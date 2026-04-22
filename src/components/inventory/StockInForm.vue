<template>
  <q-card class="q-pa-md"  style="width: 1500px; max-width: 100vw;">
    <q-card-section>
      <div class="text-h4">
        {{mode}}進貨單
        <q-btn label="採購分配" v-if="!preview" outlined dense glossy color="blue" @click="openProcurementDistribution"/> &nbsp;
        <q-btn label="會計傳票" v-if="!preview" outlined dense glossy color="brown"/>&nbsp;
        <q-btn label="核准" v-if="!preview && (form.核准 == null || form.核准 == '')" outlined dense glossy color="grey" @click="validate(true)"/>&nbsp;
        <q-btn label="覆核" v-if="!preview && (form.採購覆核 == null || form.採購覆核 == '')" outlined dense glossy color="grey" @click="revalidate(true)"/>&nbsp;
        <q-btn label="取消核准" v-if="!preview && (form.核准 != null && form.核准 != '')" outlined dense glossy color="grey" @click="validate(false)"/>&nbsp;
        <q-btn label="取消覆核" v-if="!preview && (form.採購覆核 != null && form.採購覆核 != '')" outlined dense glossy color="grey" @click="revalidate(false)"/>&nbsp;
        <q-btn label="列印" v-if="!preview" outlined dense glossy color="grey"/>&nbsp;
      </div>
    </q-card-section>
    <q-card-section>
      <q-form ref="myForm">
        <!--日期、單號、倉管人員、覆核人員、覆核日期、傳票-->
        <div class="row q-col-gutter-md">
          <!--日期-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input  outlined dense readonly v-model="form.日期" label="日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.日期" readonly mask="YYYY/MM/DD"  no-title @update:model-value="showDatePopup = false">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <!--單號-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input label="單號" outlined dense v-model="form.單號" readonly/>
          </div>
          <!--倉管人員-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-select
              outlined dense v-model="form.倉管人員"
              emit-value map-options label="倉管人員"
              :options="warehouseWorkersList"
              @update:model-value="changeWHWorkerName" :readonly="readonly || preview"
              option-label="工號"
              option-value="工號"/>
            <label class="text-h5">{{ whWorkerName }}</label>
          </div>
          <!--覆核人員-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input label="覆核人員" outlined dense v-model="form.採購覆核" readonly/>
          </div>
          <!--覆核日期-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input type="date" label="覆核日期" outlined dense v-model="form.覆核日" readonly/>
          </div>
          <!--傳票-->
          <div class="col-2 col-md-2" style="max-width: 250px">
            <q-input label="傳票" outlined dense v-model="form.傳票" :readonly="readonly || preview"/>
          </div>
        </div>
        <!--備註-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 1500px">
            <q-input label="備註" outlined dense v-model="form.備註" :readonly="readonly || preview"/>
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section>
      <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="識別碼"
                :rows="form.detailList || []"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                :pagination="{ rowsPerPage: 5 }"
      >
        <template v-slot:body-cell-收貨數量="props">
          <q-td :props="props">
            <q-input outlined dense type="number" @blur="計算特採數量(props.row)"  :readonly="readonly || preview"
              v-model="props.row.收貨數量" :rules="[val =>  !!val || '收貨數量為必填欄位']"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-合格數量="props">
          <q-td :props="props">
            <q-input outlined dense type="number" @blur="計算特採數量(props.row)" :readonly="readonly || preview"
              v-model="props.row.合格數量" :rules="[val =>  !!val || '合格數量為必填欄位']"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-退回數量="props">
          <q-td :props="props">
            <q-input outlined dense type="number" :readonly="readonly || preview"
              v-model="props.row.退回數量" :rules="[val =>  !!val || '退回數量為必填欄位']"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-樣品="props">
          <q-td :props="props">
            <q-checkbox outlined dense :disable="readonly || preview"
              v-model="props.row.樣品"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-折讓金額="props">
          <q-td :props="props">
            <q-input outlined dense type="number" @blur="計算付款金額(props.row)" :readonly="readonly || preview"
              v-model="props.row.折讓金額" :rules="[val =>  !!val || '折讓金額為必填欄位']"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="關閉" color="blue" flat dense @click="close"/>
      <q-btn label="送出" color="red" flat dense @click="submit"/>
    </q-card-actions>
  </q-card>
  <q-dialog v-model="showProcurementDistribution" persistent>
    <ProcurementDistributionForm v-model:showForm="showProcurementDistribution" v-model:list="tmpList" />
  </q-dialog>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region import
import {QCard
  , QCardSection
  , QBtn
  , QForm
  , QCardActions
  , QInput
  , QIcon
  , QDate
  , QPopupProxy
  , QSelect
  , QTable
  , QTd
  , QCheckbox
  , SessionStorage
  , QDialog
} from 'quasar';
import { ref,
  defineProps,
  onMounted,
  defineEmits,
  watch,
 } from 'vue'
 import dayjs from 'dayjs'
import { useStockIn } from '@/composables/useStockIn';
import { useItemStore } from '@/composables/useItem';
import LoadingComponent from '../LoadingComponent.vue';
import { useHRStore } from '@/composables/useHR';
import ProcurementDistributionForm from '../procurement/ProcurementDistributionForm.vue';
// #endregion

// #region variable
// const showChooseProcItem = ref(false);
const tmpList = ref([]);
const hrStore = useHRStore();
const showProcurementDistribution = ref(false);
const whWorkerName = ref('');
const 品項編號Options = ref([]);
const columns = ref([
  {name:'品項編號',label:'品項編號',field:'品項編號', align: 'left', sortable: true},
  {name:'品名規格',label:'品名規格',field:'品名規格', align: 'left', sortable: true},
  {name:'單位',label:'單位',field:'單位', align: 'left', sortable: true},
  {name:'廠商編號',label:'廠商編號',field:'廠商編號', align: 'left', sortable: true},
  {name:'廠商簡稱',label:'廠商簡稱',field:'廠商簡稱', align: 'left', sortable: true},
  {name:'採購數量',label:'採購數量',field:'採購數量', align: 'right', sortable: true},
  {name:'收貨數量',label:'收貨數量',field:'收貨數量', align: 'right', sortable: true},
  {name:'合格數量',label:'合格數量',field:'合格數量', align: 'right', sortable: true},
  {name:'特採數量',label:'特採數量',field:'特採數量', align: 'right', sortable: true},
  {name:'退回數量',label:'退回數量',field:'退回數量', align: 'left', sortable: true},
  {name:'樣品',label:'樣品',field:'樣品', align: 'left', sortable: true},
  {name:'備註',label:'備註',field:'批號', align: 'left', sortable: true},
  {name:'專案序號',label:'專案序號',field:'包裝單號', align: 'left', sortable: true},
  {name:'採購單號',label:'採購單號',field:'採購單號', align: 'left', sortable: true},
  {name:'實際單價',label:'實際單價',field:'實際單價', align: 'right', sortable: true},
  {name:'折讓金額',label:'折讓金額',field:'折讓金額', align: 'right', sortable: true},
  {name:'付款金額',label:'付款金額',field:'付款金額', align: 'right', sortable: true},
]);
const mode = ref('');
const itemStore = useItemStore();
const stockInStore = useStockIn();
// const authStore = useAuth();
const secondDialog = ref(false);
const emits = defineEmits(['update:showForm']);
const myForm = ref(null);
const preview = ref(false);
const warehouseWorkersList = ref([]);
const showDatePopup = ref(false);
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
  ,detailList:[]
});
const props = defineProps({
  form:{
    type:Object,
    default:()=>({單號:''
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
  ,detailList:[]})
  },
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  mode:{
    type:String,
    default:'',
  },
  preview:{
    type:Boolean,
    default:false,
  }
})
// #endregion

// #region function
const changeWHWorkerName = async () =>{
  console.log('form.value.倉管人員', form.value.倉管人員);
  console.log('warehouseWorkersList', warehouseWorkersList.value)
  let worker = warehouseWorkersList.value.find(x => x.工號 == form.value.倉管人員);
  console.log('worker', worker);
  if (!worker && (form.value.倉管人員 && form.value.倉管人員 != null && form.value.倉管人員 != undefined))
  {
    await hrStore.getWorkerByNumber(form.value.倉管人員).then((data)=>{
      console.log('worker 2', data);
      worker = data;
    });
    whWorkerName.value = worker.姓名;
  }
}
const 計算特採數量 = (row) =>{
  row.特採數量 = row.收貨數量 - row.合格數量;
  計算付款金額(row)
}
const 計算付款金額 = (row) =>{
  row.付款金額 = row.收貨數量 * row.實際單價 - row.折讓金額
}
const validate = async (isValidate) =>{
  secondDialog.value = true;
  if (isValidate){
    form.value.核准 = SessionStorage.getItem('Account').account;
    form.value.核准日 = dayjs().format("YYYY-MM-DD");
  } else {
    form.value.核准 = null;
    form.value.核准日 = null;
  }
  await stockInStore.saveUpdateForm(form.value).then((data)=>{
    if (data.data.errorMessage && data.data.errorMessage != '') {
      alert(data.data.errorMessage);
    } else {
      alert((isValidate?'核准成功!':'取消核准成功!'));
    }
    secondDialog.value = false;
    // emits('update:showForm', false)
  })
}

const revalidate = async (isValidate) =>{
  if (isValidate){
    form.value.採購覆核 = SessionStorage.getItem('Account').account;
    form.value.覆核日 = dayjs().format("YYYY-MM-DD");
  } else {
    form.value.採購覆核 = null;
    form.value.覆核日 = null;
  }
  secondDialog.value = true;
  await stockInStore.saveUpdateForm(form.value).then((data)=>{
    if (data.data.errorMessage && data.data.errorMessage != '') {
      alert(data.data.errorMessage);
    } else {
      alert((isValidate?'覆核成功!':'取消覆核成功!'));
    }
    secondDialog.value = false;
    // emits('update:showForm', false)
  })
}

const init = async () =>{
  mode.value = props.mode;
  form.value = props.form;
  preview.value = props.preview;
  if (mode.value == '修改') {
  await stockInStore.stockInDetailLists(form.value.單號).then((data)=>{
    form.value.detailList = data;
    form.value.detailList.forEach(x =>{
      計算特採數量(x);
    });
  });
  await stockInStore.getWarehouseWorkers().then((data)=>{
    warehouseWorkersList.value = data || [];
    // if (warehouseWorkersList.value.length == 0){
    //   hrStore.getAllWorkers().then((data2)=>{
    //     warehouseWorkersList.value = data2;
    //   })
    // }
  })
  changeWHWorkerName();
  await itemStore.getAllItems().then((data)=>{
    品項編號Options.value = data;
  });
  }
  else if (mode.value == '新增'){
    form.value.日期 = dayjs().format("YYYY/MM/DD")
    await stockInStore.getFormNo().then((data)=>{
      form.value.單號 = data;
    })
  }
}
watch(showProcurementDistribution, (newValue) =>{
  if (!newValue){
    if (!form.value.detailList)
      form.value.detailList = [];
    tmpList.value.forEach(x => form.value.detailList.push({
      品項編號:x.品項編號,
      品名規格:x.品名規格,
      單位:x.單位,
      廠商編號:x.廠商編號,
      廠商簡稱:x.廠商簡稱,
      採購數量:x.採購數量,
      收貨數量:x.收貨數量,
      合格數量:x.合格數量,
      特採數量:x.特採數量,
      退回數量:x.退回數量,
      樣品:x.樣品,
      備註:x.備註,
      專案序號:x.專案序號,
      採購單號:x.採購單號,
      實際單價:x.實際單價,
      折讓金額:x.折讓金額,
      付款金額:x.付款金額
    }));
  }
})
onMounted(async ()=>{
  await init();
})
const close = () =>{
  emits('update:showForm', false);
}
const openProcurementDistribution = () =>{
  showProcurementDistribution.value = true;
}

const submit = async () =>{
  console.log('form value', form.value);
  secondDialog.value = true;
  await stockInStore.saveUpdateForm(form.value).then((data)=>{
    if (data.data.errorMessage && data.data.errorMessage != '') {
      alert(data.data.errorMessage);
    } else {
      alert('儲存成功!');
    }

    secondDialog.value = false;
    close();
  })
}
// #endregion
</script>
