<template>
  <q-layout view="hHh Lpr fFf" class="container">
      <!-- 上方標題列 -->
      <q-header class="text-white">
        <q-toolbar class="banner">
          <div class="col">
            <q-btn @click="toggleLeftDrawer">
              <q-item-section avatar>
                <q-icon name="menu" size="lg" />
              </q-item-section>
            </q-btn>
          </div>
          <div class="col-3"></div>
          <div class="col-6">{{ theCompany?.公司名稱 }}</div>
          <div class="col-3"><h7>{{ Account?.accountName }}，你好!</h7>
          <q-btn flat color="blue" rounded @click="openChangePasswordForm"><h7>變更密碼</h7></q-btn>
          <q-btn flat rounded @click="logout"><h7>登出</h7></q-btn>
          </div>
        </q-toolbar>
      </q-header>

      <!-- 左側選單 -->
      <SideMenu v-model="leftDrawerOpen" />

      <!-- 主內容區 -->
      <q-page-container>
        <router-view />

        <q-footer elevated class="bg-grey-9 text-white footer">
          2025 &copy; 營運管理系統
        </q-footer>
      </q-page-container>
      <!--變更密碼表單-->
      <q-dialog v-model="showChangePasswordForm" persistent >
        <q-card  class="q-pa-md"  style="width: 400px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h4">變更密碼</div>
          </q-card-section>
          <q-form ref="myForm">
            <q-card-section>
              <div class="q-gutter-md" style="max-width: 400px">
                <q-input v-model="Account.accountName" label="登入者" outlined dense readonly />
              </div>
              <br>
              <div class="q-gutter-md" style="max-width: 400px">
                <q-input v-model="Account.password" label="原有密碼" type="password" outlined dense readonly />
              </div>
              <br>
              <div class="q-gutter-md" style="max-width: 400px">
                <q-input v-model="newPassword" label="新密碼" :type="isPwd ? 'password' : 'text'" outlined dense :rules="[val => !!val || '新密碼為必填欄位']">
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </q-input>
              </div>
              <div class="q-gutter-md" style="max-width: 400px">
                <q-input v-model="newPasswordConfirm" label="新密碼確認" :type="isPwdConfirm ? 'password' : 'text'" outlined dense :rules="[
                                                                                                          val => !!val || '新密碼確認為必填欄位',
                                                                                                          val => val === newPassword || '兩次輸入的密碼不一致'
                                                                                                        ]" >
                  <q-icon
                    :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwdConfirm = !isPwdConfirm"
                  />
                </q-input>
              </div>
            </q-card-section>
          </q-form>
          <q-card-actions align="right">
            <q-btn flat label="取消" color="negative" @click="closeForm" />
            <q-btn flat label="送出" color="primary" @click="handleOtherAction" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <LoadingComponent v-model="secondDialog" />
  </q-layout>
</template>

<script>
import {
  QLayout, QHeader, QToolbar, QBtn, QPageContainer,
  QItemSection, QIcon, SessionStorage, QFooter,QDialog,
  QCard,QCardSection,QCardActions,QInput,QForm,
} from 'quasar'
import { matMenu } from '@quasar/extras/material-icons'
import { onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import SideMenu from '../components/SideMenu.vue'
import { useCustStore } from '@/composables/useCust';
import { useUserStore } from '@/composables/useUser'
import LoadingComponent from '@/components/LoadingComponent.vue'

export default {
  name: 'MainLayout',
  components: {
    QLayout,
    QHeader,
    QToolbar,
    QBtn,
    QPageContainer,
    QItemSection,
    QIcon,
    SideMenu,
    QFooter,
    QDialog,
    QCard,QCardSection,QCardActions,QInput,QForm,LoadingComponent,
  },
  setup () {
    const Account = SessionStorage.getItem('Account')
    // Add debugging to identify problem callbacks
    const originalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class extends originalResizeObserver {
      constructor(callback) {
        super((entries, observer) => {
          console.log('ResizeObserver triggered:', entries.length, 'entries');
          entries.forEach(entry => {
            console.log('Element:', entry.target, 'Size:', entry.contentRect);
          });
          callback(entries, observer);
        });
      }
    };
    const router = useRouter()
    const isPwd = ref(true)
    const isPwdConfirm = ref(true)
    if (!Account) {
      router.push('/login')
    }
    const secondDialog = ref(false);
    const leftDrawerOpen = ref(true)
    const theCompany = ref({});
    const showChangePasswordForm = ref(false);
    const myForm = ref(null);
    const custStore = useCustStore();
    const userStore = useUserStore();
    const newPasswordConfirm = ref('');
    const newPassword = ref('');

    const handleOtherAction = async () => {
      const success = await myForm.value.validate()
      if (success) {
        submitForm();
      } else {
        return;
      }
    }

    onMounted(async () =>{
      await custStore.getUserCompany().then((data)=>{
        theCompany.value = data;
        isPwdConfirm.value = true;
        isPwd.value = true;
      })
    })

    const closeForm = () =>{
      showChangePasswordForm.value = false;
    }

    const submitForm = async () =>{
      secondDialog.value = true;
      await userStore.changePassword(Account.account, newPassword.value).then((data)=>{
        if (data.data.errorMessage){
          alert(data.data.errorMessage);
        } else {
          alert('變更完成!');
          Account.password = newPasswordConfirm.value;
          newPasswordConfirm.value = '';
          newPassword.value = '';
          isPwdConfirm.value = true;
          isPwd.value = true;
          closeForm();
        }
        secondDialog.value = false;
      });
    }

    const openChangePasswordForm = () =>{
      showChangePasswordForm.value = true;
    }

    function logout () {
      try {
        SessionStorage.removeItem('Account')
        // const router = useRouter();
        router.push('/login')
      } finally {
        // const router = useRouter();
        router.push('/login')
      }
    }

    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    return {
      theCompany,
      Account,
      leftDrawerOpen,
      toggleLeftDrawer,
      useRouter,
      matMenu,
      logout,
      // changePassword,
      openChangePasswordForm,
      showChangePasswordForm,
      submitForm,
      closeForm,
      myForm,
      handleOtherAction,
      newPasswordConfirm,
      newPassword,
      isPwd,
      isPwdConfirm,
    }
  },
}
</script>

<style>
.banner {
  background-color: #484745;
  height: 10vh;
  font-size: 3dvh;
}
.footer {
  background-color: #484745;
  height: 5vh;
  font-size: 3dvh;
}
.container {
  height: 100vh;
}
</style>
