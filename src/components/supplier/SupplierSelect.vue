<template>
  <q-select
    outlined dense
    v-model="supplierNo"
    :options="supplierList"
    option-value="廠商編號"
    option-label="廠商編號"
    label="廠商編號"
    :readonly="preview"
    @update:model-value="onSelection"
    emit-value map-options
  >
  </q-select>
  <q-icon name="search" size="30px" v-if="!preview" @click="openSearchSupplierNoForm" class="cursor-pointer"></q-icon>
  <q-dialog v-model="showSearchSupplierNoForm" perisitent>
    <SupplierListQueryView v-model:supplierNo="supplierNo" v-model:showForm="showSearchSupplierNoForm" />
  </q-dialog>
  <label class="text-h5"><font color=red>廠商全稱: {{ supplierName }}</font></label>
</template>
<script setup>
//#region import
import { useSupplierStore } from '@/composables/useSupplier';
import {
  QSelect,
  QIcon,
  QDialog,
} from 'quasar';
import { defineProps,
  onMounted,
  ref,
  defineEmits,
  watch,
 } from 'vue';
 import SupplierListQueryView from '@/components/supplier/query/SupplierListQueryView.vue';
//#endregion

//#region veriable
const supplierStore = useSupplierStore();
const props = defineProps({
  supplierNo:{
    type: String,
    default: ''
  },
  preview:{
    type: Boolean,
    default: false
  }
});
const preview = ref(false);
const supplierNo = ref('');
const supplierName = ref('');
const supplierList = ref([]);
const emit = defineEmits(['update:supplierNo'])
const showSearchSupplierNoForm = ref(false);
//#endregion

//#region function
onMounted(async () => {
  console.log('props.supplierNo', props.supplierNo);
  await supplierStore.getAllSupplierList().then((data) => {
    console.log('getAllSupplierList response:', data);
    supplierList.value =  data;
    supplierNo.value = props.supplierNo;
    preview.value = props.preview;
  }).catch((error) => {
    console.error('getAllSupplierList error:', error);
    supplierList.value = [];
  });
  console.log('supplierList', supplierList.value);
});

const onSelection = (value) => {
  supplierNo.value = value;
  console.log('Selected supplierNo:', supplierNo.value);
  // 在這裡可以進行其他操作，例如發出事件或更新父組件的資料
  emit('update:supplierNo', supplierNo.value); // 如果需要向父組件傳遞選擇的值，可以使用 emit
};

const openSearchSupplierNoForm = () => {
  showSearchSupplierNoForm.value = true;
}

watch(() => supplierNo.value, async (newVal) => {
  await supplierStore.querySupplier({ supplierNo: newVal }).then(response => {
    console.log('Query response:', response);
    if (response.length > 0) {// 假設 response 是一個包含廠商資料的陣列
      supplierName.value = response[0].廠商名稱;
      emit('update:supplierNo', newVal); // 向父組件傳遞選擇的廠商編號
    } else {
      supplierName.value = '';
    }
  }).catch(error => {
    console.error('Query error:', error);
    supplierList.value = [];
  });
  // supplierNo.value = newVal;
});
//#endregion
</script>
