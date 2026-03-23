<template>
  <q-select :readonly="props.readonly" v-model="sales" label="工號" outlined dense
                        :options="salesList"
                        option-value="工號"
                        option-label="工號" @update:model-value="changeSalesName"
                        :rules="[val =>   !!val || '業務編號為必填欄位']"
                        emit-value
                        map-options
                      />
  <label class="text-red text-center" style=" font-size: 24px;">
    {{ salesName }}
  </label>
</template>
<script setup>
// #region import
import { useCustStore } from '@/composables/useCust';
import {ref,
  defineProps,
  onMounted,defineEmits,
} from 'vue';
import {QSelect,
} from 'quasar'
// #endregion

// #region variable
const salesList = ref([]);
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  readonly:{
    type:Boolean,
    default:()=>false,
  },
  sales:{
    type:String,
    default:()=>'',
  }
})
const sales = ref('');
const salesName = ref('');
const custStore = useCustStore();
const emits = defineEmits(['update:sales']);
// #endregion

// #region function
const changeSalesName = () => {
  console.log('業務人員',sales.value)
  console.log('sales no',sales.value)
  emits('update:sales', sales.value)
  console.log('salesList',salesList.value)
  salesName.value = salesList.value.find(asales => asales.工號 == sales.value)
        ?salesList.value.find(asales => asales.工號 == sales.value).姓名
        :'';
  console.log('name:', salesName.value )
}
onMounted(()=>{
  custStore.getSalesList().then((data)=>{
    salesList.value = data;
  })
})
// #endregion
</script>
