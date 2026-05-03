<template>
  <q-card class="q-pa-md"  style="width: 1500px; max-width: 100vw;">
    <q-card-section>
      <div class="text-h4">
        {{ props.mode }}{{ formName }}
        <q-btn label="覆核" v-if="!props.preview && (hasAllAuth) && !form.核准" outlined dense glossy color="grey"/>&nbsp;
        <q-btn label="取消覆核" v-if="!props.preview && (hasAllAuth) && form.核准" outlined dense glossy color="grey"/>&nbsp;
      </div>
    </q-card-section>
    <q-form ref="myForm">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!--日期-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input  outlined dense readonly v-model="form.日期" label="日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.日期" disable readonly mask="YYYY/MM/DD" v-close-popup no-title @update:model-value="showDatePopup = false">
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
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input outlined dense label="單號" v-model="form.單號" readonly/>
          </div>
          <!--付款類別-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-select outlined dense label="付款類別" v-model="form.類別" emit-value map-options :options="paymentList"/>
          </div>
          <!--憑證種類-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-select outlined dense label="憑證種類" v-model="form.MACHINENO" emit-value map-options :options="machineNoList"/>
          </div>
          <!--發票日期-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input  outlined dense v-model="form.付款日期" label="發票日期" mask="####/##/##" :rules="[val => !!val || '發票日期為必填欄位']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover v-model="showIVDatePopup" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.付款日期" mask="YYYY/MM/DD" v-close-popup no-title @update:model-value="showIVDatePopup = false">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat @click="showIVDatePopup = false" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <!--未稅金額-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input outlined dense type="number" label="未稅金額" v-model="form.銀轉金額" />
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <!--廠商編號、全稱-->
          <div class="col-6 col-md-6 flex" style="max-width: 750px">
            <supplier-select v-mode="form.廠商編號" />
          </div>
          <!--發票號碼-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-input outlined dense label="發票號碼" v-model="form.發票號碼"/>
          </div>
          <!--未稅金額-->
          <div class="col-3 col-md-3" style="max-width: 375px">
            <q-input outlined dense type="number" label="稅額" v-model="form.付票金額" />
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <!--會計傳票-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input outlined dense label="會計傳票" v-model="form.傳票" />
          </div>
          <!--幣別-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-select outlined dense label="幣別" v-model="form.幣別" emit-value map-options :options="currencyList"/>
          </div>
          <!--匯率-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input outlined dense readonly type="number" label="匯率" v-model="form.匯率" />
          </div>
          <!--付款單號-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input outlined dense label="付款單號" v-model="form.請款人員" style="width:100px"/>
            <q-btn outlined dense label="單筆付款" color="brown" glossy style="width:75px" />
            <q-checkbox outlined dense label="結案" v-model="form.結案" @update:model-value="toogleClose" style="width:10px"/>
          </div>
          <!--帳期-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input outlined dense label="帳期" v-model="form.備註" />
          </div>
          <!--總額-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input outlined dense readonly type="number" label="總額" v-model="form.付款總額" />
          </div>
        </div>
        <br>
      </q-card-section>
      <q-card-section>

      </q-card-section>
    </q-form>
    <q-card-actions align="right">
      <q-btn label="關閉" color="blue" flat dense @click="close"/>
    </q-card-actions>
  </q-card>
</template>
<script setup>
// #region import
import {
  QCard
  , QCardSection
  , QBtn
  , QCardActions
  , QForm
  , QInput
  , QIcon
  , QPopupProxy
  , QDate
  , QSelect
  , QCheckbox
} from 'quasar';
import {
  defineProps
  , onMounted
  , ref
  , defineEmits
} from 'vue';
import { useAuth } from '@/composables/useAuth';
import dayjs from 'dayjs'
import SupplierSelect from '../supplier/SupplierSelect.vue';
// #endregion

// #region variable
const showDatePopup = ref(false);
const showIVDatePopup = ref(false);
const formName = '進項憑證'
const paymentList = ref([]);
const machineNoList = ref([]);
const currencyList = ref([]);
const props = defineProps({
  form:{
    type:Object,
    default:() =>{},
  },
  mode:{
    type:String,
    default:'新增'
  },
  showForm:{
    type:Boolean,
    default:false,
  },
  preview:{
    type:Boolean,
    default:false,
  }
});
const form = ref({
       識別碼:0
      ,日期:dayjs().format('YYYY/MM/DD')
      ,單號:''
      ,廠商編號:''
      ,幣別:''
      ,匯率:0.0
      ,請款人員:''
      ,付款日期:''
      ,類別:''
      ,付現金額:0.0
      ,銀轉金額:0.0
      ,匯費:0.0
      ,銀存編碼:''
      ,付票金額:0.0
      ,票據號碼:''
      ,付款總額:0.0
      ,MACHINENO:''
      ,發票號碼:''
      ,備註:''
      ,建檔:''
      ,建檔日:''
      ,修改:''
      ,修改日:''
      ,核准:''
      ,核准日:''
      ,傳票:''
      ,結案:false
      ,detailList:[]
});
const authStore = useAuth();
const hasAllAuth = authStore.hasAllAuth(formName);
const emits = defineEmits(['update:showForm'])
// #endregion

// #region function
const init  = async()=>{
  if (props.mode == '修改')
    form.value = props.form;
}
onMounted(async ()=>{
  await init();
})
const close = () =>{
  emits('update:showForm', false);
}
// #endregion
</script>
