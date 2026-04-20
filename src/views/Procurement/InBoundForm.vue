<template>
  <!--#region 標頭及維護按鈕-->
    <div class="row justify-start">
      <div class="col-1 justify-start" style="max-width:150px">
        <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
      </div>
      <div class="col-11 justify-start" style="max-width:1350px">
        <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="primary" class="padding-right"
                glossy @click="openCustomerDialog('新增')"
                :loading="loading">新增進貨單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="info" class="padding-right"
                glossy @click="openCustomerDialog('修改')"
                :loading="loading">修改進貨單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="red" class="padding-right"
                  glossy @click="deleteCustomer"
                  :loading="loading">刪除進貨單</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="green" class="padding-right"
                  glossy @click="openCustomerDialog('預覽')"
                    :loading="loading">進貨單預覽</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="blue-6" class="padding-right"
                  glossy @click="openSearchForm"
                    :loading="loading">進貨單查詢</q-btn>&nbsp;
      </div>
    </div>
  <!--#endregion -->
</template>
<script setup>
// #region import
import {
  QIcon,
  QBtn,
//   QCard,
} from 'quasar';
import {
  ref
} from 'vue';
import { useAuth } from '@/composables/useAuth';
// #endregion

// #region variable
const formName = "採購作業";
// eslint-disable-next-line no-unused-vars
const mode = ref('');
const authStore = useAuth();
const hasAllAuth = authStore.hasAllAuth(formName);
const auth = authStore.getAuth(formName);
// import { }
// #endregion

// #region function
const openCustomerDialog = (type) =>{
  console.log(type);
}
// #endregion
</script>
