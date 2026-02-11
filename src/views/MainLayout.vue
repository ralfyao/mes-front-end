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
          <div class="col-9">Dashboard</div>
          <div class="col-2">{{ Account?.accountName }}，你好!
          <q-btn flat rounded @click="logout"><h6>登出</h6></q-btn>
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
  </q-layout>
</template>

<script>
import {
  QLayout, QHeader, QToolbar, QBtn, QPageContainer,
  QItemSection, QIcon, SessionStorage, QFooter
} from 'quasar'
import { matMenu } from '@quasar/extras/material-icons'
import { ref} from 'vue'
import { useRouter } from 'vue-router'
import SideMenu from '../components/SideMenu.vue'

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
    QFooter
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
    if (!Account) {
      router.push('/login')
    }
    const leftDrawerOpen = ref(true)

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
      Account,
      leftDrawerOpen,
      toggleLeftDrawer,
      useRouter,
      matMenu,
      logout
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
  overflow: hidden;
}
</style>
