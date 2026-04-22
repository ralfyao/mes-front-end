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
    <div class="row justify-start">
      <div class="col-12 justify-start flex" style="max-width:1500px">

        <label class="text-h4"><font color=red>{{ errorMessage }}</font></label>
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
    <stock-in-form v-model:mode="mode" v-model:showForm="showDialog" v-model:preview="preview" v-model:form="form"/>
  </q-dialog>
  <loading-component v-model="secondDialog"/>
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
  onMounted,
  watch
} from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useStockIn } from '@/composables/useStockIn';
import StockInForm from '@/components/inventory/StockInForm.vue';
import dayjs from 'dayjs';
import LoadingComponent from '@/components/LoadingComponent.vue';
// #endregion

// #region variable
const formName = "進貨入庫";
const errorMessage = ref('');
const secondDialog = ref(false);
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
      { name:'日期',	label:'日期',	field:'日期',	align:'left', sortable:true  ,
        format: val => val != null
        ? dayjs(val).format('YYYY/MM/DD')
        : '', sort: (a, b) => {
        return new Date(a) - new Date(b)
        }  },
      { name:'倉管人員',	label:'倉管人員',	field:'倉管人員',	align:'left', sortable:true},
      { name:'備註',	label:'備註',	field:'備註',	align:'left', sortable:true},
      { name:'建檔',	label:'建檔',	field:'建檔',	align:'left', sortable:true},
      { name:'建檔日',	label:'建檔日',	field:'建檔日',	align:'left', sortable:true ,
        format: val => val != null
        ? dayjs(val).format('YYYY/MM/DD')
        : '', sort: (a, b) => {
        return new Date(a) - new Date(b)
        }},
      { name:'修改',	label:'修改',	field:'修改',	align:'left', sortable:true},
      { name:'修改日',	label:'修改日',	field:'修改日',	align:'left', sortable:true ,
        format: val => val != null
        ? dayjs(val).format('YYYY/MM/DD')
        : '', sort: (a, b) => {
        return new Date(a) - new Date(b)
        }},
      { name:'核准',	label:'核准',	field:'核准',	align:'left', sortable:true},
      { name:'核准日',	label:'核准日',	field:'核准日',	align:'left', sortable:true ,
        format: val => val != null
        ? dayjs(val).format('YYYY/MM/DD')
        : '', sort: (a, b) => {
        return new Date(a) - new Date(b)
        }},
      { name:'採購覆核',	label:'採購覆核',	field:'採購覆核',	align:'left', sortable:true},
      { name:'覆核日',	label:'覆核日',	field:'覆核日',	align:'left', sortable:true ,
        format: val => val != null
        ? dayjs(val).format('YYYY/MM/DD')
        : '', sort: (a, b) => {
        return new Date(a) - new Date(b)
        }},
]);
// import { }
// #endregion

// #region function
const openCustomerDialog = (type) =>{
  console.log(type);
  mode.value = type;
  if (type == '新增'){
    preview.value = false;
    form.value = {
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
    }
  } else if (type == '修改'){
    if (selected.value.length == 0){
      errorMessage.value = '請選取一筆資料修改!'
      return;
    }
    preview.value = false;
    form.value = selected.value[0];
    form.value.日期 = dayjs(form.value.日期).format("YYYY/MM/DD")
  } else if (type == '預覽') {
    preview.value = true;
  }
  showDialog.value = true;
}

const init = async()=>{
  selected.value = [];
  secondDialog.value = true;
  await stockInStore.getAllStockInLists().then((data)=>{
    list.value = data;
    secondDialog.value = false;
  })
}

onMounted(async()=>{
  init();
})

watch(showDialog, async (newValue)=>{
  if (!newValue){
    await init();
  }
})

const deleteCustomer = async () =>{
  if (selected.value.length == 0) {
    errorMessage.value = '請選取一筆資料刪除!';
    return;
  }
  if (confirm('確認刪除?')){
    secondDialog.value = true;
    await stockInStore.deleteStockInForm(form.value).then((data)=>{
      if (data.data.errorMessage && data.data.errorMessage != ''){
        alert()
      } else {
        alert('刪除成功');
      }
      secondDialog.value = false;
      init();
    });
  }
}
// #endregion
</script>
