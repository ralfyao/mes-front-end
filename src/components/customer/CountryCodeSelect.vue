<template>
  <q-select v-model="country" style="max-width: 500px" :readonly="readonly || preview" label="國別" outlined dense
    :options="countryList"
    option-value="code"
    option-label="國別"
    @update:model-value="getCountryName"
  >
  </q-select>
  <label class="text-red text-center" style=" font-size: 24px;">
    {{ countryname }}
  </label>
</template>
<script setup>
// import block start
import { useCustStore } from '@/composables/useCust';
import {
  QSelect,
} from 'quasar'
import {
  ref,
  onMounted,
  defineProps,
  defineEmits
} from 'vue'
// import block end

// variable block start
const custStore = useCustStore();
const country = ref('');
const countryname = ref('');
const countryList = ref([]);
const props =  defineProps({
  country:{
    type:[String, Object],
    default:()=>'',
  },
  readonly:{
    type:Boolean,
    default:false,
  },
});
const emits = defineEmits(['update:country']);
// variable block end

// function block start
const getCountryName = (acountry) =>{
  console.log('country', acountry);
  country.value = countryList.value.find(x => (x?.國別??'') === (acountry?.國別 ? acountry?.國別.trim() :  acountry?.trim()))
  console.log('country.value', country?.value );
  countryname.value = (country.value?.code? country.value?.code : country?.value);
  emits("update:country", country.value);
}
onMounted(async ()=>{
  await custStore.getCountryList().then((data)=>{
    countryList.value = data;
    getCountryName(props.country);
  })
})
// function block end
</script>
