<template>
  <q-card class="q-pa-md"  style="width: 1500px; max-width: 100vw;">
    <q-card-section>
      <div class="text-h4">
        {{mode}}進貨單
        <q-btn label="採購分配" outlined dense glossy color="blue"/> &nbsp;
        <q-btn label="會計傳票" outlined dense glossy color="brown"/>&nbsp;
        <q-btn label="核准" outlined dense glossy color="grey"/>&nbsp;
        <q-btn label="取消核准" outlined dense glossy color="grey"/>&nbsp;
        <q-btn label="列印" outlined dense glossy color="grey"/>&nbsp;
      </div>
    </q-card-section>
    <q-card-section>
      <q-form ref="myForm">
        <div class="row q-col-gutter-md">
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input  outlined dense readonly v-model="form.日期" label="日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.日期" readonly mask="YYYY/MM/DD"  no-title @update:model-value="showDatePopup = false">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input label="單號" outlined dense v-model="form.單號" readonly/>
          </div>
          <div class="col-2 col-md-2" style="max-width: 250px">
          </div>
          <div class="col-2 col-md-2" style="max-width: 250px">
          </div>
          <div class="col-2 col-md-2" style="max-width: 250px">
          </div>
          <div class="col-2 col-md-2" style="max-width: 250px">
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="關閉" color="blue" flat dense @click="close"/>
    </q-card-actions>
  </q-card>
</template>
<script setup>
// #region import
import {QCard
  , QCardSection
  , QBtn
  , QForm
  , QCardActions
  , QInput
  , QIcon
  , QDate
  , QPopupProxy
} from 'quasar';
import { ref,
  defineProps,
  onMounted,
  defineEmits,
 } from 'vue'
 import dayjs from 'dayjs'
import { useStockIn } from '@/composables/useStockIn';
// #endregion

// #region variable
const mode = ref('');
const stockInStore = useStockIn();
const emits = defineEmits(['update:showForm']);
const myForm = ref(null);
const showDatePopup = ref(false);
const form = ref({
  單號:''
  ,日期:''
  ,倉管人員:''
  ,備註:''
  ,建檔:''
  ,建檔日:''
  ,修改:''
  ,修改日:''
  ,核准:''
  ,核准日:''
  ,採購覆核:''
  ,覆核日:''
  ,傳票:''
  ,defailList:[]
});
const props = defineProps({
  form:{
    type:Object,
    default:()=>{}
  },
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  mode:{
    type:String,
    default:'',
  },
  preview:{
    type:Boolean,
    default:false,
  }
})
// #endregion

// #region function
const init = async () =>{
  mode.value = props.mode;
  form.value = props.form;
  if (mode.value == '新增'){
    form.value.日期 = dayjs().format("YYYY/MM/DD")
    await stockInStore.getFormNo().then((data)=>{
      form.value.單號 = data;
    })
  }
}
onMounted(async ()=>{
  await init();
})
const close = () =>{
  emits('update:showForm', false);
}
// #endregion
</script>
