<template>
  <q-drawer v-model="drawer" side="left" bordered class="drawer">
        <q-list padding bordered class="rounded-borders">
            <div v-for="menu in menuList" :key="menu.menuID">
                <q-item v-if="menu.menuSubList.length == 0" clickable v-ripple @click="goTo(`${menu.menuUrl}`)">
                    <q-icon :name="menu.menuIcon" size="md" />
                    <q-item-section class="font-size-3dvh">{{ menu.menuName }}</q-item-section>
                </q-item>
                <q-expansion-item
                  v-if="menu.menuSubList && menu.menuSubList.length > 0"
                  :label="menu.menuName"
                  :icon="menu.menuIcon"
                  expand-separator
                  class="font-size-3dvh"
                >
                  <q-item
                    v-for="menuSub in menu.menuSubList"
                    clickable
                    v-ripple
                    @click="goTo(menuSub.menuSubUrl)"
                    :key="menuSub.menuSubID"
                  >
                    <q-item-section class="font-size-3dvh">
                      {{ menuSub.menuSubName }}
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
            </div>
        </q-list>
  </q-drawer>
</template>

<script setup>
import { computed, defineProps, defineEmits, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/composables/useMenus';
import { QDrawer, QList, QItem, QItemSection, 
  QExpansionItem, 
  SessionStorage,
  QIcon } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])
const menuList = ref([]);

onMounted(async () => {
  // You can add any setup logic here if needed
  const menuStore = useMenuStore();
  const account = SessionStorage.getItem('Account');
  console.log('account in SideMenu:', account);
  await menuStore.getMenus(account.account).then(menus => {
    console.log('menus in SideMenu:', menus);
    menus.forEach(menu => {
      menuList.value.push(menu);
    });
  });
})

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
.font-size-3dvh {
  font-size: 3dvh;
}

.title {
  font-size: 3dvh;
  display: flex;
  align-items: center;
}
/* 讓 q-expansion-item 的 header 內容垂直置中 */
.q-expansion-item__container > .q-item {
  align-items: center !important;
}

/* 如果還想讓箭頭與文字靠得更近一點，可加這行 */
.q-expansion-item__toggle-icon {
  margin-top: 0 !important;
}
</style>
