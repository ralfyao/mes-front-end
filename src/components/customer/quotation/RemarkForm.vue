<template>
  <q-card class="q-pa-md"  style="width: 750px; max-width: 95vw;">
    <q-card-section>
      <div class="col-2 flex text-h4">訂單列印選框</div>
    </q-card-section>
    <q-form ref="myForm">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-4 col-md-4" style="max-width: 250px">
            <q-input label="單號" outlined dense v-model="quono" readonly/>
          </div>
          <div class="col-4 col-md-4" style="max-width: 250px">
            <q-input label="客戶" outlined dense v-model="custNo" readonly/>
          </div>
          <div class="col-4 col-md-4" style="max-width: 250px">
            <q-card-actions align="right">
              <q-btn label="儲存" flat color="blue" @click="submit" />
              <q-btn label="關閉" flat color="red" @click="close" />
            </q-card-actions>
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-4 col-md-4" style="max-width: 250px">
            <q-input label="備註(補充說明)" outlined dense readonly/>
          </div>
          <div class="col-8 col-md-8" style="max-width: 500px">
            <q-input label="名稱" outlined dense v-model="custName" readonly/>
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 750px">
            <q-input label="備註(補充說明)"  outlined dense type="textarea" v-model="quotationForm.remark"/>
          </div>
        </div>
      </q-card-section>
    </q-form>
  </q-card>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region import
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useCustStore } from '@/composables/useCust';
import {
  QCard,
  QCardSection,
  QForm,
  QCardActions,
  QInput,
  QBtn,
  SessionStorage,
 } from 'quasar';
 import {
  defineProps,
  onMounted,
  ref,
  defineEmits,
 } from 'vue';
// #endregion

// #region variable
const props = defineProps({
  quotationNo:{
    type:String,
    default:'',
  },
  rfqNo:{
    type:String,
    default:'',
  },
  custNo:{
    type:String,
    default:'',
  },
  custName:{
    type:String,
    default:'',
  }
})
const emits = defineEmits(['updte:showForm']);
const secondDialog = ref(false);
const quono = ref('');
const rfqno = ref('');
const custNo = ref('');
const custName = ref('');
const quotationForm = ref({
  idno		:'',
  quono       :'',
  companyid   :0,
  mtype       :'',
  mmodel      :'',
  currency    :'',
  amount      :0,
  commission  :'',
  status      :'',
  contact     :'',
  machineno   :'',
  rfqno       :'',
  condate     :'',
  shipdate    :'',
  quodate     :'',
  // rfqdate     :'',
  ranking     :'',
  address     :'',
  exrate      :0,
  daddress    :'',
  價格條件    :'',
  交貨方式    :'',
  付款方式    :'',
  remark      :'',
  交貨日期    :'',
  稅率        :0.0,
  建檔        :'',
  修改        :'',
  核准        :'',
  建檔日      :'',
  修改日      :'',
  核准日      :'',
  quotationDetailFormList :[],
});
const custStore = useCustStore();
// #endregion

// #region function
onMounted(async ()=>{
  quono.value = props.quotationNo;
  rfqno.value = props.rfqNo;
  custNo.value = props.custNo;
  custName.value = props.custName;
  await custStore.getQuotationByNo(quono.value).then((data)=>{
    quotationForm.value = data;
    console.log('quotationForm', quotationForm.value);
  });
})
const close = () => {
  emits('update:showForm', false);
}
const submit = async() =>{
  if (confirm('您確定要儲存?')){
    secondDialog.value = true;
    quotationForm.value.修改 = SessionStorage.getItem('Account').account;
    await custStore.updateQuotationRemark(quotationForm).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else{
        alert('更新成功');
        close();
      }
    })
  }
}
// #endregion
</script>
