<!-- eslint-disable no-unused-vars -->
<template>
  <q-card  class="q-pa-md"  style="width: 750px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">詢問函搜尋</div>
      <q-form ref="myForm" >
        <q-card-section>
          <div class="row items-center q-col-gutter-md no-wrap">
            <div class="col-3 col-md-3 no-wrap" style="max-width: 200px">
              <label class="text-h6">詢問單日期</label>
            </div>
            <div class="col-9 col-md-9  row items-center no-wrap" style="max-width: 550px">
              <q-input outlined dense v-model="startDate" style="width: 160px" label="開始日期" mask="####/##/##">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover v-model="showFromDatePopup" transition-show="scale" transition-hide="scale">
                      <q-date v-model="startDate" mask="YYYYMMDD" class="width:100px;" no-title>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat @click="showFromDatePopup = false" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              &nbsp;
              &nbsp;
              <span>~</span>
              &nbsp;
              &nbsp;
              <q-input outlined dense v-model="endDate" style="width: 160px"  label="結束日期" mask="####/##/##">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover v-model="showEndDatePopup" transition-show="scale" transition-hide="scale">
                      <q-date v-model="endDate" mask="YYYYMMDD" class="width:100px;" no-title>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat @click="showEndDatePopup = false" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <br>
          <div class="row items-center q-col-gutter-md no-wrap">
            <div class="col-3 col-md-3 no-wrap" style="max-width: 200px">
              <label class="text-h6">客戶名稱</label>
            </div>
            <div class="col-9 col-md-9  row items-center no-wrap" style="max-width: 500px">
              <q-input label="客戶名稱" style="width: 350px" outlined dense v-model="custName"/>
            </div>
          </div>
          <br>
          <div class="row items-center q-col-gutter-md no-wrap">
            <div class="col-3 col-md-3 no-wrap" style="max-width: 200px">
              <label class="text-h6">國別</label>
            </div>
            <div class="col-9 col-md-9  row items-center no-wrap" style="max-width: 500px">
              <CountryCodeSelect label="國別" style="width: 350px" v-model:country="country"/>
            </div>
          </div>
          <br>
          <div class="row items-center q-col-gutter-md no-wrap">
            <div class="col-3 col-md-3 no-wrap" style="max-width: 200px">
              <label class="text-h6">業別</label>
            </div>
            <div class="col-9 col-md-9  row items-center no-wrap" style="max-width: 500px">
              <IndustryCodeSelect label="產業別" v-model:industrycode="industrycode" show-horizon="true"/>
            </div>
          </div>
          <br>
          <div class="row items-center q-col-gutter-md no-wrap">
            <div class="col-3 col-md-3 no-wrap" style="max-width: 200px">
              <label class="text-h6">追蹤狀況</label>
            </div>
            <div class="col-9 col-md-9  row items-center no-wrap" style="max-width: 500px">
              <!-- <q-input label="追蹤狀況" style="width: 350px" outlined dense v-model="situation"/> -->
              <CustStatusSelect v-model:status="situation" outlined dense label="追蹤狀況" />
            </div>
          </div>
          <br>
          <div class="row items-center q-col-gutter-md no-wrap">
            <div class="col-3 col-md-3 no-wrap" style="max-width: 200px">
              <label class="text-h6">業務人員</label>
            </div>
            <div class="col-9 col-md-9  row items-center no-wrap" style="max-width: 500px">
              <SalesSelect label="業務人員" v-model:sales="sales"/>
            </div>
          </div>
          <br>
        </q-card-section>
      </q-form>
      <q-card-actions align="right">
        <q-btn flat color="blue" label="查詢" @click="query"/>
        <q-btn flat color="red" label="EXIT" @click="close"/>
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>
<script setup>
// #region import
import {
  QCard,
  QCardSection,
  QForm,
  QCardActions,
  QBtn,
  QIcon,
  QPopupProxy,
  QDate,
  QInput,
} from 'quasar'
import {
  defineEmits,
  defineProps,
  ref,
} from 'vue'
import CountryCodeSelect from '../CountryCodeSelect.vue';
import IndustryCodeSelect from '../IndustryCodeSelect.vue';
import SalesSelect from '../SalesSelect.vue';
import { useCustStore } from '@/composables/useCust';
import CustStatusSelect from '../CustStatusSelect.vue';
// #endregion

// #region variable
// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['update:showForm', 'update:list']);
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  list:{
    type:Array,
    default:()=>[]
  }
})
const startDate = ref('');
const endDate = ref('');
const showEndDatePopup = ref(false);
const showFromDatePopup = ref(false);
const custName = ref('');
const country = ref('');
const industrycode = ref('');
const sales = ref('');
const situation = ref('');
const custStore = useCustStore();
// #endregion

// #region function
const close = () =>{
  emits('update:showForm', false);
}
const query = async () =>{
  const param = {
    startDate:startDate.value,
    endDate:endDate.value,
    custName:custName.value,
    country:country.value?.code?country.value?.code.trim():country.value?.trim(),
    industrycode:industrycode.value?.中分類碼,
    sales:sales.value,
    situation:situation.value,
  };
  await custStore.querySalesRecordList(param).then((data)=>{
    emits('update:list', data);
    close();
  })
}
// #endregion

</script>
