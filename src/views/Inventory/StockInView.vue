<template>
  <!--#region 標頭及維護按鈕-->
    <div class="row justify-start">
      <div class="col-1 justify-start" style="max-width:150px">
        <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
      </div>
      <div class="col-11 justify-start" style="max-width:1350px">
        <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="primary" class="padding-right"
                glossy @click="openCustomerDialog('新增')"
                :loading="loading">新增進貨單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="info" class="padding-right"
                glossy @click="openCustomerDialog('修改')"
                :loading="loading">修改進貨單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="red" class="padding-right"
                  glossy @click="deleteCustomer"
                  :loading="loading">刪除進貨單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="green" class="padding-right"
                  glossy @click="openCustomerDialog('預覽')"
                    :loading="loading">進貨單預覽</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="blue-6" class="padding-right"
                  glossy @click="openSearchForm"
                    :loading="loading">進貨單查詢</q-btn>&nbsp;
      </div>
    </div>
  <!--#endregion -->
  <!--#region 進貨單列表 -->
  <div class="row justify-start">
    <div class="col-12 col-md-12"  style="max-width: 2000px">
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
        />
    </div>
  </div>
  <!--#endregion -->
  <q-dialog v-model="showDialog" persistent>
    <stock-in-form v-model:mode="mode" v-model:showForm="showDialog" v-model:form="form"/>
  </q-dialog>
</template>
<script setup>
// #region import
import {
  QIcon,
  QBtn,
  QTable,
  QDialog,
//   QCard,
} from 'quasar';
import {
  ref,
  onMounted
} from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useStockIn } from '@/composables/useStockIn';
import StockInForm from '@/components/inventory/StockInForm.vue';
// #endregion

// #region variable
const formName = "進貨入庫";
// const showDialog = ref(false);
// eslint-disable-next-line no-unused-vars
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
const mode = ref('');
const preview = ref(false);
const showDialog = ref(false);
const selected = ref([]);
const stockInStore = useStockIn();
const authStore = useAuth();
const list = ref([]);
const hasAllAuth = authStore.hasAllAuth(formName);
const auth = authStore.getAuth(formName);
const columns = ref([
      { name:'單號',	label:'單號',	field:'單號',	align:'left', sortable:true},
      { name:'廠商編號',	label:'廠商編號',	field:'廠商編號',	align:'left', sortable:true},
      { name:'品項編號',	label:'品項編號',	field:'品項編號',	align:'left', sortable:true},
      { name:'品名規格',	label:'品名規格',	field:'品名規格',	align:'left', sortable:true},
      { name:'批號',	label:'批號',	field:'批號',	align:'left', sortable:true},
      { name:'收貨數量',	label:'收貨數量',	field:'收貨數量',	align:'right', sortable:true},
      { name:'合格數量',	label:'合格數量',	field:'合格數量',	align:'right', sortable:true},
      { name:'特採數量',	label:'特採數量',	field:'特採數量',	align:'right', sortable:true},
      { name:'退回數量',	label:'退回數量',	field:'退回數量',	align:'right', sortable:true},
      { name:'實際單價',	label:'實際單價',	field:'實際單價',	align:'right', sortable:true},
      { name:'折讓金額',	label:'折讓金額',	field:'折讓金額',	align:'left', sortable:true},
      { name:'付款金額',	label:'付款金額',	field:'付款金額',	align:'left', sortable:true},
      { name:'樣品',	label:'樣品',	field:'樣品',	align:'left', sortable:true},
      { name:'採購單號',	label:'採購單號',	field:'採購單號',	align:'left', sortable:true},
      { name:'退貨單號',	label:'退貨單號',	field:'退貨單號',	align:'left', sortable:true},
      { name:'包裝單號',	label:'包裝單號',	field:'包裝單號',	align:'left', sortable:true},
      { name:'勾選',	label:'勾選',	field:'勾選',	align:'left', sortable:true},
]);
// import { }
// #endregion

// #region function
const openCustomerDialog = (type) =>{
  console.log(type);
  mode.value = type;
  if (type == '新增'){
    preview.value = false;
  } else if (type == '修改'){
    preview.value = false;
  } else if (type == '預覽') {
    preview.value = true;
  }
  showDialog.value = true;
}

const init = async()=>{
  await stockInStore.getAllStockInLists().then((data)=>{
    list.value = data;
  })
}

onMounted(async()=>{
  init();
})
// #endregion
</script>
