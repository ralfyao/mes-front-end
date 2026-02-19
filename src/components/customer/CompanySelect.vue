<template>
  <div>
    <q-select
      :model-value="props.modelValue"
      :label="props.label"
      :options="props.companyList"
      :readonly="props.readonly"
      option-value="company"
      option-label="company"
      @update:model-value="updateValue"
      outlined
      dense
    />
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue';
import { QSelect } from 'quasar';
const props = defineProps({
  modelValue: String,
  label: String,
  readonly:Boolean,
  companyList:[],
})
const emits = defineEmits(['update:modelValue']);
function updateValue(val) {
  emits('update:modelValue', val)
}
</script>
