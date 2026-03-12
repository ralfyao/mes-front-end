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
              glossy @click="openCustomerDialog('新增')"
              :loading="loading">新增訂單</q-btn>&nbsp;
          <!-- </div> -->
          <!-- <div class="padding-right"> -->
            <q-btn color="info" class="padding-right"
              glossy @click="openCustomerDialog('修改')"
              :loading="loading">修改訂單</q-btn>&nbsp;
          <!-- </div> -->
          <!-- <div class="padding-right"> -->
              <q-btn color="red" class="padding-right"
                glossy @click="deleteCustomer"
                :loading="loading">刪除訂單</q-btn>&nbsp;
          <!-- </div> -->
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.查詢))">
          <!-- <div class="padding-right"> -->
            <q-btn color="green" class="padding-right"
                glossy @click="openCustomerDialog('預覽')"
                  :loading="loading">訂單預覽</q-btn>&nbsp;
          <!-- </div> -->
          <q-btn color="blue-6" class="padding-right"
                glossy @click="openSearchForm"
                  :loading="loading">訂單查詢</q-btn>&nbsp;
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
    <!--查詢條件表單-->
    <q-dialog v-model="showQueryForm" persistent >
      <OrderQueryForm v-model:showForm="showQueryForm" v-model:list="list"/>
    </q-dialog>
    <!--主表單-->
    <q-dialog v-model="showForm" persistent >
      <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
        <q-card-section>
          <div class="col-3 flex text-h4">
            {{mode}}訂單
            <div class="col-3 flex" v-if="mode == '修改'">
              <q-checkbox v-model="salesOrderForm.結案" label="結案" :readonly="readonly || preview" @update:model-value="updateCloseFlag"/>
              <q-btn v-if="!preview" label="報價單分配" color="green" glossy densed @click="quotationDistribution"/>&nbsp;
              <q-btn v-if="!preview" label="轉製令工件" color="primary" glossy densed/>&nbsp;
              <q-btn v-if="!preview" label="轉開出貨單" color="brown" glossy densed @click="transferToShipOrder"/>
            </div>
            <div class="col-3 flex" v-if="(hasAllAuth ||(auth && auth.核准)) && !preview && mode == '修改'">
              <q-btn color="grey" class="padding-right"
                      glossy v-if="salesOrderForm.核准日 && salesOrderForm.核准日!= ''"
                      :loading="loading" @click="validate(false)">取消核准</q-btn> &nbsp;
              <q-btn color="grey" class="padding-right"
                      glossy v-if="!salesOrderForm.核准日 || salesOrderForm.核准日== ''"
                      :loading="loading" @click="validate(true)">核准</q-btn> &nbsp;
            </div>
            <div class="col-3 flex" v-if="(hasAllAuth ||(auth && auth.輸出))">
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
            <q-card-actions align="right">
              <q-btn flat label="取消" color="negative" @click="close" />
              <q-btn v-if="!preview" label="送出" color="primary" @click="handleOtherAction" />
            </q-card-actions>
          </div>
        </q-card-section>
        <q-form ref="myForm" >
          <q-card-section>
            <!--日期、單號-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-input outlined dense v-model="salesOrderForm.日期" label="日期" :readonly="readonly || preview" mask="####/##/##" :rules="[val =>  !!val || '日期為必填欄位']">
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
                <q-icon name="search" size="30px" @click="openSearcCustomerForm" class="cursor-pointer"></q-icon>
                <q-dialog v-model="showSearchCustNoForm" perisitent>
                  <CustListQueryView v-model:showForm="showSearchCustNoForm" v-model:custNo="salesOrderForm.客戶編號"/>
                </q-dialog>
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
                :rules="[val =>  !!val || '稅率為必填欄位']"  emit-value map-options
                :options="taxRateList"/>
              </div>
            </div>
            <br>
            <!--價格條件、目的港-->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select  outlined dense v-model="salesOrderForm.價格條件"  label="價格條件"
                :options="priceCondList" :readonly="readonly || preview"
                :rules="[val =>  !!val || '價格條件為必填欄位']"  emit-value map-options
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
                  :rules="[val =>  !!val || '交貨方式為必填欄位']"
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
                <q-btn  outlined dense label="核對" color="green" glossy v-if="!preview" @click="openAccountCheck" />
              </div>
              <div class="col-6 col-md-6" style="max-width: 500px">
                <q-select  outlined v-model="salesOrderForm.交貨日期" dense  label="交期要求"
                  :options="dueDateTerm" :readonly="readonly || preview"
                  :rules="[val =>  !!val || '交貨日期為必填欄位']"
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
                :rules="[val =>  !!val || '付款方式為必填欄位']"
                emit-value map-options
                option-value="條文編號"
                option-label="條文名稱"/>
              </div>
            </div>
            <br>
            <!--備註-->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12" style="max-width: 1000px">
                <q-input outlined dense :readonly="readonly || preview" v-model="salesOrderForm.remark" label="備註"/>
              </div>
            </div>
          </q-card-section>
          <q-card-section style="
                            max-height: 70vh;
                            overflow: auto;
                          ">

            <!--分期收款-->
            <h6>
              收款列表
              <q-btn v-if="!preview" dense outlined  label="新增收款" color="primary" glossy @click="AddAR"/>
            </h6>
            <div style="min-width: 1500px">
              <div v-for="item in salesOrderForm.arListDetail" v-bind:key="item.識別" class="row no-wrap q-col-gutter-md">
                <div class="col-1 col-md-1" style="max-width: 200px">
                  <q-select dense outlined emit-value map-options label="款項期別"
                    :readonly="readonly || preview"
                    v-model="item.款項期別"
                    :options="installmentTypeList"
                    option-value="期別名稱"
                    option-label="期別名稱"
                  />
                </div>
                <div class="col-1 col-md-1" style="max-width: 200px">
                  <q-input
                    type="number" dense outlined
                    v-model="item.成數"
                    label="成數"
                    :min="0.0"
                    :readonly="readonly || preview"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 200px">
                   <q-input
                    type="number" dense outlined
                    v-model="item.金額"
                    label="金額"
                    :min="0.0"
                    :readonly="readonly || preview"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 200px">
                  <q-input dense outlined
                    v-model="item.請款單號"
                    label="立帳單號"
                    readonly/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 200px">
                  <q-btn label="轉立帳單" color="green" glossy v-if="!preview && (item.請款單號 == '')" @click="transferReceivable(item)" />
                </div>
              </div>
              <br>
            </div>
            <br>
            <div class="text-h6">
              產品列表
              <q-btn v-if="!preview" dense outlined label="增加品項" color="primary" glossy @click="addItem"/>
            </div>
            <div style="min-width: 1500px">
              <div v-for="item in salesOrderForm.orderListDetail" v-bind:key="item.識別碼" class="row no-wrap q-col-gutter-md">
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
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.數量1" label="數量"
                  :rules="[val =>  !!val || '數量為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.單價1" label="單價" @blur="onBlur(item)"
                  :rules="[val =>  !!val || '單價為必填欄位']"/>
                </div>
                <div class="col-1 col-md-1" style="max-width: 180px">
                  <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.金額1" label="金額"
                  :rules="[val =>  !!val || '金額為必填欄位']"/>
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
                  :rules="[val =>  !!val || '機台類別為必填欄位']"/>
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
            <label class="justify-center">金額總計：{{ salesOrderForm.總額 }}</label>
          </q-card-section>
        </q-form>
        <q-card-section>
          <label class="text-h4">
            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3 no-wrap"  style="max-width: 300px">
                核准人員：{{ salesOrderForm.核准 }}
                <q-input outlined dense v-model="salesOrderForm.核准日" style="max-width: 150px" readonly/>
              </div>
              <div class="col-3 col-md-3 no-wrap"  style="max-width: 300px">
                修改人員：{{ salesOrderForm.修改 }}
                <q-input outlined dense v-model="salesOrderForm.修改日" style="max-width: 150px"  readonly/>
              </div>
              <div class="col-3 col-md-3 no-wrap"  style="max-width: 300px">
                建檔人員：{{ salesOrderForm.建檔 }}
                <q-input outlined dense v-model="salesOrderForm.建檔日" style="max-width: 150px"  readonly/>
              </div>
              <div class="col-3 col-md-3 no-wrap"  style="max-width: 300px">
                製令工號{{ salesOrderForm.machineno }}
              </div>
            </div>
          </label>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--銀行帳戶核對-->
    <q-dialog v-model="showCheckForm" persistent>
      <BankInfoView
        v-model:showForm="showCheckForm"
        :bankAccountCheckForm="bankAccountCheckForm"
      />
    </q-dialog>
    <!--報價單分配-->
    <q-dialog v-model="showQuotationDistributionForm">
      <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
        <q-card-section>
          <div class="text-h4">料號選擇</div>
        </q-card-section>
        <q-card-section>
          <q-table  class="rounded-borders my-sticky-header-table"
                :columns="quotColumns"
                row-key="識別碼"
                :rows="quotationDistributionList"
                flat
                bordered
                selection="multiple"
                virtual-scroll
                style="max-height: 500px"
                v-model:selected="selectedQuotation"
                @selection="onSelection"
                :pagination="{ rowsPerPage: 5 }"
          ></q-table >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="帶入訂單" color="primary" @click="carryToSalesOrder" />
          <q-btn flat label="取消" color="negative" @click="closeQuotationDistributionForm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <LoadingComponent v-model="secondDialog"/>
  </q-layout>
</template>
<script setup>
// #region import block start
import dayjs from 'dayjs'
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
import {ref, onMounted, watch} from 'vue'
import { useCustStore } from '@/composables/useCust';
import BankInfoView from '@/components/customer/salesorder/BankInfoView.vue';
import CustListQueryView from '@/components/customer/query/CustListQueryView.vue'
import OrderQueryForm from '@/components/customer/query/OrderQueryForm.vue';
// #endregion import block end

// #region variable block start
const showSearchCustNoForm = ref(false);
const formName = '訂單合約';
const theUser = ref([]);
const auth = ref({});
const hasAllAuth = ref(false);
const custStore = useCustStore();
const showETDPopup = ref(false);
const showQueryForm = ref(false);
const preview = ref(false);
const showCheckForm = ref(false);
const showQuotationDistributionForm = ref(false);
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
const quotationDistributionList = ref([]);
const installmentTypeList = ref([]);
const 收款帳號 = ref('');
const 單號 = ref('');
const mode = ref('');
const companyName = ref('');
const errorMessage = ref('');
const secondDialog = ref(false);
const list = ref([]);
const selected = ref([]);
const selectedQuotation = ref([]);
const showDatePopup = ref(false);
const showForm = ref(false);
const custNumberList = ref([]);
const columns =
[
  // { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
  { name: '單號', label: '訂單單號', align: 'left', field: '單號', sortable: true },
  { name: '日期', label: '日期', align: 'left', field: '日期', sortable: true },
  { name: '客戶編號', label: '客戶編號', align: 'left', field: '客戶編號', sortable: true },
  { name: '客戶全稱', label: '客戶全稱', align: 'left', field: '客戶全稱', sortable: true },
  { name: '指配國別', label: '國別', align: 'left', field: '指配國別', sortable: true },
  { name: '總額', label: '訂單總額', align: 'left', field: '總額', sortable: true },
  { name: '要望日期', label: '預交日', align: 'left', field: '要望日期', sortable: true },
  { name: '付款方式', label: '交易條件', align: 'left', field: '付款方式', sortable: true },
  { name: '交貨方式', label: '運輸方式', align: 'left', field: '交貨方式', sortable: true },
  { name: '價格條件', label: '貿易條件', align: 'left', field: '價格條件', sortable: true },
  { name: '業務員', label: '業代', align: 'left', field: '業務員', sortable: true },
  { name: '業務人員', label: '業務人員', align: 'left', field: '業務人員', sortable: true },
  { name: '核准', label: '核准', align: 'left', field: '核准', sortable: true },
  { name: '結案', label: '結案', align: 'left', field: '結案', sortable: true },
];

const quotColumns =
[
  // { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
  { name: '產品編號', label: '產品編號', align: 'left', field: '產品編號', sortable: true },
  { name: '品名規格', label: '品名規格', align: 'left', field: '品名規格', sortable: true },
  { name: '數量', label: '數量', align: 'left', field: '數量', sortable: true },
  { name: '單位', label: '單位', align: 'left', field: '單位', sortable: true },
  { name: '單價', label: '單價', align: 'left', field: '單價', sortable: true },
  { name: '報價單號', label: '報價單號', align: 'left', field: 'quono', sortable: true },
];
const salesOrderForm = ref({
  account:SessionStorage.getItem('Account').account,
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
  結案:false,
  要望日期:'',
  交貨地址:'',
  指配國別:'',
  目的港:'',
  價格條件:'',
  交貨方式:'',
  付款方式:'',
  交貨日期:'',
  machineno:'',
  remark:'',
  建檔:'',
  修改:'',
  核准:'',
  建檔日:'',
  修改日:'',
  核准日:'',
  orderListDetail:[],
  arListDetail:[],
});
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
const openSearchForm = () =>{
  showQueryForm.value = true;
}
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
      account:SessionStorage.getItem('Account').account,
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
      machineno:'',
      remark:'',
      建檔:'',
      修改:'',
      核准:'',
      建檔日:'',
      修改日:'',
      核准日:'',
      orderListDetail:[],
      arListDetail: []
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
      salesOrderForm.value = selected.value[0];
      console.log('selected customer:', salesOrderForm.value)
      console.log('custNumberList.value',custNumberList.value);
      console.log('salesOrderForm.value.客戶編號', salesOrderForm.value.客戶編號);
      console.log('Customer Number List', custNumberList.value.find((x)=>x.正航編號==salesOrderForm.value.客戶編號));
      salesOrderForm.value.日期 = dayjs(salesOrderForm.value.日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
      companyName.value = custNumberList?.value?.find((x)=>x.正航編號==salesOrderForm.value.客戶編號)?.company??'';
      收款帳號.value = custNumberList?.value?.find((x)=>x.正航編號==salesOrderForm.value.客戶編號)?.credibility??'';
      changeSalesName();
      errorMessage.value = "";
      if (type == '預覽')
        preview.value = true;
      else
        preview.value = false;
      showForm.value = true;
    }
    console.log('open type', type);
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
    secondDialog.value = true;
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
  secondDialog.value = true;
  await custStore.getSalesOrderList().then((data)=>{
    console.log('data list', data);
    list.value = data;
    list.value.forEach((x)=>x.日期 = dayjs(x.日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD"))
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
  })//稅別

  await custStore.getInstallmentType().then((data)=>{
    console.log('installmentList', data)
    installmentTypeList.value = data;
  })//款項期別

  salesOrderForm.value = {
    account:SessionStorage.getItem('Account').account,
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
    結案:false,
    要望日期:'',
    交貨地址:'',
    指配國別:'',
    目的港:'',
    價格條件:'',
    交貨方式:'',
    付款方式:'',
    交貨日期:'',
    machineno:'',
    remark:'',
    建檔:'',
    修改:'',
    核准:'',
    建檔日:'',
    修改日:'',
    核准日:'',
    orderListDetail:[],
    arListDetail:[],
  };
  selected.value = [];
  secondDialog.value = false;
  theUser.value = SessionStorage.getItem('Account');
  auth.value = theUser.value.authList.find((x)=>x.menuSubName == formName);
  hasAllAuth.value =
      (!auth.value.高管 && !auth.value.核准 && !auth.value.編修 && !auth.value.報表 && !auth.value.輸出);
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
    secondDialog.value = true;
    await custStore.saveSalesOrder(salesOrderForm).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('寫入成功');

      }
      secondDialog.value = false;
    });
  } else if (mode.value == '修改') {
    console.log('mode', mode.value)
    salesOrderForm.value.修改 = Account.account;
    secondDialog.value = true;
    await custStore.updateSalesOrderForm(salesOrderForm).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('修改成功');
      }
      secondDialog.value = false;
      init();
    });
  }
  showForm.value = false;
        salesOrderForm.value = {
          account:SessionStorage.getItem('Account').account,
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
          machineno:'',
          remark:'',
          建檔:'',
          修改:'',
          核准:'',
          建檔日:'',
          修改日:'',
          核准日:'',
          orderListDetail:[],
          arListDetail: []
        };
}

const AddAR = () =>{
  salesOrderForm.value.arListDetail.push({
    識別:0,
    單號:salesOrderForm.value.單號,
    款項期別:'',
    成數:0.0,
    金額:0.0,
    請款單號:'',
  });
}

const updateCloseFlag = async () =>{//TO-DO
  secondDialog.value = true;
  await custStore.updateCloseFlag(salesOrderForm.value.結案, salesOrderForm.value.單號).then((data)=>{
    console.log('close flag data', data)
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      salesOrderForm.value.結案 = (data.data.result.結案=='0'?false:true);
      if (data.data.result.結案=='1')
        alert('已結案');
      else
        alert('已取消結案');
      showForm.value = false;
    }
    secondDialog.value = false;
  });
}

const changeSalesName = () =>{
  salesname.value = salesList.value.find((x)=>x.工號==salesOrderForm.value.業務員).姓名;
}

const close = () =>{
  showForm.value = false;
  preview.value = false;
  salesOrderForm.value = {
    account:SessionStorage.getItem('Account').account,
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
    machineno:'',
    remark:'',
    建檔:'',
    修改:'',
    核准:'',
    建檔日:'',
    修改日:'',
    核准日:'',
    orderListDetail:[],
    arListDetail: [],
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
  if (item.報價單價){
    item.折數 = item.單價1 / item.報價單價 * 100;
  }
}
const sumAmount = () =>{
  salesOrderForm.value.總額 = 0;
  for(let i = 0; i <  salesOrderForm.value.orderListDetail.length; i++) {
    salesOrderForm.value.總額 += salesOrderForm.value.orderListDetail[i].金額1;
  }
}
const openAccountCheck = async () =>{
  if (收款帳號.value == '')
  {
    alert('請輸入收款帳號');
    return;
  }
  await custStore.getBankInfo(收款帳號.value).then((data)=>{
    console.log('bank data',data)
    bankAccountCheckForm.value = data;
  })
  console.log('before set', showCheckForm.value)
  showCheckForm.value = true
  console.log('after set', showCheckForm.value)
}

// const closeCheckAction = () =>{
//   showCheckForm.value = false;
// }

const quotationDistribution = async () =>{
  console.log('salesOrderForm.value',salesOrderForm.value)
  await custStore.getQuotationDistributionList(salesOrderForm.value.客戶編號, salesOrderForm.value.日期).then((data)=>{
    quotationDistributionList.value = data;
  })
  showQuotationDistributionForm.value = true;
}

const closeQuotationDistributionForm = () =>{
  selectedQuotation.value = [];
  showQuotationDistributionForm.value = false;
}

const carryToSalesOrder = () => {

  if (!salesOrderForm.value.orderListDetail)
    salesOrderForm.value.orderListDetail = [];

  for (let i = 0; i < selectedQuotation.value.length; i++) {

    let item = selectedQuotation.value[i];

    salesOrderForm.value.orderListDetail.push({
      產品編號: item.產品編號,
      品名規格: item.品名規格,
      單位: item.單位,
      數量1: item.數量,
      單價1: item.單價,
      金額1: 0.0,
      報價單價: item.單價,
      折數: 100,
      註記: '',
      專案序號: item.quono,
      mtype: '',
      佣金率: 0.0,
      樣品別: '',
      描述: '',
      showDatePopup: false
    });
    closeQuotationDistributionForm();
  }
}

const transferToShipOrder = async () => {
  secondDialog.value = true;
  await custStore.transferToShipOrder(salesOrderForm).then((data)=>{
    console.log(data)
    if(data.data.errorMessage){
      alert(data.data.errorMessage)
    } else {
      alert('轉開成功')
      init();
      showForm.value = false;
    }
    secondDialog.value = false;
  });
}

const transferReceivable = async (item) =>{
  console.log('transferReceivable item', item);
  console.log('transferReceivable salesOrderForm.value', salesOrderForm.value);
  const transferForm = structuredClone(salesOrderForm.value);
  transferForm.arListDetail = [];
  transferForm.arListDetail.push({
    "識別": 0,
    "單號": salesOrderForm.value.單號,
    "款項期別": item.款項期別,
    "成數": item.成數,
    "金額": item.金額,
    "請款單號": ""
  });
  transferForm.建檔 = SessionStorage.getItem('Account').account;
  transferForm.orderListDetail = [];
  console.log('transferReceivable transferForm.value', transferForm);
  console.log('transferReceivable salesOrderForm.value after', salesOrderForm.value);
  secondDialog.value = true;
  await custStore.transferReceivable(transferForm).then((data)=>{
    console.log(data);
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert('轉單成功!');
      item.請款單號 = data.data.result;
    }
    secondDialog.value = false;
  })
}

const openSearcCustomerForm = () =>{
  // alert('openSearcCustomerForm');
  showSearchCustNoForm.value = true;
}

watch(
  () => salesOrderForm.value.客戶編號,
  (newVal) => {
    console.log('資料更新了', newVal)
    if(newVal)
      changeCustCompany();
  },
  { deep: true, immediate: true }
)

const validate = async(valid) =>{
  await custStore.validateSalesOrder(salesOrderForm.value.單號, valid, theUser.value.account).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert((valid?'覆核':'取消覆核')+'成功!');
    }
    close();
    init();
  })
}
// #endregion function block end
</script>
