<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-3 col-md3">
          <q-icon name="play_circle" size="30px" >客戶未收查詢</q-icon>
        </div>
        <div class="padding-right">
          <q-btn color="green" class="padding-right"
              glossy @click="openARDialog('預覽')"
                :loading="loading">詳細資料</q-btn>
        </div>
      </div>
      <div class="row justify-start padding-top">
        <div class="col-6 col-md-6"  style="max-width: 500px">
          <div class="text-left text-red">{{ errorMessage }}</div>
        </div>
      </div>
    </h5>
    <q-page-container>
      <q-page>
        <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="識別"
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
    <q-dialog v-model="showForm" persistent >
      <q-card class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
        <q-card-section>
          <div class="text-h4">
            客戶未收帳
          </div>
        </q-card-section>
        <q-form ref="myForm" >
          <q-card-section>
            <q-table  class="rounded-borders my-sticky-header-table"
                    :columns="columnsAll"
                    row-key="識別"
                    :rows="selected"
                    flat
                    bordered
                    virtual-scroll
                    style="max-height: 500px"
                    v-model:selected="selected"
                    :pagination="{ rowsPerPage: 5 }"
            ></q-table >
          </q-card-section>
          <hr>
          <div class="text-h5">
            未收帳明細
          </div>
          <q-card-section>
            <q-table  class="rounded-borders my-sticky-header-table"
                    :columns="columnsAllData"
                    row-key="識別"
                    :rows="data.detailList"
                    flat
                    bordered
                    virtual-scroll
                    style="max-height: 500px"
                    v-model:selected="selected"
                    :pagination="{ rowsPerPage: 5 }"
            ></q-table >
            <!-- <div v-for=" item in data.detailList" :key="item.識別">
              <div class="row q-col-gutter-md">
                <div class="col-1 col-md-1" style="max-width: 300px">
                  <q-input readonly outlined dense v-model="item.收付別" label="收付別"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 300px">
                  <q-input readonly outlined dense v-model="item.對象" label="對象"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 300px">
                  <q-input readonly outlined dense v-model="item.帳款來源" label="帳款來源"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 400px">
                  <q-input readonly outlined dense v-model="item.帳款日期" label="帳款日期"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 300px">
                  <q-input readonly outlined dense v-model="item.沖帳碼" label="憑證種類"/>
                </div>
                <div class="col-2 col-md-1" style="max-width: 300px">
                  <q-input readonly outlined dense v-model="item.發票號碼" label="發票(憑證)號碼"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 300px">
                  <q-input readonly outlined dense v-model="item.沖帳碼" label="沖帳碼"/>
                </div>
              </div>
            </div> -->
          </q-card-section>
        </q-form>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="negative" @click="close" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>
<script setup>
// import block start
import { useARStore } from '@/composables/useAR';
import {
  QLayout,
  QIcon,
  QBtn,
  QPageContainer,
  QPage,
  QTable,
  QDialog,
  QCardSection,
  QCard,
  QForm,
  QCardActions,
} from 'quasar'
import { ref, onMounted } from 'vue'
// import block end

// variable block start
const arStore = useARStore();
const list = ref([]);
const listAll = ref([]);
const loading = ref(false);
const columns = ref([
  { name: '識別', label: '識別', align: 'left', field: '識別', sortable: true },
  { name: '對象', label: '客戶編號', align: 'left', field: '對象', sortable: true },
  { name: 'company', label: '客戶名稱', align: 'left', field: 'company', sortable: true },
  { name: '備註', label: '帳期', align: 'left', field: '備註', sortable: true },
  { name: '幣別', label: '幣別', align: 'left', field: '幣別', sortable: true },
]);
const columnsAll = ref([
  { name: '識別', label: '識別', align: 'left', field: '識別', sortable: true },
  { name: '對象', label: '客戶編號', align: 'left', field: '對象', sortable: true },
  { name: 'company', label: '客戶名稱', align: 'left', field: 'company', sortable: true },
  { name: '備註', label: '帳期', align: 'left', field: '備註', sortable: true },
  { name: '幣別', label: '幣別', align: 'left', field: '幣別', sortable: true },
  { name: '原幣未稅', label: '原幣未稅總計', align: 'left', field: '原幣未稅', sortable: true },
  { name: '未稅', label: '未稅總計', align: 'left', field: '未稅', sortable: true },
  { name: '稅', label: '稅總計', align: 'left', field: '稅', sortable: true },
  { name: '金額', label: '金額總計', align: 'left', field: '金額', sortable: true },
]);

const columnsAllData =  ref([
  { name: '識別', label: '識別', align: 'left', field: '識別碼', sortable: true },
  { name: '收付別', label: '收付別', align: 'left', field: '收付別', sortable: true },
  { name: '帳款來源', label: '帳款來源', align: 'left', field: '帳款來源', sortable: true },
  { name: '帳款日期', label: '帳款日期', align: 'left', field: '帳款日期', sortable: true },
  { name: '沖帳碼', label: '憑證種類', align: 'left', field: '沖帳碼', sortable: true },
  { name: '發票號碼', label: '發票(憑證)號碼', align: 'left', field: '發票號碼', sortable: true },
  { name: '請款單號', label: '憑證沖銷單號', align: 'left', field: '請款單號', sortable: true },
  { name: '幣別', label: '幣別', align: 'left', field: '幣別', sortable: true },
  { name: '匯率', label: '匯率', align: 'left', field: '匯率', sortable: true },
  { name: '原幣未稅', label: '原幣未稅', align: 'left', field: '原幣未稅', sortable: true },
  { name: '未稅', label: '未稅', align: 'left', field: '未稅', sortable: true },
  { name: '稅', label: '稅', align: 'left', field: '稅', sortable: true },
  { name: '金額', label: '金額', align: 'left', field: '金額', sortable: true },
]);
const showForm = ref(false);
const selected = ref([]);
const errorMessage = ref('');
const data = ref({
  識別碼:0,
  識別:'',
  對象:'',
  company:'',
  備註:'',
  幣別:'',
  原幣未稅:0.0,
  未稅:0.0,
  稅:0.0,
  金額:0.0,
  detailList:[],
});
// variable block end

// function block start
const openARDialog = (type) =>{
  console.log(type);
  if(selected.value.length == 0){
    errorMessage.value = "請選取一筆資料做檢視!";
    return;
  }
  data.value = selected.value[0];
  listAll.value = [];
  listAll.value.push(data);
  console.log('listAll.value', listAll.value);
  showForm.value = true;
}
const close = () =>{
  showForm.value = false;
}
onMounted(async ()=>{
  await arStore.getUnclosedARList().then((data)=>{
    list.value = data;
  });
})
// function block end
</script>
