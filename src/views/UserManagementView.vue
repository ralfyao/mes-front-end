<template>
    <!-- <q-page class="q-pa-md"> -->
    <q-layout class="q-pa-md padding  q-gutter-sm">
        <h5 class="text-left">
            <q-icon name="play_circle" size="30px" >使用者列表</q-icon>
        </h5>
        <q-page-container>
            <q-page>
            <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="account"
                :rows="userList"
                flat
                bordered
                virtual-scroll
                selection="single"
                v-model:selected="selected"
            ></q-table >
            <div class="row justify-start padding-top">
                <div class="padding-right">
                <q-btn color="primary" class="padding-right"
                       glossy @click="openUserDialog('新增')"
                       :loading="loading">新增使用者</q-btn>
                </div>
                <div class="padding-right">
                 <q-btn color="info" class="padding-right"
                       glossy @click="openUserDialog('修改')"
                       :loading="loading">修改使用者</q-btn>
                </div>
                <q-btn color="red" class="padding-right"
                       glossy @click="deleteUser"
                       :loading="loading">刪除使用者</q-btn>
            </div>
            <h5 class="text-left text-red">{{ errorMessage }}</h5>
            </q-page>
        </q-page-container>
        <!-- 新增/修改使用者的頁面 -->
        <q-dialog v-model="showForm" persistent >
            <q-card class="q-pa-md"  style="width: 700px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h4">{{mode}}使用者</div>
                </q-card-section>

                <q-card-section>
                <div class="q-gutter-md" style="max-width: 400px">
                    <q-input v-model="form.account" ref="accountRef" :readonly="readonly" label="帳號" outlined dense :rules="[val => !!val || '帳號為必填欄位']"/>
                    <q-input v-model="form.name" ref="nameRef" label="姓名" outlined dense :rules="[val => !!val || '姓名為必填欄位']"/>
                    <q-input v-model="form.password" ref="passwordRef" :type="isPwd ? 'password' : 'text'" label="密碼" outlined dense :rules="[val => !!val || '密碼為必填欄位']">
                        <template v-slot:append>
                            <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                            />
                        </template>
                    </q-input>
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
    <!-- </q-page> -->
</template>
<script setup>
import {
  QIcon
  , QLayout
  , QPageContainer
  , QPage
  , QTable
  , QBtn
  , QDialog
  , QCard
  , QCardSection
  , QCardActions
  // , QInnerLoading
  , QInput,
  SessionStorage
} from 'quasar'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/composables/useUser.js'
import LoadingComponent from '@/components/LoadingComponent.vue'
// 定義變數
const errorMessage = ref('')
const userList = ref([])
const userStore = useUserStore()
const accountRef = ref(null)
const nameRef = ref(null)
const passwordRef = ref(null)

const secondDialog = ref(false)
const selected = ref([])
const readonly = ref(false)
const isPwd = ref(true)
// const $q = useQuasar();
const loading = ref(false)
const columns = ref([
  { name: 'account', label: '帳號', align: 'left', field: 'account', sortable: true },
  { name: 'accountName', label: '使用者名稱', align: 'left', field: 'accountName', sortable: true },
  { name: 'lastModifier', label: '修改人員', align: 'left', field: 'lastModifier', sortable: true },
  { name: 'lastModifyDate', label: '修改日期', align: 'left', field: 'lastModifyDate', sortable: true }
])
const mode = ref('')
const showForm = ref(false)
const form = ref({ account: '', accountName: '', name: '', password: '', lastModifier: '' })
const modifier = SessionStorage.getItem('Account').account
// 刪除使用者
const deleteUser = async () => {
  if (selected.value.length === 0) {
    errorMessage.value = '請選擇要刪除的使用者'
    return
  }
  errorMessage.value = ''
  if (!confirm(`確定要刪除使用者 ${selected.value[0].account} 嗎？`)) {
    return
  }
  loading.value = true
  const userDel = {
    username: selected.value[0].account,
    password: selected.value[0].password,
    name: selected.value[0].accountName == null ? '' : selected.value[0].accountName,
    lastModifier: modifier
  }
  userStore.delUser(userDel).then(async (msg) => {
    if (msg !== 'OK') {
      errorMessage.value = msg
    } else {
      errorMessage.value = ''
      userList.value = await userStore.getAllUsers()
      selected.value = []
    }
    loading.value = false
  })
}
// 開啟新增或修改使用者的對話框
const openUserDialog = (type) => {
  mode.value = type
  showForm.value = true
  console.log('selected value:', selected.value)
  errorMessage.value = ''
  if (type === '修改') {
    if (selected.value.length === 0) {
      console.log('No user selected for modification')
      errorMessage.value = '請選擇要修改的使用者'
      showForm.value = false
      return
    }
    readonly.value = true
    const user = selected.value[0]
    form.value.account = user.account
    form.value.name = user.accountName
    form.value.password = user.password
  } else {
    readonly.value = false
    form.value.account = ''
    form.value.name = ''
    form.value.password = ''
  }
}
// 送出新增或修改使用者的表單
async function submitForm () {
  console.log('送出資料：', form.value)
  console.log('userStore', userStore)
  console.log('typeof addUser', typeof userStore.addUser)
  nameRef.value.validate()
  accountRef.value.validate()
  passwordRef.value.validate()
  if (nameRef.value.hasError || accountRef.value.hasError || passwordRef.value.hasError) {
    return
  }
  loading.value = true
  secondDialog.value = true
  const user = {
    username: form.value.account,
    password: form.value.password,
    name: form.value.name,
    lastModifier: modifier
  }
  if (mode.value == '新增') {
    const msg = await userStore.addUser(user)
    if (msg !== 'OK') {
      errorMessage.value = msg
    } else {
      errorMessage.value = ''
    }
  } else if (mode.value == '修改') {
    const msg = await userStore.updateUser(user)
    if (msg !== 'OK') {
      errorMessage.value = msg
    } else {
      errorMessage.value = ''
    }
  }
  loading.value = false
  secondDialog.value = false
  userList.value = await userStore.getAllUsers()
  selected.value = []
  showForm.value = false
}
// initial data fetch
onMounted(async () => {
  userList.value = await userStore.getAllUsers()
  console.log('userList Value:', userList.value)
  if (userList.value.length === 0) {
    errorMessage.value = '沒有使用者資料'
  }
  console.log('userList:', userList.value)
})
</script>
<style lang="css">
.padding{
    padding: 20px;
}
.padding-top{
    padding-top: 20px;
}
.padding-right{
    padding-right: 20px;
}
</style>
