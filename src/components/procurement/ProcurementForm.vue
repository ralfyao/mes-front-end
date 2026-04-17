<template>
  <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
    <q-card-section>
      <div class="col-3 flex text-h4">
        {{mode}}採購單
        <div class="flex col-7">
          <q-btn v-if="!preview" class="padding-right" label="採購單分配" color="green" glossy densed/> &nbsp;
          <q-btn v-if="!preview" class="padding-right" label="工作內容撰寫" color="blue" glossy densed @click="openRecordTrackingDialog"/> &nbsp;
        </div>
        <div class="flex col-7" v-if="(hasAllAuth ||(auth && auth.核准)) && !preview">
          <q-btn color="grey" class="padding-right"
                        glossy v-if="procurementData.核准日 && procurementData.核准日!= ''"
                        :loading="loading" @click="validate(false)">取消核准</q-btn> &nbsp;
          <q-btn color="grey" class="padding-right"
                        glossy v-if="!procurementData.核准日 || procurementData.核准日== ''"
                        :loading="loading" @click="validate(true)">核准</q-btn> &nbsp;
        </div>
        <div class="flex col-7" v-if="(hasAllAuth ||(auth && auth.輸出)) && (procurementData.核准日 && procurementData.核准日!= '')">
          <q-btn color="grey" class="padding-right"
                    glossy
                    :loading="loading">列印</q-btn> &nbsp;
          </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-form ref="myForm" >
        <!--日期、單號、廠商編號-->
        <div class="row q-col-gutter-md">
          <!--日期-->
          <div class="col-3 col-md-3">
            <q-input label="日期" outlined readonly dense v-model="procurementData.日期" type="date" />
          </div>
          <!--單號-->
          <div class="col-3 col-md-3">
            <q-input label="單號" outlined readonly dense v-model="procurementData.單號" />
          </div>
          <!--廠商編號-->
          <div class="col-6 col-md-6 flex">
            <label class="text-h5">廠商編號：</label>
            <SupplierSelect v-model:supplierNo="procurementData.廠商編號" v-model:preview="preview" />
          </div>
        </div>
        <br>
        <!--聯絡人、營業稅率、幣別、送貨地址-->
        <div class="row q-col-gutter-md">
          <!--聯絡人-->
          <div class="col-3 col-md-3">
            <q-select
              outlined dense
              :readonly="preview"
              v-model="procurementData.聯絡人"
              :options="supplier.contactList || []"
              option-value="聯絡人"
              option-label="聯絡人"
              label="聯絡人"
              @selection="onSelection"
              emit-value map-options/>
          </div>
          <!--營業稅率-->
          <div class="col-3 col-md-3">
            <q-select label="營業稅率" outlined :readonly="preview" dense v-model="procurementData.營業稅率" :options="rateList" emit-value map-options />
          </div>
          <!--幣別匯率-->
          <div class="col-1 col-md-1">
            <q-select v-model="procurementData.幣別" :readonly="readonly || preview" outlined dense label="幣別"
                :options="currencyList"
                option-label="currency"
                option-value="currency"
                @update:model-value="changeExRate"
                emit-value map-options
                />
          </div>
          <div class="col-1 col-md-1">
            <q-input label="匯率" outlined :readonly="true" dense v-model="procurementData.匯率" />
          </div>
          <!--送貨地址-->
          <div class="col-3 col-md-3">
            <q-input label="送貨地址" outlined :readonly="preview" dense v-model="procurementData.送貨地址" />
          </div>
        </div>
        <br>
        <!--採購歸屬、付款條件、運輸方式、採購人員-->
        <div class="row q-col-gutter-md">
          <div class="col-3 col-md-3">
            <q-select
              outlined dense
              :readonly="preview"
              v-model="procurementData.採購類別"
              :options="procurementTypeList || []"
              label="採購類別"
              emit-value map-options
             />
          </div>
          <div class="col-3 col-md-3">
            <q-select
              outlined dense
              :readonly="preview"
              v-model="procurementData.交易條件"
              :options="paymentTermList || []"
              option-value="付款條件"
              option-label="付款條件"
              label="付款條件"
              emit-value map-options
             />
          </div>
          <div class="col-3 col-md-3">
            <q-select
              outlined dense
              :readonly="preview"
              v-model="procurementData.運輸方式"
              :options="transportationList || []"
              option-value="運輸方式"
              option-label="運輸方式"
              label="運輸方式"
              emit-value map-options
             />
          </div>
          <div class="col-3 col-md-3">
            <ProcurementSelect v-model:procurementor="procurementData.採購人員" :readonly="preview" />
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <div class="col-6 col-md-6">
            <q-input label="注意事項" outlined :readonly="preview" dense v-model="procurementData.注意事項" />
          </div>
          <div class="col-3 col-md-3">
            <q-input
              outlined dense
              :readonly="preview"
              v-model="procurementData.貿易條件"
              label="貿易條件"
              emit-value map-options
             />
          </div>
          <div class="col-2 col-md-2">
            <q-input label="交貨日期" outlined :readonly="preview" dense v-model="procurementData.交貨日期" type="date" />
          </div>
          <div class="col-1 col-md-1">
            <q-btn v-if="!preview" label="作廢" color="red" glossy densed @click="voidPO(procurementData.單號)"/>
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section>
      <div class="text=-h5">採購品項</div>
      <q-btn v-if="!preview" label="新增品項" color="primary" glossy densed @click="addItem"/>
      <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="識別"
                :rows="procurementData.procurementList"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px;max-width: 1500px"
                :pagination="{ rowsPerPage: 5 }"
        >
        <template v-slot:body-cell-品項編號="props">
          <q-td :props="props">
            <q-select
              outlined dense
              v-model="props.row.品項編號"
              :options="品項編號Options"
              option-value="產品編號"
              option-label="產品編號"
              emit-value map-options
              :readonly="preview"
              @update:model-value="onItemSelection(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-品名規格="props">
          <q-td :props="props">
            {{ props.row.品名規格 }}
          </q-td>
        </template>
        <template v-slot:body-cell-單位="props">
          <q-td :props="props">
            {{ props.row.單位 }}
          </q-td>
        </template>
        <template v-slot:body-cell-數量="props">
          <q-td :props="props">
            <q-input style="width: 100px;" outlined dense type="number" @blur="calculateAmount()" :readonly="preview" v-model="props.row.數量" />
          </q-td>
        </template>
        <template v-slot:body-cell-單價="props">
          <q-td :props="props">
            <q-input style="width: 100px;" outlined dense type="number" @blur="calculateAmount()" :readonly="preview" v-model="props.row.單價" />
          </q-td>
        </template>
        <template v-slot:body-cell-未稅金額="props">
          <q-td :props="props">
            {{ props.row.未稅金額 }}
          </q-td>
        </template>
        <template v-slot:body-cell-稅額="props">
          <q-td :props="props">
            {{ props.row.稅額 }}
          </q-td>
        </template>
        <template v-slot:body-cell-採購金額="props">
          <q-td :props="props">
            {{ props.row.採購金額 }}
          </q-td>
        </template>
        <template v-slot:body-cell-專案序號="props">
          <q-td :props="props">
            <q-input outlined dense :readonly="preview" v-model="props.row.專案序號" />
          </q-td>
        </template>
        <template v-slot:body-cell-樣品="props">
          <q-td :props="props">
            <q-checkbox v-model="props.row.樣品" :readonly="preview" />
          </q-td>
        </template>
        <template v-slot:body-cell-備註="props">
          <q-td :props="props">
            <q-input outlined style="width: 200px;" dense :readonly="preview" v-model="props.row.備註" />
          </q-td>
        </template>
        <template v-slot:body-cell-請購序號="props">
          <q-td :props="props">
            <q-input outlined type="number" dense :readonly="preview" v-model="props.row.請購序號" />
          </q-td>
        </template>
        <template v-slot:body-cell-識別="props">
          <q-td :props="props">
            <q-btn v-if="!preview" label="作廢" color="red" glossy densed @click="voidPOItem(props.row)"/>
          </q-td>
        </template>
      </q-table >
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-2 col-md-2">
        </div>
        <div class="col-2 col-md-2">
        </div>
        <div class="col-2 col-md-2">
        </div>
        <div class="col-2 col-md-2">
          總未稅金額：{{ procurementData.procurementList.reduce((sum, item) => sum + item.未稅金額, 0) }}
        </div>
        <div class="col-2 col-md-2">
          總稅額：{{ procurementData.procurementList.reduce((sum, item) => sum + item.稅額, 0) }}
        </div>
        <div class="col-2 col-md-2">
          總採購金額：{{ procurementData.procurementList.reduce((sum, item) => sum + item.採購金額, 0) }}
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="關閉" flat color="red" @click="close"/>
      <q-btn label="送出" flat color="blue" @click="submit"/>
    </q-card-actions>
  </q-card>
  <q-dialog v-model="recordTrackingDialog" persistent max-width="600px">
    <ProcurementRecordTracking v-model:procurementNo="procurementData.單號" v-model:showForm="recordTrackingDialog" @close="recordTrackingDialog = false"/>
  </q-dialog>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region import
import { QCard,
  QCardSection,
  QForm,
  QCardActions,
    // QIcon
  QBtn,
  QInput,
  QSelect,
  QTable,
  QTd,
  QCheckbox,
  QDialog
} from 'quasar';
import {
  ref
  , onMounted
  , defineProps
  , defineEmits
  , watch
} from 'vue';
import SupplierSelect from '@/components/supplier/SupplierSelect.vue';
import { useSupplierStore } from '@/composables/useSupplier';
import { useCustStore } from '@/composables/useCust';
import dayjs from 'dayjs';
import { useAuth } from '@/composables/useAuth';
import { usePurchaseStore } from '@/composables/usePurchase';
import { useItemStore } from '@/composables/useItem';
import ProcurementSelect from '@/components/procurement/ProcurementSelect.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ProcurementRecordTracking from '@/components/procurement/ProcurementRecordTracking.vue';
// #endregion

// #region variable
const formName = '採購作業';
const authStore = useAuth();
const auth = authStore.getAuth(formName);
const hasAllAuth = authStore.hasAllAuth(formName);
const itemStore = useItemStore();
const 品項編號Options = ref([]);
const myForm = ref(null);
const mode = ref('新增');
const secondDialog = ref(false);
const currencyList = ref([]);
const procurementTypeList = ref([
  '現場作業',
  '安全庫存',
  '研發試製',
  '買賣貿易'
]);
const paymentTermList = ref([
  '貨到T/T',
  '即期票',
  '月結當月票',
  '月結30天',
  '月結60天',
  '月結90天'
]);
const transportationList = ref([
  '貨運:公司付費',
'貨運:廠商付費',
'公司自行載運',
'廠商自行送貨',
'海運:進口報關',
'空運:快捷委託'
]);
// const procurementorList = ref([]);
// const tradeTermList = ref([]);
const supplier = ref({
  contactList: []
});
const recordTrackingDialog = ref(false);
const procurementData = ref({
   單號:''
  ,日期:''
  ,廠商編號:''
  ,聯絡人:''
  ,營業稅率:0
  ,幣別:''
  ,匯率:''
  ,採購人員:''
  ,採購類別:''
  ,交易條件:''
  ,運輸方式:''
  ,送貨地址:''
  ,貿易條件:''
  ,交貨日期:''
  ,結案:''
  ,建檔:''
  ,建檔日:''
  ,修改:''
  ,修改日:''
  ,核准:''
  ,核准日:''
  ,注意事項:''
  ,procurementList:[]
});
const columns = ref([
  { name: '品項編號', label: '品項編號', align: 'left', field: '品項編號', sortable: true },
  { name: '品名規格', label: '品名規格', align: 'left', field: '品名規格', sortable: true },
  { name: '數量', label: '採購數量', align: 'right', field: '數量', sortable: true },
  { name: '收貨數量', label: '收貨數量', align: 'left', field: '收貨數量', sortable: true },
  { name: '合格數量', label: '合格數量', align: 'left', field: '合格數量', sortable: true },
  { name: '特採數量', label: '特採數量', align: 'left', field: '特採數量', sortable: true },
  { name: '單位', label: '單位', align: 'left', field: '單位', sortable: true },
  { name: '單價', label: '單價', align: 'right', field: '單價', sortable: true },
  { name: '未稅金額', label: '未稅金額', align: 'right', field: '未稅金額', sortable: true },
  { name: '稅額', label: '稅額', align: 'right', field: '稅額', sortable: true },
  { name: '採購金額', label: '採購金額', align: 'right', field: '採購金額', sortable: true },
  { name: '專案序號', label: '專案序號', align: 'left', field: '專案序號', sortable: true },
  { name: '樣品', label: '樣品', align: 'center', field: '樣品', sortable: true },
  { name: '備註', label: '備註', align: 'left', field: '備註', sortable: false },

  { name: '請購序號', label: '請購序號', align: 'left', field: '請購序號', sortable: false },
  { name: '識別', label: '作廢', align: 'left', field: '識別', sortable: false },
]);
const supplierStore = useSupplierStore();
const preview = ref(false);
const props = defineProps({
  mode: {
    type: String,
    default: '新增'
  },
  procurementData: {
    type: Object,
    default: () => ({})
  },
  preview: {
    type: Boolean,
    default: false
  },
  showForm: {
    type: Boolean,
    default: false
  },
  formName:{
    type: String,
    default: '採購作業'
  }
})

const emits = defineEmits(['update:showForm']);
const showForm = ref(false);
const rateList = ref([
  { label: '0%', value: '0' },
  { label: '5%', value: '0.05' },
]);
const custStore = useCustStore();
const exRateList = ref([]);
const newPONo = ref('');
const purchaseStore = usePurchaseStore();
// #endregion

// #region function
const submit = async () => {
  secondDialog.value = true;
  console.log('submit', procurementData.value);
  if (mode.value === '新增') {
    await purchaseStore.createPurchaseOrder(procurementData.value).then((response) => {
      console.log('create response', response);
      if (response.errorMessage && response.errorMessage !== '') {
        // 在這裡可以處理錯誤，例如顯示錯誤訊息
        alert(mode.value + '失敗:' + response.errorMessage);
      } else {
        // 在這裡可以處理成功的回應，例如顯示成功訊息或更新 UI
        alert(mode.value + '成功!');
      }

      secondDialog.value = false;
      close();
      // 在這裡可以處理成功的回應，例如顯示成功訊息或更新 UI
    }).catch((error) => {
      console.error('Create error:', error);
      secondDialog.value = false;
      // 在這裡可以處理錯誤，例如顯示錯誤訊息
    });
  } else if (mode.value === '修改') {
    if (procurementData.value.建檔日 == 'Invalid Date'){
      procurementData.value.建檔日 = dayjs().format('YYYY-MM-DD');
    }
    if (procurementData.value.核准日 == 'Invalid Date'){
      procurementData.value.核准日 = dayjs().format('YYYY-MM-DD');
    }
    if (procurementData.value.修改日 == 'Invalid Date'){
      procurementData.value.修改日 = dayjs().format('YYYY-MM-DD');
    }
    procurementData.value.建檔日 = dayjs(procurementData.value.建檔日).format('YYYY-MM-DD');
    procurementData.value.核准日 = dayjs(procurementData.value.核准日).format('YYYY-MM-DD');
    procurementData.value.修改 = authStore.getUser().account;
    procurementData.value.修改日 = dayjs().format('YYYY-MM-DD');
    procurementData.value.procurementList.forEach(item => {
      item.交貨日期 = dayjs(item.交貨日期).format('YYYY-MM-DD');
    });
    await purchaseStore.updatePurchaseOrder(procurementData.value).then((response) => {
      console.log('update response', response);
      if (response.errorMessage && response.errorMessage !== '') {
        // 在這裡可以處理錯誤，例如顯示錯誤訊息
        alert(mode.value + '失敗:' + response.errorMessage);
      } else {
        // 在這裡可以處理成功的回應，例如顯示成功訊息或更新 UI
        alert(mode.value + '成功!');
      }
      secondDialog.value = false;
      close();
      // 在這裡可以處理成功的回應，例如顯示成功訊息或更新 UI
    }).catch((error) => {
      console.error('Update error:', error);
      secondDialog.value = false;
      close();

      // 在這裡可以處理錯誤，例如顯示錯誤訊息
    });
  }
  // 在這裡可以進行表單驗證和提交邏輯
  // 例如，使用 myForm.value.validate() 來驗證表單
  // 然後將 procurementData.value 發送到後端 API
}
const addItem = () => {
  procurementData.value.procurementList.push({
    // 識別: Date.now(), // 使用時間戳作為識別碼，實際應用中可能需要更複雜的識別邏輯
    識別:0,
    品項編號: '',
    品名規格: '',
    單位: '',
    數量: 0,
    單價: 0,
    未稅金額:0,
    稅額:0,
    採購金額: 0,
    專案序號: '',
    樣品:false,
    備註:'',
    請購序號:''
  });
}
const init = async () =>{
  mode.value = props.mode;
  console.log('mode.value', mode.value);
  // formName.value = props.formName;
  if (mode.value === '新增') {
    await purchaseStore.getPONo().then((data)=>{
      console.log('newPONo', data);
      newPONo.value = data;
    });
    procurementData.value = {
      單號:newPONo.value
     ,日期:dayjs().format('YYYY-MM-DD')
     ,廠商編號:''
     ,聯絡人:''
     ,營業稅率:0
     ,幣別:''
     ,匯率:0
     ,採購人員:''
     ,採購類別:''
     ,交易條件:''
     ,運輸方式:''
     ,送貨地址:''
     ,貿易條件:''
     ,交貨日期:''
     ,結案:false
     ,建檔:authStore.getUser().account
     ,建檔日:dayjs().format('YYYY/MM/DD')
     ,修改:authStore.getUser().account
     ,修改日:dayjs().format('YYYY/MM/DD')
     ,核准:''
     ,核准日:''
     ,注意事項:''
     ,procurementList:[]
    };
  } else {
    if (props.procurementData){
      console.log('props.procurementData', props.procurementData);
      procurementData.value = props.procurementData;
      procurementData.value.日期 = dayjs(procurementData.value.日期).format('YYYY-MM-DD');
      procurementData.value.交貨日期 = dayjs(procurementData.value.交貨日期).format('YYYY-MM-DD');
    }
  }
  // procurementData.value = props.procurementData;
  preview.value = props.preview;
  showForm.value = props.showForm;

  await custStore.getCurrencyList().then((data)=>{
    console.log('currencyList', data);
    currencyList.value  = data;
  });
  await itemStore.getAllItems().then((data)=>{
    console.log('itemList', data);
    品項編號Options.value  = data;
  });
}
onMounted(async () => {
  init();

})

const close = () => {
  console.log('close form')
  emits('update:showForm', false);
}

const changeExRate = async (val) =>{
  console.log('val.currency', val);
  try{
  exRateList.value = await custStore.getExRateList(val);
  procurementData.value.匯率 = exRateList.value[0].匯率;
  }catch(e){console.log(e)}
}

const calculateAmount = () =>{
  procurementData.value.procurementList.forEach(item => {
    console.log('procurementData.value.營業稅率', procurementData.value.營業稅率);
    item.未稅金額 = item.數量 * item.單價;
    item.稅額 = Math.round(item.未稅金額 * procurementData.value.營業稅率 * 100) / 100;
    item.採購金額 = item.未稅金額 + item.稅額;
  });
}

const onItemSelection = (row) =>{
  const selectedItem = 品項編號Options.value.find(item => item.產品編號 === row.品項編號);
  console.log('selectedItem', selectedItem);
  if (selectedItem) {
    row.品名規格 = selectedItem.品名規格;
    row.單位 = selectedItem.採購單位;
  }
}

const voidPO = async (poNo) =>{
  if (confirm('確定要作廢這筆採購單嗎？')) {
    secondDialog.value = true;
    await purchaseStore.voidPurchaseOrder(poNo).then((response) => {
      console.log('void response', response);
      if (response.errorMessage && response.errorMessage !== '') {
        // 在這裡可以處理錯誤，例如顯示錯誤訊息
        alert('作廢失敗:' + response.errorMessage);
      } else {
        // 在這裡可以處理成功的回應，例如顯示成功訊息或更新 UI
        alert('作廢成功!');
      }
      secondDialog.value = false;
      close();
      // 在這裡可以處理成功的回應，例如顯示成功訊息或更新 UI
    }).catch((error) => {
      console.error('Void error:', error);
      secondDialog.value = false;
      close();
      // 在這裡可以處理錯誤，例如顯示錯誤訊息
    });
  }
}

const voidPOItem = async (row) =>{
  if (confirm('確定要作廢這筆採購品項嗎？')) {
    secondDialog.value = true;
    await purchaseStore.voidPurchaseOrderItem(row.識別).then((response) => {
      console.log('void item response', response);
      if (response.errorMessage && response.errorMessage !== '') {
        // 在這裡可以處理錯誤，例如顯示錯誤訊息
        alert('作廢失敗:' + response.errorMessage);
      } else {
        // 在這裡可以處理成功的回應，例如顯示成功訊息或更新 UI
        alert('作廢成功!');
        secondDialog.value = false;
        close();
      }
    }).catch((error) => {
      console.error('Void item error:', error);
      secondDialog.value = false;
      close();
      // 在這裡可以處理錯誤，例如顯示錯誤訊息
    });
  }
}

const validate = async (validate) =>{
  const user = authStore.getUser().account;
  await purchaseStore.evaluatePurchaseOrder(procurementData.value.單號, validate, user).then((data)=>{
    console.log('validate response', data);
    if(data?.data?.errorMessage && data?.data?.errorMessage != ''){
      alert(data.data.errorMessage)
    } else {
      alert(`${validate ? '核准' : '取消核准'}完成`);
    }
    close();
  })
}

watch(() => procurementData.value.廠商編號, async (newVal) => {
  await supplierStore.querySupplier({ supplierNo: newVal }).then(response => {
    supplier.value = response[0];
  }).catch(error => {
    console.error('Query error:', error);
  });
})

const openRecordTrackingDialog = () =>{
  recordTrackingDialog.value = true;
}
// #endregion
</script>
