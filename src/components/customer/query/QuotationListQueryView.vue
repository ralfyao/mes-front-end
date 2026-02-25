<template>
  <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">
        報價歷程
        <div class="row">
          <div class="col-2">
            <q-input v-model="customer.正航編號" label="客戶編號" readonly outlined dense/>
          </div>
          &nbsp;
          <div class="col-2">
            <q-input v-model="customer.欄位2" label="客戶簡稱" readonly outlined dense/>
          </div>
          &nbsp;
          <div class="col-4">
            <q-input v-model="customer.company" label="客戶全名" readonly outlined dense/>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-table
                :columns="columns"
                row-key="識別"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                class="rounded-borders"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="取消" color="negative" @click="close"/>
    </q-card-actions>
  </q-card>
</template>
<script setup>
// import section start
import {
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QTable,
  QInput
} from 'quasar'
import {ref, defineProps, defineEmits, onMounted } from 'vue'
import { useCustStore } from '@/composables/useCust';
// import section end

// variable section start
const custStore = useCustStore();
const columns = [
  { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
  { name: '產品編號', label: '產品編號', align: 'left', field: '產品編號', sortable: true },
  { name: '品名規格', label: '品名規格', align: 'left', field: '品名規格', sortable: true },
  { name: 'rfqno', label: '詢問函編號', align: 'left', field: 'rfqno', sortable: true },
  { name: '單價', label: '單價', align: 'left', field: '單價', sortable: true },
  { name: 'condate', label: '報價有效日期', align: 'left', field: 'condate', sortable: true },
];
const list = ref([]);
const customer = ref({});
const props = defineProps({
  modelValue:{
    type:Boolean,
    default:()=>false,
  },
  custid:{
    type:String,
    default:'',
  }
});
const emits = defineEmits(['update:modelValue']);

// variable section end

// function section start
onMounted(async ()=>{
  await custStore.getQuotationListByCustid(props.custid).then((data)=>{
    list.value = data;
  })
  await custStore.getCustList().then((data)=>{
    customer.value = data.find((x)=>x.識別 == props.custid);
    console.log('customer.value', customer.value)
  })
})
const close = () =>{
  emits('update:modelValue', false);
}
// function section end
</script>
