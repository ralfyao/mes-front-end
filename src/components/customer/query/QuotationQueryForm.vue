<template>
  <q-card class="q-pa-md"  style="width: 500px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h4">報價單搜尋</div>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.quono" outlined dense label="單號查詢"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.company" outlined dense label="客戶查詢"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.itemNo" outlined dense label="品名查詢"/>
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
// #region import block
import { useCustStore } from '@/composables/useCust';
import {
  QCard,
  QCardSection,
  QInput,
  QCardActions,
  QBtn,
} from 'quasar';
import {
  ref,
  defineEmits,
  defineProps,
} from 'vue';
// #endregion

// #region variable block
const param = ref({
  quono:'',
  company:'',
  itemNo:'',
});

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  list:{
    type:Array,
    default:()=>[]
  }
});
const emits = defineEmits(['update:showForm', 'update:list']);
const custStore = useCustStore();
const res = ref([]);
// #endregion

// #region function block
const query = async () =>{
  await custStore.queryQuotationList(param).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      res.value = data.data.resultList;
    }
    console.log('update list', res.value)
    emits('update:list', res.value);
    emits('update:showForm', false);
  });
}
const close = () =>{
  emits('update:showForm', false);
}
// #endregion
</script>
