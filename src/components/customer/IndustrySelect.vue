<template>
  <div>
    <q-select
      :model-value="props.modelValue"
      :label="props.label"
      :options="props.industryList"
      option-value="中分類碼"
      option-label="中分類碼"
      @update:model-value="updateValue"
      outlined
      dense
    />
    <label class="text-red text-center" style=" font-size: 24px;">
      {{ industry }}
    </label>
  </div>
</template>
<script setup>
import { defineProps, defineEmits,   computed  } from 'vue';
import { QSelect } from 'quasar';
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  industryList: {
    type: Array,
    default: () => []
  }
});
const industry =  computed(() => {
  const found = props.industryList?.find(
    item => item.中分類碼 === props.modelValue
  )
  return found?.中分類名稱 || ''
})
const emits = defineEmits(['update:modelValue']);
function updateValue(val) {
  // console.log('Selected industry code:', val);
  emits('update:modelValue', val)
  const industryItem = props.industryList.find(item => item.中分類碼 === val.中分類碼);
  // console.log('Found industry item:', industryItem, '中分類名稱', industryItem?.中分類名稱);
  industry.value =  industryItem ? industryItem.中分類名稱 : '';
  // console.log('Selected industry name:', industry.value);
}
</script>
