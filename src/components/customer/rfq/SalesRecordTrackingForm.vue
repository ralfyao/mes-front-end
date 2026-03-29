<template>
  <q-card class="q-pa-md"  style="width: 1000px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">工作內容撰寫</div>
      <q-form ref="myForm" >
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input dense outlined :readonly="preview" v-model="form.工作日期" label="日期" mask="####/##/##" :rules="[val =>  !!val || '洽談日期為必填欄位']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover v-model="showRfqDatePopup" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.工作日期" :readonly="preview" mask="YYYY/MM/DD" no-title>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat @click="showRfqDatePopup = false" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-8 col-md-8 flex" style="max-width: 667px">
              <SalesSelect v-model:sales="form.員工編號" v-model:width="salesSelectWidth" />
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input outlined dense label="詢問函/專案" v-model="form.專案序號" readonly />
            </div>
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-select outlined dense label="職務" v-model="業務" readonly
              :options="jobList" emit-value map-options
               />
            </div>
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input outlined dense label="要望機率" v-model="form.進度" type="number" />
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input outlined dense label="客戶簡稱" v-model="form.模組編碼" readonly />
            </div>
            <div class="col-8 col-md-8 " style="max-width: 667px">
              <q-input outlined dense label="程序來源" style="max-width: 667px" v-model="form.模組名稱" />
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-md">
            <div class="col-8 col-md-8 " style="max-width: 667px">
              <q-select label="聯絡分類"
                :options="jobClassificationList" emit-value map-options
               v-model="form.任務分類" outlined dense />
            </div>
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input outlined dense v-model="form.成效點數" label="成效點數"/>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <label>訪談重點</label>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-12 " style="max-width: 1000px">
              <q-input label="內容簡述" v-model="form.工作簡述" outlined dense type="textarea"/>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-12 flex" style="max-width: 1000px">
              <q-input dense outlined :readonly="preview" v-model="form.預計再訪" label="預計再訪日" mask="####/##/##" :rules="[val =>  !!val || '洽談日期為必填欄位']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover v-model="showRecallDatePopup" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.預計再訪" :readonly="preview" mask="YYYY/MM/DD" no-title>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat @click="showRecallDatePopup = false" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat color="blue" label="新增" @click="submit"/>
      <q-btn flat color="red" label="EXIT" @click="close()"/>
    </q-card-actions>
  </q-card>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region import
import {
  QCard,
  QCardSection,
  QForm,
  QCardActions,
  QBtn,
  QInput,
  QIcon,
  QPopupProxy,
  QDate,
  QSelect
 } from 'quasar';
import {
  defineEmits,
  ref,
  onMounted,
  defineProps,
} from 'vue';
// eslint-disable-next-line no-unused-vars
import dayjs  from 'dayjs';
import SalesSelect from '../SalesSelect.vue';
import { useCustStore } from '@/composables/useCust';
import LoadingComponent from '@/components/LoadingComponent.vue';
// #endregion

// #region variable
const emits = defineEmits(['update:showForm']);
const showRfqDatePopup = ref(false);
const form = ref({
  工作日期:'',
  員工編號:'',
  專案序號:'',
  進度:0,
  模組編碼:'',
  模組名稱:'',
  任務分類:'',
  成效點數:0,
  工作簡述:'',
  預計再訪:'',
});
const showRecallDatePopup = ref(false);
const jobClassificationList = ref([]);
const salesSelectWidth = 'width:200px';
const jobList = ref([]);
const secondDialog = ref(false);
const props = defineProps({
  rfqno:{
    type:String,
    default:'',
  }
});
const 業務 = '業務';
const custStore = useCustStore();
const rfq = ref({});
// #endregion

// #region function
const close = () =>{
  emits('update:showForm', false);
}
onMounted(async ()=>{
  form.value.工作日期 = ("YYYY/MM/DD");
  console.log('props.rfqno', props.rfqno);
  await custStore.getRfq(props.rfqno).then((data)=>{
    console.log('rfqList',data);
    rfq.value = data;
    form.value.專案序號 = rfq.value.rfqno;
  });
  const queryParm = ref({company:''});
  queryParm.value.company = rfq.value.company;
  let custlist = await custStore.getCustListByCondition(queryParm);
  console.log('custList', custlist);
  let cust = custlist.data.resultList.find((x)=>x.company == rfq.value.company);
  console.log('cust', cust);
  if (cust){
    form.value.模組編碼 = cust.欄位2;
    form.value.模組名稱 = 'RFQMEMO-'+cust.company;
  }
  await custStore.getJobClassification().then((data)=>{
    jobClassificationList.value = data;
    console.log('jobClassificationList', jobClassificationList.value);
  })
  await custStore.getJobList().then((data)=>{
    jobList.value = data;
  });
})
const submit = async () =>{
  console.log(form.value);
  secondDialog.value = true;
  await custStore.insertRfqTrackingRecord(form).then((data)=>{
    if (data.errorMessage){
      alert(data.errorMessage)
    }
    else{
      alert('新增成功');
      close();
    }
    secondDialog.value = false;
  });
}
// #endregion
</script>
