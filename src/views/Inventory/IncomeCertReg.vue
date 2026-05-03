<template>
  <!--#region 標頭及維護按鈕-->
  <div class="row justify-start">
    <div class="col-1 justify-start" style="max-width:150px">
      <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
    </div>
    <div class="col-11 justify-start" style="max-width:1350px">
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="primary" class="padding-right"
                glossy @click="openCustomerDialog('新增')"
                :loading="loading">新增進項憑證</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="info" class="padding-right"
                glossy @click="openCustomerDialog('修改')"
                :loading="loading">修改進項憑證</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="red" class="padding-right"
                  glossy @click="deleteCustomer"
                  :loading="loading">刪除進項憑證</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="green" class="padding-right"
                  glossy @click="openCustomerDialog('預覽')"
                    :loading="loading">進項憑證預覽</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="blue-6" class="padding-right"
                  glossy @click="openSearchForm"
                    :loading="loading">進項憑證查詢</q-btn>&nbsp;
    </div>
  </div>
  <div class="row justify-start">
    <div class="col-12 justify-start flex" style="max-width:1500px">
      <label class="text-h4"><font color=red>{{ errorMessage }}</font></label>
    </div>
  </div>
   <!--#endregion -->
   <!--#region 品項列表 -->
   <div class="row justify-start">
    <div class="col-12 col-md-12"  style="max-width: 2000px">
      <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="識別碼"
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
   <!--#region 主畫面 -->
   <q-dialog v-model="showDialog" persistent>
    <income-cert-reg-form v-model:showForm="showDialog"  v-model:form="form" v-model:mode="mode"/>
   </q-dialog>
   <!--#endregion -->
   <loading-component v-model="secondDialog"/>
</template>
<script setup>
// #region import
import {
  QIcon
  , QBtn
  , QTable
  , QDialog
} from 'quasar';
import { ref
  , onMounted
  , watch
 } from 'vue';
import { useAuth } from '@/composables/useAuth';
import IncomeCertRegForm from '@/components/inventory/IncomeCertRegForm.vue';
import { useStockIn } from '@/composables/useStockIn';
import LoadingComponent from '@/components/LoadingComponent.vue';
import dayjs from 'dayjs';
// #endregion

// #region variable
const formName = ref('進項憑證');
const authStore = useAuth();
const hasAllAuth = authStore.hasAllAuth(formName.value);
const mode = ref('');
const columns = ref([
  {name:'單號', label:'單號', field:'單號', sortable:true, align: 'left' },
  {name:'日期', label:'日期', field:'日期', sortable:true, align: 'left' , format: val => val != null ? dayjs(val).format('YYYY/MM/DD') : '', sort: (a, b) => { return new Date(a) - new Date(b) }  },
  {name:'廠商編號', label:'廠商編號', field:'廠商編號', sortable:true, align: 'left' },
  {name:'幣別', label:'幣別', field:'幣別', sortable:true, align: 'left' },
  {name:'匯率', label:'匯率', field:'匯率', sortable:true, align: 'left' },
  {name:'付款日期', label:'付款日期', field:'付款日期', sortable:true, align: 'left', format: val => val != null ? dayjs(val).format('YYYY/MM/DD') : '', sort: (a, b) => { return new Date(a) - new Date(b) }   },
  {name:'類別', label:'類別', field:'類別', sortable:true, align: 'left' },
  {name:'付現金額', label:'付現金額', field:'付現金額', sortable:true, align: 'right' },
  {name:'銀轉金額', label:'銀轉金額', field:'銀轉金額', sortable:true, align: 'right' },
  {name:'銀存編碼', label:'銀存編碼', field:'銀存編碼', sortable:true, align: 'left' },
]);
const list = ref([]);
const selected = ref([]);
const showDialog = ref(false);
const secondDialog = ref(false);
const form = ref({ 識別碼:0
  ,日期:''
  ,單號:''
  ,廠商編號:''
  ,幣別:''
  ,匯率:''
  ,請款人員:''
  ,付款日期:''
  ,類別:''
  ,付現金額:0
  ,銀轉金額:0
  ,匯費:0
  ,銀存編碼:''
  ,付票金額:0
  ,票據號碼:''
  ,付款總額:0
  ,MACHINENO:''
  ,發票號碼:''
  ,備註:''
  ,建檔:''
  ,建檔日:''
  ,修改:''
  ,修改日:''
  ,核准:''
  ,核准日:''
  ,傳票:''
  ,結案:''
})
const stockInStore = useStockIn();
// #endregion

// #region function
const openCustomerDialog = (type) =>{
  mode.value = type;
  if (mode.value == '新增') {
    console.log(mode.value);
  } else if (mode.value == '修改') {
    console.log(mode.value);
    form.value = selected.value[0];
  } else if (mode.value == '預覽') {
    console.log(mode.value);
    form.value = selected.value[0];
  }
  showDialog.value = true;
}
onMounted(async () =>{
  await init();
})
const init = async () =>{
  form.value = { 識別碼:0
    ,日期:''
    ,單號:''
    ,廠商編號:''
    ,幣別:''
    ,匯率:''
    ,請款人員:''
    ,付款日期:''
    ,類別:''
    ,付現金額:0
    ,銀轉金額:0
    ,匯費:0
    ,銀存編碼:''
    ,付票金額:0
    ,票據號碼:''
    ,付款總額:0
    ,MACHINENO:''
    ,發票號碼:''
    ,備註:''
    ,建檔:''
    ,建檔日:''
    ,修改:''
    ,修改日:''
    ,核准:''
    ,核准日:''
    ,傳票:''
    ,結案:false
  }
  selected.value = [];
  secondDialog.value = true;
  await stockInStore.queryAllIncomeCertReg().then((data)=>{
    console.log('data',data);
    if (data.data.errorMessage && data.data.errorMessage != ''){
      alert(data.data.errorMessage);
    } else {
      list.value = data.data.resultList;
    }
    secondDialog.value = false;
  });
}
watch(showDialog, newValue =>{
  if (!newValue){
    init();
  }
})
// #endregion

</script>
