<template>
   <q-dialog v-model="secondDialog" persistent>
    <q-card
      class="flex flex-center"
      style="width: 300px; height: 150px; position: relative;"
    >
      <q-inner-loading showing label="處理中，請稍候..." />
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { QDialog, QCard, QInnerLoading } from 'quasar'

const props = defineProps({
  modelValue: { type: Boolean, required: true }
})
const emit = defineEmits(['update:modelValue'])

const secondDialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
