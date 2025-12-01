<template>
  <div></div>
</template>
<script setup >
// import { QList,
//         //  QItem,
//         //  QItemSection
//         } from 'quasar';
import { useMenuStore } from '@/composables/useMenus';
import { useUserStore } from '@/composables/useUser';
import { onMounted, ref } from 'vue';

const menuStore = useMenuStore();
const userStore = useUserStore();

const menuList = ref([]);
const userList = ref([]);

onMounted(async () =>{
  // await menuStore.getAllMenus().then(menus =>{
  //   menus.forEach(_menu=>{
  //     menuList.value.push(_menu);
  //   });
  // });
  userList.value = await userStore.getAllUsers();
  menuList.value = await menuStore.getAllMenus();
});
</script>
