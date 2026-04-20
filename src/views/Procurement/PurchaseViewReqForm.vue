<template>
  <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
    <div class="row q-col-gutter-md">
      <div class="col-12 justify-start" style="max-width:1500px">
        <div class="text-h4">{{ mode }}請購單
          <q-btn label="關閉" color="blue" flat densed @click="close"/>
          <q-btn label="送出" color="red" v-if="!preview" flat densed @click="submit"/>
        </div>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 justify-start" style="max-width:1200px">
        <q-card-section>
          <q-form ref="myForm" >
            <q-table  class="rounded-borders my-sticky-header-table"
                    :columns="columns"
                    row-key="請購序號"
                    :rows="list"
                    flat
                    bordered
                    virtual-scroll
                    style="max-height: 500px; width:2000px"
                    :pagination="{ rowsPerPage: 5 }"
            >
              <template v-slot:body-cell-請購日期="props">
                <q-td :props="props">
                  <q-input  outlined dense :readonly="readonly||preview" v-model="props.row.日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                          <q-date v-model="props.row.日期" :readonly="readonly||preview" mask="YYYY/MM/DD" no-title>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-td>
              </template>
              <template v-slot:body-cell-品項編號="props">
                <q-td :props="props" style="width:200px" class="flex">
                  <q-input  outlined dense :readonly="readonly||preview" v-model="props.row.品項編號" style="width:150px"/>
                  <q-icon name="search" size="30px" @click="openSearcItemForm(props.row)" class="cursor-pointer" ></q-icon>
                  <q-dialog v-model="showSearchItemNoForm" perisitent>
                    <product-query-like-form v-model:showForm="showSearchItemNoForm" @select="onSelectItem"/>
                    <!-- <CustListQueryView v-model:showForm="showSearchCustNoForm" v-model:custNo="salesOrderForm.客戶編號"/> -->
                  </q-dialog>
                </q-td>
              </template>
              <template v-slot:body-cell-請購部門="props">
                <q-td :props="props" >
                  <q-select v-model="props.row.請購部門" :readonly="readonly || preview" outlined dense
                  :options="deptList"  emit-value map-options
                          option-value="職務"
                          option-label="職務"/>
                </q-td>
              </template>
              <template v-slot:body-cell-請購類別="props">
                <q-td :props="props">
                  <q-select v-model="props.row.請購類別" :readonly="readonly || preview" outlined dense
                  :options="purTypeList"  emit-value map-options/>
                </q-td>
              </template>
              <template v-slot:body-cell-需求日期="props">
                <q-td :props="props">
                  <q-input  outlined dense :readonly="readonly||preview" v-model="props.row.需求日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover v-model="showReqDatePopup" transition-show="scale" transition-hide="scale">
                          <q-date v-model="props.row.需求日期"  :readonly="readonly||preview" mask="YYYY/MM/DD" no-title>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat @click="showReqDatePopup = false" />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-td>
              </template>
              <template v-slot:body-cell-需求數量="props">
                <q-td :props="props">
                  <q-input  outlined dense :readonly="readonly||preview" v-model="props.row.數量" :rules="[val => !!val || '需求數量為必填欄位']"></q-input>
                </q-td>
              </template>
              <template v-slot:body-cell-緊急="props">
                <q-td :props="props">
                  <q-checkbox  outlined dense :readonly="readonly||preview" v-model="props.row.緊急" ></q-checkbox>
                </q-td>
              </template>
              <template v-slot:body-cell-用途="props">
                <q-td :props="props">
                  <q-input  outlined dense :readonly="readonly||preview" v-model="props.row.用途"></q-input>
                </q-td>
              </template>
              <template v-slot:body-cell-指定供應廠商="props">
                <q-td :props="props">
                   <q-select v-model="props.row.指定供應廠商" :readonly="readonly || preview" outlined dense
                  :options="vendorList" option-value="廠商編號" option-label="廠商編號" @update:model-value="updateVendorAlias(props.row)"  emit-value map-options/>
                </q-td>
             </template>
              <template v-slot:body-cell-廠商簡稱="props">
                <q-td :props="props">
                  <q-input  outlined dense readonly v-model="props.row.廠商簡稱"></q-input>
                </q-td>
              </template>
              <template v-slot:body-cell-註記="props">
                <q-td :props="props">
                  <q-input  outlined dense :readonly="readonly||preview" v-model="props.row.註記"></q-input>
                </q-td>
              </template>
            </q-table >
          </q-form>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>
<script setup>
//#region import
import {
  QCard,
  QCardSection,
  QForm,
  QTable,
  QBtn,
  QInput,
  QTd,
  QIcon,
  QPopupProxy,
  QDate,
  QSelect,
  QDialog,
  QCheckbox,
} from 'quasar';
import {
  ref, defineProps, onMounted, defineEmits,
} from 'vue';
import dayjs from 'dayjs'
import { usePurchaseStore } from '@/composables/usePurchase';
import ProductQueryLikeForm from '@/components/product/ProductQueryLikeForm.vue';
import { useSupplierStore } from '@/composables/useSupplier';
// import { useItemStore } from '@/composables/useItem';
//#endregion

//#region variable
const vendorList = ref([]);
const list = ref([]);
const preview = ref(false);
const myForm = ref(null);
const showDatePopup = ref(false);
const showReqDatePopup = ref(false);
const purTypeList = ref([
  '機台零件',
  '買賣批發',
  '售後維修',
  '專案增購',
  '受託代工',
  '研發用途',
  '安全庫存',
  '廠驗追加',
  '客戶訂購'
]);
const columns = ref([
  { name: '請購序號', label: '請購序號', align: 'left', field: '請購序號', sortable: true },
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
]);
const deptList = ref([]);
const showSearchItemNoForm = ref(false);
// const itemStore = useItemStore();
const props = defineProps({
  data:{
    type:Object,
    default:() => ({
       請購序號:0
      ,日期:''
      ,品項編號:''
      ,品名規格:''
      ,請購類別:''
      ,請購部門:''
      ,請購人員:''
      ,數量:0
      ,單位:''
      ,需求日期:''
      ,緊急:false
      ,用途:''
      ,註記:''
      ,指定供應廠商:''
      ,轉單:false
      ,結案:false
      ,選擇廠商:''
      ,採購單號:''
    })
  },
  mode:{
    type:String,
    value:'',
  },
  preview:{
    type:Boolean,
    value:false,
  }
});
const supplierStore = useSupplierStore();
const currentRow = ref(null);
const emits = defineEmits(['update:showForm']);
const form = ref({
   請購序號:''
  ,日期:''
  ,品項編號:''
  ,品名規格:''
  ,請購類別:''
  ,請購部門:''
  ,請購人員:''
  ,數量:0
  ,單位:''
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
const purchaseStore = usePurchaseStore();
//#endregion

//#region function
const openSearcItemForm = (row) => {
  currentRow.value = row;
  showSearchItemNoForm.value = true;
}
const close = () => {
  emits('update:showForm', false);
}
const submit = async () =>{
  await purchaseStore.savePurchaseRequest(list.value[0]).then((data)=>{
    if (!data.data.errorMessage && data.data.errorMessage  != ''){
      alert(data.data.errorMessage);
    } else {
      alert('儲存成功!');
    }
    close();
  });
}

const init = async () =>{
  form.value = props.data;
  preview.value = props.preview;
  form.value.日期 = dayjs(form.value.日期).format("YYYY-MM-DD")
  form.value.需求日期 = dayjs(form.value.需求日期).format("YYYY-MM-DD")
  list.value.push(form.value);
  await purchaseStore.getDeptList().then((data)=>{
    deptList.value = data;
  });
  await supplierStore.getAllSupplierList().then((data)=>{
    vendorList.value = data;
  })
}

const updateVendorAlias = (row) =>{
  let vendor = vendorList.value.find(x => x.廠商編號 == row.指定供應廠商);
  console.log('vendor', vendor);
  if (vendor){
    row.廠商簡稱 = vendor.廠商簡稱;
  }
}

onMounted(async ()=>{
  init();
})
const onSelectItem = (item) => {
  if (!currentRow.value || !item) return;

  currentRow.value.品項編號 = item.產品編號;
  currentRow.value.品名規格 = item.品名規格;
  currentRow.value.單位 = item.單位;
};
//#endregion
</script>
