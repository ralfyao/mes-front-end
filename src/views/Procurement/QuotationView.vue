<template>
  <!--#region 表頭-->
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.編修))">
            <!-- <div class="padding-right"> -->
              <q-btn color="primary" class="padding-right"
                glossy @click="openDialog('新增')"
                  :loading="loading">新增{{ formName }}</q-btn>&nbsp;
            <!-- </div> -->
            <!-- <div class="padding-right"> -->
              <q-btn color="info" class="padding-right"
                glossy @click="openDialog('修改')"
                :loading="loading">修改{{ formName }}</q-btn>&nbsp;
            <!-- </div> -->
            <!-- <div class="padding-right"> -->
              <q-btn color="red" class="padding-right"
                glossy @click="openDialog('刪除')"
                :loading="loading">刪除{{ formName }}</q-btn>&nbsp;
            <!-- </div> -->
          </div>
          <div v-if="(hasAllAuth ||(auth && auth.查詢))">
          <!-- <div class="padding-right"> -->
            <q-btn color="green" class="padding-right"
              glossy @click="openDialog('預覽')"
                :loading="loading">{{ formName }}預覽</q-btn>&nbsp;
          <!-- </div> -->
          <!-- <div class="padding-right"> -->
            <q-btn color="blue" class="padding-right"
              glossy @click="openSearchDialog"
                :loading="loading">{{ formName }}搜尋</q-btn>&nbsp;
          <!-- </div> -->
          </div>
      </div>
      <div class="row justify-start padding-top">
        <div class="text-left text-red">{{ errorMessage }}</div>
      </div>
    </h5>
  </q-layout>
  <!--#endregion-->
  <!--#region 列表-->
  <q-page-container>
    <q-page>
        <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="識別"
                :rows="list"
                flat
                bordered
                style="height: 400px"
                virtual-scroll
                selection="single"
                v-model:selected="selected"
                @selection="onSelection"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table >
    </q-page>
  </q-page-container>
  <!--#endregion-->
  <!--#region 表單本體-->
  <q-dialog v-model="showForm" persistent >
    <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
      <q-card-section>
        <div class="text-h4">
          {{mode}}{{ formName }}
        </div>
        <q-card-actions align="left">
        </q-card-actions>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="negative" @click="close()" />
          <q-btn v-if="!preview" label="送出" color="primary" :loading="loading" @click="handleOtherAction" />
        </q-card-actions>
      </q-card-section>
      <q-form ref="myForm" >
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-3 col-md-3" style="max-width: 600px">
              <q-input outlined dense v-model="form.產品編號" :readonly="readonly || preview" label="材料編號" />
            </div>
            <div class="col-2 col-md-2" style="max-width: 600px"></div>
            <div class="col-2 col-md-2" style="max-width: 600px"></div>
            <div class="col-2 col-md-2" style="max-width: 600px"></div>
            <div class="col-3 col-md-3" style="max-width: 600px"></div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
  <!--#endregion-->
</template>
<script setup>
//#region import
import { useAuth } from '@/composables/useAuth';
import {
    QIcon
  , QLayout
  , QBtn
  , QPageContainer
  , QPage
  , QTable
  , QDialog
  , QCard
  , QCardSection
  , QCardActions
} from 'quasar';
import { onMounted
  , readonly, ref
 } from 'vue';
//#endregion

//#region variable
const formName = "廠商詢價";
const authStore = useAuth();
const auth = ref({});
const hasAllAuth = ref(false);
const errorMessage = ref('');
const selected = ref([]);
const list = ref([]);
const columns = ref([]);
const preview = ref(false);
const showForm = ref(false);
const mode = ref('');
const myForm = ref(null);
const form = ref({
  產品編號:'',

});
//#endregion

//#region function
onMounted(()=>{
  auth.value = authStore.getAuth(formName);
  hasAllAuth.value = authStore.hasAllAuth(formName);
})

const openDialog = async (type) =>{
  mode.value = type;
  if (type == '新增'){
    console.log(type);
    showForm.value = true;
  } else {
    if (type == '修改' || type == '預覽'){
      if (selected.value.length == 0){
        errorMessage.value = `請選擇一筆${type}!`
        return;
      }
      if (type == '預覽') {
        preview.value = true;
      } else {
        preview.value = false;
      }
      console.log(type);
      showForm.value = true;
    } else if (type == '刪除') {
      console.log(type);
    }
  }
}

const handleOtherAction = () =>
{

}

const close = () =>{
  showForm.value = false;
}

const onSelection = () =>{

}
//#endregion
</script>
