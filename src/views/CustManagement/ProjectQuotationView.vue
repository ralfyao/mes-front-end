<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="text-left">
      <q-icon name="play_circle" size="30px" >專案報價</q-icon>
    </h5>
    <q-page-container>
      <q-page>
        <q-table
                :columns="columns"
                row-key="quono"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                @selection="onSelection"
                class="rounded-borders"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table>
        <div class="row justify-start padding-top">
            <div class="padding-right">
              <q-btn color="primary" class="padding-right"
                       glossy @click="openCustomerDialog('新增')"
                       :loading="loading">新增報價單</q-btn>
            </div>
            <div class="padding-right">
              <q-btn color="info" class="padding-right"
                       glossy @click="openCustomerDialog('修改')"
                       :loading="loading">修改報價單</q-btn>
            </div>
            <div class="padding-right">
              <q-btn color="red" class="padding-right"
                       glossy @click="deleteQuotation"
                       :loading="loading">刪除報價單</q-btn>
            </div>
        </div>
        <h5 class="text-left text-red">{{ errorMessage }}</h5>
      </q-page>
    </q-page-container>
    <q-dialog v-model="showForm" persistent >
      <QuotationView :form="quotationForm" :mode="mode" :quono="selected.length ? selected[0].quono : ''" v-model:showForm="showForm"/>
    </q-dialog>
  </q-layout>
</template>
<script setup>
//import block start
import QuotationView from '@/components/customer/quotation/QuotationView.vue';
import {
  QLayout
  , QPageContainer
  , QPage
  , QTable
  , QBtn
  , QDialog
} from 'quasar'
import { ref, onMounted } from 'vue'
import { useCustStore } from '@/composables/useCust';
//import block end

//variable block start
const custStore = useCustStore();
const showForm = ref(false);
const errorMessage = ref('');
const selected = ref([]);
const list = ref([]);
const mode = ref('');
const columns =
[
  { name: 'quodate', label: '報價單日期', align: 'left', field: 'quodate', sortable: true },
  { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
  { name: 'condate', label: '報價有效日期', align: 'left', field: 'condate', sortable: true },
  { name: 'rfqno', label: '詢價單號', align: 'left', field: 'rfqno', sortable: true },
];
const quotationForm = ref({
  idno		:'',
  quono       :'',
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
  rfqdate     :'',
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
  quotationDetailFormList:[],
});
//variable block end

//function block start
const openCustomerDialog = (type) =>{
  mode.value = type;
  if (type == '新增'){
    console.log('type', type);
  } else {
    console.log('type', type);
    const selectItem = selected.value[0];
    console.log('selectItem', selectItem);
    quotationForm.value = selectItem;
  }
  showForm.value = true;
}
const deleteQuotation = async () =>{
  await custStore.deleteQuotation(selected.value[0]).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage)
    } else if (data.errorMessage){
      alert(data.errorMessage)
    } else {
      alert('刪除成功');
    }
    custStore.getQuotationList('').then((data)=>{
      list.value = data;
    });
  })
}
const onSelection = () =>{

}
onMounted(async ()=>{
  await custStore.getQuotationList('').then((data)=>{
    list.value = data;
  });
})
//function block end
</script>
