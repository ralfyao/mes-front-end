<template>
  <!--#region 標頭及維護按鈕-->
  <div class="row justify-start">
    <div class="col-1 justify-start" style="max-width:150px">
      <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
    </div>
    <div class="col-11 justify-start" style="max-width:1350px">
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="primary" class="padding-right"
                glossy @click="openCustomerDialog('新增')"
                :loading="loading">新增採購單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="info" class="padding-right"
                glossy @click="openCustomerDialog('修改')"
                :loading="loading">修改採購單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="red" class="padding-right"
                  glossy @click="deleteCustomer"
                  :loading="loading">刪除採購單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="green" class="padding-right"
                  glossy @click="openCustomerDialog('預覽')"
                    :loading="loading">採購單預覽</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="blue-6" class="padding-right"
                  glossy @click="openSearchForm"
                    :loading="loading">採購單查詢</q-btn>&nbsp;
    </div>
    <div class="col-12" style="max-width:3000px">
      <div class="text-left text-h4 text-red">{{ errorMessage }}</div>
    </div>
  </div>
  <!--#endregion-->
  <!--#region 採購單列表 -->
  <div class="row justify-start">
    <div class="col-12 col-md-12"  style="max-width: 1500px">
      <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="單號"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table >
    </div>
  </div>
  <!--#endregion-->
  <!--#region 主表單-->
  <q-dialog v-model="showForm" persistent >
    <ProcurementForm v-model:showForm="showForm" v-model:mode="mode" v-model:procurementData="procurementData" v-model:preview="preview" />
  </q-dialog>
  <!--#endregion-->
  <LoadingComponent v-model="secondDialog" />
</template>
<script setup>
//#region import
import { useAuth } from '@/composables/useAuth';
import {
    QIcon
    , QBtn
    , QTable
    , QDialog
  // , QLayout
} from 'quasar';
import { onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { usePurchaseStore } from '@/composables/usePurchase';
import ProcurementForm from '@/components/procurement/ProcurementForm.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
//#endregion

//#region variable
const formName = "採購作業";
// eslint-disable-next-line no-unused-vars
const purchaseStore = usePurchaseStore();
const authStore = useAuth();
const auth = authStore.getAuth(formName);
const hasAllAuth = authStore.hasAllAuth(formName);
const errorMessage = ref('');
const list = ref([]);
const mode = ref('新增');
const procurementData = ref({});
const preview = ref(false);
const showForm = ref(false);
const secondDialog = ref(false);
const selected = ref([]);
const columns =
[
  // { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
  { name: '日期', label: '日期', align: 'left', field: '日期', sortable: true ,
  format: val => val != null
    ? dayjs(val).format('YYYY/MM/DD')
    : '' },
  { name: '單號', label: '採購單號', align: 'left', field: '單號', sortable: true },
  { name: '廠商編號', label: '廠商編號', align: 'left', field: '廠商編號', sortable: true },
  { name: '廠商全稱', label: '廠商全稱', align: 'left', field: '廠商全稱', sortable: true },
  // { name: '指配國別', label: '國別', align: 'left', field: '指配國別', sortable: true },
  // { name: '總額', label: '訂單總額', align: 'right', field: '總額', sortable: true,
  // format: val => val != null
  //   ? Number(val).toLocaleString('zh-TW')
  //   : '' },
  // { name: '要望日期', label: '預交日', align: 'left', field: '要望日期', sortable: true,
  // format: val => val != null
  //   ? dayjs(val).format('YYYY/MM/DD')
  //   : ''  },
  // { name: '幣別', label: '幣別', align: 'left', field: '幣別', sortable: true },
  // { name: '稅率', label: '稅率', align: 'left', field: '稅率', sortable: true },
  // { name: '目的港', label: '目的港', align: 'left', field: '目的港', sortable: true },
  // { name: '業務員', label: '業代', align: 'left', field: '業務員', sortable: true },
  // { name: '業務人員', label: '業務人員', align: 'left', field: '業務人員', sortable: true },
  // { name: '核准', label: '核准', align: 'left', field: '核准', sortable: true  },
  // { name: '結案', label: '結案', align: 'left', field: '結案', sortable: true ,
  // format: val => val != null
  //   ? val ? 'Y' : 'N'
  //   : 'N'},
];
//#endregion

//#region function
onMounted(async () => {
  init();
});
const init = async() =>{
  secondDialog.value = true;
  errorMessage.value = '';

  await purchaseStore.getAllPurchasesList().then((data) => {
    console.log('purchaseList', data);
    list.value = [];
    list.value = data;
    selected.value = [];
    secondDialog.value = false;
  });
}
const openCustomerDialog = (type) =>{
  console.log('openCustomerDialog', type)
  if (type === '新增') {
    mode.value = '新增';
    procurementData.value = {
      單號:''
     ,日期:''
     ,廠商編號:''
     ,聯絡人:''
     ,營業稅率:''
     ,幣別:''
     ,匯率:0
     ,採購人員:''
     ,採購類別:''
     ,交易條件:''
     ,運輸方式:''
     ,送貨地址:''
     ,貿易條件:''
     ,交貨日期:''
     ,結案:false
     ,建檔:authStore.getUser()
     ,建檔日:dayjs().format('YYYY/MM/DD')
     ,修改:authStore.getUser()
     ,修改日:dayjs().format('YYYY/MM/DD')
     ,核准:''
     ,核准日:''
     ,注意事項:''
    };
    preview.value = false;
    showForm.value = true;
  } else if (type === '修改') {
    if (selected.value.length === 0) {
      errorMessage.value = '請選擇一筆資料進行修改';
      return;
    }
    mode.value = '修改';
    procurementData.value = selected.value[0];
    console.log('selected', selected.value[0]);
    preview.value = false;
    showForm.value = true;
  } else if (type === '預覽') {
    if (selected.value.length === 0) {
      errorMessage.value = '請選擇一筆資料進行預覽';
      return;
    }
    mode.value = '預覽';
    procurementData.value = selected.value[0];
    preview.value = true;
    showForm.value = true;
  }
}

watch(() => showForm.value, async (newVal) => {
  if (!newVal) {
    init();
  }
});

const deleteCustomer = () =>{
  if (selected.value.length === 0) {
    errorMessage.value = '請選擇一筆資料進行刪除';
    return;
  }
  var result = confirm('您確認是否要刪除?');
  if (!result)
    return;
  if (selected.value[0].核准日 && selected.value[0].核准日 != '')
  {
    alert('已核准的採購單不可刪除');
    return;
  }
  secondDialog.value = true;
  purchaseStore.deletePurchaseOrder(selected.value[0].單號).then((response) => {
    console.log('delete response', response);
    if (response.errorMessage && response.errorMessage !== '') {
      // 在這裡可以處理錯誤，例如顯示錯誤訊息
      alert('刪除失敗:' + response.errorMessage);
    } else {
      // 在這裡可以處理成功的回應，例如顯示成功訊息或更新 UI
      alert('刪除成功!');
    }
    secondDialog.value = false;
    init();
  }).catch((error) => {
    console.error('Delete error:', error);
    secondDialog.value = false;
  });
}

const openSearchForm = () =>{

}
//#endregion
</script>
