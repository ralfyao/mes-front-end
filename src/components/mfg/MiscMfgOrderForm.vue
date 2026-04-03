<template>
  <q-card class="q-pa-md"  style="width: 1500px; max-width: 100vw;">
    <q-card-section>
      <div class="text-h4">{{mode}}零件工令單</div>
    </q-card-section>
    <q-card-section>
      <q-form ref="myForm">
        <!--申請用途、申請日期、單號、收費機制-->
        <div class="row q-col-gutter-md">
          <!--申請用途-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-select label="申請用途" outlined dense :readonly="readonly || preview" v-model="form.申請用途" :options="options" option-label="label" option-value="value" emit-value map-options />
          </div>
          <!--申請日期-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-input  outlined dense :readonly="readonly || preview" v-model="form.申請日期" label="日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.申請日期"  :readonly="readonly || preview" mask="YYYY/MM/DD" no-title>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <!--單號-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-input outlined dense readonly v-model="form.單號" label="單號" />
          </div>
          <!--收費機制-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-select label="收費機制" v-model="form.收費機制" outlined dense :readonly="readonly || preview" :options="收費機制options" option-label="label" option-value="value" emit-value map-options />
          </div>
        </div>
        <!--客戶名稱、專案序號、機台型號-->
        <div class="row q-col-gutter-md">
          <!--客戶名稱-->
          <div class="col-6 col-md-6" style="max-width: 750px">
            <CustCodeSelect v-model:客戶編號="form.客戶編號"/>
          </div>
          <!--專案序號-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-input outlined dense :readonly='readonly || preview' v-model="form.專案序號" label="專案序號" />
          </div>
          <!--機台型號-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-input outlined dense :readonly='readonly || preview' v-model="form.機台型號" label="機台型號" />
          </div>
        </div>
        <br>
        <!--機台名稱、運送方式、交貨日期、保固效期-->
        <div class="row q-col-gutter-md">
          <!--機台名稱-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-input outlined dense :readonly='readonly || preview' v-model="form.機台名稱" label="機台名稱" />
          </div>
          <!--運送方式-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-select label="運送方式" outlined dense :readonly="readonly || preview" v-model="form.運送方式" :options="運送方式options" option-label="label" option-value="value" emit-value map-options />
          </div>
          <!--交貨日期-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-input  outlined dense :readonly="readonly || preview" v-model="form.交貨日期" label="交貨日期" mask="####/##/##" :rules="[val => !!val || '交貨日期為必填欄位']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover v-model="showDate3Popup" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.交貨日期"  :readonly="readonly || preview" mask="YYYY/MM/DD" no-title>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat @click="showDate3Popup = false" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <!--保固效期-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <!-- <q-input outlined dense :readonly='readonly || preview' v-model="form.保固效期" label="保固效期" /> -->
            <q-input  outlined dense :readonly="readonly || preview" v-model="form.保固效期" label="保固效期" mask="####/##/##" :rules="[val => !!val || '保固效期為必填欄位']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover v-model="showDate2Popup" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.保固效期"  :readonly="readonly || preview" mask="YYYY/MM/DD" no-title>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat @click="showDate2Popup = false" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <!--狀況說明-->
        <div class="row q-col-gutter-md">
          <div class="col-9 col-md-9" style="max-width: 1125px">
            <q-input type="textarea" outlined dense :readonly='readonly || preview' v-model="form.狀況說明" label="狀況說明" />
          </div>
          <div class="col-3 col-md-3" style="max-width: 375px">
            <SalesSelect v-model:sales="form.申請人"/>
            <q-btn color="green" outlined dense glossy label="收款進度查詢"/>
          </div>
        </div>
        <br>
        <!--零件列表-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 1500px">
            <q-btn label="新增零件" outlined dense glossy color="primary" @click="addPart"/>
            <q-table  class="rounded-borders my-sticky-header-table"
                      :columns="columns"
                      row-key="識別碼"
                      :rows="form.detailList"
                      flat
                      bordered
                      virtual-scroll
                      style="max-height: 500px"
              >
              <template v-slot:body-cell-零件分類="props">
                <q-td :props="props">
                  <q-select outlined dense
                    v-model="props.row.零件分類"
                    :options="零件分類Options"
                    emit-value map-options
                    />
                </q-td>
              </template>
              <template v-slot:body-cell-零件號碼="props">
                <q-td :props="props">
                  <q-input outlined dense v-model="props.row.零件號碼" />
                </q-td>
              </template>
              <template v-slot:body-cell-品名="props">
                <q-td :props="props">
                  <q-input outlined dense v-model="props.row.品名" />
                </q-td>
              </template>
              <template v-slot:body-cell-描述="props">
                <q-td :props="props">
                  <q-input outlined dense v-model="props.row.描述" />
                </q-td>
              </template>
              <template v-slot:body-cell-數量="props">
                <q-td :props="props">
                  <q-input type="number" outlined dense v-model="props.row.數量" />
                </q-td>
              </template>
              <template v-slot:body-cell-單位="props">
                <q-td :props="props">
                  <q-input outlined dense v-model="props.row.單位" />
                </q-td>
              </template>
              <template v-slot:body-cell-附屬模組="props">
                <q-td :props="props">
                  <q-input outlined dense v-model="props.row.附屬模組" />
                </q-td>
              </template>
              <template v-slot:body-cell-備註="props">
                <q-td :props="props">
                  <q-input outlined dense v-model="props.row.備註" />
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn v-if="!preview" label="送出" color="primary" @click="handleOtherAction" />
      <q-btn flat label="關閉" color="primary" @click="close"/>
    </q-card-actions>
  </q-card>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region import block start
import {
  QCard,
  QBtn,
  QCardSection,
  QCardActions,
  QForm,
  QSelect,
  QInput,
  QIcon,
  QPopupProxy,
  QDate,
  SessionStorage,
  QTable,
  QTd,
} from 'quasar'
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  watch,
} from 'vue'
import LoadingComponent from '@/components/LoadingComponent.vue';
import dayjs from 'dayjs';
import { useMfgStore } from '@/composables/useMfg';
import CustCodeSelect from '../customer/CustCodeSelect.vue';
import SalesSelect from '../customer/SalesSelect.vue';
// #endregion import block end


// #region variable block start
const secondDialog = ref(false);
const showDatePopup = ref(false);
const showDate2Popup = ref(false);
const showDate3Popup = ref(false);
const columns = ref([
  { name: '零件分類', label: '零件分類', field: '零件分類', align: 'left' },
  { name: '零件號碼', label: '零件編號', field: '零件號碼', align: 'left' },
  { name: '品名', label: '零件名稱', field: '品名', align: 'left' },
  { name: '描述', label: '規格', field: '描述', align: 'left' },
  { name: '數量', label: '數量', field: '數量', align: 'right' },
  { name: '單位', label: '單位', field: '單位', align: 'left' },
  { name: '附屬模組', label: '負責人', field: '附屬模組', align: 'left' },
  { name: '備註', label: '備註', field: '備註', align: 'left' },
]);
const 零件分類Options = ref([
  {label:'市購品', value:'市購品'},
  {label:'庫存品', value:'庫存品'},
  {label:'自製/需購料', value:'自製/需購料'},
  {label:'自製/在庫料', value:'自製/在庫料'},
])
const 運送方式options = ref([
  {label:'自行載運:大慶', value:'自行載運:大慶'},
  {label:'自行載運:客戶', value:'自行載運:客戶'},
  {label:'貨運:大慶自付', value:'貨運:大慶自付'},
  {label:'貨運:客戶到付', value:'貨運:客戶到付'},
])
const options=ref([
  {label:'專案增購', value:'專案增購'},
  {label:'廠驗追加', value:'廠驗追加'},
  {label:'售後維修', value:'售後維修'},
  {label:'客戶訂購', value:'客戶訂購'},
  {label:'安全庫存', value:'安全庫存'},
  {label:'研發用途', value:'研發用途'},
  {label:'受託代工', value:'受託代工'},
  {label:'買賣批發', value:'買賣批發'},
]);
const 收費機制options = [
  {label:'不收費:保固效期內', value:'不收費:保固效期內'},
  {label:'不收費:特案處理', value:'不收費:特案處理'},
  {label:'不收費:廠內驗機追加', value:'不收費:廠內驗機追加'},
  {label:'收費:廠內驗機追加', value:'收費:廠內驗機追加'},
  {label:'收費:超過保固期', value:'收費:超過保固期'},
  {label:'收費:客戶自行汰換', value:'收費:客戶自行汰換'},
  {label:'收費:定期維修計畫', value:'收費:定期維修計畫'},
]
const salesOrderForm =  ref({
      account:SessionStorage.getItem('Account').account,
      識別:'',
      日期:'',
      單號:'',
      客戶編號:'',
      業務員:'',
      幣別:'',
      稅別:'',
      稅率:'',
      總額:0.0,
      佣金:0.0,
      結案:'',
      要望日期:'',
      交貨地址:'',
      指配國別:'',
      目的港:'',
      價格條件:'',
      交貨方式:'',
      付款方式:'',
      交貨日期:'',
      machineno:'',
      remark:'',
      建檔:'',
      修改:'',
      核准:'',
      建檔日:'',
      修改日:'',
      核准日:'',
      orderListDetail:[],
      arListDetail: []
    });
const form = ref({
      識別碼:''
      ,單號:''
      ,申請日期:''
      ,申請人:''
      ,客戶簡稱:''
      ,專案序號:''
      ,機台型號:''
      ,機台類型:''
      ,機台名稱:''
      ,交貨日期:''
      ,保固效期:''
      ,收費機制:''
      ,運送方式:''
      ,建檔:''
      ,修改:''
      ,核准:''
      ,建檔日:''
      ,修改日:''
      ,核准日:''
      ,主旨:''
      ,申請用途:''
      ,客戶編號:''
      ,訂單編號:''
      ,detailList:[],
});
// const custStore = useCustStore();
const mode = ref('新增');
const preview = ref(false);
const emits = defineEmits(['update:showForm']);
const myForm = ref(null);
const showForm = ref(false);
const mfgStore = useMfgStore();
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  salesOrderForm:{
    type:Object,
    default:()=>({
      account:SessionStorage.getItem('Account').account,
      識別:'',
      日期:'',
      單號:'',
      客戶編號:'',
      業務員:'',
      幣別:'',
      稅別:'',
      稅率:'',
      總額:0.0,
      佣金:0.0,
      結案:'',
      要望日期:'',
      交貨地址:'',
      指配國別:'',
      目的港:'',
      價格條件:'',
      交貨方式:'',
      付款方式:'',
      交貨日期:'',
      machineno:'',
      remark:'',
      建檔:'',
      修改:'',
      核准:'',
      建檔日:'',
      修改日:'',
      核准日:'',
      orderListDetail:[],
      arListDetail: []
    }),
  }
})
// const
// #endregion variable block end


// #region function block start
const close = () =>{
  emits('update:showForm', false);
}
const init = async () =>{
  showForm.value = props.showForm;
  salesOrderForm.value = props.salesOrderForm;
  form.value.申請日期 = dayjs().format('YYYY/MM/DD');
  if (mode.value === '新增') {
    await mfgStore.getMiscMfgOrderNo().then((data)=>{
      form.value.單號 = data;
    })
  }
}
onMounted(async ()=>{
  await init();
})
const addPart = () =>{
  form.value.detailList.push({
    識別碼:0
    ,單號:''
    ,零件分類:''
    ,零件號碼:''
    ,品名:''
    ,描述:''
    ,數量:0
    ,單位:''
    ,備註:''
    ,附屬模組:''
    ,模組編碼:''
    ,BOM編號:''
    ,BOM表識別碼:''
  });
}
watch(
  () => form.value.客戶編號,
  async (newVal, oldVal) => {
    if (newVal) {
      console.log('客戶編號變更，更新客戶簡稱', oldVal, newVal);
    }
  }
)
const handleOtherAction = async () => {
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}
const submitForm = () =>{
  var result = confirm('您確認要送出零件申請單嗎?');
  if (!result)
    return;
  secondDialog.value = true;
  form.value.訂單編號 = salesOrderForm.value.單號;
  mfgStore.createMiscMfgOrder(form).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert('零件申請單建立成功!');
      close();
    }
    secondDialog.value = false;
  })
}
// #endregion function block end
</script>
