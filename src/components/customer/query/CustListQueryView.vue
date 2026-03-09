<template>
  <q-card  class="q-pa-md"  style="width: 700px; max-width: 95vw;">
    <q-card-section>
      <q-input dense outlined v-model="custName" label="客戶名稱" />
    </q-card-section>
    <q-card-section>
      <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="識別"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table >
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="帶入" color="green" flat @click="carry"/>
      <q-btn label="EXIT" color="primary" flat @click="close" />
    </q-card-actions>
  </q-card>
</template>
<script setup>
// import block start
import { useCustStore } from '@/composables/useCust';
import {
  QCard,
  QCardSection,
  QTable,
  QBtn,
  QCardActions,
  QInput,
} from 'quasar'
import {
  onMounted,
  ref,
  defineProps,
  defineEmits,
  watch
} from 'vue';
// import block end

// variable block start
const custName = ref('');
const columns =
[
  { name: 'company', label: '客戶名稱', align: 'left', field: 'company', sortable: true },
  { name: '正航編號', label: '客戶編號', align: 'left', field: '正航編號', sortable: true },
];
const tmpList = ref([]);
const list = ref([]);
const selected = ref([])
const showThisForm = ref(false);
const custStore = useCustStore();
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  }
})
const emits = defineEmits(['update:showForm', 'update:custNo']);
// variable block end

// function block start
onMounted(async ()=>{
  showThisForm.value = props.showForm;
  await custStore.getCustList().then((data)=>{
    tmpList.value = data;
  })
  // alert('in CustListQuerView:'+showThisForm.value );
})
const close = () =>{
  emits('update:showForm', false);
}
const searchCustList = () =>{
  list.value = [];
  list.value = tmpList.value.filter((x)=>x.company.indexOf(custName.value) != -1 && x.company != '' && x.正航編號 && x.正航編號!= '')
}
watch(
  () => custName,
  (newVal) => {
    console.log('資料更新了', newVal)
    if(newVal)
      searchCustList();
  },
  { deep: true, immediate: true }
)

const carry = () =>{
  // if (custName.value.trim() == ''){
  //   alert('請輸入客戶名稱!');
  //   return;
  // }
  if (selected.value.length == 0)
  {
    alert('請選取一筆資料!');
    return;
  }
  emits('update:custNo', selected.value[0].正航編號)
  close();
}
//function bloc
// function block end
</script>
