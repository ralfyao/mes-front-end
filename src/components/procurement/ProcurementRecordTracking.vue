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
                      <q-date v-close-popup v-model="form.工作日期" @update:model-value="showRfqDatePopup = false" :readonly="preview" mask="YYYY/MM/DD" no-title>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat @click="showRfqDatePopup = false" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input outlined dense label="工號" v-model="form.員工編號" readonly />
            </div>
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input outlined dense label="姓名" v-model="employee1.姓名" readonly />
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input outlined dense label="分項" v-model="form.模組編碼" readonly />
            </div>
            <div class="col-8 col-md-8" style="max-width: 666px">
              <q-input outlined dense label="程序來源" v-model="form.模組名稱" readonly />
           </div>
          </div>
          <br>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input outlined dense label="專案序號" v-model="form.專案序號" readonly />
            </div>
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input outlined dense label="職務" v-model="form.職務" readonly/>
            </div>
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input type="number" outlined dense label="專案進度" v-model="form.專案進度" />
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-md">
            <div class="col-8 col-md-8" style="max-width: 666px">
              <q-select label="任務分類"
                :options="jobClassificationList" emit-value map-options
               v-model="form.任務分類" outlined dense />
            </div>

            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input type="number" outlined dense label="成效點數" v-model="form.成效點數" />
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-12" style="max-width: 1000px">
              <q-input outlined dense label="工作簡述" v-model="form.工作簡述" type="textarea" :rows="4" />
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-12" style="max-width: 1000px">
              <q-input outlined dense label="特別註記" v-model="form.特別註記" type="textarea" :rows="4" />
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 333px">
              <q-input outlined dense label="日誌單號" v-model="form.日誌單號" readonly="" />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="取消" flat color="grey" @click="$emit('close')"/>
      <q-btn label="儲存" flat color="blue" @click="submit"/>
    </q-card-actions>
  </q-card>
  <loading-component v-model="secondDialog"/>
</template>
<script setup>
// #region import
import {
  QCard,
  QCardSection,
  QForm,
  QInput,
  QIcon,
  QDate,
  QPopupProxy,
  QSelect,
  QCardActions,
  QBtn
} from 'quasar';
import { ref,
  defineProps,defineEmits,
  onMounted
 } from 'vue';
import LoadingComponent from '../LoadingComponent.vue';
import { usePurchaseStore } from '@/composables/usePurchase';
import dayjs from 'dayjs';
import { useHRStore } from '@/composables/useHR';
import { useAuth } from '@/composables/useAuth';
import { useCustStore } from '@/composables/useCust';
import { useSupplierStore } from '@/composables/useSupplier';
// #endregion

//#region variable
const supplier = ref({});
const showRfqDatePopup = ref(false);
const jobClassificationList = ref([]);
const supplierStore = useSupplierStore();
const preview = ref(false);
const form = ref({
  工作日期:'',
  員工編號:'',
  專案序號:'',
  進度:0,
  模組編碼:'',
  模組名稱:'',
  專案進度:'',
  任務分類:'',
  成效點數:0,
  工作簡述:'',
  特別註記:'',
  預計再訪:'',
  日誌單號:''
});
const props = defineProps({
  procurementNo: {
    type: String,
    default: ''
  },
  recordTrackingDialog:{
    type:Boolean,
    default:false,
  }
})
const auth = useAuth();
const purchaseStore = usePurchaseStore();
const hrStore = useHRStore();
const secondDialog = ref(false);
const procurementData = ref({});
const employee1 = ref({});
const custStore = useCustStore();
const emits = defineEmits(['update:showForm']);
// #endregion

//#region function
onMounted(async ()=>{
  await purchaseStore.getPurchaseOrderByNo(props.procurementNo).then((response)=>{
    console.log('procurementNo', props.procurementNo);
    console.log('response list', response)
    procurementData.value = response;

    form.value.工作日期 = dayjs().format('YYYY/MM/DD');
    form.value.專案序號 = procurementData.value.採購類別;
    form.value.模組編碼 = procurementData.value.廠商編號;
    form.value.模組名稱 = procurementData.value.單號;
    form.value.任務分類 = "採購作業";

  }).catch((error)=>{
    console.error('Error fetching purchase order:', error);
  });
  await hrStore.getEmployeeByAccount(auth.getUser().account).then((employee) => {
      form.value.員工編號 = employee.工號;
      form.value.職務 = employee.職能;
      employee1.value = employee;
      form.value.日誌單號 = `${employee1.value.工號}-${dayjs().format('YYYYMMDD')}`;

      // hrStore.getJournalByNo(form.value.日誌單號).then((data)=>{
      //   console.log('Journal data:', data);
      //   if (data) {
      //     // form.value = data;
      //     form.value.工作日期 = dayjs(form.value.工作日期).format('YYYY/MM/DD');
      //   }
      // });
    });
  await custStore.getJobClassification().then((data)=>{
        jobClassificationList.value = data;
        console.log('jobClassificationList', jobClassificationList.value);
  });
  await supplierStore.getSupplierList().then((response)=>{
    supplier.value = response.find(x => x.廠商編號 == procurementData.value.廠商編號);
    console.log('suppl;ier', supplier.value);
    form.value.工作簡述 = `${supplier.value.廠商簡稱}-採購${procurementData.value.procurementList.length}項`;
  });
});
const submit = async() =>{
  console.log('submit form', form.value);
  // 在這裡可以將 form.value 發送到後端 API
  // 例如：
  await hrStore.saveUpdateJournal(form.value).then((response)=>{
    console.log('submit response', response);
    if (response.data.errorMessage == null || response.data.errorMessage === '') {
      // 提交成功後的處理，例如顯示成功訊息或關閉對話框
      alert('工作內容已成功儲存');
      // 可以選擇清空表單或關閉對話框
      form.value = {
        工作日期:'',
        員工編號:'',
        專案序號:'',
        進度:0,
        模組編碼:'',
        模組名稱:'',
        任務分類:'',
        成效點數:0,
        工作簡述:'',
        特別註記:'',
        預計再訪:'',
        日誌單號:''
      };
      // 或者關閉對話框
      emits('update:showForm', false);
    } else {
      alert('儲存失敗，請稍後再試');
      emits('update:showForm', false);
    }
  }).catch((error)=>{
      console.error('Error saving work log:', error);
      alert('儲存過程中發生錯誤，請稍後再試');
      emits('update:showForm', false);
  });
}
// #endregion
</script>
