<template>
  <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
    <q-card-section>
      <div class="col-3 flex text-h4">
        {{mode}}採購單
        <q-btn v-if="!preview" label="採購單分配" color="green" glossy densed/>
      </div>
    </q-card-section>
    <q-card-section>
      <q-form ref="myForm" >
        <!--日期、單號、廠商編號-->
        <div class="row q-col-gutter-md">
          <!--日期-->
          <div class="col-3 col-md-3">
            <q-input label="日期" outlined :readonly="preview" dense v-model="procurementData.日期" type="date" />
          </div>
          <!--單號-->
          <div class="col-3 col-md-3">
            <q-input label="單號" outlined :readonly="preview" dense v-model="procurementData.單號" />
          </div>
          <!--廠商編號-->
          <div class="col-6 col-md-6 flex">
            <label class="text-h5">廠商編號：</label>
            <SupplierSelect v-model:supplierNo="procurementData.廠商編號" :readonly="preview" />
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
            <q-select label="營業稅率" outlined :readonly="preview" dense v-model="procurementData.營業稅率" :options="rateList" />
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
              option-value="採購類別"
              option-label="採購類別"
              label="採購類別"
              emit-value map-options
             />
          </div>
          <div class="col-3 col-md-3">
            <q-select
              outlined dense
              :readonly="preview"
              v-model="procurementData.付款條件"
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
            <q-select
              outlined dense
              :readonly="preview"
              v-model="procurementData.採購人員"
              :options="procurementorList || []"
              option-value="採購人員"
              option-label="採購人員"
              label="採購人員"
              emit-value map-options
             />
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <div class="col-6 col-md-6">
            <q-input label="注意事項" outlined :readonly="preview" dense v-model="procurementData.注意事項" />
          </div>
          <div class="col-3 col-md-3">
            <q-select
              outlined dense
              :readonly="preview"
              v-model="procurementData.貿易條件"
              :options="tradeTermList || []"
              option-value="貿易條件"
              option-label="貿易條件"
              label="貿易條件"
              emit-value map-options
             />
          </div>
          <div class="col-2 col-md-2">
            <q-input label="交貨日期" outlined :readonly="preview" dense v-model="procurementData.交貨日期" type="date" />
          </div>
          <div class="col-1 col-md-1">
            <q-btn v-if="!preview" label="作廢" color="primary" glossy densed/>
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section>
      <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="識別"
                :rows="procurementData.procurementList"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table >
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="關閉" flat color="red" @click="close"/>
    </q-card-actions>
  </q-card>
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
} from 'quasar';
import {
  ref
  , onMounted
  , defineProps
  , defineEmits,
  watch
} from 'vue';
import SupplierSelect from '@/components/supplier/SupplierSelect.vue';
import { useSupplierStore } from '@/composables/useSupplier';
import { useCustStore } from '@/composables/useCust';
import dayjs from 'dayjs';
import { useAuth } from '@/composables/useAuth';
// import SupplierListQueryView from '@/components/supplier/query/SupplierListQueryView.vue';
// #endregion

// #region variable
const authStore = useAuth();
const myForm = ref(null);
const mode = ref('新增');
const currencyList = ref([]);
const procurementTypeList = ref([]);
const paymentTermList = ref([]);
const transportationList = ref([]);
const procurementorList = ref([]);
const tradeTermList = ref([]);
const supplier = ref({
  contactList: []
});
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
  { name: '識別', label: '識別', align: 'left', field: '識別', sortable: true },
  { name: '品號', label: '品號', align: 'left', field: '品號', sortable: true },
  { name: '品名', label: '品名', align: 'left', field: '品名', sortable: true },
  { name: '規格', label: '規格', align: 'left', field: '規格', sortable: true },
  { name: '單位', label: '單位', align: 'left', field: '單位', sortable: true },
  { name: '數量', label: '數量', align: 'right', field: '數量', sortable: true },
  { name: '單價', label: '單價', align: 'right', field: '單價', sortable: true },
  { name: '金額', label: '金額', align: 'right', field: '金額', sortable: true },
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
// #endregion

// #region function
const init = async () =>{
  mode.value = props.mode;
  console.log('mode.value', mode.value);
  if (mode.value === '新增') {
    procurementData.value = {
      單號:''
     ,日期:''
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
     ,建檔:authStore.getUser()
     ,建檔日:dayjs().format('YYYY/MM/DD')
     ,修改:authStore.getUser()
     ,修改日:dayjs().format('YYYY/MM/DD')
     ,核准:''
     ,核准日:''
     ,注意事項:''
     ,procurementList:[]
    };
  } else {
    if (props.procurementData){
      procurementData.value = props.procurementData;
    }
  }
  // procurementData.value = props.procurementData;
  preview.value = props.preview;
  showForm.value = props.showForm;

  await custStore.getCurrencyList().then((data)=>{
    console.log('currencyList', data);
    currencyList.value  = data;
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

watch(() => procurementData.value.廠商編號, async (newVal) => {
  await supplierStore.querySupplier({ supplierNo: newVal }).then(response => {
    supplier.value = response[0];
  }).catch(error => {
    console.error('Query error:', error);
  });
})
// #endregion
</script>
