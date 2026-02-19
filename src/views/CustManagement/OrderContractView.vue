<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >訂單合約</q-icon>
        </div>
        <div class="padding-right">
          <q-btn color="primary" class="padding-right"
            glossy @click="openCustomerDialog('新增')"
            :loading="loading">新增訂單</q-btn>
        </div>
        <div class="padding-right">
          <q-btn color="info" class="padding-right"
            glossy @click="openCustomerDialog('修改')"
            :loading="loading">修改訂單</q-btn>
        </div>
        <div class="padding-right">
            <q-btn color="red" class="padding-right"
              glossy @click="deleteCustomer"
              :loading="loading">刪除訂單</q-btn>
        </div>
        <div class="padding-right">
          <q-btn color="green" class="padding-right"
              glossy @click="openCustomerDialog('預覽')"
                :loading="loading">訂單預覽</q-btn>
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
        <q-table
                :columns="columns"
                row-key="識別"
                :rows="list"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                @selection="onSelection"
                class="rounded-borders"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table>

      </q-page>
    </q-page-container>
    <q-dialog v-model="showForm" persistent >
      <q-card  class="q-pa-md"  style="width: 1000px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h4">
            {{mode}}訂單
            <div v-if="mode == '修改'">
              <q-checkbox v-model="salesOrderForm.結案" label="結案" :readonly="readonly || preview" @update:model-value="updateCloseFlag"/>
              <q-btn v-if="!preview" label="報價單分配" color="green" glossy densed/>&nbsp;
              <q-btn v-if="!preview" label="轉製令工件" color="primary" glossy densed/>&nbsp;
              <q-btn v-if="!preview" label="轉開出貨單" color="brown" glossy densed/>
            </div>
          </div>
        </q-card-section>
        <q-form ref="myForm" >
          <q-card-section>
            <!--日期、單號-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input outlined dense v-model="salesOrderForm.日期" label="日期" :readonly="readonly || preview" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="salesOrderForm.日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input v-model="salesOrderForm.單號" :readonly="readonly || preview" outlined dense label="單號"/>
              </div>
            </div>
            <!--預交日-->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12" style="max-width: 1000px">
                <q-input outlined dense v-model="salesOrderForm.要望日期" :readonly="readonly || preview" label="預交日" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="showETDPopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="salesOrderForm.要望日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="showETDPopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <br>
            <!--客戶編號、客戶簡稱-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select v-model="salesOrderForm.客戶編號" :readonly="readonly || preview" outlined dense label="客戶編號"
                :options="custNumberList"
                option-label="正航編號"
                option-value="正航編號"
                emit-value map-options
                @update:model-value="changeCustCompany"
                />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input  :readonly="readonly || preview" v-model="companyName" outlined dense label="客戶簡稱"></q-input>
              </div>
            </div>
            <br>
            <!--業務員、幣別-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select v-model="salesOrderForm.業務員" :readonly="readonly || preview" outlined dense label="業務員"
                :options="salesList"
                option-label="工號"
                option-value="工號"
                emit-value map-options
                @update:model-value="changeSalesName"
                />
                <label class="text-red text-center" style=" font-size: 24px;">
                  {{ salesname }}
                </label>
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select v-model="salesOrderForm.幣別" :readonly="readonly || preview" outlined dense label="幣別"
                :options="currencyList"
                option-label="currency"
                option-value="currency"
                emit-value map-options
                />
              </div>
            </div>
            <br>
            <!--交貨地址-->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12" style="max-width: 1000px">
                <q-input v-model="salesOrderForm.交貨地址" :readonly="readonly || preview"  outlined dense label="交貨地址" />
              </div>
            </div>
            <br>
            <!--稅別、稅率-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select v-model="salesOrderForm.稅別" outlined dense :readonly="readonly || preview" label="稅別"
                :options="taxTypeList"
                emit-value map-options
                />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select  outlined dense v-model="salesOrderForm.稅率"  label="稅率" :readonly="readonly || preview"
                :rules="[val => !!val || '稅率為必填欄位']"  emit-value map-options
                :options="taxRateList"/>
              </div>
            </div>
            <br>
            <!--價格條件、目的港-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select  outlined dense v-model="salesOrderForm.價格條件"  label="價格條件"
                :options="priceCondList" :readonly="readonly || preview"
                :rules="[val => !!val || '價格條件為必填欄位']"  emit-value map-options
                option-value="條文編號"
                option-label="條文名稱"/>
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input outlined dense v-model="salesOrderForm.目的港" :readonly="readonly || preview" label="目的港" />
              </div>
            </div>
            <br>
            <!--訂單總額、交貨方式-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input outlined dense v-model="salesOrderForm.總額" :readonly="readonly || preview" label="總額" />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select  outlined v-model="salesOrderForm.交貨方式" dense :readonly="readonly || preview"  label="交貨方式"
                  :options="handMethod"
                  :rules="[val => !!val || '交貨方式為必填欄位']"
                  option-value="條文編號"
                  option-label="條文名稱"
                  emit-value map-options
                />
              </div>
            </div>
            <br>
            <!--收款帳號、交期要求-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input outlined dense v-model="收款帳號" label="收款帳號" :readonly="readonly || preview" />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select  outlined v-model="salesOrderForm.交貨日期" dense  label="交期要求"
                  :options="dueDateTerm" :readonly="readonly || preview"
                  :rules="[val => !!val || '交貨日期為必填欄位']"
                  option-value="條文編號"
                  option-label="條文名稱"
                  emit-value map-options
                />
              </div>
            </div>
            <br>
            <!--指配國別、付款方式-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input outlined dense v-model="salesOrderForm.指配國別" :readonly="readonly || preview" label="指配國別" />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select  outlined v-model="salesOrderForm.付款方式" dense :readonly="readonly || preview"  label="付款方式"
                :options="paymentTerm"
                :rules="[val => !!val || '付款方式為必填欄位']"
                emit-value map-options
                option-value="條文編號"
                option-label="條文名稱"/>
              </div>
            </div>
            <br>
            <!--指配國別、付款方式-->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12" style="max-width: 1000px">
                <q-input outlined dense :readonly="readonly || preview" v-model="salesOrderForm.Remark"/>
              </div>
            </div>
          </q-card-section>
          <q-card-section style="
                            max-height: 70vh;
                            overflow: auto;
                          ">
            <div class="text-h6">
              產品列表
              <q-btn v-if="!preview" dense outlined label="增加品項" color="primary" @click="addItem"/>
            </div>
            <div style="min-width: 1500px">
              <div v-for="item in salesOrderForm.orderListDetail" v-bind:key="item.識別碼" class="row no-wrap q-col-gutter-md">
                <div class="col-1 col-md-1" style="max-width: 200px">
                  <q-input outlined dense v-model="item.產品編號" :readonly="readonly || preview" label="產品編號"
                  :rules="[val => !!val || '產品編號為必填欄位']"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 300px">
                  <q-input outlined dense v-model="item.品名規格" :readonly="readonly || preview" label="品名規格"
                  :rules="[val => !!val || '品名規格為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input outlined dense v-model="item.單位" :readonly="readonly || preview" label="銷售單位"
                  :rules="[val => !!val || '銷售單位為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.數量1" label="數量"
                  :rules="[val => !!val || '數量為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.單價1" label="單價" @blur="onBlur(item)"
                  :rules="[val => !!val || '單價為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.金額1" label="金額"
                  :rules="[val => !!val || '金額為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.報價單價" label="報價單價"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.折數" label="折數"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 300px">
                  <q-input outlined dense :readonly="readonly || preview" v-model="item.註記" label="註記"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 300px">
                  <q-input outlined dense :readonly="readonly || preview" v-model="item.專案序號" label="專案序號"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 300px">
                  <q-select outlined dense :readonly="readonly || preview" v-model="item.mtype" label="機台類型"
                  :options="eqpTypeList"
                  option-value="typeid"
                  option-label="type" emit-value map-options
                  :rules="[val => !!val || '機台類別為必填欄位']"/>
                </div>

                <div class="col-1 col-md-1" style="max-width: 80px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.佣金率" label="佣金率"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 300px">
                  <q-input outlined dense :readonly="readonly || preview" v-model="item.樣品別" label="樣品別"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 300px">
                  <q-input outlined dense :readonly="readonly || preview" v-model="item.描述" label="描述"/>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-form>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="negative" @click="close" />
          <q-btn v-if="!preview" label="送出" color="primary" @click="handleOtherAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <LoadingComponent v-model="secondDialog"/>
  </q-layout>
</template>
<script setup>
// import block start
import LoadingComponent from '@/components/LoadingComponent.vue';
import {
    QIcon
  , QLayout
  , QPage
  , QPageContainer
  , QTable
  , QBtn
  , QDialog
  , QCard
  , QCardSection
  , QForm
  , QInput
  // , QIcon
  , QPopupProxy
  , QDate
  , QCardActions
  , QSelect
  , QCheckbox
  , SessionStorage
} from 'quasar';
import {ref, onMounted} from 'vue'
import { useCustStore } from '@/composables/useCust';
//import block end

//variable block start
const custStore = useCustStore();
const showETDPopup = ref(false);
const preview = ref(false);
const myForm = ref(null);
const salesname = ref('');
const salesList = ref([]);
const currencyList  = ref([]);
const taxTypeList = ref([]);
const taxRateList   = ref([]);
const priceCondList = ref([]);
const handMethod = ref([]);
const dueDateTerm = ref([]);
const paymentTerm = ref([]);
const eqpTypeList   = ref([]);
const 收款帳號 = ref('');
const 單號 = ref('');
const mode = ref('');
const companyName = ref('');
const errorMessage = ref('');
const list = ref([]);
const selected = ref([]);
const showDatePopup = ref(false);
const showForm = ref(false);
const custNumberList = ref([]);
const columns =
[
  // { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
  { name: '單號', label: '訂單單號', align: 'left', field: '單號', sortable: true },
  { name: '客戶編號', label: '客戶編號', align: 'left', field: '客戶編號', sortable: true },
  { name: '日期', label: '日期', align: 'left', field: '日期', sortable: true },
];
const salesOrderForm = ref({
  識別:'',
  日期:'',
  單號:'',
  客戶編號:'',
  業務員:'',
  幣別:'',
  稅別:'',
  稅率:'',
  總額:0.0,
  佣金:0.0,
  結案:'',
  要望日期:'',
  交貨地址:'',
  指配國別:'',
  目的港:'',
  價格條件:'',
  交貨方式:'',
  付款方式:'',
  交貨日期:'',
  MACHINENO:'',
  Remark:'',
  建檔:'',
  修改:'',
  核准:'',
  建檔日:'',
  修改日:'',
  核准日:'',
  orderListDetail:[],
});
//variable block end

//function block start
const onSelection = () =>{

}
onMounted(async()=>{
  init();
})
const openCustomerDialog = (type) =>{
  mode.value = type;
  showForm.value = true;
  errorMessage.value = "";
  if (type == '新增'){
    console.log('open type', type);
    salesOrderForm.value = {
      識別:'',
      日期:'',
      單號:'',
      客戶編號:'',
      業務員:'',
      幣別:'',
      稅別:'',
      稅率:'',
      總額:0.0,
      佣金:0.0,
      結案:'',
      要望日期:'',
      交貨地址:'',
      指配國別:'',
      目的港:'',
      價格條件:'',
      交貨方式:'',
      付款方式:'',
      交貨日期:'',
      MACHINENO:'',
      Remark:'',
      建檔:'',
      修改:'',
      核准:'',
      建檔日:'',
      修改日:'',
      核准日:'',
      orderListDetail:[],
    };
    salesOrderForm.value.單號 = 單號.value;
    salesOrderForm.value.日期 = new Date().toISOString();
    console.log('salesOrderForm.value.單號',salesOrderForm.value.單號)
  } else if (type == '修改' || type == '預覽'){
     if (selected.value.length == 0){
      errorMessage.value = `請選取一筆資料做${type}`;
      showForm.value = false;
      preview.value = false;
      return;
    } else {
      errorMessage.value = "";
      if (type == '預覽')
        preview.value = true;
      showForm.value = true;
    }
    console.log('open type', type);
    salesOrderForm.value = selected.value[0];
  }
}
const changeCustCompany = () =>{
  console.log('salesOrderForm.value.客戶編號', salesOrderForm.value.客戶編號);
  companyName.value = custNumberList.value.find((x)=>x.正航編號==salesOrderForm.value.客戶編號).company;
  收款帳號.value = custNumberList.value.find((x)=>x.正航編號==salesOrderForm.value.客戶編號).credibility;
  salesOrderForm.value.指配國別 = custNumberList.value.find((x)=>x.正航編號==salesOrderForm.value.客戶編號).country;
}
const deleteCustomer = async () =>{
  if (selected.value.length == 0){
    errorMessage.value = "請選取一筆資料做刪除";
    return;
  }
  var result = confirm('您是否要刪除此筆訂單?');
  if (result){
    await custStore.deleteSalesOrder(selected.value[0].單號).then((data)=>{
      console.log('data', data);
      if (data.data.errorMessage && data.data.errorMessage != ''){
        alert(data.data.errorMessage);
      } else {
        alert('刪除成功');
      }
      init();
    })
  }
}
const init = async () =>{
  await custStore.getSalesOrderList().then((data)=>{
    console.log('data list', data);
    list.value = data;
  });
  await custStore.getCustNumberList().then((data)=>{
    console.log('custNumberList', data);
    custNumberList.value = data;
  });
  await custStore.getSalesList().then((data)=>{
    console.log('salesList', data);
    salesList.value = data;
  });
  await custStore.getCurrencyList().then((data)=>{
    console.log('currencyList', data);
    currencyList.value  = data;
  });
  await custStore.getTaxRateList().then((data)=>{
    console.log('taxRateList', data);
    taxRateList.value  = data;
  });
  await custStore.getTxConditionList('T').then((data)=>{
    console.log('priceCondList', data);
    priceCondList.value = data;
  });//價格條件

  await custStore.getTxConditionList('D').then((data)=>{
    console.log('handMethod', data);
    handMethod.value    = data;
  });//交貨方式
  await custStore.getTxConditionList('R').then((data)=>{
    console.log('dueDateTerm', data);
    dueDateTerm.value    = data;
  });//交貨要求

  await custStore.getTxConditionList('P,Y').then((data)=>{
    console.log('paymentTerm', data);
    paymentTerm.value  = data;
  });//付款方式

  await custStore.getEqpType().then((data)=>{
    console.log('eqpTypeList', data);
    eqpTypeList.value   = data;
  });//機台類型;

  await custStore.getSalesNo().then((data)=>{
      console.log('sales order no', data);
      單號.value = data
  })//銷售單號

  await custStore.getTaxType().then((data)=>{
    console.log('tax type', data)
    taxTypeList.value = data;
  })
}
const handleOtherAction = async () =>{
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}

const submitForm = async () =>{
  console.log('sales order form:', salesOrderForm);
  const Account = SessionStorage.getItem('Account');
  if (mode.value == '新增'){
    console.log('mode', mode.value)
    salesOrderForm.value.建檔 = Account.account;
    await custStore.saveSalesOrder(salesOrderForm).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('寫入成功');

      }
    });
  } else if (mode.value == '修改') {
    console.log('mode', mode.value)
    salesOrderForm.value.修改 = Account.account;
    await custStore.updateSalesOrderForm(salesOrderForm).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('修改成功');
      }
    });
  }
  showForm.value = false;
        salesOrderForm.value = {
          識別:'',
          日期:'',
          單號:'',
          客戶編號:'',
          業務員:'',
          幣別:'',
          稅別:'',
          稅率:'',
          總額:0.0,
          佣金:0.0,
          結案:'',
          要望日期:'',
          交貨地址:'',
          指配國別:'',
          目的港:'',
          價格條件:'',
          交貨方式:'',
          付款方式:'',
          交貨日期:'',
          MACHINENO:'',
          Remark:'',
          建檔:'',
          修改:'',
          核准:'',
          建檔日:'',
          修改日:'',
          核准日:'',
          salesOrderLines:[],
        };
}

const updateCloseFlag = async () =>{//TO-DO
  await custStore.updateCloseFlag(salesOrderForm.value.結案, salesOrderForm.value.單號).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert('已結案');
      showForm.value = false;
    }
  });
}

const changeSalesName = () =>{
  salesname.value = salesList.value.find((x)=>x.工號==salesOrderForm.value.業務員).姓名;
}

const close = () =>{
  showForm.value = false;
  preview.value = false;
  salesOrderForm.value = {
    識別:'',
    日期:'',
    單號:'',
    客戶編號:'',
    業務員:'',
    幣別:'',
    稅別:'',
    稅率:'',
    總額:0.0,
    佣金:0.0,
    結案:'',
    要望日期:'',
    交貨地址:'',
    指配國別:'',
    目的港:'',
    價格條件:'',
    交貨方式:'',
    付款方式:'',
    交貨日期:'',
    MACHINENO:'',
    Remark:'',
    建檔:'',
    修改:'',
    核准:'',
    建檔日:'',
    修改日:'',
    核准日:'',
  };
}
const addItem = () =>{
  salesOrderForm.value.orderListDetail.push({
    產品編號:'',
    品名規格:'',
    單位:'',
    數量1:0.0,
    單價1:0.0,
    金額1:0.0,
    報價單價:0.0,
    折數:0.0,
    註記:'',
    專案序號:'',
    mtype:'',
    佣金率:0.0,
    樣品別:'',
    描述:'',
    showDatePopup:false
  });
}
const onBlur = (item) =>{
  item.金額1 = item.單價1 * item.數量1;
  sumAmount();
}
const sumAmount = () =>{
  salesOrderForm.value.總額 = 0;
  for(let i = 0; i <  salesOrderForm.value.orderListDetail.length; i++) {
    salesOrderForm.value.總額 += salesOrderForm.value.orderListDetail[i].金額1;
  }
}
//function block end
</script>
