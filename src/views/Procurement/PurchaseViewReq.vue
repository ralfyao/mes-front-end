<template>
  <!--#region 標頭及維護按鈕-->
  <div class="row justify-start">
    <div class="col-1 justify-start" style="max-width:150px">
      <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
    </div>
    <div class="col-11 justify-start" style="max-width:1350px">
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="primary" class="padding-right"
                glossy @click="openCustomerDialog('新增')"
                :loading="loading">新增請購單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="info" class="padding-right"
                glossy @click="openCustomerDialog('修改')"
                :loading="loading">修改請購單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="red" class="padding-right"
                  glossy @click="deleteCustomer"
                  :loading="loading">刪除請購單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="green" class="padding-right"
                  glossy @click="openCustomerDialog('預覽')"
                    :loading="loading">請購單預覽</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="blue-6" class="padding-right"
                  glossy @click="openSearchForm"
                    :loading="loading">請購單查詢</q-btn>&nbsp;
    </div>
    <div class="col-12" style="max-width:3000px">
      <div class="text-left text-h4 text-red">{{ errorMessage }}</div>
    </div>
  </div>
  <!--#endregion-->
  <!--#region 請購單列表 -->
  <div class="row justify-start">
    <div class="col-12 col-md-12"  style="max-width: 1500px">
      <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="請購序號"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                :pagination="{ rowsPerPage: 5 }"
        >
        <template v-slot:body-cell-緊急="props">
          <q-td :props="props">
            <q-checkbox outlined dense disable="" v-model="props.row.緊急" />
          </q-td>
        </template>
      </q-table >
    </div>
  </div>
  <!--#endregion-->
  <q-dialog v-model="showPurViewReqForm" persistent>
    <purchase-view-req-form v-model:showForm="showPurViewReqForm" v-model:preview="preview" v-model:mode="mode" v-model:data="form"/>
  </q-dialog>
  <loading-component v-model="showSecondDialog"/>
</template>
<script setup>
//#region import
import { QIcon, QBtn,
  QTable,
  QCheckbox,
  QDialog,
 } from 'quasar';
import { ref,
  onMounted,
  watch
 } from 'vue';
import { useAuth } from '@/composables/useAuth';
import dayjs from 'dayjs';
import { usePurchaseStore } from '@/composables/usePurchase';
import LoadingComponent from '@/components/LoadingComponent.vue';
import PurchaseViewReqForm from './PurchaseViewReqForm.vue';
//#endregion

//#region variable
const errorMessage = ref('');
const selected = ref([]);
const formName = ref('請購作業');
const purchaseStore = usePurchaseStore();
const authStore = useAuth();
const showPurViewReqForm = ref(false);
const hasAllAuth = authStore.hasAllAuth(formName.value);
const auth = authStore.getAuth(formName.value);
const list = ref([]);
const showSecondDialog = ref(false);
const mode = ref('');
const form = ref({
  請購序號:0
  ,日期:''
  ,品項編號:''
  ,品名規格:''
  ,請購類別:''
  ,請購部門:''
  ,請購人員:''
  ,數量:0
  ,需求日期:''
  ,緊急:false
  ,用途:''
  ,註記:''
  ,指定供應廠商:''
  ,轉單:false
  ,結案:false
  ,選擇廠商:''
  ,採購單號:''
});
const preview = ref(false);
const columns = ref([
  { name: '請購日期', label: '請購日期', align: 'left', field: '日期', sortable: true ,
  format: val => val != null
    ? dayjs(val).format('YYYY/MM/DD')
    : '' },
  { name: '請購部門', label: '請購部門', align: 'left', field: '請購部門', sortable: true },
  { name: '請購類別', label: '請購類別', align: 'left', field: '請購類別', sortable: true },
  { name: '品項編號', label: '品項編號', align: 'left', field: '品項編號', sortable: true },
  { name: '品名規格', label: '品名規格', align: 'left', field: '品名規格', sortable: true },
  { name: '單位', label: '單位', align: 'left', field: '單位', sortable: true },
  { name: '需求數量', label: '需求數量', align: 'left', field: '數量', sortable: true },
  { name: '緊急', label: '緊急', align: 'left', field: '緊急', sortable: true },
  { name: '需求日期', label: '需求日期', align: 'left', field: '需求日期', sortable: true },
  { name: '用途', label: '用途', align: 'left', field: '用途', sortable: true },
  { name: '指定供應廠商', label: '指定廠商', align: 'left', field: '指定供應廠商', sortable: true },
  { name: '廠商簡稱', label: '廠商簡稱', align: 'left', field: '廠商簡稱', sortable: true },
  { name: '註記', label: '註記', align: 'left', field: '註記', sortable: true },
])
//#endregion

//#region function
const openCustomerDialog = (type) =>{
  mode.value = type;
  if (mode.value == '新增') {
    console.log(mode.value);
    selected.value=[];
    form.value = {
      請購序號:0
      ,日期:''
      ,品項編號:''
      ,品名規格:''
      ,請購類別:''
      ,請購部門:''
      ,請購人員:''
      ,數量:0
      ,需求日期:''
      ,緊急:false
      ,用途:''
      ,註記:''
      ,指定供應廠商:''
      ,轉單:false
      ,結案:false
      ,選擇廠商:''
      ,採購單號:''
    };
    showPurViewReqForm.value = true;
  } else if (mode.value == '修改') {
    console.log(mode.value);
    form.value = selected.value[0];
    showPurViewReqForm.value = true;
  } else if (mode.value == '預覽') {
    preview.value = true;
    form.value = selected.value[0];
    showPurViewReqForm.value = true;
  }
}
const deleteCustomer = async () =>{
  if (selected.value.length == 0) {
    errorMessage.value = '請選取一筆進行刪除!';
    return;
  }
  if (confirm('確認刪除?')){
    await purchaseStore.deletePurchaseRequest(selected.value[0]).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      }else{
        alert('刪除成功');
        init();
      }
    })
  }
}
const init = async () =>{
 showSecondDialog.value = true;
  await purchaseStore.getAllPurchaseRequestList().then((data)=>{
    list.value = data;
    showSecondDialog.value = false;
  });
}
onMounted(async ()=>{
  await init();
})
watch(showPurViewReqForm, newValue=>{
  if (!newValue){
    init();
  }
})
//#endregion
</script>
