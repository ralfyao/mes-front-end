<template>
  <q-card class="q-pa-md"  style="width: 500px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h4">訂單搜尋</div>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.company" outlined dense label="客戶查詢"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <CountryCodeSelect v-model:country="param.country"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.itemNo" outlined dense label="品號查詢"/>
        </div>
      </div>
      <br>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="查詢" color="positive" @click="query()" />
      <q-btn flat label="EXIT" color="negative" @click="close()" />
    </q-card-actions>
  </q-card>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region ----------------------------import block---------------------------------
import {
  QCard,
  QBtn,
  QCardSection,
  QCardActions,
  QInput,
} from 'quasar'
import {
  ref,defineProps, defineEmits,
} from 'vue'
import CountryCodeSelect from '../CountryCodeSelect.vue';
import { useCustStore } from '@/composables/useCust';
import LoadingComponent from '@/components/LoadingComponent.vue';
// #endregion ----------------------------import block---------------------------------

// #region ----------------------------variable block---------------------------------
const param = ref({
  company:'',
  country:'',
  itemNo:'',
})
const secondDialog = ref(false);
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
const emits = defineEmits(['update:showForm', 'update:list'])
const custStore = useCustStore();
const res = ref([]);
// #endregion ----------------------------variable block---------------------------------

// #region ----------------------------function block---------------------------------
const query = async () =>{

  await custStore.querySalesOrderByCondition(param).then((data)=>{
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
// #endregion ----------------------------function block---------------------------------
</script>
