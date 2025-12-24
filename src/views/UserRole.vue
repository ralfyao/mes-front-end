<template>
    <q-layout class="q-pa-md padding  q-gutter-sm">
      <h5 class="text-left">
        <q-icon name="play_circle" size="30px" >使用者角色列表</q-icon>
      </h5>
      <q-page-container>
        <q-page>
          <q-table
            :columns="columns"
            :rows="rows"
            flat
            bordered
            virtual-scroll
            selection="single">
            <!-- 操作欄 -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-xs">
                <q-btn
                  label="編輯"
                  color="primary"
                  size="md"
                  dense
                  @click="onEdit(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-page>
      </q-page-container>
    </q-layout>
</template>
<script setup>
import {
  QLayout
  , QPageContainer
  , QPage
  , QIcon
  , QTable
  , QTd
  , QBtn
  } from 'quasar';
import {
  ref
  , onMounted
  } from 'vue';
import { useUserStore } from '@/composables/useUser';
const columns = ref([
  { name: 'account', label: '帳號', align: 'left', field: 'account', sortable: true },
  { name: 'accountName', label: '帳號名稱', align: 'left', field: 'accountName', sortable: true },
  { name: 'createUser', label: '建立人員', align: 'left', field: 'lastModifier', sortable: true },
  { name: 'createDate', label: '建立日期', align: 'left', field: 'lastModifyDate', sortable: true },
  { name: 'actions', label: '操作', align: 'center' },
]);
const rows = ref([]);
const userStore = useUserStore();
onMounted(async () => {
  rows.value = await userStore.getAllUsers();
  // 模擬從 API 獲取資料
  // rows.value = [
  //   { account: 'user1', privilegeDesc: '管理員', createUser: 'admin', createDate: '2024-01-01' },
  //   { account: 'user2', privilegeDesc: '一般使用者', createUser: 'admin', createDate: '2024-01-02' },
  //   { account: 'user3', privilegeDesc: '訪客', createUser: 'admin', createDate: '2024-01-03' },
  // ];
  }
);
</script>
