<template>
  <q-card class="q-pa-md"  style="width: 500px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h4">客戶搜尋</div>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.company" outlined dense label="客戶全稱"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.companyAlias" outlined dense label="客戶簡稱"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.custNo" outlined dense label="客戶編號"/>
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
          <IndustryCodeSelect v-model:industrycode="param.industryCode"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.eqpType" outlined dense label="機台類別"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.custType" outlined dense label="型態分類"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.remark" outlined dense label="備註"/>
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
// import block start
import { useCustStore } from '@/composables/useCust';
import {
  QCard,
  QCardSection,
  QInput,
  QBtn,
  QCardActions,
  // QSelect,
} from 'quasar'
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import IndustryCodeSelect from './IndustryCodeSelect.vue';
import CountryCodeSelect from './CountryCodeSelect.vue';
// import block end

// variable block start
const custStore = useCustStore();
const countryList = ref([]);
// const countryname = ref('');
const param = ref({
  company:'',
  companyAlias:'',
  custNo:'',
  country:'',
  industryCode:'',
  eqpType:'',
  custType:'',
  remark:'',
})
const res = ref([]);
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
// variable block end

// function block start
const close = () =>{
  emits('update:showForm', false);
}
const query = async () =>{
  await custStore.getCustListByCondition(param).then((data)=>{
    res.value = data.data.resultList;
  });
  console.log('update list', res.value)
  emits('update:list', res.value);
  emits('update:showForm', false);
}
onMounted(async () => {
  param.value = {
    company:'',
    companyAlias:'',
    custNo:'',
    country:'',
    industryCode:'',
    eqpType:'',
    custType:'',
    remark:'',
  };
  await custStore.getCountryList().then((data)=>{
    countryList.value = data;
  })
});
// function block end
</script>
