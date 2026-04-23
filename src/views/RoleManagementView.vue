<template>
  <q-layout class="q-pa-md padding  q-gutter-sm border-rounded">
      <h5 class="text-left">
        <q-icon name="play_circle" size="30px" >角色權限列表</q-icon>
      </h5>
      <q-page-container>
        <q-page>
          <q-table  class="rounded-borders my-sticky-header-table"  :columns="columns"
                row-key="privilegeDesc"
                :rows="privRoles"
                flat
                bordered
                virtual-scroll
                selection="single"
                v-model:selected="selected"
                @selection="onSelection">
          </q-table >
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
      <!--新增修改角色-->
      <q-dialog v-model="showForm" persistent >
        <q-card class="q-pa-md"  style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h4">{{mode}}角色</div>
          </q-card-section>
          <q-card-section>
            <div class="q-gutter-md" style="max-width: 400px">
              <q-input v-model="form.roleName" ref="roleNameRef" :readonly="readonly" label="角色名稱" outlined dense :rules="[val => !!val || '角色名稱為必填欄位']"/>
            </div>
            <q-list padding bordered class="rounded-borders">
              <div v-for="menu in privList" :key="menu.menuID">
                <q-item v-if="menu.menuSubList.length == 0">
                  <q-item-section side>
                    <q-checkbox
                      :model-value="checkSelectedMenu(menu.menuID)"
                      @update:model-value="val => {
                        if (val) {
                          selectedMenu.push({ menuID: menu.menuID });
                        } else {
                          selectedMenu = selectedMenu.filter(item => item.menuID !== menu.menuID);
                        }
                        console.log('selectedMenu', selectedMenu);
                      }"
                    />
                  </q-item-section>
                  <q-item-section class="font-size-3dvh">
                    {{ menu.menuName }}
                  </q-item-section>
                </q-item>
                <q-expansion-item
                  v-if="menu.menuSubList?.length > 0"
                  default-opened
                  expand-separator>
                  <template v-slot:header>
                    <div class="row items-center">
                      <q-checkbox
                        :model-value="checkSelectedMenu(menu.menuID)"
                        @update:model-value="val => onMenuCheck(menu, val)"
                      />
                      <span class="q-ml-sm">{{ menu.menuName }}</span>
                    </div>
                  </template>

                  <q-item
                    v-for="menuSub in menu.menuSubList"
                    :key="menuSub.menuSubID"
                    clickable
                    class="bg-grey-2"
                    v-ripple
                  >

                      <div>
                        <div>&nbsp;</div>&nbsp;&nbsp;&nbsp;&nbsp;|___
                      </div>
                    <q-item-section side>
                      <q-checkbox
                        :model-value="checkSelectedSubMenu(menuSub.menuID, menuSub.menuSubID)"
                        @update:model-value="val => onSubMenuCheck(menu, menuSub, val)"
                      />
                    </q-item-section>
                    <q-item-section class="font-size-3dvh">
                      {{ menuSub.menuSubName }}
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
              </div>
            </q-list>
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
       , QList
       , QExpansionItem
       , QItem
       , QItemSection
       , QCheckbox
       , QPage,
  SessionStorage} from 'quasar';
import { ref } from 'vue';
import LoadingComponent from '../components/LoadingComponent.vue';
import { usePrivilegeStore } from '@/composables/usePrivileges';
import { onMounted } from 'vue';
import { useMenuStore } from '@/composables/useMenus';
const privRoles = ref([]);
const errorMessage = ref('');
const userPriv = usePrivilegeStore();
const menuStore = useMenuStore();
const selected = ref([]);
const selectedMenu = ref([]);
const selectedSub = ref([]);
const privList = ref([]);
const userPrivList = ref([]);
const roleNameRef = ref(null);
const readonly = ref(false);
const showForm = ref(false);
const form = ref({account:'', roleName: '', privList:[], selectedMenu:[], selectedSub:[] });
const secondDialog = ref(false);
const loading = ref(false);
const mode = ref('');
const columns = ref([
  { name: 'privilegeDesc', label: '角色名稱', align: 'left', field: 'privilegeDesc', sortable: true },
  { name: 'createUser', label: '建立人員', align: 'left', field: 'createUser', sortable: true },
  { name: 'createDate', label: '建立日期', align: 'left', field: 'createDate', sortable: true },
])

const checkSelectedMenu = (menuID) => {
  return selectedMenu.value.some(item => item.menuID === menuID);
}

const checkSelectedSubMenu = (menuID,menuSubID) => {
  console.log('檢查子選單是否已選擇:', menuID, menuSubID);
  console.log('目前選取的子選單:', selectedSub.value);
  return selectedSub.value.some(item => item.menuID == menuID && item.menuSubID === menuSubID);
}

function onSelection({ rows, added }) {
  if (added) {
    console.log('✅ 勾選:', rows[0].privilegeDesc)
  } else {
    console.log('❌ 取消勾選:', rows[0].privilegeDesc)
  }
  console.log('目前選取的角色:', selected.value)
}

function onMenuCheck(menu, val) {
  if (val) {
    // 勾選主選單
    if (!checkSelectedMenu(menu.menuID)) {
      selectedMenu.value.push({ menuID: menu.menuID })
    }

    // 勾選所有子選單
    if (menu.menuSubList?.length > 0) {
      menu.menuSubList.forEach(sub => {
        if (!checkSelectedSubMenu(menu.menuID, sub.menuSubID)) {
          selectedSub.value.push({
            menuID: menu.menuID,
            menuSubID: sub.menuSubID
          })
        }
      })
    }
  } else {
    // 取消主選單
    selectedMenu.value = selectedMenu.value.filter(
      item => item.menuID !== menu.menuID
    )

    // 取消所有子選單
    selectedSub.value = selectedSub.value.filter(
      item => item.menuID !== menu.menuID
    )
  }

  console.log('selectedMenu', selectedMenu)
  console.log('selectedSub', selectedSub)
}

function onSubMenuCheck(menu, menuSub, val) {
  if (val) {
    // 勾選子選單
    if (!checkSelectedSubMenu(menu.menuID, menuSub.menuSubID)) {
      selectedSub.value.push({
        menuID: menu.menuID,
        menuSubID: menuSub.menuSubID
      })
    }

    // 確保主選單也被勾選
    if (!checkSelectedMenu(menu.menuID)) {
      selectedMenu.value.push({ menuID: menu.menuID })
    }
  } else {
    // 取消子選單
    selectedSub.value = selectedSub.value.filter(
      item =>
        !(item.menuID === menu.menuID && item.menuSubID === menuSub.menuSubID)
    )

    // 檢查是否還有其他子選單被勾選，若無則取消主選單
    const stillSelected = selectedSub.value.some(
      item => item.menuID === menu.menuID
    )
    if (!stillSelected) {
      selectedMenu.value = selectedMenu.value.filter(
        item => item.menuID !== menu.menuID
      )
    }
  }

  console.log('selectedMenu', selectedMenu.value)
  console.log('selectedSub', selectedSub.value)
}


const deleteRole = async() =>{
  console.log('selected', selected.value[0].privilegeDesc);
  loading.value = true;
  secondDialog.value = true
  if (selected.value.length === 0) {
      console.log('No role selected for modification')
      errorMessage.value = '請選擇要刪除的角色'
      showForm.value = false
      return;
  }
  let result = confirm(`確定要刪除角色 ${selected.value[0].privilegeDesc} 嗎？`);
  if (result) {
    const msg = await userPriv.deleteRolePrivilege(selected.value[0].privilegeDesc);
    if (msg !== 'OK') {
      errorMessage.value = msg
    } else {
      alert('刪除成功');
    }
    const res = await userPriv.getAllPrivileges()
    privRoles.value = res
    console.log('.value', privRoles.value);
    selected.value = [];
  }
  loading.value = false;
  secondDialog.value = false
}
const openRoleDialog = async (type) => {
  mode.value = type;
  showForm.value = true;
  errorMessage.value = '';
  const res = await menuStore.getAllMenus();
  res.sort((a, b) => a.menuID - b.menuID);
  console.log('res', res);
  privList.value = res;
  selectedSub.value = [];
  selectedMenu.value = [];
  if (type === '修改') {
    if (selected.value.length === 0) {
      console.log('No role selected for modification')
      errorMessage.value = '請選擇要修改的角色'
      showForm.value = false
      return;
    }
    readonly.value = true
    const role = selected.value[0]
    const Account = SessionStorage.getItem('Account');
    form.value.roleName = role.privilegeDesc;
    form.value.account = Account.account;
    let res1 = await userPriv.getPrivMenuByRole(form.value.roleName );
    userPrivList.value = res1;
    console.log('userPrivList', userPrivList.value);
    userPrivList.value.forEach(x =>{
      selectedMenu.value.push({ menuID: x.menuID });
        if (selectedMenu.value.filter(y => y.menuID == x.menuID).length == 0) {
          selectedMenu.value.push({ menuID: x.menuID });
        }
        selectedSub.value.push({ menuID: x.menuID, menuSubID: x.menuSubID });
    });
  } else {
    selected.value = [];
    selectedMenu.value = [];
    selectedSub.value = [];
    readonly.value = false;
    form.value.roleName = '';
    form.value.selectedMenu = [];
    form.value.selectedSub = [];
  }
}
const submitForm = async () =>{
  // const res = await userPriv.saveRolePrivilege(form);
  const Account = SessionStorage.getItem('Account');
  form.value.account = Account.account;
  console.log('form', form);
  console.log('mode', mode.value);
  form.value.selectedMenu = selectedMenu.value;
  form.value.selectedSub = selectedSub.value;

  secondDialog.value = true
  loading.value = true;
  if (mode.value == '新增') {
    const msg = await userPriv.saveRolePrivilege(form);
    if (msg !== 'OK') {
      errorMessage.value = msg
    } else {
      alert(mode.value + '成功');
    }
  } else if (mode.value == '修改') {
    const msg = await userPriv.updateRolePrivilege(form)
    if (msg !== 'OK') {
      errorMessage.value = msg
    } else {
      alert(mode.value + '成功');
    }
    selected.value = [];
    loading.value = false;
  }
  secondDialog.value = false
  showForm.value = false;
  const res = await userPriv.getAllPrivileges()
  privRoles.value = res
  console.log('.value', privRoles.value);
}
onMounted(async ()=>{
  const res = await userPriv.getAllPrivileges()
  privRoles.value = res
  console.log('.value', privRoles.value);
});
</script>
