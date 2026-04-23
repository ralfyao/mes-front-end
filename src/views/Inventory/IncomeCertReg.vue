<template>
  <!--#region 標頭及維護按鈕-->
  <div class="row justify-start">
    <div class="col-1 justify-start" style="max-width:150px">
      <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
    </div>
    <div class="col-11 justify-start" style="max-width:1350px">
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="primary" class="padding-right"
                glossy @click="openCustomerDialog('新增')"
                :loading="loading">新增進項憑證</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="info" class="padding-right"
                glossy @click="openCustomerDialog('修改')"
                :loading="loading">修改進項憑證</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="red" class="padding-right"
                  glossy @click="deleteCustomer"
                  :loading="loading">刪除進項憑證</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="green" class="padding-right"
                  glossy @click="openCustomerDialog('預覽')"
                    :loading="loading">進項憑證預覽</q-btn>&nbsp;
      <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="blue-6" class="padding-right"
                  glossy @click="openSearchForm"
                    :loading="loading">進項憑證查詢</q-btn>&nbsp;
    </div>
  </div>
  <div class="row justify-start">
    <div class="col-12 justify-start flex" style="max-width:1500px">
      <label class="text-h4"><font color=red>{{ errorMessage }}</font></label>
    </div>
  </div>
   <!--#endregion -->
</template>
<script setup>
// #region import
import {
  QIcon
  , QBtn
} from 'quasar';
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
// #endregion

// #region variable
const formName = ref('進項憑證');
const authStore = useAuth();
const hasAllAuth = authStore.hasAllAuth(formName.value);
// #endregion

// #region function
// #endregion

</script>
