<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <!--表頭-->
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
        </div>
        <!--編修-->
        <div v-if="(hasAllAuth ||(auth && auth.編修))">
          <q-btn color="primary" class="padding-right"
            glossy @click="openCARDialog('新增')"
            :loading="loading">新增供應商</q-btn>&nbsp;
          <q-btn color="info" class="padding-right"
            glossy @click="openCARDialog('修改')"
            :loading="loading">修改供應商</q-btn>&nbsp;
          <q-btn color="red" class="padding-right"
              glossy @click="deleteCAR"
              :loading="loading">刪除供應商</q-btn>&nbsp;
        </div>
        <!--查詢-->
        <div v-if="(hasAllAuth ||(auth && auth.查詢))">
          <!-- <div class="padding-right"> -->
            <q-btn color="green" class="padding-right"
                glossy @click="openCARDialog('預覽')"
                  :loading="loading">供應商預覽</q-btn>&nbsp;
        </div>
      </div>
      <div class="row justify-start padding-top">
        <div class="text-left text-red">{{ errorMessage }}</div>
      </div>
    </h5>
    <!--列表-->
    <q-page-container>
      <q-page>
        <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="廠商編號"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table >
      </q-page>
    </q-page-container>
    <!--表單本體-->
    <q-dialog v-model="showForm" persistent >
      <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
        <q-card-section>
          <div class="text-h4">
            {{mode}}{{ formName }}
            <q-card-actions align="right">
              <div>
                <q-btn color="green" class="padding-right"
                      glossy
                      :loading="loading">廠商評鑑</q-btn> &nbsp;
                <q-btn color="blue" class="padding-right"
                      glossy
                      :loading="loading">供料詢價</q-btn> &nbsp;
              </div>
              <div>
                <q-btn flat label="取消" color="negative" @click="close" />
                <q-btn v-if="(hasAllAuth || auth.編修) && !preview" label="送出" color="primary" @click="handleOtherAction" />
              </div>
              <div v-if="(hasAllAuth ||(auth && auth.核准)) && !preview">
                <q-btn color="grey" class="padding-right"
                        glossy v-if="form.核准日 && form.核准日!= ''"
                        :loading="loading" @click="validate(false)">取消核准</q-btn> &nbsp;
                <q-btn color="grey" class="padding-right"
                        glossy v-if="!form.核准日 || form.核准日== ''"
                        :loading="loading" @click="validate(true)">核准</q-btn> &nbsp;
              </div>
              <div v-if="(hasAllAuth ||(auth && auth.輸出))">
                  <!-- <div class="padding-right"> -->
                    <q-btn color="grey" class="padding-right"
                      glossy
                      :loading="loading">列印</q-btn> &nbsp;
                  <!-- </div> -->
                  <!-- <div class="padding-right"> -->
                    <q-btn color="grey" class="padding-right"
                      glossy
                      :loading="loading">列印(英)</q-btn>
                  <!-- </div> -->
              </div>
            </q-card-actions>
          </div>
        </q-card-section>
        <q-form ref="myForm" >
          <q-card-section>
            <!-- 廠商簡稱 廠商編號 廠商名稱 區域國別 -->
            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3" style="max-width: 400px">
                <q-input v-model="form.廠商簡稱" label="廠商簡稱" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 400px">
                <q-input v-model="form.廠商編號" label="廠商編號" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 400px">
                <q-input v-model="form.廠商名稱" label="廠商名稱" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 300px">
                <country-code-select v-model:country="form.國別"/>
              </div>
            </div>
            <br>
            <!-- 公司地址 工廠地址 統一編號 -->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 750px">
                <q-input v-model="form.公司地址" :readonly="readonly || preview" label="公司地址" outlined dense />
              </div>
              <div class="col-4 col-md-4" style="max-width: 500px">
                <q-input v-model="form.工廠地址" :readonly="readonly || preview" label="工廠地址" outlined dense />
              </div>
              <div class="col-2 col-md-2" style="max-width: 250px">
                <q-input v-model="form.統一編號" :readonly="readonly || preview" label="統一編號" outlined dense />
              </div>
            </div>
            <br>
            <!-- 聯絡人 職稱 手機 電郵信箱 -->
            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3" style="max-width: 400px">
                <q-input v-model="form.聯絡人" :readonly="readonly || preview" label="聯絡人" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 400px">
                <q-input v-model="form.職稱" :readonly="readonly || preview" label="職稱" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 400px">
                <q-input v-model="form.聯絡手機" :readonly="readonly || preview" label="手機" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 300px">
                <q-input v-model="form.電郵" :readonly="readonly || preview" label="電郵信箱" outlined dense />
              </div>
            </div>
            <br>
            <!-- 電話 傳真 所屬業別 管理分類 評鑑等級 -->
            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3" style="max-width: 300px">
                <q-input v-model="form.電話" :readonly="readonly || preview" label="電話" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 300px">
                <q-input v-model="form.傳真" :readonly="readonly || preview" label="傳真" outlined dense />
              </div>
              <div class="col-2 col-md-2" style="max-width: 300px">
                <industry-code-select v-model="form.所屬業別"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 300px">
                <q-select v-model="form.管理分類" :readonly="readonly || preview" label="管理分類" outlined dense />
              </div>
              <div class="col-2 col-md-2" style="max-width: 300px">
                <q-select v-model="form.等級" :readonly="readonly || preview" label="評鑑等級" outlined dense />
              </div>
            </div>
            <br>
            <!-- 備註 廠商特色 負責人 個人手機 停用 -->
            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3" style="max-width: 300px">
                <q-input v-model="form.備註" :readonly="readonly || preview" label="備註" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 300px">
                <q-input v-model="form.R1" :readonly="readonly || preview" label="廠商特色" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 300px">
                <q-input v-model="form.R2" :readonly="readonly || preview" label="負責人" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 150px">
                <q-input v-model="form.R3" :readonly="readonly || preview" label="個人手機" outlined dense />
              </div>
              <div class="col-3 col-md-3" style="max-width: 150px">
                <q-btn label="停用" v-if="!readonly && !preview && !form.停用" color="red" outlined dense />
                <q-btn label="取消停用" v-if="!readonly && !preview && form.停用" color="primary" outlined dense />
              </div>
            </div>
            <br>
          </q-card-section>
        </q-form>
        <q-card-section>
          <div class="text-h5">供料詢價明細紀錄</div>
          <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columnsDetail"
                row-key="識別"
                :rows="listDetail"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table >
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
  <LoadingComponent  v-model="secondDialog"/>
</template>
<script setup>
// #region--------------------------------------import block start---------------------------------//
import CountryCodeSelect from '@/components/customer/CountryCodeSelect.vue';
import IndustryCodeSelect from '@/components/customer/IndustryCodeSelect.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useAuth } from '@/composables/useAuth';
import { useSupplierStore } from '@/composables/useSupplier';
import {
    QIcon
  , QLayout
  , QBtn
  , QCard
  , QCardSection
  , QCardActions
  , QForm
  , QPageContainer
  , QPage
  , QTable
  , QDialog
  , QInput
  , QSelect
} from 'quasar';
import {
  ref,
  onMounted,
} from 'vue'

// #endregion--------------------------------------import block end---------------------------------//

// #region--------------------------------------variable block start---------------------------------//
const supplierStpre = useSupplierStore();
const errorMessage = ref('');
const formName = '供應廠商';
const hasAllAuth = ref(false);
const auth = ref({});const columns = ref([
  { name: '廠商編號', label: '廠商編號', align: 'left', field: '廠商編號', sortable: true },
  { name: '廠商簡稱', label: '廠商簡稱', align: 'left', field: '廠商簡稱', sortable: true },
  { name: '廠商名稱', label: '廠商名稱', align: 'left', field: '廠商名稱', sortable: true },
  { name: '統一編號', label: '統一編號', align: 'left', field: '統一編號', sortable: true },
  { name: '電話', label: '電話', align: 'left', field: '電話', sortable: true },
  { name: '傳真', label: '傳真', align: 'left', field: '傳真', sortable: true },
  { name: '聯絡人', label: '聯絡人', align: 'left', field: '聯絡人', sortable: true },
  { name: '職稱', label: '職稱', align: 'left', field: '職稱', sortable: true },
  { name: '所屬業別', label: '所屬業別', align: 'left', field: '所屬業別', sortable: true },
  { name: '管理分類', label: '管理分類', align: 'left', field: '管理分類', sortable: true },
  { name: '等級', label: '等級', align: 'left', field: '等級', sortable: true },
  { name: '核准', label: '核准', align: 'left', field: '核准', sortable: true },
  { name: '停用', label: '停用', align: 'left', field: '停用', sortable: true },
]);
const list = ref([]);
const listDetail = ref([])
const selected = ref([]);
const authStore = useAuth();
const secondDialog = ref(false);
const preview = ref(false);
const showForm = ref(false);
const mode = ref('');
const myForm = ref(null);
const form = ref({
  廠商編號:'',
  廠商簡稱:'',
  廠商名稱:'',
  國別:'',
  公司地址:'',
  工廠地址:'',
  統一編號:'',
  聯絡人:'',
  職稱:'',
  聯絡手機:'',
  電郵:'',
  電話:'',
  傳真:'',
  所屬業別:'',
  管理分類:'',
  等級:'',
  備註:'',
  R1:'',
  R2:'',
  R3:'',
  停用:false,
  建檔:authStore.getUser().account,
  修改:'',
  核准:'',
  建檔日:'',
  修改日:'',
  核准日:'',

})
const columnsDetail = ref([
{ name: '詢價日期', label: '詢價日期', align: 'left', field: '詢價日期', sortable: true },
  { name: '品項編號', label: '品項編號', align: 'left', field: '品項編號', sortable: true },
  { name: '品名', label: '品名', align: 'left', field: '品名', sortable: true },
  { name: '採購單位', label: '採購單位', align: 'left', field: '採購單位', sortable: true },
  { name: '最低採購量', label: '最低採購量', align: 'left', field: '最低採購量', sortable: true },
  { name: '最大採購量', label: '最大採購量', align: 'left', field: '最大採購量', sortable: true },
  { name: '單價', label: '單價', align: 'left', field: '單價', sortable: true },
  { name: '幣別', label: '幣別', align: 'left', field: '幣別', sortable: true },
  { name: '詢價人員', label: '詢價人員', align: 'left', field: '詢價人員', sortable: true },
  { name: '報價有效日期', label: '報價有效日期', align: 'left', field: '報價有效日期', sortable: true },
  { name: '廠商品號', label: '廠商品號', align: 'left', field: '廠商品號', sortable: true },


]);
// #endregion--------------------------------------variable block end---------------------------------//

// #region--------------------------------------function block start---------------------------------//
onMounted(async ()=>{
  secondDialog.value = true;
  auth.value = authStore.getAuth(formName);
  hasAllAuth.value = authStore.hasAllAuth(formName);
  await supplierStpre.getSupplierList().then((data)=>{
    list.value = data;
    secondDialog.value = false;
  })
})
const close = () =>{
  showForm.value = false;
}
const openCARDialog = (type) => {
  mode.value = type;
  showForm.value = true;
  if (type == '新增') {
    form.value = {
      廠商編號:'',
      廠商簡稱:'',
      廠商名稱:'',
      國別:'',
      公司地址:'',
      工廠地址:'',
      統一編號:'',
      聯絡人:'',
      職稱:'',
      聯絡手機:'',
      電郵:'',
      電話:'',
      傳真:'',
      所屬業別:'',
      管理分類:'',
      等級:'',
      備註:'',
      R1:'',
      R2:'',
      R3:'',
      停用:false,
      建檔:'',
      修改:'',
      核准:'',
      建檔日:'',
      修改日:'',
      核准日:'',
    }
  } else if (type == '修改' || type == '預覽') {
    if (selected.value.length == 0){
      errorMessage.value = '請選取一筆資料修改!';
      return;
    }
    form.value = selected.value[0];
    console.log('select.value[0]', form.value);
    listDetail.value = form.value.supplyList;
    if (type == '預覽') {
      preview.value = true;
    } else {
      preview.value = false;
    }
  }
}
const handleOtherAction = async () =>{

}
// #endregion--------------------------------------function block end---------------------------------//
</script>
