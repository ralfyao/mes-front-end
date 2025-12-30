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
            virtual-scroll>
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
      <q-dialog v-model="showEditDialog" persistent >
        <q-card class="q-pa-md"  style="width: 500px; max-width: 80vw;">
            <q-card-section>
                <div class="text-h4">編輯使用者角色</div>
            </q-card-section>
            <q-card-section>
              <h5>使用者帳號：{{ selectedUser?.account }}</h5> <br/>
            </q-card-section>
            <q-card-section>
              <q-list padding bordered class="rounded-borders">
                <q-item v-for="role in roleList" :key="role.privilegeName">
                  <q-item-section>
                    <div class="row items-center">
                      <q-checkbox
                        class="q-mr-sm"
                        :model-value="chekSelected(role.privilegeDesc)"
                        @update:model-value="val => toggleRole(role.privilegeDesc, val)"
                      />
                      <span class="font-size-3dvh">
                        {{ role.privilegeDesc }}
                      </span>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="取消" color="primary" @click="closeWindow" v-close-popup />
                <q-btn flat label="保存" color="primary" />
            </q-card-actions>
        </q-card>
      </q-dialog>
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
  , QDialog
  , QCard
  , QCardSection
  , QCardActions
  , QList
  , QItemSection
  , QItem
  , QCheckbox
  } from 'quasar';
import {
  ref
  , onMounted
  } from 'vue';
import { useUserStore } from '@/composables/useUser';
import { usePrivilegeStore } from '@/composables/usePrivileges';
const columns = ref([
  { name: 'account', label: '帳號', align: 'left', field: 'account', sortable: true },
  { name: 'accountName', label: '帳號名稱', align: 'left', field: 'accountName', sortable: true },
  { name: 'createUser', label: '建立人員', align: 'left', field: 'lastModifier', sortable: true },
  { name: 'createDate', label: '建立日期', align: 'left', field: 'lastModifyDate', sortable: true },
  { name: 'actions', label: '操作', align: 'center' },
]);
const rows = ref([]);
const selectedUser = ref(null);
const roleList = ref([]);
const userRoleList = ref([]);
const userStore = useUserStore();
const userPriv = usePrivilegeStore();
const showEditDialog = ref(false);
const closeWindow = () => {
  showEditDialog.value = false;
};
const toggleRole = (privilegeDesc, checked) => {
  if (checked) {
    // 加入
    if (!chekSelected(privilegeDesc)) {
      userRoleList.value.push({ privilegeDesc });
    }
  } else {
    // 移除
    userRoleList.value = userRoleList.value.filter(
      role => role.privilegeDesc !== privilegeDesc
    );
  }
};
const onEdit = async (row) => {
  console.log('編輯使用者角色:', row);
  selectedUser.value = row;
  showEditDialog.value = true;
  const res = await userPriv.getAllPrivileges();
  roleList.value = res;
  const resUsrRole = await userPriv.getUserPrivileges(row.account);
  userRoleList.value = resUsrRole;
  // 在這裡添加編輯邏輯，例如打開一個對話框讓用戶修改角色
};
const chekSelected = (privilegeDesc) => {
  return userRoleList.value.some(
    (role) => role.privilegeDesc === privilegeDesc
  );
};
onMounted(async () => {
    rows.value = await userStore.getAllUsers();
  }
);
</script>
