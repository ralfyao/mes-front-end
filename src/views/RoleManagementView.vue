<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
      <h5 class="text-left">
        <q-icon name="play_circle" size="30px" >角色權限列表</q-icon>
      </h5>
      <q-page-container>
        <q-page>
          <q-table :columns="columns"
                row-key="privilegeDesc"
                :rows="privRoles"
                flat
                bordered
                virtual-scroll
                selection="single"
                v-model:selected="selected"
                class="rounded-borders">
          </q-table>
          <div class="row justify-start padding-top">
            <div class="padding-right">
              <q-btn color="primary" class="padding-right"
                       glossy @click="openRoleDialog('新增')"
                       :loading="loading">新增角色</q-btn>
            </div>
            <div class="padding-right">
              <q-btn color="info" class="padding-right"
                       glossy @click="openRoleDialog('修改')"
                       :loading="loading">修改角色</q-btn>
            </div>
            <div class="padding-right">
              <q-btn color="red" class="padding-right"
                       glossy @click="deleteRole"
                       :loading="loading">刪除角色</q-btn>
            </div>
          </div>
          <h5 class="text-left text-red">{{ errorMessage }}</h5>
        </q-page>
      </q-page-container>
      <q-dialog v-model="showForm" persistent >
        <q-card class="q-pa-md"  style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h4">{{mode}}角色</div>
          </q-card-section>
          <q-card-section>
            <div class="q-gutter-md" style="max-width: 400px">
              <q-input v-model="form.roleName" ref="roleNameRef" :readonly="readonly" label="角色名稱" outlined dense :rules="[val => !!val || '角色名稱為必填欄位']"/>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="取消" color="negative" @click="showForm = false" />
            <q-btn label="送出" color="primary" @click="submitForm" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <LoadingComponent v-model="secondDialog"/>
  </q-layout>
</template>
<script setup>
import { QIcon
       , QLayout
       , QTable
       , QPageContainer
       , QBtn
       , QDialog
       , QCard
       , QCardSection
       , QCardActions
       , QInput
       , QPage} from 'quasar';
import { ref } from 'vue';
import { usePrivilegeStore } from '@/composables/usePrivileges';
import { onMounted } from 'vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useMenuStore } from '@/composables/useMenus';
const privRoles = ref([]);
const errorMessage = ref('');
const userPriv = usePrivilegeStore();
const menuStore = useMenuStore();
const selected = ref([]);
const privList = ref([]);
const roleNameRef = ref(null);
const readonly = ref(false);
const showForm = ref(false);
const form = ref({ roleName: '', privList:[] });
const secondDialog = ref(false);
const loading = ref(false);
const mode = ref('');
const columns = ref([
  { name: 'privilegeDesc', label: '角色名稱', align: 'left', field: 'privilegeDesc', sortable: true },
  { name: 'createUser', label: '建立人員', align: 'left', field: 'createUser', sortable: true },
  { name: 'createDate', label: '建立日期', align: 'left', field: 'createDate', sortable: true },
])

const openRoleDialog = async (type) => {
  mode.value = type;
  showForm.value = true;
  errorMessage.value = '';
  const res = await menuStore.getAllMenus();
  console.log('res', res);
  privList.value = res;
  if (type === '修改') {
    if (selected.value.length === 0) {
      console.log('No role selected for modification')
      errorMessage.value = '請選擇要修改的角色'
      showForm.value = false
      return;
    }
    readonly.value = true
    const role = selected.value[0]
    form.value.roleName = role.privilegeDesc
    // form.value.privList = user.accountName
    // form.value.password = user.password
  } else {
    readonly.value = false
    form.value.roleName = '';
    form.value.privList = [];

  }
}
const submitForm = () =>{

}
onMounted(async ()=>{
  const res = await userPriv.getAllPrivileges()
  privRoles.value = res
  console.log('.value', privRoles.value)
  // if (privRoles.value.length === 0)
  // {
  //   errorMessage.value = '沒有角色資料'
  // }
});
</script>
