<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >{{formName}}</q-icon>
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.編修))">
          <!-- <div class="padding-right"> -->
            <q-btn color="primary" class="padding-right"
              glossy @click="openCustomerDialog('新增')"
              :loading="loading">新增報價單</q-btn>&nbsp;
          <!-- </div> -->
          <!-- <div class="padding-right"> -->
            <q-btn color="info" class="padding-right"
              glossy @click="openCustomerDialog('修改')"
              :loading="loading">修改報價單</q-btn>&nbsp;
          <!-- </div> -->
          <!-- <div class="padding-right"> -->
            <q-btn color="red" class="padding-right"
              glossy @click="deleteQuotation"
              :loading="loading">刪除報價單</q-btn>&nbsp;
          <!-- </div> -->
        </div>

        <div v-if="(hasAllAuth ||(auth && auth.查詢))">
        <!-- <div class="padding-right"> -->
          <q-btn color="green" class="padding-right"
            glossy @click="openCustomerDialog('預覽')"
            :loading="loading">預覽報價單</q-btn>&nbsp;
          <q-btn color="blue-6" class="padding-right"
            glossy @click="openSearchForm"
            :loading="loading">報價單查詢</q-btn>&nbsp;
        </div>
      </div>
      <div class="row justify-start padding-top">
        <div class="col-6 col-md-6"  style="max-width: 500px">
          <div class="text-left text-red">{{ errorMessage }}</div>
        </div>
      </div>
    </h5>
    <q-page-container>
      <q-page>
        <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="idno"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                @selection="onSelection"
                :pagination="{ rowsPerPage: 5 }"
        >
          <template v-slot:body-cell-明細查詢="props">
            <q-td :props="props">
              <q-btn
                color="primary"
                label="查看"
                dense outline
                @click="viewDetail(props.row)"
              />
            </q-td>
          </template>
        </q-table >
      </q-page>
    </q-page-container>
    <q-dialog v-model="showForm" persistent >
      <QuotationView
        :form="quotationForm"
        :mode="mode" :preview="preview"
        :quono="selected.length ? selected[0].quono : ''"
        v-model:theUser="theUser"
        v-model:auth="auth"
        v-model:hasAllAuth="hasAllAuth"
        v-model:showForm="showForm"/>
    </q-dialog>
    <q-dialog v-model="showSearchForm" persistent >
      <QuotationQueryForm v-model:showForm="showSearchForm" v-model:list="list"/>
    </q-dialog>
    <q-dialog v-model="showDetailForm" persistent >
      <ShowQuotationDetailView v-model:show-form="showDetailForm" v-model:list="rowDetail"/>
    </q-dialog>
  </q-layout>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region import block start
import dayjs from 'dayjs'
import QuotationView from '@/components/customer/quotation/QuotationView.vue';
import LoadingComponent from '@/components/LoadingComponent.vue'
import {
  QLayout
  , QPageContainer
  , QPage
  , QTable
  , QBtn
  , QDialog
  , QIcon
  , SessionStorage
} from 'quasar'
import { ref, onMounted } from 'vue'
import { useCustStore } from '@/composables/useCust';
import QuotationQueryForm from '@/components/customer/query/QuotationQueryForm.vue';
import ShowQuotationDetailView from '@/components/customer/query/ShowQuotationDetailView.vue';
// #endregion import block end

// #region variable block start
const formName = '專案報價';
const auth = ref({});
const hasAllAuth = ref(false);
const theUser = ref({});
const custStore = useCustStore();
const secondDialog = ref(false);
const showForm = ref(false);
const rowDetail = ref([]);
const showDetailForm = ref(false);
const showSearchForm = ref(false);
const preview = ref(false);
const errorMessage = ref('');
const selected = ref([]);
const list = ref([]);
const mode = ref('');
const columns =
[
  { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
  { name: 'quodate', label: '報價單日期', align: 'left', field: 'quodate', sortable: true },
  { name: 'company', label: '客戶', align: 'left', field: 'company', sortable: true },
  { name: 'contact', label: '聯絡人', align: 'left', field: 'contact', sortable: true },
  { name: 'mtype', label: '機台類別', align: 'left', field: 'mtype', sortable: true },
  { name: '明細查詢', label: '明細查詢', align: 'left', field: '明細查詢', sortable: true },
  { name: 'amount', label: '報價總額', align: 'left', field: 'amount', sortable: true },
  { name: 'daddress', label: '業代', align: 'left', field: 'daddress', sortable: true },
  { name: '業務人員', label: '業務人員', align: 'left', field: '業務人員', sortable: true },
  { name: 'QUODATE', label: '報價有效日期', align: 'left', field: 'QUODATE', sortable: true },
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
// #endregion variable block end

// #region function block start
const openCustomerDialog = (type) =>{
  mode.value = type;
  errorMessage.value = "";
  if (type == '新增'){
    console.log('type', type);
    quotationForm.value = {
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
    };
    selected.value = [];
  } else {
    console.log('type', type);
    if (selected.value.length == 0){
      errorMessage.value = `請先選取要${type}的報價單`
      return
    }
    const selectItem = selected.value[0];
    if (type == '預覽')
      preview.value = true;
    else
      preview.value = false;

    console.log('selectItem', selectItem);
    quotationForm.value = selectItem;
  }
  showForm.value = true;
}
const deleteQuotation = async () =>{
  if (selected.value.length == 0){
    errorMessage.value = '請先選取要刪除的報價單'
    return
  }
  errorMessage.value = ''
  var result = confirm('確定要刪除此筆資料?');
  if(!result)
    return;
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
  secondDialog.value = true;
  await custStore.getQuotationList('').then((data)=>{
    list.value = data;
    list.value.forEach((x)=>x.quodate = dayjs(x.quodate, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD"));

    secondDialog.value = false;
  });
  theUser.value = SessionStorage.getItem('Account');
  auth.value = theUser.value.authList.find((x)=>x.menuSubName == formName);
  console.log('prjquo auth', auth.value)
  hasAllAuth.value =
      (!auth.value.高管 && !auth.value.核准 && !auth.value.編修 && !auth.value.報表 && !auth.value.輸出);
})
const openSearchForm = () =>{
  showSearchForm.value = true;
}
const viewDetail = (row) => {
  console.log('row', row);
  console.log('row quotationDetailFormList', row.quotationDetailFormList);
  rowDetail.value = row.quotationDetailFormList;
  showDetailForm.value = true;
}
// #endregion function block end
</script>
