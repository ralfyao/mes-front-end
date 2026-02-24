<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >其他收入</q-icon>
        </div>
        <div class="padding-right">
          <q-btn color="primary" class="padding-right"
            glossy @click="openARDialog('新增')"
            :loading="loading">新增其他收入</q-btn>
        </div>
        <div class="padding-right">
          <q-btn color="info" class="padding-right"
            glossy @click="openARDialog('修改')"
            :loading="loading">修改其他收入</q-btn>
        </div>
        <div class="padding-right">
            <q-btn color="red" class="padding-right"
              glossy @click="deleteAR"
              :loading="loading">刪除其他收入</q-btn>
        </div>
        <div class="padding-right">
          <q-btn color="green" class="padding-right"
              glossy @click="openARDialog('預覽')"
                :loading="loading">其他收入預覽</q-btn>
        </div>
      </div>
      <div class="row justify-start padding-top">
        <div class="col-6 col-md-6"  style="max-width: 500px">
          <div class="text-left text-red">{{ errorMessage }}</div>
        </div>
      </div>
    </h5>
  </q-layout>
</template>
<script setup>
// import block start
import {
  QLayout,
  QIcon,
  QBtn,
} from 'quasar';
import { ref } from 'vue';
// import block end

// variable block start
const errorMessage = ref('');
// variable block end

// function block start
const openARDialog = (type) =>{
  console.log(type);
}
// function block end
</script>
