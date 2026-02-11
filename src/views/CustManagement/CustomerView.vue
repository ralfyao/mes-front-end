<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="text-left">
      <q-icon name="play_circle" size="30px" >客戶維護</q-icon>
    </h5>
    <q-page-container>
      <q-page>
        <q-table
                :columns="columns"
                row-key="識別"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                @selection="onSelection"
                class="rounded-borders"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table>
        <div class="row justify-start padding-top">
            <div class="padding-right">
              <q-btn color="primary" class="padding-right"
                       glossy @click="openCustomerDialog('新增')"
                       :loading="loading">新增客戶</q-btn>
            </div>
            <div class="padding-right">
              <q-btn color="info" class="padding-right"
                       glossy @click="openCustomerDialog('修改')"
                       :loading="loading">修改客戶</q-btn>
            </div>
            <div class="padding-right">
              <q-btn color="red" class="padding-right"
                       glossy @click="deleteCustomer"
                       :loading="loading">刪除客戶</q-btn>
            </div>
        </div>
        <h5 class="text-left text-red">{{ errorMessage }}</h5>
      </q-page>
    </q-page-container>
    <q-dialog v-model="showForm" persistent >
      <q-card  class="q-pa-md"  style="width: 1000px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h4">{{mode}}客戶</div>
          </q-card-section>
          <q-form ref="myForm" >
            <q-card-section>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-12" style="max-width: 1000px">
                    <q-input v-model="form.company" :readonly="readonly" label="客戶全稱" outlined dense :rules="[val => !!val || '客戶全稱為必填欄位']"/>
                  </div>
                  <div class="col-6 col-md-6" style="max-width: 500px">
                    <q-input v-model="form.欄位2" :readonly="readonly" label="客戶簡稱" outlined dense :rules="[val => !!val || '客戶簡稱為必填欄位']"/>
                    <div class="col-6 col-md-6" style="max-width: 500px">
                          <q-select v-model="form.country" style="max-width: 500px" :readonly="readonly" label="國別" outlined dense
                          :options="countryList"
                          option-value="code"
                          option-label="國別"
                          @update:model-value="getCountryName"
                          >
                          </q-select>
                          <label class="text-red text-center" style=" font-size: 24px;">
                            {{ countryname }}
                          </label>
                          <br>
                          <q-input v-model="form.contactperson" :readonly="readonly" label="聯絡人" outlined dense/>
                    </div>
                  </div>
                  <div class="col-6 col-md-6" style="max-width: 500px">
                    <q-input v-model="form.正航編號" :readonly="readonly" label="客戶編號" outlined dense />
                    <br>
                    <q-input v-model="form.source" :readonly="readonly" label="開發來源" outlined dense />
                    <br>
                    <q-input v-model="form.position" :readonly="readonly" label="職位" outlined dense/>
                  </div>
                  <div class="col-6 col-md-6" style="max-width: 500px">
                  </div>
                  <div class="col-12 col-md-12" style="max-width: 1000px">
                    <q-input v-model="form.address" :readonly="readonly" label="營業地址" outlined dense :rules="[val => !!val || '營業地址為必填欄位']"/>
                    <q-input v-model="form.daddress" :readonly="readonly" label="寄件地址" outlined dense :rules="[val => !!val || '寄件地址為必填欄位']"/>
                  </div>
                  <div class="col-6 col-md-6" style="max-width: 500px">
                    <q-input v-model="form.tel" :readonly="readonly" label="客戶電話" outlined dense/>
                    <br>
                    <q-input v-model="form.website" :readonly="readonly" label="網址" outlined dense />
                    <br>
                    <q-input v-model="form.email" :readonly="readonly" label="電子信箱" outlined dense/>
                    <br>
                    <q-input v-model="form.industry" :readonly="readonly" label="配合代理" outlined dense/>
                    <br>
                  </div>
                  <div class="col-6 col-md-6" style="max-width: 500px">
                    <q-input v-model="form.zipcode" :readonly="readonly" label="手機" outlined dense/>
                    <br>
                    <q-input v-model="form.fax" :readonly="readonly" label="傳真" outlined dense/>
                    <br>
                    <q-input v-model="form.ma" :readonly="readonly" label="型態分類" outlined dense/>
                    <br>
                    <q-input v-model="form.欄位1" :readonly="readonly" label="終端使用" outlined dense/>
                    <br>
                  </div>
                  <div class="col-12 col-md-12" style="max-width: 1000px">
                        <q-select v-model="form.industrycode" :readonly="readonly" label="所屬業別"
                        outlined dense :options="industryList" @update:model-value="getIndustryName"
                            option-value="中分類碼"
                            option-label="中分類碼"></q-select>
                        <label class="text-red text-center" style=" font-size: 24px;">{{ industry }}</label>
                  </div>
                  <div class="col-12 col-md-12" style="max-width: 1000px">
                    <q-input v-model="form.machineissue" :readonly="readonly" label="機台類別" outlined dense></q-input>
                  </div>
                  <div class="col-6 col-md-6" style="max-width: 500px">
                    <q-select v-model="form.credibility" :readonly="readonly" label="收款帳戶" outlined dense
                    :options="bankList"
                            option-value="銀存編碼"
                            option-label="銀存編碼"></q-select>
                  </div>
                  <div class="col-6 col-md-6" style="max-width: 500px">
                    <q-btn label="停用" v-if="form.停用日 === '' || form.停用日 === null" @click="setExpiry('Y')" color="negative"/>&nbsp;
                    <q-btn label="取消停用" v-if="form.停用日 !== '' && form.停用日 !== null"  color="primary" @click="setExpiry('N')"/>
                  </div>
                  <div class="col-12 col-md-12" style="max-width: 1000px">
                    <q-input v-model="form.memo" :readonly="readonly" label="備註" outlined dense></q-input>
                  </div>
                </div>
                <br>
                <hr class="q-my-md justify-center">
                <h6>
                  客戶聯絡人清單
                  <q-btn size="sm" label="新增聯絡人" color="primary" @click="form.contactLists.push({識別: Date.now(), 姓名: '', 職稱: '', 電話: '', 分機: '', email: '', company:''})"/>
                </h6>
                <div v-for="item in form.contactLists" :key="item.識別" class="q-mt-md">
                  <div class="row q-col-gutter-md">
                    <div class="col-3 col-md-3" style="max-width: 250px">
                      <q-input v-model="item.姓名" :readonly="readonly" label="姓名" outlined dense/>
                    </div>
                    <div class="col-2 col-md-2" style="max-width: 250px">
                      <q-input v-model="item.職稱" :readonly="readonly" label="職稱" outlined dense/>
                    </div>
                    <div class="col-2 col-md-2" style="max-width: 250px">
                      <q-input v-model="item.email" :readonly="readonly" label="e-mail" outlined dense/>
                    </div>
                    <div class="col-3 col-md-3" style="max-width: 250px">
                      <q-input v-model="item.電話" :readonly="readonly" label="電話" outlined dense/>
                    </div>
                    <div class="col-2 col-md-2" style="max-width: 250px">
                      <q-input v-model="item.分機" :readonly="readonly" label="分機" outlined dense/>
                    </div>
                  </div>
                </div>
                <br>
                <br>
                <hr>
                <h6>
                  客戶聯絡明細
                  <q-btn size="sm" label="新增聯絡明細" color="primary" @click="form.contactDetails.push({ 日期: '', 註記: '', 業務人員: '', RFQNO: ''})"/>
                </h6>
                <div v-for="item in form.contactDetails" :key="item.SERNO+'-'+item.COMPANY" class="q-mt-md">
                  <div class="row q-col-gutter-md">
                    <div class="col-2 col-md-2" style="max-width: 200px; max-height: 50px;">
                      <q-input filled dense v-model="item.日期" label="洽談日期" mask="##/##/####" :rules="['item.日期']">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                              <q-date v-model="item.日期" mask="DD/MM/YYYY" no-title>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div class="col-3 col-md-3" style="max-width: 200px">
                      <q-input v-model="item.註記" :readonly="readonly" label="註記" outlined dense/>
                    </div>
                    <div class="col-3 col-md-3" style="max-width: 200px">
                      <q-input v-model="item.業務人員" :readonly="readonly" label="工號" outlined dense/>
                    </div>
                    <div class="col-3 col-md-3" style="max-width: 200px">
                      <q-input v-model="item.業務人員姓名" :readonly="true" label="業務人員" outlined dense/>
                    </div>
                    <div class="col-2 col-md-2" style="max-width: 200px">
                      <q-input v-model="item.rfqno" :readonly="readonly" label="RFQNO" outlined dense/>
                    </div>
                  </div>
                </div>
            </q-card-section>
          </q-form>
          <q-card-actions align="right">
            <q-btn flat label="取消" color="negative" @click="showForm = false" />
            <q-btn label="送出" color="primary" @click="handleOtherAction" />
          </q-card-actions>
      </q-card>
    </q-dialog>
    <LoadingComponent v-model="secondDialog"/>
  </q-layout>
</template>
<script setup>
import {
    QIcon
  , QLayout
  , QPageContainer
  , QPage
  , QTable
  , QBtn
  , QDialog
  , QCard
  , QCardSection
  , QCardActions
  , QInput
  , QSelect
  , SessionStorage
  , QForm
  , QDate
  , QPopupProxy
} from 'quasar';
// import  { CustomerForm } from '@/components/customer/CustomerForm.vue';
import { useCustStore } from '@/composables/useCust';
import { ref, onMounted,  } from 'vue';
const selected = ref([]);
const countryList = ref([]);
const bankList = ref([]);
const errorMessage = ref('');
const showForm = ref(false)
const showDatePopup = ref(false)
const secondDialog = ref(false)
const readonly = ref(false)
const countryname = ref('');
const handleOtherAction = async () => {
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}
const deleteCustomer = () => {
  console.log('selected', selected.value);
  if (selected.value.length === 0) {
      console.log('No role selected for modification')
      errorMessage.value = '請選擇要刪除的角色'
      showForm.value = false
      return;
  }
  const custToDelete = selected.value[0];
  console.log('要刪除的客戶資料:', custToDelete);
  let result = confirm(`確定要刪除客戶 ${custToDelete.company} 嗎？`);
  if (result) {
    custStore.deleteCustomer(custToDelete.識別).then((res) => {
      console.log('API回傳結果:', res);
      if (res.data.errorMessage == '') {
        alert('刪除成功');
      } else {
        alert('刪除失敗：' + res.data.errorMessage);
        errorMessage.value = res.data.errorMessage
      }
      init();
    });
  }
}
// const formRef = ref(null);
const getCountryName = (code) => {
  console.log('選擇的國別代碼:', code);
  const country = countryList.value.find(item => (item?.國別??'') === code.code || item.code === code.code);

  console.log('選擇的國別value:', country);
  countryname.value =  country ? country.code : '';
  form.value.country = country?.國別??'';
  console.log('選擇的form國別:', form.value.country);
  console.log('選擇的國別:', countryname.value);
};
const getIndustryName = (code) => {
  console.log('選擇的業別代碼:', code);
  const industryItem = industryList.value.find(item => item.中分類碼 === code.中分類碼);
  industry.value =  industryItem ? industryItem.中分類名稱 : '';
};
const columns =
[
  { name: 'customerId', label: '客戶識別碼', align: 'left', field: '識別', sortable: true },
  { name: 'customerNo', label: '客戶編號', align: 'left', field: '正航編號', sortable: true },
  { name: 'customerName', label: '客戶全稱', align: 'left', field: 'company', sortable: true },
  { name: 'customerAddress', label: '客戶地址', align: 'left', field: 'address', sortable: true },
  { name: 'customerEmail', label: '客戶電子信箱', align: 'left', field: 'email', sortable: true },
  { name: 'customerContact', label: '聯絡人', align: 'left', field: 'contactperson', sortable: true },
  { name: 'customerCountry', label: '客戶國家', align: 'left', field: 'country', sortable: true },

];
const custStore = useCustStore();
const list = ref([]);
const mode = ref('')
const industry = ref('')
const industryList = ref([])
const form = ref({
  識別: '',
  company: '',
  ma:'',
  tel:'',
  fax:'',
  contactperson: '',
  position:'',
  email: '',
  country: '',
  正航編號: '',
  address: '',
  欄位2: '',
  欄位1: '',
  source:'',
  daddress: '',
  zipcode:'',
  website:'',
  industrycode:'',
  industry:'',
  machineissue:'',
  credibility:'',
  建檔:'',
  修改:'',
  建檔日:'',
  修改日:'',
  comment:'',
  account:'',
  contactLists:[],
  contactDetails:[]
})
onMounted(async () => {
  init();
  console.log('countryList', countryList.value);
});
const setExpiry = async (flag) => {
  if (flag === 'Y') {
    form.value.停用日 = new Date().toLocaleDateString('zh-TW');
  } else {
    form.value.停用日 = '';
  }
  await custStore.updateCustomerExpiry(form.value).then((res) => {
    console.log('API回傳結果:', res);
    if (res.data.errorMessage == '') {
      alert('操作成功');
      form.value.停用日 = flag === 'Y' ? new Date().toLocaleDateString('zh-TW') : null;
    } else {
      alert('操作失敗：' + res.data.errorMessage);
      errorMessage.value = res.data.errorMessage
    }
  });
}
const init = async () =>{
  list.value = await custStore.getCustList() ;
  countryList.value = await custStore.getCountryList();
  industryList.value = await custStore.getIndustryList();
  bankList.value = await custStore.getBankList();
  form.value = {
  識別: '',
  company: '',
  ma:'',
  tel:'',
  fax:'',
  contactperson: '',
  position:'',
  email: '',
  country: '',
  正航編號: '',
  address: '',
  欄位2: '',
  欄位1: '',
  source:'',
  daddress: '',
  zipcode:'',
  website:'',
  industrycode:'',
  industry:'',
  machineissue:'',
  credibility:'',
  建檔:'',
  修改:'',
  建檔日:'',
  修改日:'',
  comment:'',
  account:'',
  contactLists:[],
  contactDetails:[]};
  console.log('銀行列表:', bankList.value);
  selected.value = [];
}
const myForm = ref(null)

const submitForm = async () => {
  console.log('in submitForm');
  const success = await myForm.value.validate();
  if (!success) {
    console.log('表單驗證失敗');
    return;
  }
  console.log('送出的表單資料:', form.value);
  const Account = SessionStorage.getItem('Account');
  form.value.account = Account.account;
  if (mode.value == '新增') {
    console.log('新增客戶資料:', form.value);
    form.value.建檔 = Account.account;
    form.value.建檔日 = new Date().toLocaleDateString('zh-TW');
    form.value.contactLists.forEach(contact => {
      contact.COMPANY = form.value.COMPANY;
    });
    form.value.contactDetails.forEach(detail => {
      detail.COMPANY = form.value.COMPANY;
    });
    await custStore.saveCustomer(form).then((res) => {
      console.log('API回傳結果:', res);
      if (res.data.errorMessage == '') {
        alert(mode.value + '成功');
      } else {
        alert('新增失敗：' + res.data.errorMessage);
        errorMessage.value = res.data.errorMessage
      }
      init();
    });

  } else if (mode.value == '修改') {
    console.log(`id: ${selected.value[0].識別}`);
    console.log('修改客戶資料:', form.value);
    form.value.修改 = Account.account;
    form.value.修改日 = new Date().toLocaleDateString('zh-TW');
    if (!form.value.credibility) {
      form.value.credibility = selected.value[0].credibility;
    }
    await custStore.updateCustomer(form).then((res) => {
      console.log('API回傳結果:', res);
      if (res.data.errorMessage == '') {
        alert(mode.value + '成功');
      } else {
        alert('修改失敗：' + res.data.errorMessage);
        errorMessage.value = res.data.errorMessage
      }
      init();
    });
  }
  form.value = ({
    識別: '',
    company: '',
    ma:'',
    tel:'',
    fax:'',
    contactperson: '',
    position:'',
    email: '',
    country: '',
    正航編號: '',
    address: '',
    欄位2: '',
    欄位1: '',
    source:'',
    daddress: '',
    zipcode:'',
    website:'',
    industrycode:'',
    industry:'',
    machineissue:'',
    credibility:'',
    建檔日:'',
    修改日:'',
    comment:'',
    account:''
  });
  showForm.value = false;
  countryname.value = '';
  industry.value = '';
};
function onSelection({ rows, added }) {
  if (added) {
    console.log('✅ 勾選:', rows[0].customerName)
  } else {
    console.log('❌ 取消勾選:', rows[0].customerName)
  }
  console.log('目前選取的客戶名稱:', selected.value)
}


const openCustomerDialog = (action) => {
  console.log('開啟客戶表單，操作:', action);
  if (action === '修改') {
    if (selected.value.length === 0) {
      errorMessage.value = '請先選擇要修改的客戶';
      return;
    }
    const selectedCustomerId = selected.value[0];
    const selectedCustomer = list.value.find(customer => customer.識別 === selectedCustomerId.識別);
    if (selectedCustomer) {
      form.value = { ...selectedCustomer };
      console.log('選取的客戶資料:', form.value);
      if (selectedCustomer.country) {
        getCountryName({ code: selectedCustomer.country });
      }
      if (selectedCustomer.industrycode) {
        getIndustryName({ 中分類碼: selectedCustomer.industrycode });
      }
    } else {
      errorMessage.value = '找不到選取的客戶資料';
      return;
    }
  } else if (action === '新增'){
    form.value = {
    識別: '',
    company: '',
    ma:'',
    tel:'',
    fax:'',
    contactperson: '',
    position:'',
    email: '',
    country: '',
    正航編號: '',
    address: '',
    欄位2: '',
    欄位1: '',
    source:'',
    daddress: '',
    zipcode:'',
    website:'',
    industrycode:'',
    industry:'',
    machineissue:'',
    credibility:'',
    建檔:'',
    修改:'',
    建檔日:'',
    修改日:'',
    comment:'',
    account:'',
    contactLists:[],
    contactDetails:[]};
    countryname.value = '';
    industry.value = '';
  }

  errorMessage.value = '';
  mode.value = action;
  showForm.value = true;
  errorMessage.value = '';
  secondDialog.value = true;
};
</script>
