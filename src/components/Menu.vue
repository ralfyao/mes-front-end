<template>
  <q-drawer v-model="modelValue" bordered class="drawer">
    <q-list>
      <q-expansion-item icon="assessment" label="報表管理">
        <q-item clickable v-ripple @click="handleClick('/report/daily')">
          <q-item-section avatar><q-icon name="insert_chart" /></q-item-section>
          <q-item-section>每日報表</q-item-section>
        </q-item>
      </q-expansion-item>

      <q-item clickable v-ripple @click="handleClick('/dashboard')">
        <q-item-section avatar><q-icon name="home" /></q-item-section>
        <q-item-section>主頁面</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
// ✅ 定義 props，讓 v-model 正常運作
defineProps({
  modelValue: { type: Boolean, required: true }
})

// ✅ 定義 emits
const emit = defineEmits(['update:modelValue', 'navigate'])

// ✅ 使用函式名稱 "handleClick"（與 ESLint 錯誤不同）
function handleClick(path) {
  emit('navigate', path)
  emit('update:modelValue', false) // 點擊後關閉 Drawer
}
</script>

<style>
.drawer {
  background-color: #e9e9e9;
}
</style>
