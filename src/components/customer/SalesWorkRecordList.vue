<template>
  <div>
  <hr>
  <h6>詢問函追蹤記錄</h6>
  <div v-for="item in props.workRecordList" :key="item.識別碼">
    <div class="row q-col-gutter-md">
      <div class="col-2 col-md-2" style="max-width: 200px">
        <q-input v-model="item.工作日期" label="聯絡日期" :readonly="true" outlined dense></q-input>
      </div>
      <div class="col-2 col-md-2" style="max-width: 200px">
        <q-input v-model="item.工作簡述" label="內容簡述" :readonly="true" outlined dense></q-input>
      </div>
      <div class="col-3 col-md-3" style="max-width: 200px">
        <q-input v-model="item.預計再訪" label="預計再訪" :readonly="true" outlined dense></q-input>
      </div>
      <div class="col-3 col-md-3" style="max-width: 200px">
        <q-input v-model="item.姓名" label="業務" :readonly="true" outlined dense></q-input>
      </div>
      <div class="col-2 col-md-2" style="max-width: 200px">
        <q-input v-model="item.員工編號" label="工號" :readonly="true" outlined dense></q-input>
      </div>
    </div>
  </div>
  </div>
</template>
<script setup>
import { QInput } from 'quasar';
import { defineProps } from 'vue'
const props = defineProps({
  workRecordList:{
    type:Array,
    default:() => []
  }
})
</script>
