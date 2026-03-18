<template>
  <q-card  class="q-pa-md"  style="width: 500px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">供應商搜尋</div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-10">
          <q-input v-model="itemNo" outlined dense label="編號查詢"/>
        </div>
      </div>
      <br>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="查詢" color="positive" @click="query()" />
      <q-btn flat label="EXIT" color="negative" @click="close()" />
    </q-card-actions>
  </q-card>
</template>
<script setup>
//#region import
import { useSupplierStore } from '@/composables/useSupplier';
import {
  QCard,
  QCardSection,
  QInput,
  QCardActions,
  QBtn,
  // QTable,
} from 'quasar';
import {
  defineEmits,
  onMounted,
  ref,
  defineProps,
 } from 'vue';
//#endregion

//#region variable
const emits = defineEmits(['update:showForm', 'update:list']);
const supplierStore = useSupplierStore();
const list = ref([]);
const itemNo = ref('');
const showForm = ref(false);
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  list:{
    type:Array,
    default:()=>[],
  }
})
//#endregion

//#region function
const close = () =>{
  emits('update:showForm', false);
}

const query = () =>{
  console.log('itemNo', itemNo.value);
  const newList = list.value.filter((x)=> x.品項編號 && x.品項編號.indexOf(itemNo.value) != -1);
  console.log('newList', newList);
  emits('update:list', newList);
  close();
}

onMounted(async()=>{
  await supplierStore.getSupplierQuotationList().then((data)=>{
    list.value = data;
  })
  showForm.value = props.showForm;
  // list.value = props.list;
  // console.log('list.value', list.value);
})
//#endregion
</script>
