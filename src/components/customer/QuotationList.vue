<template>
  <div>
    <h6>報價單列表</h6>
    <div v-for="item in props.quotationList" :key="item.quono">
      <div class="row q-col-gutter-md">
        <div class="col-6 col-md-6 flex" style="max-width: 375px">
          <q-input v-model="item.quono" label="報價單號" :readonly="true" outlined dense></q-input>
          <q-btn label="報價單細項" @click="openQuotationDetail(item.quono)" flat ></q-btn>
        </div>
        <div class="col-6 col-md-6 flex" style="max-width: 375px">
          <q-input v-model="item.quodate" label="報價單日期" :readonly="true" outlined dense></q-input>
        </div>
      </div>
    </div>
  </div>
  <br>
  <h6>報價單細項列表</h6>
  <div v-for="item in quotationDetailList" :key="item.quono">
    <div class="row q-col-gutter-md">
      <div class="col-2 col-md-2" style="max-width: 150px">
        <q-input v-model="item.quono" label="報價單號" :readonly="true" outlined dense></q-input>
      </div>
      <div class="col-2 col-md-2" style="max-width: 150px">
        <q-input v-model="item.產品編號" label="產品編號" :readonly="true" outlined dense></q-input>
      </div>
      <div class="col-2 col-md-2" style="max-width: 150px">
        <q-input v-model="item.品名規格" label="品名規格" :readonly="true" outlined dense></q-input>
      </div>
      <div class="col-2 col-md-2" style="max-width: 150px">
        <q-input v-model="item.數量" label="數量" :readonly="true" outlined dense></q-input>
      </div>
      <div class="col-2 col-md-2" style="max-width: 150px">
        <q-input v-model="item.金額" label="金額" :readonly="true" outlined dense></q-input>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref } from 'vue'
import { useCustStore } from '@/composables/useCust';
import {
  QInput
  , QBtn
} from 'quasar'
const props = defineProps({
  quotationList:{
    type:Array,
    default: () =>[]
  }
});
const custStore = useCustStore();
const quotationDetailList = ref([]);
const openQuotationDetail = async (quono) =>{
  console.log('quono', quono);
  await custStore.getQuotationDetailList(quono).then((data) =>{
    quotationDetailList.value = data;
  });
}
</script>
