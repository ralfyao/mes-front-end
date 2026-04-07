<template>
  <q-card   class="q-pa-md"  style="width: 750px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h4">訂單合約列印</div>
      <q-card-actions align="right">
        <q-btn flat label="放棄" color="negative" @click="close()" />
      </q-card-actions>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-6 col-md-6">
          <q-input v-model="salesOrderForm.單號" label="單號" outlined dense readonly />
        </div>
        <div class="col-6 col-md-6">
          <q-input v-model="salesOrderForm.客戶編號" label="客戶" outlined dense readonly />
        </div>
      </div>
      <br>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-12">
          <q-input v-model="salesOrderForm.客戶全稱" label="客戶名稱" outlined dense readonly />
        </div>
      </div>
      <br>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-12">
          <q-input type="textarea" v-model="salesOrderForm.備註" label="備註" outlined dense />
        </div>
      </div><br>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-12">
          <q-table
            :columns="arColumns"
            row-key="識別"
            :rows="list"
            selection="single"
            v-model:selected="selectedDetail"
            flat
            bordered
            style="max-height: 70vh;"
          />     
        </div>
      </div>
      <br>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-4">
          <q-btn color="yellow-5" outlined glossy label="中文訂單 %" @click="printForm(1)"/>
        </div>
        <div class="col-4 col-md-4">
          <q-btn color="orange-5" outlined glossy label="Performa Invoice % " @click="printForm(2)"/>
        </div>
        <div class="col-4 col-md-4">
          <q-btn color="blue-5" outlined glossy label="日文訂單 %" @click="printForm(3)"/>

        </div>
      </div>
      <br>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-4">
          <q-btn color="yellow-7" outlined glossy label="中文訂單 T" @click="printFormT(1)"/>
        </div>
        <div class="col-4 col-md-4">
          <q-btn color="orange-7" outlined glossy label="Performa Invoice T " @click="printFormT(2)"/>
        </div>
        <div class="col-4 col-md-4">
          <q-btn color="blue-7" outlined glossy label="日文訂單 T" @click="printFormT(3)"/>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
//#region import block start
import { QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QInput,
  // eslint-disable-next-line no-unused-vars
  QTable,
} from 'quasar';
// eslint-disable-next-line no-unused-vars
import { ref, defineProps, defineEmits, onMounted } from 'vue';
//#endregion import block end

//#region variable block start
// eslint-disable-next-line no-unused-vars
const selectedDetail = ref([]);
const list = ref([]);
// eslint-disable-next-line no-unused-vars
const arColumns = [
  { name: '產品編號', label: '產品編號', align: 'left', field: '產品編號', sortable: true },
  { name: '品名規格', label: '品名規格', align: 'right', field: '品名規格', sortable: true },
  { name: '單位', label: '單位', align: 'left', field: '單位', sortable: true },
  { name: '數量1', label: '數量', align: 'right', field: '數量1', sortable: true },
  { name: '單價1', label: '單價', align: 'left', field: '單價1', sortable: true },
  { name: '金額1', label: '金額', align: 'right', field: '金額1', sortable: true },
  { name: '報價單價', label: '報價單價', align: 'right', field: '報價單價', sortable: true },
  
  { name: '折數', label: '折數', align: 'right', field: '折數', sortable: true },
  
  { name: '註記', label: '註記', align: 'left', field: '註記', sortable: true },
  { name: '專案序號', label: '專案序號', align: 'left', field: '專案序號', sortable: true },
  { name: 'mtype', label: '機台類型', align: 'left', field: 'mtype', sortable: true },
  { name: '佣金率', label: '佣金率', align: 'left', field: '佣金率', sortable: true },
  { name: '樣品別', label: '樣品別', align: 'left', field: '樣品別', sortable: true },
  { name: '描述', label: '描述', align: 'left', field: '描述', sortable: true },
  

];
const props = defineProps({
  salesOrderForm: {
    type: Object,
    default: () => ({})
  },
  showForm: {
    type: Boolean,
    default: false
  },
  selectedAr:{
    type:Array,
    default:()=>[],
  }
});
const salesOrderForm = ref({});
const selectedAr = ref([]);
//#endregion variable block end

//#region function block start
const emits = defineEmits(['update:showForm']);
const close = () => {
  emits('update:showForm', false);
}
onMounted(()=>{
  salesOrderForm.value = props.salesOrderForm;
  list.value = salesOrderForm.value.orderListDetail;
  selectedAr.value = props.selectedAr;
  console.log("salesOrderForm.value", salesOrderForm.value);
})

const printForm = (type) =>{
  console.log('selectedAr', selectedAr.value);
  if (selectedAr.value.length == 0){
    alert("請選取一筆訂單明細資料做列印");
    return;
  } 
  emits('update:showForm', false);
  // eslint-disable-next-line no-unused-vars
  const url = `/api/salesorder/print?ordno=${salesOrderForm.value.單號}&type=${type}`;
  window.open(url, '_blank');
}

const printFormT = (type) =>{
  console.log('selectedAr', selectedAr.value);
  if (selectedAr.value.length == 0){
    alert("請選取一筆訂單明細資料做列印");
    return;
  } 
  emits('update:showForm', false);
  // eslint-disable-next-line no-unused-vars
  const url = `/api/salesorder/print?ordno=${salesOrderForm.value.單號}&type=${type}`;
  window.open(url, '_blank');
}
//#endregion function block end
</script>