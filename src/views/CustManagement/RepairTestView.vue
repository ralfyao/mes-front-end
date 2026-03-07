<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="text-left">
        <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
    </h5>
  </q-layout>
</template>
<script setup>
// import block start
import {
    QIcon
  , QLayout
} from 'quasar';
import {
  ref
} from 'vue';
// import block end

// variable block start
const formName = ref('檢測維修');
// variable block end

// function block start
// function bloxk end
</script>
