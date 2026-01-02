<template>
<div>
  <q-table
    :columns="columns"
    :rows="[]"
    flat
    bordered
    virtual-scroll
    class="rounded-borders"
  >
  </q-table>
  <div class="row justify-start padding-top">
    <div class="padding-right">
      <q-btn color="primary" class="padding-right" glossy
        :loading="loading">
        新增產品規格
      </q-btn>
    </div>
    <div class="padding-right">
      <q-btn color="info"
             class="padding-right"
             glossy
            :loading="loading">修改產品規格</q-btn>
    </div>
    <div class="padding-right">
      <q-btn color="red" class="padding-right" glossy
        :loading="loading">刪除產品規格</q-btn>
    </div>
  </div>
  <LoadingComponent v-model="secondDialog"/>
</div>
</template>
<script setup>
import {
  QTable
  , QBtn
} from 'quasar'
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/composables/useProduct';
import LoadingComponent from '../LoadingComponent.vue'
const productStore = useProductStore();
const secondDialog = ref(false);
const productSpecList = ref([]);
const loading = ref(false);
const columns = ref([
    { name: 'specId', label: '規格ID', align: 'left', field: 'specId', sortable: true },
    { name: 'specName', label: '規格名稱', align: 'left', field: 'specName', sortable: true },
    { name: 'specValue', label: '規格值', align: 'left', field: 'specValue', sortable: true },
    { name: 'createUser', label: '建立人員', align: 'left', field: 'createUser', sortable: true },
    { name: 'createDate', label: '建立日期', align: 'left', field: 'createDate', sortable: true },
    { name: 'modifyUser', label: '修改人員', align: 'left', field: 'modifyUser', sortable: true },
    { name: 'modifyDate', label: '修改日期', align: 'left', field: 'modifyDate', sortable: true },
]);
onMounted(async () => {
  let res = await productStore.getAllProductSpecs();
  productSpecList.value = res;
});
</script>
