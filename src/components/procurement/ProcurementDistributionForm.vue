<template>
  <q-card class="q-pa-md"  style="width: 1200px; max-width: 100vw;">
    <q-card-section>
      <div class="text-h4">
        料號選擇
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-4 flex" style="max-width: 500px">
          <q-input label="廠商查詢" outlined dense v-model="vendorName" @update:model-value="updateList"/>&nbsp;&nbsp;&nbsp;
          <q-btn label="清除篩選" color="blue" glossy outlined dense @click="filter"/>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-12" style="max-width: 1500px">
          <q-table  class="rounded-borders my-sticky-header-table"
                  :columns="columns"
                  row-key="識別碼"
                  :rows="tmpList || []"
                  flat
                  bordered
                  virtual-scroll
                  style="max-height: 500px"
                  selection="multiple"
                  v-model:selected="selected"
                  :pagination="{ rowsPerPage: 5 }"
          >
          <template v-slot:body-cell-樣品="props">
            <q-td :props="props">
              <q-checkbox outlined dense type="number"  disable
                v-model="props.row.樣品"
              />
            </q-td>
        </template>
          </q-table >
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn outlined flat color="red" label="帶入" @click="carry" />
      <q-btn outlined flat color="blue" label="關閉" @click="close" />
    </q-card-actions>
  </q-card>
  <loading-component v-model="secondDialog"/>
</template>
<script setup>
// #region import
import {
  QCard
  , QCardSection
  , QCardActions
  , QBtn
  , QInput
  , QTable
  , QTd
  , QCheckbox
} from 'quasar';
import {
  onMounted
  , ref
  , defineProps
  , defineEmits
} from 'vue';
import LoadingComponent from '../LoadingComponent.vue';
import { useStockIn } from '@/composables/useStockIn';
// #endregion

// #region variable
const stockInStore = useStockIn();
const vendorName = ref('');
const selected = ref([]);
const props = defineProps({
  showForm:{
    type:Boolean,
    default:false,
  },
  // list:{
  //   type:Array,
  //   default:()=>[],
  // }
});
const secondDialog = ref(false);
const emits = defineEmits(['update:showForm', 'update:list']);
const showForm = ref(false);
const columns = ref([
  {name:'產品編號', label:'產品編號', field:'品項編號', sort:true, align:'left'},
  {name:'品名規格', label:'品名規格', field:'品名規格', sort:true, align:'left'},
  {name:'採購單號', label:'採購單號', field:'採購單號', sort:true, align:'left'},
  {name:'採購數量', label:'採購數量', field:'採購數量', sort:true, align:'left'},
  {name:'樣品', label:'樣品', field:'樣品', sort:true, align:'left'},
  {name:'廠商編號', label:'廠商編號', field:'廠商編號', sort:true, align:'left'},
  {name:'廠商簡稱', label:'廠商簡稱', field:'廠商簡稱', sort:true, align:'left'},
  {name:'預交日期', label:'預交日期', field:'預交日期', sort:true, align:'left'},
]);
const list = ref([]);
const tmpList = ref([]);
// #endregion

// #region function
const init = async()=>{
  showForm.value = props.showForm;
  secondDialog.value = true;
  await stockInStore.queryAvailableProcItem().then((data)=>{
    list.value = data;
    tmpList.value = list.value;
    secondDialog.value = false;
  })
}
onMounted(async()=>{
  // list.value = props.list;
  init();

})

const filter = () =>{
  tmpList.value = list.value;
}

const updateList = () =>{
  tmpList.value = list.value.filter(x=> (x.廠商簡稱 != null && x.廠商簡稱.indexOf(vendorName.value) != -1) || (x.廠商編號 != null && x.廠商編號.indexOf(vendorName.value) != -1));
}

const close = () =>{
  emits('update:showForm', false);
}

const carry = () =>{

  emits('update:list', selected.value);
  close();
}
// #endregion
</script>
