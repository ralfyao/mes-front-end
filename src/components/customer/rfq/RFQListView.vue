<template>
  <q-card class="q-pa-md"  style="width: 1000px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h4">詢價單列表</div>
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
    </q-card-section>
    <q-card-section>
      <q-table
        :columns="columns"
        :rows="lists"
        flat
        bordered
        virtual-scroll
        style="max-height: 500px"
        class="rounded-borders"
        :pagination="{ rowsPerPage: 5 }"
      />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="取消" color="negative" @click="close()" />
    </q-card-actions>
  </q-card>
</template>
<script setup>
// import block start
import {
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QTable,
  QInput
} from 'quasar'
import { defineProps, defineEmits, watch, ref, onMounted } from 'vue';
import { useCustStore } from '@/composables/useCust';
// import block end

// variable block start
const custStore = useCustStore();
const props = defineProps({
  companyId:{
    type:String,
    default:()=>'',
  },
  showForm:{
    type:Boolean,
    default:false,
  }
});
const emits = defineEmits(['update:showForm']);
const customer = ref({});
const lists = ref([]);
const columns =
[
  { name: 'rfqno', label: '詢問函號', align: 'left', field: 'rfqno', sortable: true },
  { name: 'machine', label: 'MACHINE', align: 'left', field: 'machine', sortable: true },
  { name: 'rfqdate', label: '詢問函日期', align: 'left', field: 'rfqdate', sortable: true },
  { name: 'status', label: 'STATUS', align: 'left', field: 'status', sortable: true },
  { name: 'rfqstatus', label: 'RESULT', align: 'left', field: 'rfqstatus', sortable: true },
  //{ name: 'sales', label: '業務編號', align: 'left', field: 'sales', sortable: true },
  { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
];
// variable block end

//function block start
const close = () =>{
  console.log('close')
  emits('update:showForm', false);
}
watch(props.companyId, async (oldValue, newValue)=>{
  console.log('oldValue', oldValue, 'newValue', newValue)
  await custStore.getRfqListByCust(newValue).then((data)=>{
    lists.value = data;
  });
})
onMounted(async ()=>{
 await custStore.getRfqListByCust(props.companyId).then((data)=>{
    lists.value = data;
  });
  await custStore.getCustList().then((data)=>{
    customer.value = data.find((x)=>x.識別 == props.companyId);
    console.log('customer.value', customer.value)
  })
})
//function block end
</script>
