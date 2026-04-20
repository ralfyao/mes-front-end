<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >其他收入</q-icon>
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.編修))">
        <!-- <div class="padding-right"> -->
          <q-btn color="primary" class="padding-right"
            glossy @click="openARDialog('新增')"
            :loading="loading">新增其他收入</q-btn>&nbsp;
        <!-- </div> -->
        <!-- <div class="padding-right"> -->
          <q-btn color="info" class="padding-right"
            glossy @click="openARDialog('修改')"
            :loading="loading">修改其他收入</q-btn>&nbsp;
        <!-- </div> -->
        <!-- <div class="padding-right"> -->
            <q-btn color="red" class="padding-right"
              glossy @click="deleteAR"
              :loading="loading">刪除其他收入</q-btn>&nbsp;
        <!-- </div> -->
        </div>

        <div v-if="(hasAllAuth ||(auth && auth.查詢))">
        <!-- <div class="padding-right"> -->
          <q-btn color="green" class="padding-right"
              glossy @click="openARDialog('預覽')"
                :loading="loading">其他收入預覽</q-btn> &nbsp;
        </div>
      </div>
      <div class="row justify-start padding-top">
        <div class="col-6 col-md-6"  style="max-width: 500px">
          <div class="text-left text-red">{{ errorMessage }}</div>
        </div>
      </div>
    </h5>
    <q-page-container>
      <q-page>
        <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="單號"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                @selection="onSelection"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table >
      </q-page>
    </q-page-container>
    <q-dialog v-model="showForm" persistent >
      <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
        <q-card-section>
          <div class="text-h4">
            {{mode}}其他收入單
            <div v-if="mode == '修改'">
            </div>
            <q-card-actions class="col-12 flex" align="right">
              <q-btn flat label="取消" color="negative" @click="close" />
              <q-btn v-if="!preview" label="送出" color="primary" @click="handleOtherAction" />
              <q-btn v-if="(auth.核准 || hasAllAuth) && mode == '修改' && !form.核准日" label="覆核" color="grey" @click="validate(true)"/>
              <q-btn v-if="(auth.核准 || hasAllAuth) && mode == '修改' && form.核准日" label="取消覆核" color="grey" @click="validate(false)"/>
              <!-- <div> -->
            <!-- <div class="padding-right"> -->
                  <q-btn v-if="(hasAllAuth ||(auth && auth.輸出))" color="grey" class="padding-right"
                      glossy
                      :loading="loading">列印</q-btn> &nbsp;
                  <!-- </div> -->
                  <!-- <div class="padding-right"> -->
                  <q-btn v-if="(hasAllAuth ||(auth && auth.輸出))" color="grey" class="padding-right"
                      glossy
                      :loading="loading">列印(英)</q-btn>
                  <!-- </div> -->
              <!-- </div> -->
            </q-card-actions>
          </div>
        </q-card-section>
        <q-form ref="myForm" >
          <q-card-section>
            <!--日期、單號、客戶編號、客戶簡稱、傳票-->
            <div class="row q-col-gutter-md">
              <div class="col-2 col-md-2" style="max-width: 300px">
                <q-input outlined dense v-model="form.日期" label="日期" :readonly="readonly || preview" mask="####/##/##" :rules="[val =>  !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-close-popup v-model="form.日期" @update:model-value="showDatePopup = false" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-2 col-md-2" style="max-width: 300px">
                <q-input v-model="form.單號" label="單號" :readonly="true" outlined dense></q-input>
              </div>
              <div class="col-2 col-md-2" style="max-width: 300px">
                <q-select v-model="form.客戶編號" :readonly="readonly || preview" outlined dense label="客戶編號"
                :options="custNumberList"
                option-label="正航編號"
                option-value="正航編號"
                emit-value map-options
                @update:model-value="changeCustCompany"
                />
              </div>
              <div class="col-3 col-md-3" style="max-width: 300px">
                <q-input v-model="companyName" label="客戶簡稱" :readonly="true" outlined dense></q-input>
              </div>
              <div class="col-3 col-md-3" style="max-width: 270px">
                <q-input v-model="form.傳票" label="傳票" :readonly="readonly || preview" outlined dense></q-input>
              </div>
            </div>
            <!--業務人員、匯率、稅別、稅率、客戶全名-->
            <div class="row q-col-gutter-md">
              <div class="col-2 col-md-2" style="max-width: 300px">
                <q-select v-model="form.業務員" :readonly="readonly || preview" label="業務人員" outlined dense
                    :options="salesList"
                            option-value="工號" emit-value map-options
                            option-label="工號" @update:model-value="changeSalesName"
                            ></q-select>
                <label class="text-red text-center" style=" font-size: 24px;">
                  {{ salesname }}
                </label>
              </div>
              <div class="col-2 col-md-2" style="max-width: 300px">
                <q-select outlined dense  label="幣別"
                v-model="form.幣別"
                :options="currencyList"
                option-value="currency"
                option-label="currency" :readonly="readonly || preview"
                @update:model-value="changeExRate" emit-value map-options
                 :rules="[val => !preview &&  !!val || '幣別為必填欄位']"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 300px">
                <q-select outlined dense  label="匯率"
                :options="exRateList"
                v-model="form.匯率"
                option-label="匯率" :readonly="readonly || preview"
                option-value="匯率"  emit-value map-options
                :rules="[val => !preview && !!val || '匯率為必填欄位']"
                />
              </div>
              <div class="col-2 col-md-2" style="max-width: 300px">
                <q-select  outlined dense v-model="form.稅率"  label="稅率" :readonly="readonly || preview"
                :rules="[val => !!val || '稅率為必填欄位']"  emit-value map-options
                :options="taxRateList"/>
              </div>
              <div class="col-4 col-md-4" style="max-width: 350px">
                <q-input v-model="companyFullName" label="客戶全名" :readonly="true" outlined dense></q-input>
              </div>
            </div>
            <!--收款帳號、專案序號、貿易條件、付款方式-->
            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3" style="max-width: 300px">
                <q-input outlined dense v-model="收款帳號" label="收款帳號" :readonly="readonly || preview" />
                <q-btn  outlined dense label="核對" color="green" glossy v-if="!preview" @click="openAccountCheck" />
              </div>
              <div class="col-3 col-md-3" style="max-width: 300px">
                <q-input v-model="form.machineno" label="專案序號" :readonly="readonly || preview" outlined dense></q-input>
              </div>
              <div class="col-3 col-md-3" style="max-width: 300px">
                <q-select  outlined dense v-model="form.價格條件"  label="貿易條件"
                :options="priceCondList" :readonly="readonly || preview"
                :rules="[val => !!val || '價格條件為必填欄位']"  emit-value map-options
                option-value="條文編號"
                option-label="條文名稱"/>
              </div>
              <div class="col-3 col-md-3" style="max-width: 500px">
                <q-select  outlined v-model="form.付款方式" dense :readonly="readonly || preview"  label="付款方式"
                :options="paymentTerm"
                :rules="[val => !!val || '付款方式為必填欄位']"
                emit-value map-options
                option-value="條文編號"
                option-label="條文名稱"/>
              </div>
            </div>
            <br>
            <!--備註說明、結案-->
            <div class="row q-col-gutter-md">
              <div class="col-10 col-md-10" style="max-width: 800px">
                <q-input v-model="form.remark" label="備註說明" :readonly="readonly || preview" outlined dense></q-input>
              </div>
              <div class="col-2 col-md-2" style="max-width: 200px">
                <q-checkbox v-model="form.結案" label="結案" :disable="readonly || preview" @update:model-value="updateCloseFlag"/>
              </div>
            </div>
            <br>
            <hr>
            <q-card-section style="
                            max-height: 70vh;
                            overflow: auto;
                          ">
              <h6>
                細項列表
                <q-btn v-if="!preview" size="sm" label="新增細項" color="primary" @click="AddOtherIncomeItem"/>
              </h6>
              <div style="min-width: 1500px">
                <div v-for="item in form.detailList" :key="item.識別">
                  <div class="row q-col-gutter-md">
                    <div class="col-1 col-md-1" style="max-width: 500px">
                      <q-select v-model="item.項目編號" :readonly="readonly || preview" outlined dense label="項目編號"
                      :options="itemNumberList"
                      option-label="項目編號"
                      option-value="項目編號"
                      emit-value map-options
                      @update:model-value="changeItemName(item)"/>
                    </div>
                    <div class="col-1 col-md-1" style="max-width: 500px">
                      <q-input v-model="項目名稱" label="項目名稱" :readonly="true" outlined dense></q-input>
                    </div>
                    <div class="col-1 col-md-1" style="max-width: 500px">
                      <q-input type="number" v-model="item.原幣未稅" label="原幣未稅" :readonly="readonly || preview" outlined dense></q-input>
                    </div>
                    <div class="col-1 col-md-1" style="max-width: 500px">
                      <q-input type="number" v-model="item.未稅" label="未稅" :readonly="readonly || preview" outlined dense></q-input>
                    </div>
                    <div class="col-1 col-md-1" style="max-width: 500px">
                      <q-input type="number" v-model="item.稅" label="稅" :readonly="readonly || preview" outlined dense></q-input>
                    </div>
                    <div class="col-1 col-md-1" style="max-width: 500px">
                      <q-input type="number" v-model="item.金額" label="金額" :readonly="readonly || preview" outlined dense></q-input>
                    </div>
                    <div class="col-2 col-md-2" style="max-width: 500px">
                      <q-input v-model="item.備註" label="備註" :readonly="readonly || preview" outlined dense></q-input>
                    </div>
                    <div class="col-1 col-md-1" style="max-width: 500px">
                      <q-input v-model="item.專案序號" label="專案序號" :readonly="readonly || preview" outlined dense></q-input>
                    </div>
                    <div class="col-1 col-md-1" style="max-width: 500px">
                      <q-checkbox v-model="item.結案" label="結案" :disable="readonly || preview"/>
                    </div>
                    <div class="col-1 col-md-1" style="max-width: 500px">
                      <q-input v-model="item.憑證編號" label="憑證編號" :readonly="readonly || preview" outlined dense></q-input>
                    </div>
                    <br>
                  </div>
                </div>
                <br>
                <label class="text-h4">
                  <div class="row q-col-gutter-md">
                    <div class="col-4 col-md-4 no-wrap"  style="max-width: 300px">
                      覆核人員：{{ form.核准 }}
                      <q-input outlined dense v-model="form.核准日" style="max-width: 150px" readonly/>
                    </div>
                    <div class="col-4 col-md-4 no-wrap"  style="max-width: 300px">
                      修改人員：{{ form.修改 }}
                      <q-input outlined dense v-model="form.修改日" style="max-width: 150px"  readonly/>
                    </div>
                    <div class="col-4 col-md-4 no-wrap"  style="max-width: 300px">
                      建檔人員：{{ form.建檔 }}
                      <q-input outlined dense v-model="form.建檔日" style="max-width: 150px"  readonly/>
                    </div>
                  </div>
                </label>
              </div>
            </q-card-section>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
    <!--銀行帳戶核對-->
    <q-dialog v-model="showCheckForm" persistent>
      <BankInfoView
        v-model:showForm="showCheckForm"
        :bankAccountCheckForm="bankAccountCheckForm"
      />
    </q-dialog>
  </q-layout>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region import block start
import {
  QLayout,
  QIcon,
  QBtn,
  QPageContainer,
  QPage,
  QTable,
  QDialog,
  QCard,
  QCardSection,
  QForm,
  QInput,
  QSelect,
  QPopupProxy,
  QDate,
  QCardActions,
  QCheckbox,
  SessionStorage
} from 'quasar';
import { ref, onMounted } from 'vue';
import { useCustStore } from '@/composables/useCust';
import BankInfoView from '@/components/customer/salesorder/BankInfoView.vue';
import { useARStore } from '@/composables/useAR';
// #endregion import block end

// #region variable block start
const account = SessionStorage.getItem('Account');
const formName = '客戶未收查詢';
const auth = ref({});
const hasAllAuth = ref(false);
const theUser = ref({});
const secondDialog = ref(false);
const 單號 = ref('');
const myForm = ref(null);
const 項目名稱 = ref('');
const arStore = useARStore();
const itemNumberList = ref([]);
const paymentTerm = ref([]);
const priceCondList = ref([]);
const showCheckForm = ref(false);
const 收款帳號 = ref('');
const taxRateList = ref([]);
const currencyList = ref([]);
const exRateList = ref([]);
const companyName = ref('');
const companyFullName = ref('');
const custStore = useCustStore();
const custNumberList = ref([]);
const salesList = ref([]);
const errorMessage = ref('');
const columns =
[
  // { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
  { name: '日期', label: '日期', align: 'left', field: '日期', sortable: true },
  { name: '單號', label: '訂單單號', align: 'left', field: '單號', sortable: true },
  { name: '客戶編號', label: '客戶編號', align: 'left', field: '客戶編號', sortable: true },
];
const list = ref([]);
const salesname = ref('');
const selected = ref([]);
const showForm = ref(false);
const mode = ref('');
const showDatePopup = ref(false);
const form = ref({
  單號:'',
  日期:'',
  客戶編號:'',
  業務員:'',
  幣別:'',
  匯率:0.0,
  稅別:'',
  稅率:0.0,
  總額:0.0,
  結案:0,
  價格條件:'',
  付款方式:'',
  machineno:'',
  remark:'',
  建檔:'',
  修改:'',
  核准:'',
  建檔日:'',
  修改日:'',
  核准日:'',
  傳票:'',
  detailList:[],
})
const bankAccountCheckForm = ref({
  銀存編碼:'',
  銀行名稱:'',
  Bankname:'',
  銀行地址:'',
  帳號:'',
  SwiftCode:'',
  電話:'',
});
const preview = ref(false);
// #endregion variable block end

// #region function block start
const AddOtherIncomeItem = () =>{
  if (!Array.isArray(form.value.detailList)) {
    form.value.detailList = []
  }
  form.value.detailList.push({
      識別:0,
      單號:form.value.單號,
      項目編號:'',
      原幣未稅:0.0,
      未稅:0.0,
      稅:0.0,
      金額:0.0,
      備註:'',
      專案序號:'',
      勾選:0,
      憑證編號:'',
    });
}
const openARDialog = (type) =>{
  console.log(type);
  preview.value = false;
  errorMessage.value = "";
  if(type == '新增') {
    form.value = {
      單號:'',
      日期:'',
      客戶編號:'',
      業務員:'',
      幣別:'',
      匯率:0.0,
      稅別:'',
      稅率:0.0,
      總額:0.0,
      結案:0,
      價格條件:'',
      付款方式:'',
      machineno:'',
      remark:'',
      建檔:'',
      修改:'',
      核准:'',
      建檔日:'',
      修改日:'',
      核准日:'',
      傳票:'',
      detailList:[],
    };
    companyFullName.value = ''
    companyName.value = '';
    salesname.value = '';
    form.value.單號 = 單號.value;
    console.log(' form.value.單號',  form.value.單號);
  } else if (type == '修改' || type == '預覽') {
    if (selected.value.length == 0){
      errorMessage.value = "請選取一筆資料做"+type+"!";
      return;
    }
    form.value = selected.value[0];
    changeCustCompany();
    changeExRate();
    changeSalesName();
    changeExRate(form.value.幣別);
    if(type == '預覽'){
      preview.value = true;
    } else {
      preview.value = false;
    }
  }
  showForm.value = true;
  mode.value = type;
}
const close = () =>{
  showForm.value = false;
}
const onSelection = () =>{

}

const handleOtherAction = async () => {
  if (form.value.匯率.匯率){
    form.value.匯率 = form.value.匯率.匯率
  }
  console.log('handleOtherAction form.value', form.value);
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}

const submitForm = async () =>{
  const Account = SessionStorage.getItem('Account');
  secondDialog.value = true;
  if (mode.value == '新增'){
    console.log('mode', mode.value)
    form.value.建檔 = Account.account;
    await arStore.saveOtherIncome(form).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('寫入成功');
      }
      close();
      init();
    });
    // quotationForm.value.
  } else if (mode.value == '修改') {
    console.log('mode', mode.value)
    form.value.修改 = Account.account;
    await arStore.updateOtherIncome(form).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('修改成功');
      }
      close();
      init();
    });
  }
  form.value = {
    單號:'',
    日期:'',
    客戶編號:'',
    業務員:'',
    幣別:'',
    匯率:0.0,
    稅別:'',
    稅率:0.0,
    總額:0.0,
    結案:0,
    價格條件:'',
    付款方式:'',
    machineno:'',
    remark:'',
    建檔:'',
    修改:'',
    核准:'',
    建檔日:'',
    修改日:'',
    核准日:'',
    傳票:'',
    detailList:[],
  };
  showForm.value = false;
  init();
}

const changeExRate = async (val) =>{
  console.log('val.currency', val);
  try{
  secondDialog.value = true;
  await custStore.getExRateList(val).then((data)=>{
    console.log('data', data);
    form.value.匯率 = data[0].匯率 ;
    secondDialog.value = false;
  });
  }catch(e){console.log(e)}
}

const openAccountCheck = async () =>{
  if (收款帳號.value == '')
  {
    alert('請輸入收款帳號');
    return;
  }
  secondDialog.value = true;
  await custStore.getBankInfo(收款帳號.value).then((data)=>{
    console.log('bank data',data)
    bankAccountCheckForm.value = data;
    secondDialog.value = false;
  })
  console.log('before set', showCheckForm.value)
  showCheckForm.value = true
  console.log('after set', showCheckForm.value)
}

const init = async () =>{
  secondDialog.value = true;
  await custStore.getCustNumberList().then((data)=>{
    console.log('custNumberList', data);
    custNumberList.value = data;
  });
  salesList.value = await custStore.getSalesList();
  currencyList.value  = await custStore.getCurrencyList();
  await custStore.getTaxRateList().then((data)=>{
    console.log('taxRateList', data);
    taxRateList.value  = data;
  });
  paymentTerm.value  = await custStore.getTxConditionList('P,Y');//付款方式
  priceCondList.value = await custStore.getTxConditionList('T');//價格條件
  itemNumberList.value = await arStore.getItemNumberList();
  await arStore.getOtherIncomeNo().then((data)=>{
    單號.value = data;
  })
  await arStore.getOtherIncomeList().then((data)=>{
    list.value = data;
  })
  console.log('單號.value',  單號.value);
  console.log('itemNumberList.value', itemNumberList.value);
  form.value = {
    單號:'',
    日期:'',
    客戶編號:'',
    業務員:'',
    幣別:'',
    匯率:0.0,
    稅別:'',
    稅率:0.0,
    總額:0.0,
    結案:0,
    價格條件:'',
    付款方式:'',
    machineno:'',
    remark:'',
    建檔:'',
    修改:'',
    核准:'',
    建檔日:'',
    修改日:'',
    核准日:'',
    傳票:'',
    detailList:[],
  };
  secondDialog.value = false;
  selected.value = [];
  theUser.value = SessionStorage.getItem('Account');
  auth.value = theUser.value.authList.find((x)=>x.menuSubName == formName);
  hasAllAuth.value =
      (!auth.value.高管 && !auth.value.核准 && !auth.value.編修 && !auth.value.報表 && !auth.value.輸出);
  console.log('auth', auth.value);
}

const updateCloseFlag = () =>{

}

const changeCustCompany = async () =>{
  const selectedCust = custNumberList.value.find(
    x => x.正航編號?.trim() === form.value.客戶編號?.trim()
  )
  console.log('selectedCust', selectedCust)
  companyName.value = selectedCust?.company || ''
  companyFullName.value = selectedCust?.companyfullname;
  收款帳號.value = selectedCust?.credibility;
}

const changeSalesName = () =>{
  console.log('sales no',form.value.業務員)
  salesname.value = salesList.value.find(sales => sales.工號 == form.value.業務員)
        ?salesList.value.find(sales => sales.工號 == form.value.業務員).姓名
        :'';
  console.log('name:',salesname.value)
}

const changeItemName = (item) =>{
  console.log(item);
  const selectedItem = itemNumberList.value.find(x => x.項目編號 == item.項目編號).項目名稱;
  console.log('selectedItem', selectedItem);
  項目名稱.value = selectedItem;
}

const deleteAR = async () =>{
  var result = confirm('確定要刪除?')
  if (result){
    console.log('刪除');
    form.value = selected.value[0];
    await arStore.deleteOtherIncome(form).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('刪除成功');
      }
    });
    await init();
  }
}

onMounted(async () =>{
  init();
})

const validate = async (valid) =>{
  await arStore.validateOtherIncome(form.value.單號, valid, account.account).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert((valid?'覆核':'取消覆核')+'成功');
    }
    close();
    init();
  })
}


// #endregion function block end
</script>
