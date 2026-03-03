<template>
  <q-select v-model="credibility" :readonly="readonly || preview" label="收款帳戶" outlined dense
  :options="bankList"  @update:model-value="getBankCode" emit-value map-options
          option-value="銀存編碼"
          option-label="銀存編碼">
    <template #before-options>
      <div class="row q-px-md q-py-sm bg-grey-3 text-weight-bold">
        <div class="col-2">銀存編碼</div>
        <div class="col-6">銀行名稱</div>
        <div class="col-4">帳號</div>
      </div>
      <q-separator />
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section class="col-2">
          {{ scope.opt.銀存編碼 }}
        </q-item-section>
        <q-item-section class="col-6">
          {{ scope.opt.銀行名稱 }}
        </q-item-section>
        <q-item-section class="col-4">
          {{ scope.opt.帳號 }}
        </q-item-section>
      </q-item>
    </template>
    <!-- 選中後顯示樣式 -->
    <template #selected-item="scope">
      {{ scope.opt.銀存編碼 }} - {{ scope.opt.銀行名稱 }} - {{ scope.opt.帳號 }}
    </template>
  </q-select>
</template>
<script setup>
// import block start
import { useCustStore } from '@/composables/useCust';
import
{
  QSelect,
  QItem,
  QItemSection,
  QSeparator,
} from 'quasar';
import { defineProps,
  onMounted,
  ref,
  defineEmits,
 } from 'vue'
// import block end

// variable block start
const credibility = ref('');
const props = defineProps({
  credibility:{
    type: [String, Object],
    default:()=>'',
  }
});
const emits = defineEmits(['update:credibility']);
const custStore = useCustStore();
const bankList = ref([]);
// variable block end

// function block start
const getBankCode = () =>{
  credibility.value = bankList.value.find((x) => x.銀存編碼 == (props.credibility?.銀存編碼 ? props.credibility?.銀存編碼 : props.credibility ));
  emits("update:credibility", credibility.value);
}
onMounted(async ()=>{
  console.log('props.credibility', props.credibility);
  bankList.value = await custStore.getBankList();
  getBankCode();
})
// function block end
</script>
