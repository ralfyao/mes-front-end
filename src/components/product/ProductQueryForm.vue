<template>
  <q-card class="q-pa-md"  style="width: 1000px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">品項搜尋</div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.itemNo" outlined dense label="品項編號查詢"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.itemName" outlined dense label="品項名稱查詢"/>
        </div>
      </div>
      <br>
    </q-card-section>
    <q-card-sections>
       <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="產品編號"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                @selection="onSelection"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table >
    </q-card-sections>
    <q-card-actions align="right">
      <q-btn flat label="查詢" color="positive" @click="query()" />
      <q-btn flat label="EXIT" color="negative" @click="close()" />
    </q-card-actions>
  </q-card>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
//#region import
import { useItemStore } from '@/composables/useItem';
import LoadingComponent from '../LoadingComponent.vue';
import {
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QTable,
  QInput,
} from 'quasar'
import {
  defineEmits,
  ref,
} from 'vue'
//ednregion

//#region variable
const emits = defineEmits(['update:showForm', 'update:item']);
const columns = [
  { name: '產品編號', label: '產品編號', align: 'left', field: '產品編號', sortable: true },
  { name: '品別', label: '品別', align: 'left', field: '品別', sortable: true },
  { name: '大分類', label: '大分類', align: 'left', field: '大分類', sortable: true },
  { name: '小分類', label: '小分類', align: 'left', field: '小分類', sortable: true },
  { name: '產品代號', label: '產品代號', align: 'left', field: '產品代號', sortable: true },
  { name: '品名規格', label: '品名規格', align: 'left', field: '品名規格', sortable: true },
];
const list = ref([]);
const itemStore = useItemStore();
const secondDialog = ref(false);
const param = {
  itemNo:'',
  itemName:'',
}
//ednregion

//#region function
const query = async() =>{
  secondDialog.value = true;
  await itemStore.getAllItems().then((data)=>{
    list.value = data;
    if (param.itemNo && param.itemNo != ''){
      list.value = list.value.filter((x) =>x.產品編號?.indexOf(param.itemNo) != -1);
    }
    if (param.itemName && param.itemName != ''){
      list.value = list.value.filter((x) =>x.品名規格?.indexOf(param.itemName) != -1);
    }
    secondDialog.value = false;
  })
}
const selected = ref([]);
const close = () =>{
  if (selected.value.length > 0)
    emits('update:item', selected?.value[0]);
  emits('update:showForm', false);
}
//ednregion
</script>
