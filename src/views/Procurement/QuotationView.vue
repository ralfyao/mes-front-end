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
          >

            <template  v-slot:body-cell-品項編號="props">
              <q-td :props="props">
                <q-btn flat outline densed @click="openQuotationForm(props.row.品項編號)">{{props.row.品項編號}}</q-btn>
              </q-td>
            </template>
          </q-table >
      </q-page>
    </q-page-container>
    <!--#endregion-->
  </q-layout>
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
            <div class="col-3 col-md-3 flex " no-wrap style="max-width: 400px">
              <q-input outlined dense v-model="form.產品編號" readonly label="材料編號" style="width:250px" />
              <q-btn outline dense label="查料" v-if="mode == '新增'" @click="openItemQueryForm" />
              <!--#region 放大鏡廠商查詢視窗-->
              <q-dialog v-model="showItemQueryForm" persistent>
                <product-query-form v-model:showForm="showItemQueryForm" v-model:item="form"/>
              </q-dialog>
              <!--#endregion-->
            </div>
            <div class="col-2 col-md-2" style="max-width: 300px">
              <q-input outlined dense v-model="form.品別" readonly label="市購品類別" style="width:200px" />
            </div>
            <div class="col-2 col-md-2" style="max-width: 300px">
              <q-input outlined dense v-model="form.大分類" readonly label="大分類" style="width:200px" />
            </div>
            <div class="col-2 col-md-2" style="max-width: 300px">
              <q-input outlined dense v-model="form.小分類" readonly label="小分類" style="width:200px" />
            </div>
            <div class="col-3 col-md-3" style="max-width: 300px">
              <q-input outlined dense v-model="form.產品代號" readonly label="產品代號" style="width:200px" />
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 400px">
              <q-input outlined dense v-model="form.品名規格" readonly label="品名規格" style="width:400px" />
            </div>
            <div class="col-2 col-md-2" style="max-width: 200px">
              <q-input outlined dense v-model="form.外尺寸長" readonly label="外尺寸長" style="width:200px" />
            </div>
            <div class="col-2 col-md-2" style="max-width: 200px">
              <q-input outlined dense v-model="form.外尺寸寬" readonly label="外尺寸寬" style="width:200px" />
            </div>
            <div class="col-2 col-md-2" style="max-width: 100px">
              <q-input outlined dense v-model="form.厚度" readonly label="厚度" style="width:100px" />
            </div>
            <div class="col-1 col-md-1" style="max-width: 100px">
              <q-input outlined dense v-model="form.外徑" readonly label="外徑" style="width:100px" />
            </div>
            <div class="col-1 col-md-1" style="max-width: 100px">
              <q-input outlined dense v-model="form.內徑" readonly label="內徑" style="width:100px" />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn outlined dense glossy color="blue" v-if="mode != '預覽'" label="新增廠商" @click="addSupplier"/>
          <q-table dense  class="rounded-borders my-sticky-header-table"
                  :columns="columnsMaterialList"
                  row-key="識別"
                  :rows="quotationData.materialList || []"
                  flat
                  bordered
                  style="height: 400px"
                  virtual-scroll
                  :pagination="{ rowsPerPage: 5000 }"
          >
            <template  v-slot:body-cell-廠商編號="props">
              <q-td class="no-wrap flex cell-tight" :props="props">
                <q-select v-model="props.row.廠商編號"
                  outlined dense emit-value map-options  @update:model-value="changeSupplierAlias(props.row)"
                  :options="props.row.supplierList" :readonly="readonly || preview"
                  option-value="廠商編號"
                  option-label="廠商編號"/>
                <q-icon name="search" size="30px" @click="openSearcSupplierForm(props.row)" class="cursor-pointer"></q-icon>

                <!--#region 查料視窗-->
                <q-dialog v-model="showSupplierQueryForm" persistent>
                  <supplier-query-form v-model:showForm="showSupplierQueryForm" v-model:list="props.row.supplierList"/>
                </q-dialog>
                <!--#endregion-->
              </q-td>
            </template>
            <template  v-slot:body-cell-詢價日期="props">
              <q-td class="q-pa-xs items-center cell-tight" :props="props">
                <q-input style="width:150px" outlined dense v-model="props.row.詢價日期" :readonly="readonly || preview" label="詢價日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="props.row.showDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="props.row.詢價日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="props.row.showDatePopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <!-- {{ dayjs(props.row.詢價日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD") }} -->
              </q-td>
            </template>
            <template  v-slot:body-cell-單價="props">
              <q-td class="q-pa-xs items-center cell-tight" :props="props">
                <q-input style="width:150px" type="number" :readonly="readonly || preview" outlined dense v-model="props.row.單價" label="單價"></q-input>
              </q-td>
            </template>
            <template  v-slot:body-cell-幣別="props">
              <q-td class="q-pa-xs items-center cell-tight" :props="props">
                <q-select style="width:150px" outlined dense v-model="props.row.幣別" label="幣別" emit-value map-options
                  :options="currencyList" option-label="currency" :readonly="readonly || preview" option-value="currency"
                ></q-select>
              </q-td>
            </template>
            <template  v-slot:body-cell-採購單位="props">
              <q-td class="q-pa-xs items-center cell-tight" :props="props">
                <q-input style="width:150px" outlined dense :readonly="readonly || preview" v-model="props.row.採購單位" label="採購單位"></q-input>
              </q-td>
            </template>

            <template  v-slot:body-cell-最低採購量="props">
              <q-td class="q-pa-xs items-center cell-tight" :props="props">
                <q-input style="width:150px" type="number" :readonly="readonly || preview" min="1" outlined dense v-model="props.row.最低採購量" label="最低採購量"></q-input>
              </q-td>
            </template>
            <template  v-slot:body-cell-最大採購量="props">
              <q-td class="q-pa-xs items-center cell-tight" :props="props">
                <q-input style="width:150px" type="number" :readonly="readonly || preview" min="1" outlined dense v-model="props.row.最大採購量" label="最大採購量"></q-input>
              </q-td>
            </template>

            <template  v-slot:body-cell-詢價人員="props">
              <q-td class="q-pa-xs items-center cell-tight" :props="props">
                <q-select style="width:150px" outlined :readonly="readonly || preview" dense v-model="props.row.詢價人員" label="詢價人員"
                  :options="salesList" option-value="工號" emit-value map-options
                            option-label="姓名"
                ></q-select>
              </q-td>
            </template>
            <template  v-slot:body-cell-報價有效日期="props">
              <q-td class="q-pa-xs items-center cell-tight" :props="props">
                <q-input style="width:150px" outlined :readonly="readonly || preview" dense v-model="props.row.報價有效日期" label="報價有效日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="props.row.showEffDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="props.row.報價有效日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="props.row.showEffDatePopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-td>
            </template>

            <template  v-slot:body-cell-廠商品號="props">
              <q-td class="q-pa-xs items-center cell-tight" :props="props">
                <q-input style="width:150px"  outlined :readonly="readonly || preview" dense v-model="props.row.廠商品號" label="廠商品號"></q-input>
              </q-td>
            </template>
          </q-table >
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
  <!--#endregion-->
  <loading-component v-model="secondDialog"/>

</template>
<script setup>
//#region import
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useAuth } from '@/composables/useAuth';
import { useCustStore } from '@/composables/useCust';
import { useSupplierStore } from '@/composables/useSupplier';
import dayjs from 'dayjs';
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
  , QInput
  , QSelect
  , QPopupProxy
  , QDate
  , QTd
  , QForm
} from 'quasar';
import { onMounted
  ,  ref
 } from 'vue';
 import SupplierQueryForm from '@/components/supplier/query/SupplierQueryForm.vue';
import ProductQueryForm from '@/components/product/ProductQueryForm.vue';
//#endregion

//#region variable
// const showETDPopup = ref(false);
const showItemQueryForm = ref(false);
const showSupplierQueryForm = ref(false);
const secondDialog = ref(false);
const formName = "廠商詢價";
const authStore = useAuth();
const auth = ref({});
const hasAllAuth = ref(false);
const errorMessage = ref('');
const selected = ref([]);
const currencyList = ref([]);
const list = ref([]);
const supplierList = ref([]);
const columns = ref([
  { name: '詢價日期', label: '詢價日期', align: 'left', field: '詢價日期', sortable: true },
  { name: '品項編號', label: '品項編號', align: 'left', field: '品項編號', sortable: true },
  { name: '品名規格', label: '品名規格', align: 'left', field: '品名規格', sortable: true },
  { name: '廠商編號', label: '廠商編號', align: 'left', field: '廠商編號', sortable: true },
  { name: '廠商簡稱', label: '廠商簡稱', align: 'left', field: '廠商簡稱', sortable: true },
  { name: '單價', label: '單價', align: 'left', field: '單價', sortable: true },
  { name: '幣別', label: '幣別', align: 'left', field: '幣別', sortable: true },
  { name: '採購單位', label: '採購單位', align: 'left', field: '採購單位', sortable: true },
  { name: '最低採購量', label: '最低採購量', align: 'left', field: '最低採購量', sortable: true },
  { name: '最大採購量', label: '最大採購量', align: 'left', field: '最大採購量', sortable: true },
  { name: '詢價人員', label: '詢價人員', align: 'left', field: '詢價人員', sortable: true },
  { name: '報價有效日期', label: '報價有效日期', align: 'left', field: '報價有效日期', sortable: true },
  { name: '廠商品號', label: '廠商品號', align: 'left', field: '廠商品號', sortable: true },
]);
const preview = ref(false);
const showForm = ref(false);
const quotationData = ref({
  materialList:[]
});
const mode = ref('');
const myForm = ref(null);
const custStore = useCustStore();
const form = ref({
  產品編號:'',
  品別:'',
  大分類:'',
  小分類:'',
  產品代號:'',
  品名規格:'',
  外尺寸長:'',
  外尺寸寬:'',
  厚度    :'',
  外徑    :'',
  內徑    :'',
});
const columnsMaterialList = ref([
  { name: '廠商編號', label: '廠商編號', align: 'left', field: '廠商編號', sortable: true },
  { name: '廠商簡稱', label: '廠商簡稱', align: 'left', field: '廠商簡稱', sortable: true },
  { name: '詢價日期', label: '詢價日期', align: 'left', field: '詢價日期', sortable: true },
  { name: '單價', label: '單價', align: 'left', field: '單價', sortable: true },
  { name: '幣別', label: '幣別', align: 'left', field: '幣別', sortable: true },
  { name: '採購單位', label: '採購單位', align: 'left', field: '採購單位', sortable: true },
  { name: '最低採購量', label: '最低採購量', align: 'left', field: '最低採購量', sortable: true },
  { name: '最大採購量', label: '最大採購量', align: 'left', field: '最大採購量', sortable: true },
  { name: '詢價人員', label: '詢價人員', align: 'left', field: '詢價人員', sortable: true },
  { name: '報價有效日期', label: '報價有效日期', align: 'left', field: '報價有效日期', sortable: true },
  { name: '廠商品號', label: '廠商品號', align: 'left', field: '廠商品號', sortable: true },
]);
const supplierStore = useSupplierStore();
const salesList = ref([]);
//#endregion

//#region function
// const changeSalesName = (row) =>{
//   console.log('row', row);
// }
const changeSupplierAlias = (row) =>{
  row.廠商簡稱 = row.supplierList.find((x)=>x.廠商編號 == row.廠商編號)?.廠商簡稱
  console.log('row',row);
}
onMounted(async ()=>{
  await init();
})

const addSupplier = () =>{
  quotationData.value.materialList.push({
    識別:null,
    廠商編號:'',
    廠商簡稱:'',
    詢價日期:'',
    品項編號:form.value.產品編號,
    單價:0,
    幣別:'',
    採購單位:'',
    最低採購量:0,
    最大採購量:0,
    詢價人員:'',
    報價有效日期:'',
    廠商品號:'',
    supplierList:supplierList.value,
  })
}

const openItemQueryForm = () =>{
  showItemQueryForm.value = true;
}

const init = async () =>{
  auth.value = authStore.getAuth(formName);
  hasAllAuth.value = authStore.hasAllAuth(formName);

  const quotation = await supplierStore.getSupplierQuotationList();
  list.value = quotation;

  list.value.forEach((x) => {
    x.詢價日期 = dayjs(x.詢價日期).format("YYYY/MM/DD");
    x.報價有效日期 = dayjs(x.報價有效日期).format("YYYY/MM/DD");
    // x.materialList.forEach((xx)=>{console.log('supplierList', xx.supplierList)});
  });

  // 👉 分開呼叫（重點🔥）
  supplierList.value = await supplierStore.getSupplierList();

  salesList.value = await custStore.getSalesList();

  currencyList.value = await custStore.getCurrencyList();

  console.log('salesList', salesList.value);
}

const openSearcSupplierForm = (row) =>{
  console.log('row', row);
  console.log('row.supplierList', row.supplierList);
  showSupplierQueryForm.value = true;
  row.廠商編號 = '';
  row.廠商簡稱 = '';
}

const openQuotationForm = async (itemNo) =>{
  mode.value = '修改'
  preview.value = false;
  {
    await supplierStore.getQuotationByItem(itemNo).then((data)=>{
      console.log('supplierStore.getQuotationByItem', data);
      quotationData.value = data;
      quotationData.value.materialList.forEach((x)=>{
        x.詢價日期 = dayjs(x.詢價日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
        x.報價有效日期 = dayjs(x.報價有效日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
        supplierStore.getSupplierList().then((data)=>{
          x.supplierList = data
        });
      });
      form.value.產品編號 = quotationData.value.產品編號;
      form.value.品別 	= 	quotationData.value.品別
      form.value.大分類 	=   quotationData.value.大分類
      form.value.小分類 	=   quotationData.value.小分類
      form.value.產品代號 =   quotationData.value.產品代號
      form.value.品名規格 =   quotationData.value.品名規格
      form.value.外尺寸長 =   quotationData.value.外尺寸長
      form.value.外尺寸寬 =   quotationData.value.外尺寸寬
      form.value.厚度     =   quotationData.value.厚度
      form.value.外徑     =   quotationData.value.外徑
      form.value.內徑     =   quotationData.value.內徑
    })
  }

  showForm.value = true;
}

const openDialog = async (type) =>{
  mode.value = type;
  if (type == '新增'){
    console.log(type);
    form.value = {
      產品編號:'',
      品別:'',
      大分類:'',
      小分類:'',
      產品代號:'',
      品名規格:'',
      外尺寸長:'',
      外尺寸寬:'',
      厚度    :'',
      外徑    :'',
      內徑    :'',
    }
    quotationData.value = {
      materialList:[],
    }
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
      console.log(selected.value[0]);
      await supplierStore.getQuotationByItem(selected.value[0].品項編號).then((data)=>{
        console.log('supplierStore.getQuotationByItem', data);
        quotationData.value = data;
        quotationData.value.materialList.forEach((x)=>{
          x.詢價日期 = dayjs(x.詢價日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
          x.報價有效日期 = dayjs(x.報價有效日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
          supplierStore.getSupplierList().then((data)=>{
            x.supplierList = data
          });
        });
        form.value.產品編號 = quotationData.value.產品編號;
        form.value.品別 	= 	quotationData.value.品別
        form.value.大分類 	=   quotationData.value.大分類
        form.value.小分類 	=   quotationData.value.小分類
        form.value.產品代號 =   quotationData.value.產品代號
        form.value.品名規格 =   quotationData.value.品名規格
        form.value.外尺寸長 =   quotationData.value.外尺寸長
        form.value.外尺寸寬 =   quotationData.value.外尺寸寬
        form.value.厚度     =   quotationData.value.厚度
        form.value.外徑     =   quotationData.value.外徑
        form.value.內徑     =   quotationData.value.內徑
      })
      showForm.value = true;
    } else if (type == '刪除') {
      console.log(type);
    }
  }
}

const handleOtherAction = async () => {
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}

const submitForm = async () =>{
  secondDialog.value = true;
  console.log('quotationData.materialList', quotationData.value.materialList);
  quotationData.value.materialList.forEach((x)=>{
    x.產品編號 = form.value.產品編號;
  })
  // return;
  if (mode.value == '新增') {
    await supplierStore.addSupplierQuotation(form).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert(`${mode.value}成功`);
      }
      secondDialog.value = false;
      init();
    })
  } else if (mode.value == '修改') {
    quotationData.value.materialList.forEach((x)=>{
      x.品項編號 = form.value.產品編號;
    })
    await supplierStore.updateSupplierQuotation(quotationData).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert(`${mode.value}成功`);
      }
      secondDialog.value = false;
      init();
    })
  }
}

const close = () =>{
  showForm.value = false;
}

const onSelection = () =>{

}
//#endregion
</script>
