<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="text-left">
      <q-icon name="play_circle" size="30px" >客戶詢問函</q-icon>
    </h5>
    <q-page-container>
      <q-page>
        <q-table
                :columns="columns"
                row-key="識別"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                @selection="onSelection"
                class="rounded-borders"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table>
        <div class="row justify-start padding-top">
            <div class="padding-right">
              <q-btn color="primary" class="padding-right"
                       glossy @click="openCustomerDialog('新增')"
                       :loading="loading">新增詢問函</q-btn>
            </div>
            <div class="padding-right">
              <q-btn color="info" class="padding-right"
                       glossy @click="openCustomerDialog('修改')"
                       :loading="loading">修改詢問函</q-btn>
            </div>
            <div class="padding-right">
              <q-btn color="red" class="padding-right"
                       glossy @click="deleteCustomer"
                       :loading="loading">刪除詢問函</q-btn>
            </div>
        </div>
        <h5 class="text-left text-red">{{ errorMessage }}</h5>
      </q-page>
    </q-page-container>
    <q-dialog v-model="showForm" persistent >
    </q-dialog>
    <LoadingComponent v-model="secondDialog"/>
  </q-layout>
</template>
<script setup>
import {
    QIcon
  , QLayout
  , QPageContainer
  , QPage
  , QTable
  , QBtn

} from 'quasar';
import { ref, onMounted } from 'vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useCustStore } from '@/composables/useCust';
const custStore = useCustStore();
const columns =
[
  { name: 'rfqdate', label: '詢問函日期', align: 'left', field: 'rfqdate', sortable: true },
  { name: 'rfqno', label: '詢問函號', align: 'left', field: 'rfqno', sortable: true },
  { name: 'sales', label: '業務編號', align: 'left', field: 'sales', sortable: true },
  { name: 'company', label: '客戶地址', align: 'left', field: 'company', sortable: true },

];
const list = ref([]);
const errorMessage = ref('');
const selected = ref([]);
const openCustomerDialog = (mode) =>{
  console.log('Open Customer Dialog in mode:', mode);
  // 根據 mode 進行相應的操作，例如打開對話框或載入資料
  if (mode === '新增') {
    // 打開新增客戶的對話框
    console.log('Opening dialog for adding new customer');
  } else if (mode === '修改') {
    if (selected.value.length === 0) {
      errorMessage.value = '請先選擇要修改的詢問函';
      return;
    }
    errorMessage.value = '';
    // 打開修改詢問函的對話框，並載入選中的詢問函資料
    console.log('Opening dialog for editing customer:', selected.value);
  }
}
const deleteCustomer = () => {
  if (selected.value.length === 0) {
    errorMessage.value = '請先選擇要刪除的客戶';
    return;
  }
  errorMessage.value = '';
  console.log('Delete Sales Record:', selected.value);
}
const init = async () => {
  list.value = await custStore.getSalesRecordList();
  console.log('Fetched Sales Record List:', list.value);
}
onMounted( async () => {
  init();
});
</script>
