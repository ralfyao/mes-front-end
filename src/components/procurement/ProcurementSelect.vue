<template>
  <q-select outlined dense
            :readonly="preview"
            v-model="procurementor"
            :options="procurementorList || []"
            option-value="工號"
            option-label="姓名"
            label="採購人員"
            emit-value
            map-options
            @update:model-value="val => emits('update:procurementor', val)">
  </q-select>
</template>
<script setup>
// #region import
import { QSelect } from 'quasar';
import { ref, onMounted, defineEmits, defineProps } from 'vue';
import { usePurchaseStore } from '@/composables/usePurchase';
// #endregion

//#region variable
const purchaseStore = usePurchaseStore();
const procurementor = ref('');
const procurementorList = ref([]);
const emits = defineEmits(['update:procurementor']);
const props = defineProps({
  preview: {
    type: Boolean,
    default: () => false,
  },
  procurementor: {
    type: String,
    default: '',
  },
});
const preview = ref(false);
//#endregion

//#region function
onMounted(async () => {
  await purchaseStore.getProcurementorList().then((data) => {
    console.log('procurementorList', data);
    procurementorList.value = data;
    procurementor.value = props.procurementor;
    preview.value = props.preview;
  });
});
//#endregion
</script>
