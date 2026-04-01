<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.編修))">
          <!-- <div class="padding-right"> -->
            <q-btn color="primary" class="padding-right"
                        glossy @click="openCustomDialog('新增')"
                        :loading="loading">新增出貨單</q-btn>&nbsp;
          <!-- </div> -->
          <!-- <div class="padding-right"> -->
            <q-btn color="info" class="padding-right"
                        glossy @click="openCustomDialog('修改')"
                        :loading="loading">修改出貨單</q-btn>&nbsp;
          <!-- </div> -->
          <!-- <div class="padding-right"> -->
            <q-btn color="red" class="padding-right"
                        glossy @click="deleteShippingOrder"
                        :loading="loading">刪除出貨單</q-btn>&nbsp;
          <!-- </div> -->
        </div>

        <div v-if="(hasAllAuth ||(auth && auth.查詢))">
        <!-- <div class="padding-right"> -->
          <q-btn color="green" class="padding-right"
                       glossy @click="openCustomDialog('預覽')"
                       :loading="loading">預覽出貨單</q-btn>&nbsp;
          <q-btn color="blue-6" class="padding-right"
                  glossy @click="openSearchForm"
                  :loading="loading">出貨單查詢</q-btn>&nbsp;
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
                @selection="onSelection"
                :pagination="{ rowsPerPage: 5 }"
        ></q-table >
      </q-page>
    </q-page-container>
    <!--主畫面-->
    <q-dialog v-model="showForm" persistent >
      <q-card class="q-pa-md"  style="width: 1000px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h4">
            {{mode}}出貨單
            <q-btn outlined dense glossy color="primary" v-if="!preview" label="訂單分配" @click="showSODistributionForm"/>
            <q-dialog v-model="showSODistribution" persistent>
              <SalesOrderDistributionView v-model:showForm="showSODistribution"/>
            </q-dialog>
            <q-card-actions align="right">
              <div>
                <q-btn flat label="取消" color="negative" @click="close" />
                <q-btn v-if="!preview" label="送出" color="primary" @click="handleOtherAction" />
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
            <!--日期、客戶編號-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input  outlined dense :readonly="preview" v-model="form.日期" label="日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.日期" :readonly="preview" mask="YYYY/MM/DD" no-title>
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
                 <q-select v-model="form.客戶編號" :readonly="readonly || preview" outlined dense label="客戶編號"
                :options="custNumberList"
                option-label="正航編號"
                option-value="正航編號"
                emit-value map-options
                @update:model-value="changeCustCompany"
                />
                <q-icon name="search" size="30px" @click="openSearcCustomerForm" class="cursor-pointer"></q-icon>
                <q-dialog v-model="showSearchCustNoForm" perisitent>
                  <CustListQueryView v-model:showForm="showSearchCustNoForm" v-model:custNo="form.客戶編號"/>
                </q-dialog>
                <label class="text-red text-center" style=" font-size: 24px;">{{ companyName }}</label>
              </div>
            </div>
            <!--佣金、原定交貨日期-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input outlined dense v-model="form.佣金" :readonly="preview" label="應付佣金"/>
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input  outlined dense :readonly="preview" v-model="form.原定交貨日期" label="原定交貨日" mask="####/##/##" :rules="[val =>  !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="showShipDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.原定交貨日期" :readonly="preview" mask="YYYY/MM/DD" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="showShipDatePopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <!--稅別、稅率-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select v-model="form.稅別" outlined dense :readonly="readonly || preview" label="稅別"
                :options="taxTypeList"
                emit-value map-options
                />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select  outlined dense v-model="form.稅率"  label="稅率" :readonly="readonly || preview"
                :rules="[val =>  !!val || '稅率為必填欄位']"  emit-value map-options
                :options="taxRateList"/>
              </div>
            </div>
            <!--客戶全名-->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12" style="max-width: 1000px">
                <q-input  :readonly="readonly || preview" v-model="companyFullName" outlined dense label="客戶全名"></q-input>
              </div>
            </div>
            <br>
            <!--幣別、匯率-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select v-model="form.幣別" :readonly="readonly || preview" outlined dense label="幣別"
                :options="currencyList"
                option-label="currency"
                option-value="currency"
                @update:model-value="changeExRate"
                emit-value map-options
                />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select outlined dense  label="匯率"
                  :options="exRateList"
                  v-model="form.匯率"
                  option-label="匯率" :readonly="readonly || preview"
                  option-value="匯率"  emit-value map-options
                  :rules="[val => !preview && !!val || '匯率為必填欄位']"
                  />
              </div>
            </div>
            <!--訂單總額、收款帳號-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input v-model="form.總額" outlined dense label="訂單總額" readonly />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input v-model="form.收款帳號" outlined dense label="收款帳號" />
                <q-btn outlined dense glossy color="green"  v-if="!preview" label="核對" @click="openBankInfo"/>
              </div>
            </div>
            <!--收貨地址-->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12" style="max-width: 1000px">
                <q-input v-model="form.交貨地址" outlined dense :readonly="preview" label="收貨地址"/>
              </div>
            </div>
            <br>
            <!--指配國別、目的港-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input v-model="form.指配國別" outlined dense :readonly="preview" label="指配國別" />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input v-model="form.目的港" outlined dense :readonly="preview" label="目的地"/>
              </div>
            </div>
            <br>
            <!--交貨方式、貿易條件-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select  outlined v-model="form.交貨方式" dense :readonly="readonly || preview"  label="交貨方式"
                    :options="handMethod"
                    :rules="[val =>  !!val || '交貨方式為必填欄位']"
                    option-value="條文編號"
                    option-label="條文名稱"
                    emit-value map-options
                  />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select  outlined dense v-model="form.價格條件"  label="貿易條件"
                :options="priceCondList" :readonly="readonly || preview"
                :rules="[val =>  !!val || '價格條件為必填欄位']"  emit-value map-options
                option-value="條文編號"
                option-label="條文名稱"/>
              </div>
            </div>
            <!--業務員、付款方式-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select v-model="form.業務員" :readonly="readonly || preview" outlined dense label="業務人員"
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
                <q-select  outlined v-model="form.付款方式" dense :readonly="readonly || preview"  label="付款方式"
                :options="paymentTerm"
                :rules="[val =>  !!val || '付款方式為必填欄位']"
                emit-value map-options
                option-value="條文編號"
                option-label="條文名稱"/>
              </div>
            </div>
            <br>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12" style="max-width: 1000px">
                <q-input v-model="form.remark" outlined dense :readonly="preview" label="備註"/>
              </div>
            </div>
          </q-card-section>
          <!--出貨明細-->
          <q-card-section style="
                            max-height: 70vh;
                            overflow: auto;
                          ">
            <h6>
              出貨明細
              <q-btn v-if="!preview" dense outlined  label="新增明細" color="primary" glossy @click="AddShipOrderDetail"/>
            </h6>
            <div style="min-width: 1500px">
              <div v-for="item in form.shipOrderLists"  v-bind:key="item.識別碼" class="row no-wrap q-col-gutter-md">
                <div class="col-1 col-md-1" style="max-width: 200px">
                  <q-input outlined dense v-model="item.產品編號" :readonly="readonly || preview" label="產品編號"
                  :rules="[val =>  !!val || '產品編號為必填欄位']"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 300px">
                  <q-input outlined dense v-model="item.品名規格" :readonly="readonly || preview" label="品名規格"
                  :rules="[val =>  !!val || '品名規格為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input outlined dense v-model="item.單位" :readonly="readonly || preview" label="銷售單位"
                  :rules="[val =>  !!val || '銷售單位為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.數量2" label="數量"
                  :rules="[val =>  !!val || '數量為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.單價2" label="訂單單價" @blur="onBlur(item)"
                  :rules="[val =>  !!val || '單價為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.金額2" label="未稅金額"
                  :rules="[val =>  !!val || '金額為必填欄位']"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 300px">
                  <q-input outlined dense v-model="item.描述" :readonly="readonly || preview" label="註記"
                  :rules="[val =>  !!val || '描述為必填欄位']"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 300px">
                  <q-input outlined dense v-model="item.樣品別" :readonly="readonly || preview" label="專案序號"
                  :rules="[val =>  !!val || '樣品別為必填欄位']"/>
                </div>
                <div class="col-2 col-md-2" style="max-width: 300px">
                  <q-select  outlined v-model="item.倉庫別" dense :readonly="readonly || preview"  label="倉庫別"
                  :options="warehouseList"
                  :rules="[val =>  !!val || '倉庫別為必填欄位']"
                  emit-value map-options
                  option-value="倉庫"
                  option-label="倉庫"/>
                </div>
              </div>
            </div>
            <label class="text-h4">金額總計：{{ form.總額 }}</label>
          </q-card-section>
          <label class="text-h4">
            <div class="row q-col-gutter-md">
              <div class="col-4 col-md-4 no-wrap"  style="max-width: 300px">
                財務覆核：{{ form.核准 }}
                <q-input outlined dense v-model="form.核准日" style="max-width: 150px" readonly/>
              </div>
              <div class="col-4 col-md-4 no-wrap"  style="max-width: 300px">
                修改人員：{{ form.修改 }}
                <q-input outlined dense v-model="form.修改日" style="max-width: 150px"  readonly/>
              </div>
              <div class="col-4 col-md-4 no-wrap"  style="max-width: 300px">
                建檔人員：{{ form.建檔 }}
                <q-input outlined dense v-model="form.建檔日" style="max-width: 150px"  readonly/>
              </div>
            </div>
          </label>
        </q-form>
      </q-card>
    </q-dialog>
    <!--銀行資訊核對-->
    <q-dialog v-model="showBankInfo" persistent>
      <BankInfoView v-model:showForm="showBankInfo" :bankAccountCheckForm="bankAccountCheckForm"/>
    </q-dialog>
    <!--show訂單分配-->
    <q-dialog v-model="showSODistribution" persistent>
      <SalesOrderDistributionView />
    </q-dialog>
    <!--顯示查詢畫面-->
    <q-dialog v-model="showSearchForm" persistent>
      <SoldOutQueryForm v-model:showForm="showSearchForm" v-model:list="list"/>
    </q-dialog>
  </q-layout>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region import block start
import { useCustStore } from '@/composables/useCust';
import BankInfoView from '@/components/customer/salesorder/BankInfoView.vue';
import SalesOrderDistributionView from '@/components/customer/salesorder/SalesOrderDistributionView.vue';
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
  , QForm
  , QInput
  , QDate
  , QPopupProxy
  , QSelect
  , QCardActions,
  SessionStorage
} from 'quasar';
import { ref, onMounted, watch } from 'vue';
import dayjs from 'dayjs'
import CustListQueryView from '@/components/customer/query/CustListQueryView.vue'
import LoadingComponent from '@/components/LoadingComponent.vue';
import SoldOutQueryForm from '@/components/inventory/query/SoldOutQueryForm.vue';
// #endregion import block end

// #region variable block start
const showSearchCustNoForm = ref(false);
const formName = '銷貨出庫';
const showSearchForm = ref(false);
const auth = ref({});
const hasAllAuth = ref(false);
const theUser = ref({});
const secondDialog = ref(false);
const exRateList    = ref([]);
const companyFullName = ref('');
const taxTypeList = ref([]);
const taxRateList   = ref([]);
const currencyList  = ref([]);
const warehouseList = ref([]);
const showShipDatePopup = ref(false);
const salesname = ref('');
const preview = ref(false);
const showSODistribution = ref(false);
const showDatePopup = ref(false);
const custNumberList = ref([]);
const companyName = ref('');
const myForm = ref(null);
const errorMessage = ref('');
const list = ref([]);
const selected = ref([]);
const priceCondList = ref([]);
const dueDateTerm = ref([]);
const handMethod = ref([]);
const paymentTerm = ref([]);
const salesList = ref([]);
const showForm = ref(false);
const showBankInfo = ref(false);
const mode = ref('');
const columns = [
  { name: '單號', label: '出貨單號', align: 'left', field: '單號', sortable: true },
  { name: '日期', label: '出貨單日期', align: 'left', field: '日期', sortable: true },
  { name: '客戶編號', label: '客戶編號', align: 'left', field: '客戶編號', sortable: true },
  { name: '客戶簡稱', label: '客戶簡稱', align: 'left', field: '客戶簡稱', sortable: true },
  { name: '總額', label: '出貨單總額', align: 'left', field: '總額', sortable: true },
  { name: '原定交貨日期', label: '原定交貨日期', align: 'left', field: '原定交貨日期', sortable: true },
  { name: '付款方式', label: '交易條件', align: 'left', field: '付款方式', sortable: true },
  { name: '交貨方式', label: '運輸方式', align: 'left', field: '交貨方式', sortable: true },
  { name: '價格條件', label: '貿易條件', align: 'left', field: '價格條件', sortable: true },
  { name: '業務員', label: '業代', align: 'left', field: '業務員', sortable: true },
  { name: '業務人員', label: '業務人員', align: 'left', field: '業務人員', sortable: true },
  { name: '核准', label: '核准', align: 'left', field: '核准', sortable: true },
];
const custStore = useCustStore();
const form = ref({
  識別:0,
  日期:'',
  單號:'',
  客戶編號:'',
  業務員:'',
  幣別:'',
  匯率:0.0,
  稅別:'',
  稅率:'',
  佣金:0.0,
  原定交貨日期:'',
  交貨地址:'',
  指配國別:'',
  目的港:'',
  價格條件:'',
  交貨方式:'',
  付款方式:'',
  remark:'',
  總額:0.0,
  收款帳號:'',
  建檔:'',
  修改:'',
  shipOrderLists:[],
})
const bankAccountCheckForm = ref({
  銀存編碼:'',
  銀行名稱:'',
  Bankname:'',
  銀行地址:'',
  帳號:'',
  SwiftCode:'',
  電話:'',
});
// #endregion variable block end

// #region function block start
const openCustomDialog = async (type) => {
  console.log('type', type)
  mode.value = type;
  showForm.value = true;
  errorMessage.value = "";
  companyName.value = "";
  form.value = {
      識別:0,
      日期:'',
      單號:'',
      客戶編號:'',
      業務員:'',
      幣別:'',
      匯率:0.0,
      稅別:'',
      稅率:'',
      佣金:0.0,
      原定交貨日期:'',
      交貨地址:'',
      指配國別:'',
      目的港:'',
      價格條件:'',
      交貨方式:'',
      付款方式:'',
      remark:'',
      總額:0.0,
      收款帳號:'',
      建檔:'',
      修改:'',
      shipOrderLists:[],
    };
  if (type == '新增') {
    await custStore.getShippingOrderNo().then((data)=>{
      form.value.單號 = data;
    });
    console.log('form', form)
  } else if (type == '修改'|| type == '預覽') {
    if (selected.value.length == 0){
      showForm.value = false;
      errorMessage.value = "請選取一筆資料做"+type+"!";
      return;
    }
    form.value =  selected.value[0];
    console.log(type+'form', form.value)
    changeSalesName();
    changeCustCompany();
    await changeExRate(form.value.幣別)
    form.value.日期 = dayjs(form.value.日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
    form.value.原定交貨日期 = dayjs(form.value.原定交貨日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
    if (type == '預覽') {
      preview.value = true;
    } else {
      preview.value = false;
    }
  }
}
const onSelection = () =>{

}

const openSearcCustomerForm = () =>{
  // alert('openSearcCustomerForm');
  showSearchCustNoForm.value = true;
}
const init = async () =>{
  secondDialog.value = true;
   await custStore.getShipOrderList().then((data)=>{
    list.value = data;
    list.value.forEach((x)=>x.日期 = dayjs(x.日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD"))
    list.value.forEach((x)=>x.原定交貨日期 = dayjs(x.原定交貨日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD"))
  });
  await custStore.getCustNumberList().then((data)=>{
    console.log('custNumberList', data);
    custNumberList.value = data;
  });
  await custStore.getTaxType().then((data)=>{
    console.log('tax type', data)
    taxTypeList.value = data;
  })//稅別
  await custStore.getTaxRateList().then((data)=>{
    console.log('taxRateList', data);
    taxRateList.value  = data;
  });
  await custStore.getCurrencyList().then((data)=>{
    console.log('currencyList', data);
    currencyList.value  = data;
  });

  priceCondList.value = await custStore.getTxConditionList('T');//價格條件
  // console.log('priceCondList',priceCondList.value);
  dueDateTerm.value   = await custStore.getTxConditionList('R');//交貨要求
  handMethod.value    = await custStore.getTxConditionList('D');//
  paymentTerm.value  = await custStore.getTxConditionList('P,Y');//付款方式
  await custStore.getSalesList().then((data)=>{
    console.log('salesList', data);
    salesList.value = data;
  });
  await custStore.getWarehouseList().then((data)=>{
    warehouseList.value = data;
  })//倉庫別
  // let pt2   = await custStore.getTxConditionList('P');//付款方式theUser.value = SessionStorage.getItem('Account');
  theUser.value = SessionStorage.getItem('Account');
  auth.value = theUser.value.authList.find((x)=>x.menuSubName == formName);
  hasAllAuth.value =
      (!auth.value.高管 && !auth.value.核准 && !auth.value.編修 && !auth.value.報表 && !auth.value.輸出);
  console.log('auth', auth.value);
  selected.value = [];
  secondDialog.value = false;
}
onMounted(()=>{
  init();
})
const changeExRate = async (val) =>{
  console.log('val.currency', val);
  try{
  exRateList.value = await custStore.getExRateList(val);
  form.value.匯率 = exRateList.value[0].匯率;
  }catch(e){console.log(e)}
}
const changeCustCompany = () =>{
  console.log('salesOrderForm.value.客戶編號', form.value.客戶編號);
  let cust = custNumberList.value.find((x)=>x.正航編號==form.value.客戶編號);
  companyName.value = cust?.company;
  companyFullName.value = cust?.companyfullname;
  form.value.指配國別 =  cust?.country;
  // 收款帳號.value = custNumberList.value.find((x)=>x.正航編號==form.value.客戶編號).credibility;
  // salesOrderForm.value.指配國別 = custNumberList.value.find((x)=>x.正航編號==form.value.客戶編號).country;
}
const close = () =>{
  showForm.value = false;
}
const handleOtherAction = async () =>{
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}
const openBankInfo = async () =>{
  if (form.value.收款帳號 == '')
  {
    alert('請輸入收款帳號');
    return;
  }
  await custStore.getBankInfo(form.value.收款帳號).then((data)=>{
    console.log('bank data',data)
    bankAccountCheckForm.value = data;
    showBankInfo.value = true;
  })
}
const AddShipOrderDetail = () =>{
  console.log('form.value.shipOrderLists', form.value.shipOrderLists)
  form.value.shipOrderLists.push({
    識別碼:0,
    單號:'',
    產品編號:'',
    品名規格:'',
    數量2:0.0,
    單位:'',
    單價2:0.0,
    金額2:0.0,
    樣品別:'',
    描述:'',
    ORDNO:'',
    倉庫別:'',
  });
}
const submitForm = async () =>{
  console.log('submit form', form)
  secondDialog.value = true;
  if (mode.value == '新增'){
    form.value.建檔 = SessionStorage.getItem('Account').account;
    await custStore.saveShipOrder(form).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert(mode.value+'成功');
      }
      showForm.value = false;
      getData();
    })
  } else if (mode.value == '修改') {
    form.value.修改 = SessionStorage.getItem('Account').account;
    await custStore.updateShipOrder(form).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert(mode.value+'成功');
      }
      showForm.value = false;
      getData();
    })
  }
}

const showSODistributionForm = () =>{
  showSODistribution.value = true;
}

const changeSalesName = () =>{
  console.log('form.value.業務員',form.value.業務員);
  salesname.value = salesList.value.find((x)=>x.工號==form.value.業務員).姓名;
}
const onBlur = (item) =>{
  item.金額2 = item.單價2 * item.數量2;
  sumAmount();
}
const sumAmount = () =>{
  form.value.amount = 0;
  for(let i = 0; i <  form.value.shipOrderLists.length; i++) {
    form.value.總額 += form.value.shipOrderLists[i].金額2;
  }
}

const getData = async () =>{
  await custStore.getShipOrderList().then((data)=>{
    list.value = data;
  });
  secondDialog.value = false;
}

const deleteShippingOrder = async () =>{
  var result = confirm('您確定刪除?');
  if (!result)
    return;
  const delForm = selected.value[0]
  secondDialog.value = true;
  await custStore.deleteShippingOrder(delForm).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage)
    } else {
      alert('刪除成功');
      getData();
    }
  });
}

const validate = async (valid) => {
  await custStore.validateShipOrder(form.value.單號, valid, theUser.value.account).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert((valid?'覆核':'取消覆核')+'成功!');
    }
    close();
    init();
  })
}

const openSearchForm = () =>{
  showSearchForm.value = true;
}

watch(
  () => form.value.客戶編號,
  (newVal) => {
    console.log('資料更新了', newVal)
    if(newVal)
      changeCustCompany();
  },
  { deep: true, immediate: true }
)
// #endregion function block end
</script>
