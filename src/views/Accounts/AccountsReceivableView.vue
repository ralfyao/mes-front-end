<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >{{formName}}</q-icon>
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.編修))">
        <!-- <div class="padding-right"> -->
          <q-btn color="primary" class="padding-right"
            glossy @click="openARDialog('新增')" :loading="loading">新增立帳單</q-btn>&nbsp;
        <!-- </div> -->
        <!-- <div class="padding-right"> -->
          <q-btn color="info" class="padding-right"
            glossy @click="openARDialog('修改')"
            :loading="loading">修改立帳單</q-btn>&nbsp;
        <!-- </div> -->
        <!-- <div class="padding-right"> -->
            <q-btn color="red" class="padding-right"
              glossy @click="deleteAR"
              :loading="loading">刪除立帳單</q-btn>&nbsp;
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.查詢))">
          <q-btn color="green" class="padding-right"
              glossy @click="openARDialog('預覽')"
                :loading="loading">立帳單預覽</q-btn>&nbsp;
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.輸出))">
            <!-- <div class="padding-right"> -->
              <q-btn color="grey" class="padding-right"
                glossy
                :loading="loading">列印</q-btn> &nbsp;
            <!-- </div> -->
            <!-- <div class="padding-right"> -->
              <q-btn color="grey" class="padding-right"
                glossy
                :loading="loading">列印(英)</q-btn>
            <!-- </div> -->
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
                row-key="識別碼"
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
            {{mode}}立帳單
            <div v-if="mode == '修改'">
              <q-checkbox v-model="form.結案" label="結案" :readonly="readonly || preview" @update:model-value="updateCloseFlag"/>
              <q-btn v-if="!preview" label="出納收款" color="green" glossy densed @click="quotationDistribution"/>&nbsp;
              <q-btn v-if="!preview" label="收款明細導入" color="primary" glossy densed/>&nbsp;
              <q-btn v-if="!preview" label="會計傳票" color="brown" glossy densed/>
            </div>
          </div>
        </q-card-section>
        <q-form ref="myForm" >
          <q-card-section>
            <!--日期、單號、收款類別、憑證種類、發票日期、未稅金額-->
            <div class="row q-col-gutter-md">
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input outlined dense v-model="form.日期" label="日期" :readonly="readonly || preview" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input v-model="form.單號" :readonly="readonly || preview" outlined dense label="單號"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-select v-model="form.類別" outlined dense label="收款類別" emit-value map-options
                  :options="categoryList"
                />
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-select v-model="form.machineno" outlined dense label="憑證種類" emit-value map-options
                  :options="certCategoryList"
                />
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input outlined dense v-model="form.收款日期" label="發票日期" :readonly="readonly || preview" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="showRcvDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.收款日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="showRcvDatePopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input outlined dense v-model="form.銀轉金額" type="number" min='0.0' label="未稅金額"/>
              </div>
            </div>
            <br>
            <!--客戶編號、客戶簡稱、發票號碼、稅額、會計傳票-->
            <div class="row q-col-gutter-md">
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-select v-model="form.客戶編號" :readonly="readonly || preview" outlined dense label="客戶編號"
                :options="custNumberList"
                option-label="正航編號"
                option-value="正航編號"
                emit-value map-options
                @update:model-value="changeCustCompany"
                />
              </div>
              <div class="col-4 col-md-4" style="max-width: 322px">
                <q-input  :readonly="readonly || preview" v-model="companyName" outlined dense label="客戶簡稱"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input  :readonly="readonly || preview" v-model="form.發票號碼" outlined dense label="發票號碼"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input  :readonly="readonly || preview" v-model="form.收票金額" outlined dense label="稅額" @blur="calculateTax()"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input  :readonly="readonly || preview" v-model="form.傳票" outlined dense label="會計傳票"/>
              </div>
            </div>
            <br>
            <!--幣別、匯率、收款單號、帳期、總額-->
            <div class="row q-col-gutter-md">
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-select outlined dense  label="幣別"
                  v-model="form.幣別"
                  :options="currencyList"
                  option-value="currency"
                  option-label="currency" :readonly="readonly || preview"
                  @update:model-value="changeExRate" emit-value map-options
                  :rules="[val => !preview && !!val || '幣別為必填欄位']"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-select outlined dense  label="匯率"
                  :options="exRateList"
                  v-model="form.匯率"
                  option-label="匯率" :readonly="readonly || preview"
                  option-value="匯率"  emit-value map-options
                  :rules="[val => !preview && !!val || '匯率為必填欄位']"
                  />
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input  :readonly="readonly || preview" v-model="form.請款人員" outlined dense label="收款單號"/>
                <q-btn  v-if="!preview" color="orange" size="sm" label="單筆收款"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input  :readonly="readonly || preview" v-model="form.備註" outlined dense label="帳期"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input  :readonly="readonly || preview" v-model="form.收款總額" outlined dense label="總額"/>
              </div>
            </div>
          </q-card-section>
          <q-card-section style="
                            max-height: 70vh;
                            overflow: auto;
                          ">
            <h6>
              應收列表
              <q-btn v-if="!preview" dense outlined  label="新增應收款" color="primary" glossy @click="AddAR"/>
            </h6>
            <div style="min-width: 1000px">
              <div v-for="item in form.arListDetail" v-bind:key="item.識別" class="row no-wrap q-col-gutter-md">
                <div class="col-2 col-md-2" style="max-width: 166px">
                  <q-select outlined dense  label="帳款來源"
                  v-model="item.帳款來源"
                  :options="accSourceList" :readonly="readonly || preview"
                  @update:model-value="changeAccSource(item)"
                  option-value="帳款來源"
                  option-label="帳款來源"
                  emit-value map-options
                  :rules="[val => !preview && !!val || '帳款來源為必填欄位']"/>
                </div>
                <div class="col-4 col-md-4" style="max-width: 332px">
                  <q-select outlined dense  label="沖帳碼"
                  v-model="item.沖帳碼"
                  :options="writeOffCodeList" :readonly="readonly || preview"
                  emit-value map-options
                  :rules="[val => !preview && !!val || '沖帳碼為必填欄位']"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 166px">
                  <q-input type="number" :readonly="readonly || preview" v-model="item.原幣收帳金額" outlined dense label="原幣收帳金額" @blur="calcExRateAmount(item)"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 166px">
                  <q-input type="number"  :readonly="readonly || preview" v-model="item.台幣換算金額" outlined dense label="台幣換算金額"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 166px">
                  <q-input  :readonly="readonly || preview" v-model="item.說明" outlined dense label="說明"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 166px">
                  <q-input  :readonly="readonly || preview" v-model="item.專案序號" outlined dense label="專案序號"/>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-form>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="negative" @click="close" />
          <q-btn v-if="!preview" label="送出" color="primary" @click="handleOtherAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// import block start
import { useCustStore } from '@/composables/useCust';
import { useARStore } from '@/composables/useAR';
import {
  QLayout,
  QIcon,
  QBtn,
  QPageContainer,
  QPage,
  QTable,
  QDialog,
  QCardSection,
  QCard,
  QForm,
  QCardActions,
  QSelect,
  QInput,
  QDate,
  QPopupProxy,
  SessionStorage
} from 'quasar'
import { ref, onMounted } from 'vue'
// import block end

//variable block start
const formName = '應收立帳';
const auth = ref({});
const hasAllAuth = ref(false);
const theUser = ref({});
const columns =
[
  { name: '日期', label: '日期', align: 'left', field: '日期', sortable: true },
  { name: '單號', label: '單號', align: 'left', field: '單號', sortable: true },
  { name: '收款類別', label: '收款類別', align: 'left', field: '類別', sortable: true },
  { name: '憑證種類', label: '憑證種類', align: 'left', field: 'machineno', sortable: true },
];
const currencyList  = ref([]);
const exRateList    = ref([]);
const accSourceList = ref([]);
const writeOffCodeList = ref([]);
const custStore = useCustStore();
const arStore = useARStore();
const errorMessage = ref('')
const selected = ref([]);
const list = ref([]);
const companyName = ref('');
const custNumberList = ref([]);
const secondDialog = ref(false);
const categoryList = ref([
  "訂金","期約","裝機","驗機","出貨","交機","售後","零件","服務","其他"
]);
const certCategoryList = ref([
  "發票","收據","出口報單"
]);
const newArNo = ref('');
const showForm = ref(false);
const mode = ref('');
const preview = ref(false);
const myForm = ref(null);
const showDatePopup = ref(false);
const showRcvDatePopup = ref(false);
const form = ref({
  識別碼:0,
  結案:false,
  日期:'',
  單號:'',
  客戶編號:'',
  幣別:'',
  匯率:0.0,
  請款人員:'',
  收款日期:'',
  類別:'',
  收現金額:0.0,
  銀轉金額:0.0,
  machineno:'',
  發票號碼:'',
  收票金額:0.0,
  傳票:'',
  備註:'',
  收款總額:0.0,
  arListDetail:[],
});
//variable block end

//function block start
const openARDialog = async (type) =>{
  console.log(type)
  mode.value = type;
  errorMessage.value = "";
  if (type == '新增'){
    console.log('新增')
    const d = new Date()
    const formatted =
    d.getFullYear() + '/' +
    String(d.getMonth() + 1).padStart(2, '0') + '/' +
    String(d.getDate()).padStart(2, '0')
    form.value = {
      識別碼:0,
      結案:false,
      日期:'',
      單號:'',
      客戶編號:'',
      幣別:'',
      匯率:0.0,
      請款人員:'',
      收款日期:'',
      類別:'',
      收現金額:0.0,
      銀轉金額:0.0,
      machineno:'',
      發票號碼:'',
      收票金額:0.0,
      傳票:'',
      備註:'',
      收款總額:0.0,
      建檔:'',
      建檔日:'',
      修改:'',
      修改日:'',
      arListDetail:[],
    }

    await arStore.getARNo().then((data)=>{
      newArNo.value = data;
    })
    form.value.日期 = formatted;
    form.value.單號 = newArNo.value;
  } else if (type == '修改' || type == '預覽') {
    console.log('修改或預覽')
    if (selected.value.length == 0){
      errorMessage.value = "請選取一筆資料做"+type+"!";
      return;
    }
    form.value = selected.value[0];
    // form.value.匯率 = form.value.匯率.匯率;
    changeCustCompany();
    changeExRate(form.value.幣別);
    if (type == '預覽'){
      preview.value = true;
    } else {
      preview.value = false;
      // 到了要修改的時候，Load 客戶的帳款應收資料
      await arStore.getAccSourceList(form.value.客戶編號).then((data)=>{
        console.log('AccSourceList', data);
        accSourceList.value = data;
      });
    }
  }
  showForm.value = true;
}
const deleteAR = async () =>{
  var result = confirm('確定要刪除?')
  if (result){
    console.log('刪除');
    form.value = selected.value[0];
    secondDialog.value = true;
    await arStore.deleteAR(form).then((data)=>{
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

const AddAR = () =>{
  form.value.arListDetail.push({
    識別:0,
    單號:'',
    帳款來源:'',
    沖帳碼:'',
    原幣收幣金額:0.0,
    台幣換算金額:0.0,
    說明:'',
    專案序號:'',
  });
}

const changeAccSource = (item) =>{
  console.log('acc item', item)
  console.log('accSourceList', accSourceList.value);
  const data = accSourceList.value.filter((x) => x.帳款來源 == item.帳款來源 );
  console.log('data I', data)
  console.log('data I', data.length)
  for( let i = 0; i < data.length; i++){
    writeOffCodeList.value.push(data[i].沖帳碼);
  }
  console.log('writeOffCodeList', writeOffCodeList.value);
}

const onSelection = () =>{

}
const changeCustCompany = async () => {
  const selectedCust = custNumberList.value.find(
    x => x.正航編號?.trim() === form.value.客戶編號?.trim()
  )
  console.log('selectedCust', selectedCust)
  companyName.value = selectedCust?.company || ''
  await arStore.getAccSourceList(form.value.客戶編號).then((data)=>{
    console.log('AccSourceList', data);
    accSourceList.value = data;
  });
}

const quotationDistribution = () =>{

}

const updateCloseFlag = async () =>{
  secondDialog.value = true;
  await arStore.updateCloseFlag(form.value.單號).then((data)=>{
    console.log('response', data);
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert('停用成功');
    }
    secondDialog.value = false;
  })
}

const close = () =>{
  showForm.value = false;
}

const handleOtherAction = async () =>{
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}

const submitForm = async () =>{
console.log('account receivable form:', form);
  const Account = SessionStorage.getItem('Account');
  if (mode.value == '新增'){
    console.log('mode', mode.value)
    form.value.建檔 = Account.account;
    secondDialog.value = true;
    await arStore.saveAR(form).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('寫入成功');
      }
      secondDialog.value = false;
    })
  } else if (mode.value == '修改') {
    console.log('mode', mode.value)
    form.value.修改 = Account.account;
    // form.value.匯率 = form.value.匯率.匯率;
    await arStore.updateAR(form).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('修改成功');
      }
    });
  }
  showForm.value = false;
  form.value = {
      識別碼:0,
      結案:false,
      日期:'',
      單號:'',
      客戶編號:'',
      幣別:'',
      匯率:0.0,
      請款人員:'',
      收款日期:'',
      類別:'',
      收現金額:0.0,
      銀轉金額:0.0,
      憑證種類:'',
      發票號碼:'',
      收票金額:0.0,
      傳票:'',
      備註:'',
      收款總額:0.0,
      建檔:'',
      建檔日:'',
      修改:'',
      修改日:'',
      arListDetail:[],
    };
  await  init();
}

const changeExRate = async (val) =>{
  console.log('val.幣別', val);
  try{
  exRateList.value = await custStore.getExRateList(val);
  form.value.匯率 = exRateList.value[0];
  }catch(e){console.log(e)}
}

onMounted(async ()=>{
  init();
})
const init = async () =>{
  await custStore.getCustNumberList().then((data)=>{
    console.log('custNumberList', data);
    custNumberList.value = data;
  });
  await custStore.getCurrencyList().then((data)=>{
    currencyList.value  = data;
  });

  await arStore.getArList().then((data)=>{
    console.log('arList:', data);
    list.value = data;
  })
  secondDialog.value = false;

  theUser.value = SessionStorage.getItem('Account');
  auth.value = theUser.value.authList.find((x)=>x.menuSubName == formName);
  hasAllAuth.value =
      (!auth.value.高管 && !auth.value.核准 && !auth.value.編修 && !auth.value.報表 && !auth.value.輸出);
  console.log('auth', auth.value);
}

const calcExRateAmount = (item) =>{
  console.log('exrate item', item);
  console.log('form.value.匯率', form.value.匯率.匯率);
  if (form.value.匯率 && form.value.匯率.匯率 > 0){
    item.台幣換算金額 = Math.round(item.原幣收帳金額 * form.value.匯率.匯率);
  }
  form.value.銀轉金額 = 0.0;
  form.value.收款總額 = 0.0;
  for(var i = 0; i < form.value.arListDetail.length; i++){
    form.value.銀轉金額 += Math.round(form.value.arListDetail[i].台幣換算金額)
    form.value.收款總額 += Math.round(form.value.arListDetail[i].台幣換算金額)
  }
  form.value.銀轉金額 -= Math.round(form.value.收票金額);
}

const calculateTax = () =>{
  console.log('calculateTax');
  console.log('calculateTax 銀轉金額', form.value.銀轉金額, )
  console.log('calculateTax 收款總額', form.value.收款總額, )
  console.log('calculateTax 收票金額', form.value.收票金額, )
  form.value.銀轉金額 = Math.round(form.value.收款總額) - Math.round(form.value.收票金額);
}
//function block end
</script>
