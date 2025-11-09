<template>
  <q-layout view="hHh Lpr lFf">
    <!-- 上方標題列 -->
    <q-header class="text-white">
      <q-toolbar class="banner">
        <div class="col-1">
          <q-btn size="2" @click="toggleLeftDrawer">
            <q-item-section avatar>
              <q-icon :name="matMenu" />
            </q-item-section>
          </q-btn>
        </div>
        <div class="col-9">MES Dashboard</div>
        <div class="col-2">{{ Account.accountName }}，你好!</div>
      </q-toolbar>
    </q-header>

    <!-- 左側選單 -->
    <SideMenu v-model="leftDrawerOpen" />

    <!-- 主內容區 -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  QLayout, QHeader, QToolbar, QBtn, QPageContainer,
  QItemSection, QIcon, SessionStorage
} from 'quasar'
import { matMenu } from '@quasar/extras/material-icons'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SideMenu from '../components/SideMenu.vue'

export default {
  name: 'MainLayout',
  components: {
    QLayout, QHeader, QToolbar, QBtn, QPageContainer,
    QItemSection, QIcon, SideMenu
  },
  setup() {
    const Account = SessionStorage.getItem('Account')
    const leftDrawerOpen = ref(true)

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    return {
      Account,
      leftDrawerOpen,
      toggleLeftDrawer,
      useRouter,
      matMenu
    }
  }
}
</script>

<style>
.banner {
  background-color: #484745;
  height: 10vh;
  font-size: 3dvh;
}
</style>