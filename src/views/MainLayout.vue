<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="text-white banner">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>MES Dashboard</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- 將 Menu 抽成 Component -->
    <Menu v-model="leftDrawerOpen" @navigate="goTo" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Menu from '@/components/Menu.vue'

const router = useRouter()
const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function goTo(path) {
  router.push(path)
}
</script>

<style>
.banner {
  background-color: #484745;
  height: 10vh;
}
</style>