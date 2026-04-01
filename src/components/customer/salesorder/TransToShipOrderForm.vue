<template>
  <q-card class="q-pa-md"  style="width: 1000px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h4">訂單待轉出貨單查詢</div>
    </q-card-section>
    <q-card-section>
      <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="識別碼"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
        ></q-table >
      <!-- <div class="row">
        <div class="col-10">
          確定要將此銷售訂單轉為出貨單嗎？
        </div>
      </div> -->
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="轉出貨單" color="positive" @click="transferToShipOrder()" />
      <q-btn flat label="放棄" color="negative" @click="close()" />
    </q-card-actions>
    <q-dialog v-model="showSoldOutOrderForm" persistent>
      <SoldOutForm v-model:showForm="showSoldOutOrderForm" v-model:salesOrderNo="salesOrderForm.單號" v-model:list="selected"/>
    </q-dialog>
  </q-card>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region import block start
import {
  QCard,
  QBtn,
  QCardSection,
  QCardActions,
  QTable,
  QDialog,
} from 'quasar'
import {
  ref,defineProps, defineEmits,
  onMounted,
  watch,
} from 'vue'
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useCustStore } from '@/composables/useCust';
import SoldOutForm from '../inventory/SoldOutForm.vue';
// #endregion import block end

// #region variable block start
const showSoldOutOrderForm = ref(false);
const secondDialog = ref(false);
const selected = ref([]);
const showForm = ref(false);
const salesOrderForm = ref({});
const custStore = useCustStore();
const list = ref([]);
const columns = [
  { name: '單號', label: '單號', align: 'left', field: '單號', sortable: true },
  { name: '日期', label: '日期', align: 'left', field: '日期', sortable: true },
  { name: '產品編號', label: '產品編號', align: 'left', field: '產品編號', sortable: true },
  { name: '品名規格', label: '品名規格', align: 'left', field: '品名規格', sortable: true },
  { name: '出貨數量', label: '已出貨數量', align: 'right', field: '出貨數量', sortable: true },
  { name: '數量1', label: '訂單數量', align: 'right', field: '數量1', sortable: true },
  { name: '建檔', label: '建檔', align: 'right', field: '建檔', sortable: true },
  { name: 'quono', label: '報價單號', align: 'right', field: 'quono', sortable: true },
];
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  salesOrderForm:{
    type:Object,
    default:()=>({}),
  }
});
const emits = defineEmits(['update:showForm', 'update:salesOrderForm'])
// #endregion variable block end

// #region function block start
const close = () =>{
  emits('update:showForm', false);
}
onMounted(async() => {
  console.log('轉出貨單視窗銷售訂單資料', props.salesOrderForm);
  showForm.value = props.showForm;
  salesOrderForm.value = props.salesOrderForm;
  await custStore.getShipOrderListBySalesOrderId(props.salesOrderForm.客戶編號).then((data)=>{
    list.value = data;
  })
  selected.value = props.salesOrderForm.orderListDetail;
  console.log('轉出貨單視窗銷售訂單明細資料', selected.value);
})

const transferToShipOrder = async() =>{
  if (!confirm('您確定要轉出貨單？')) {
    return;
  }
  selected.value.forEach(item => {
    if(item.數量1 - item.出貨數量 <= 0){
      alert(`訂單${item.單號}的產品${item.產品編號}已全部出貨，無法轉出貨單`);
      return;
    }
    item.ordno = item.單號;
  });
  showSoldOutOrderForm.value = true;
  // close();
}

watch(showSoldOutOrderForm, (newVal) => {
  if (!newVal) {
    close();
  }
})
// #endregion function block end
</script>
