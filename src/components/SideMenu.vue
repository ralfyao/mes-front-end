<template>
  <q-drawer v-model="drawer" side="left" bordered class="drawer">
    <q-list>
      <q-item clickable v-ripple @click="goTo('/dashboard')">
        <q-item-section class="title">主頁面</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="goTo('/report')">
        <q-item-section class="title">報表設定</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="goTo('/setting')">
        <q-item-section class="title">系統設定</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { QDrawer, QList, QItem, QItemSection } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])

const drawer = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const router = useRouter()
function goTo(path) {
  router.push(path)
}
</script>

<style scoped>
.drawer {
  background-color: #E9E9E9;
}
.title {
  font-size: 3dvh;
}
</style>
