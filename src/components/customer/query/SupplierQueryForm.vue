<template>
  <q-card  class="q-pa-md"  style="width: 500px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">維修單搜尋</div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.supplierNo" outlined dense label="編號查詢"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.supplierName" outlined dense label="廠商查詢"/>
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
  QCardActions,
  QBtn,
  QInput,
} from 'quasar';
import { defineProps, defineEmits,  } from 'vue';
//#endregion

//#region veriable
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
   list:{
    type:Array,
    default:()=>[],
   }
});
const emits = defineEmits(['update:showForm', 'update:list']);
const supplierStore = useSupplierStore();
const param = {
  supplierNo:'',
  supplierName:'',
}
//#endregion

//#region function
const close = () =>{
  emits('update:showForm', false);
}
const query = async () =>{
  await supplierStore.querySupplier(param).then((data)=>{
    if (data.length == 0)
    {
      alert('無資料!');
    }
    emits('update:list', data);
    close();
  });
}
//#endregion
</script>
