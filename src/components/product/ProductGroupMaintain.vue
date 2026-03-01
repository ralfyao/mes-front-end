<template>
<div>
  <q-table  class="rounded-borders my-sticky-header-table"
    :columns="columns"
    :rows="[]"
    flat
    bordered
    virtual-scroll
    class="rounded-borders"
  >
  </q-table >
  <div class="row justify-start padding-top">
    <div class="padding-right">
      <q-btn color="primary" class="padding-right" glossy
        :loading="loading">
        新增產品群組
      </q-btn>
    </div>
    <div class="padding-right">
      <q-btn color="info"
             class="padding-right"
             glossy
            :loading="loading">修改產品群組</q-btn>
    </div>
    <div class="padding-right">
      <q-btn color="red" class="padding-right" glossy
        :loading="loading">刪除產品群組</q-btn>
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
import { ref } from 'vue'
import LoadingComponent from '../LoadingComponent.vue'
const secondDialog = ref(false);
const columns = ref([
    { name: 'groupId', label: '群組ID', align: 'left', field: 'groupId', sortable: true },
    { name: 'groupName', label: '群組名稱', align: 'left', field: 'groupName', sortable: true },
    { name: 'description', label: '描述', align: 'left', field: 'description', sortable: true },
    { name: 'createUser', label: '建立人員', align: 'left', field: 'createUser', sortable: true },
    { name: 'createDate', label: '建立日期', align: 'left', field: 'createDate', sortable: true },
    { name: 'modifyUser', label: '修改人員', align: 'left', field: 'modifyUser', sortable: true },
    { name: 'modifyDate', label: '修改日期', align: 'left', field: 'modifyDate', sortable: true },
]);
</script>
