<template>
  <q-card class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
    <q-card-section class="row items-center">
      <div class="col">
        <div class="text-h6">銷售訂單明細</div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="識別碼"
                :rows="props.data"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table >
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="關閉" color="primary" @click="close" />
    </q-card-actions>
  </q-card>
</template>
<script setup>
// #region import block start
import { defineEmits,
defineProps,
 } from 'vue';
import { QCard,
QCardSection,
QCardActions,
QTable,
QBtn,
 } from 'quasar';
// #endregion import block end

// #region variable block start
const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});
const emit = defineEmits(['update:showForm']);
const columns = [
          { name: '單號', label: '單號', field: '單號', align: 'left' },
          { name: '日期', label: '日期', field: '日期', align: 'left' },
          { name: '產品編號', label: '產品編號', field: '產品編號', align: 'left' },
          { name: '品名規格', label: '品名規格', field: '品名規格', align: 'left' },
          { name: '數量1', label: '數量', field: '數量1', align: 'left' },
          { name: '單位', label: '單位', field: '單位', align: 'left' },
          { name: '單價1', label: '單價', field: '單價1', align: 'left' },
          { name: '金額1', label: '金額', field: '金額1', align: 'left' },
          { name: '專案序號', label: '專案序號', field: '專案序號', align: 'left' },
          { name: '建檔', label: '建檔', field: '建檔', align: 'left' },
          { name: 'quono', label: '報價單號', field: 'quono', align: 'left' },
        ];
// #endregion variable block end

// #region function block start
const close = () => {
  emit('update:showForm', false);
}
// #endregion function block end
</script>
