<template>
  <!--#region 標頭及維護按鈕-->
  <div class="row justify-start">
    <div class="col-1 justify-start" style="max-width:150px">
      <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
    </div>
    <div class="col-11 justify-start" style="max-width:1350px">
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="primary" class="padding-right"
                glossy @click="openCustomerDialog('新增')"
                :loading="loading">新增品項</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="info" class="padding-right"
                glossy @click="openCustomerDialog('修改')"
                :loading="loading">修改品項</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="red" class="padding-right"
                  glossy @click="deleteCustomer"
                  :loading="loading">刪除品項</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="green" class="padding-right"
                  glossy @click="openCustomerDialog('預覽')"
                    :loading="loading">品項預覽</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="blue-6" class="padding-right"
                  glossy @click="openSearchForm"
                    :loading="loading">品項查詢</q-btn>&nbsp;
    </div>
    <div class="row justify-start">
      <div class="col-12 justify-start flex" style="max-width:1500px">
        <label class="text-h4"><font color=red>{{ errorMessage }}</font></label>
      </div>
    </div>
  </div>
  <!--#endregion -->
  <!--#region 品項列表 -->
  <div class="row justify-start">
    <div class="col-12 col-md-12"  style="max-width: 2000px">
      <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="產品編號"
                :rows="list || []"
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
    <item-form v-model:showForm="showDialog" v-model:form="form" v-model:mode="mode"/>
  </q-dialog>
  <loading-component v-model="secondDialog"/>
</template>
<script setup>
// #region import
import {
    QIcon
    , QBtn
    , QTable
    , QDialog
  // , QLayout
} from 'quasar';
import {
  ref
  , onMounted
  , watch
} from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useItemStore } from '@/composables/useItem';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ItemForm from '@/components/inventory/ItemForm.vue';
// #endregion

// #region variable
const mode = ref('');
const selected = ref([]);
const secondDialog = ref(false);
const formName = ref('品項維護');
const itemStore = useItemStore();
const showDialog = ref(false);
const authStore = useAuth();
const list = ref([]);
const form = ref({產品編號:''
      ,品別:''
      ,大分類:''
      ,小分類:''
      ,產品代號:''
      ,品名規格:''
      ,英文品名:''
      ,外尺寸長:0
      ,外尺寸寬:0
      ,厚度:0
      ,內徑:0
      ,外徑:0
      ,庫存單位:''
      ,採購單位:''
      ,採購換算倍數:0
      ,銷售單位:''
      ,銷售換算倍數:0
      ,停用:false
      ,建檔:''
      ,建檔日:''
      ,修改:''
      ,修改日:''
      ,核准:''
      ,勾選:false
      ,來源屬性:''});
const hasAllAuth = authStore.hasAllAuth(formName.value);
const errorMessage = ref('');
const columns = ref([
  {name:'品項編號', label:'品項編號', field:'產品編號', align:'left', sortable:true},
  {name:'品名規格', label:'品名', field:'品名規格', align:'left', sortable:true},
  {name:'品別', label:'品別', field:'品別', align:'left', sortable:true},
  {name:'英文品名', label:'英文品名', field:'英文品名', align:'left', sortable:true},
  {name:'大分類', label:'主分類', field:'大分類', align:'left', sortable:true},
  {name:'庫存單位', label:'庫存成本單位', field:'庫存單位', align:'left', sortable:true},
  {name:'外尺寸長', label:'長mm', field:'外尺寸長', align:'left', sortable:true},
  {name:'小分類', label:'次分類', field:'小分類', align:'left', sortable:true},
  {name:'採購單位', label:'採購單位', field:'採購單位', align:'left', sortable:true},
  {name:'外尺寸寬', label:'寬mm', field:'外尺寸寬', align:'left', sortable:true},
]);
// #endregion

// #region function
const init =async() =>{
  secondDialog.value = true;
  selected.value = [];
  errorMessage.value = '';
  await itemStore.getAllItems().then((data)=>{
    list.value = data;
    secondDialog.value = false;
  });
}
onMounted(async ()=>{
  init();
})

const deleteCustomer = async () =>{
  if (selected.value.length == 0){
    errorMessage.value = '請選取一筆刪除';
    return;
  }
  if (confirm('確認刪除?')){
    secondDialog.value = true;
    form.value = selected.value[0];
    console.log('delete form', form.value)
    await itemStore.deleteItem(form.value).then((data)=>{
      if (data.data.errorMessage && data.data.errorMessage != ''){
        alert(data.data.errorMessage);
      } else {
        alert('執行成功');
      }
      secondDialog.value = false;
      init();
    });
  }
}

const openCustomerDialog = (type)=>{
  mode.value = type;
  if (mode.value == '新增') {
    form.value = {產品編號:''
      ,品別:''
      ,大分類:''
      ,小分類:''
      ,產品代號:''
      ,品名規格:''
      ,英文品名:''
      ,外尺寸長:0
      ,外尺寸寬:0
      ,厚度:0
      ,內徑:0
      ,外徑:0
      ,庫存單位:''
      ,採購單位:''
      ,採購換算倍數:0
      ,銷售單位:''
      ,銷售換算倍數:0
      ,停用:false
      ,建檔:''
      ,建檔日:''
      ,修改:''
      ,修改日:''
      ,核准:''
      ,勾選:false
      ,來源屬性:''};

  } else if (mode.value == '修改') {
    if (selected.value.length == 0){
      errorMessage.value = '請選取一筆'+mode.value;
      return;
    }
    console.log(mode.value);
    form.value = selected.value[0];

  } else if (mode.value == '預覽') {
    if (selected.value.length == 0){
      errorMessage.value = '請選取一筆'+mode.value;
      return;
    }
    console.log(mode.value);
    form.value = selected.value[0];
  }
  showDialog.value = true;
}
watch(showDialog, newValue =>{
  if (!newValue){
    init();
  }
})
// #endregion
</script>
