<template>
  <!--#region 標頭及維護按鈕-->
  <div class="row justify-start">
    <!-- <div class="col-12" style="max-width:1500px"> -->
      <!-- <h5> -->
        <div class="col-1 justify-start" style="max-width:150px">
          <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
        </div>
        <div class="col-11 justify-start" style="max-width:1350px">
          <!-- <div v-if="(hasAllAuth ||(auth && auth.編修))"> -->
            <!-- <div class="padding-right"> -->
              <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="primary" class="padding-right"
                glossy @click="openCustomerDialog('新增')"
                :loading="loading">新增訂單</q-btn>&nbsp;
            <!-- </div> -->
            <!-- <div class="padding-right"> -->
              <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="info" class="padding-right"
                glossy @click="openCustomerDialog('修改')"
                :loading="loading">修改訂單</q-btn>&nbsp;
            <!-- </div> -->
            <!-- <div class="padding-right"> -->
                <q-btn v-if="(hasAllAuth ||(auth && auth.編修))" color="red" class="padding-right"
                  glossy @click="deleteCustomer"
                  :loading="loading">刪除訂單</q-btn>&nbsp;
            <!-- </div> -->
          <!-- </div> -->
          <!-- <div v-if="(hasAllAuth ||(auth && auth.查詢))"> -->
          <!-- <div class="padding-right"> -->
          <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="green" class="padding-right"
                  glossy @click="openCustomerDialog('預覽')"
                    :loading="loading">訂單預覽</q-btn>&nbsp;
            <!-- </div> -->
          <q-btn v-if="(hasAllAuth ||(auth && auth.查詢))" color="blue-6" class="padding-right"
                  glossy @click="openSearchForm"
                    :loading="loading">訂單查詢</q-btn>&nbsp;
          <!-- </div> -->
        </div>
        <div class="col-12" style="max-width:3000px">
          <div class="text-left text-red">{{ errorMessage }}</div>
        </div>
      <!-- </h5> -->
    <!-- </div> -->
  </div>
  <!--#endregion-->
  <!--#region 訂單列表 -->
  <div class="row justify-start">
    <div class="col-12 col-md-12"  style="max-width: 1500px">
      <q-table  class="rounded-borders my-sticky-header-table"
                    :columns="columns"
                    row-key="識別"
                    :rows="list"
                    flat
                    bordered
                    style="max-height: 1000px"
                    selection="single"
                    v-model:selected="selected"
                    @selection="onSelection"
                    :pagination="{ rowsPerPage: 10 }"
            >
        <template v-slot:body-cell-單號="props">
          <q-td :props="props">
            <q-btn :label="props.row.單號" outlined dense @click="openOrderDetails(props.row.單號)"></q-btn>
          </q-td>
        </template>
      </q-table >
    </div>
  </div>
  <!--#endregion-->
  <!--#region 查詢條件表單-->
  <q-dialog v-model="showQueryForm" persistent >
      <OrderQueryForm v-model:showForm="showQueryForm" v-model:list="list"/>
  </q-dialog>
  <!--#endregion-->
  <!--#region 主表單-->
  <q-dialog v-model="showForm" persistent >
      <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
        <q-card-section>
        <div class="col-3 flex text-h4">
            {{mode}}訂單
            <q-btn v-if="!preview && (salesOrderForm.客戶編號 != null && salesOrderForm.客戶編號 != '')" label="報價單分配" color="green" glossy densed @click="quotationDistribution"/>&nbsp;
            <div class="col-3 flex" v-if="mode == '修改'">
              <q-checkbox v-model="salesOrderForm.結案" v-if="!preview && (auth && (auth.高管 || hasAllAuth))" label="結案" :readonly="readonly || preview" @update:model-value="updateCloseFlag"/>
              <q-btn v-if="!preview && salesOrderForm.核准 != ''" label="轉零件工令" color="primary" glossy densed @click="openTransToMiscForm"/>&nbsp;
              <q-btn v-if="!preview && salesOrderForm.核准 != ''" label="轉開出貨單" color="brown" glossy densed @click="openTransToOrderForm"/>
            </div>
            <div class="col-3 flex" v-if="(hasAllAuth ||(auth && auth.核准)) && !preview && mode == '修改'">
              <q-btn color="grey" class="padding-right"
                      glossy v-if="salesOrderForm.核准日 && salesOrderForm.核准日!= ''"
                      :loading="loading" @click="validate(false)">取消核准</q-btn> &nbsp;
              <q-btn color="grey" class="padding-right"
                      glossy v-if="!salesOrderForm.核准日 || salesOrderForm.核准日== ''"
                      :loading="loading" @click="validate(true)">核准</q-btn> &nbsp;
            </div>
            <div class="col-3 flex" v-if="(hasAllAuth ||(auth && auth.輸出)) &&  salesOrderForm.核准 != ''">
                <!-- <div class="padding-right"> -->
                  <q-btn color="grey" class="padding-right"
                    glossy
                    :loading="loading" @click="showPrintForm">列印</q-btn> &nbsp;
                <!-- </div> -->
                <!-- <div class="padding-right"> -->
                  <!-- <q-btn color="grey" class="padding-right"
                    glossy
                    :loading="loading">列印(英)</q-btn> -->
                <!-- </div> -->
            </div>
            <q-card-actions align="right">
              <q-btn flat label="取消" color="negative" @click="close" />
              <q-btn v-if="!preview && (mode == '新增' || (mode == '修改' && salesOrderForm.核准 == ''))" label="送出" color="primary" @click="handleOtherAction" />
            </q-card-actions>
       </div>
        </q-card-section>
        <q-form ref="myForm" >
          <div class="row q-col-gutter-md">
            <div class="col-8 col-md-8" style="max-width: 800px">
              <q-card-section>
              <!--日期、單號、客戶編號、客戶簡稱-->
              <div class="row q-col-gutter-md">
                <!--日期-->
                <div class="col-3 col-md-3 flex" style="max-width: 300px">
                  <q-input outlined dense v-model="salesOrderForm.日期" label="日期" readonly mask="####/##/##" :rules="[val =>  !!val || '日期為必填欄位']">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                          <q-date v-model="salesOrderForm.日期" readonly mask="YYYYMMDD" no-title>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <!--單號-->
                <div class="col-3 col-md-3 flex" style="max-width: 300px">
                  <q-input v-model="salesOrderForm.單號" readonly outlined dense label="單號"/>
                </div>
                <!--客戶編號-->
                <div class="col-3 col-md-3 flex" style="max-width: 300px">
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
                <!--客戶簡稱-->
                <div class="col-3 col-md-3 flex" style="max-width: 300px">
                  <q-input  readonly v-model="companyName" outlined dense label="客戶簡稱"></q-input>
                </div>
              </div>
              <br>
              <!--預交日、客戶全名-->
              <div class="row q-col-gutter-md">
                <div class="col-2 col-md-2" style="max-width: 200px">
                  <q-input outlined dense v-model="salesOrderForm.要望日期" :readonly="readonly || preview" label="預交日" mask="####/##/##">
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
                <div class="col-10 col-md-10" style="max-width: 700px">
                  <q-input  readonly v-model="companyFullName" outlined dense label="客戶全名"></q-input>
                </div>
              </div>
              <br>
              <!--業務員、幣別、收貨地址-->
              <div class="row q-col-gutter-md">
                <div class="col-2 col-md-2" style="max-width: 200px">
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
                <div class="col-2 col-md-2" style="max-width: 200px">
                  <q-select v-model="salesOrderForm.幣別" :readonly="readonly || preview" outlined dense label="幣別"
                  :options="currencyList"
                  option-label="currency"
                  option-value="currency"
                  emit-value map-options
                  :rules="[val =>  !!val || '幣別為必填欄位']"
                  />
                </div>
                <div class="col-8 col-md-8" style="max-width: 600px">
                  <q-input v-model="salesOrderForm.交貨地址" :readonly="readonly || preview"  outlined dense label="收貨地址" />
                </div>
              </div>
              <br>
              <!--稅率、價格條件、目的港-->
              <div class="row q-col-gutter-md">
                <div class="col-4 col-md-4" style="max-width: 300px">
                  <q-select  outlined dense v-model="salesOrderForm.稅率"  label="稅率" :readonly="readonly || preview"
                  :rules="[val =>  !!val || '稅率為必填欄位']"  emit-value map-options
                  :options="taxRateList"/>
                </div>
                <div class="col-4 col-md-4" style="max-width: 300px">
                  <q-select  outlined dense v-model="salesOrderForm.價格條件"  label="價格條件"
                  :options="priceCondList" :readonly="readonly || preview"
                   emit-value map-options
                  option-value="條文編號"
                  option-label="條文名稱"/>
                </div>
                <div class="col-4 col-md-4" style="max-width: 300px">
                  <q-input outlined dense v-model="salesOrderForm.目的港" :readonly="readonly || preview" label="目的港" />
                </div>
              </div>
              <br>
              <!--總額、交貨方式-->
              <div class="row q-col-gutter-md">
                <div class="col-6 col-md-6" style="max-width: 500px">
                    <q-input outlined dense v-model="salesOrderForm.總額" :readonly="readonly || preview" label="訂單總額" :rules="[val => !!val || '訂單總額為必填欄位']" />
                </div>
                <div class="col-6 col-md-6" style="max-width: 500px">
                  <q-select  outlined v-model="salesOrderForm.交貨方式" dense :readonly="readonly || preview"  label="交貨方式"
                    :options="handMethod"
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
                  <CountryCodeSelect label="指配國別" style="width: 350px" v-model:country="salesOrderForm.指配國別"/>
                </div>
                <div class="col-6 col-md-6" style="max-width: 500px">
                  <q-select  outlined v-model="salesOrderForm.付款方式" dense :readonly="readonly || preview"  label="付款方式"
                  :options="paymentTerm"
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
              <br>
              <!--稅別-->
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-12" style="max-width: 1000px">
                  <q-select v-model="salesOrderForm.稅別" outlined dense :readonly="readonly || preview" label="稅別"
                  :options="taxTypeList"
                  emit-value map-options
                  />
                </div>
              </div>
              </q-card-section>
            </div>
            <div class="col-4 col-md-4" style="max-width: 700px">
                <div style="min-width: 1200px;max-height: 100vh;
                                overflow: auto;">
                        <h6>
                          收款列表
                          <q-btn v-if="!preview" dense outlined  label="新增收款" color="primary" glossy @click="AddAR"/>
                        </h6>
                        <q-table
                          :columns="arColumns"
                          row-key="識別"
                          :rows="salesOrderForm.arListDetail"
                          selection="single"
                          v-model:selected="selectedAr"
                          flat
                          bordered
                          style="max-height: 70vh;max-width:600px"
                        >
                          <template v-slot:body-cell-款項期別="props">
                            <q-td :props="props">
                              <q-select dense outlined emit-value map-options label="款項期別"
                                :readonly="readonly || preview"
                                v-model="props.row.款項期別"
                                :options="installmentTypeList"
                                option-value="期別名稱"
                                option-label="期別名稱"
                              />
                            </q-td>
                          </template>
                          <template v-slot:body-cell-成數="props">
                            <q-td :props="props">
                              <q-input
                                type="number" dense outlined
                                v-model="props.row.成數"
                                label="成數"
                                :min="0.0"
                                :readonly="readonly || preview"
                              />
                            </q-td>
                          </template>
                          <template v-slot:body-cell-金額="props">
                            <q-td :props="props">
                              <q-input
                              type="number" dense outlined
                              v-model="props.row.金額"
                              label="金額"
                              :min="0.0"
                              :readonly="readonly || preview"/>
                            </q-td>
                          </template>
                          <template v-slot:body-cell-請款單號="props">
                            <q-td :props="props">
                              <q-input dense outlined
                              v-model="props.row.請款單號"
                              label="立帳單號"
                              readonly/>
                              <q-btn label="轉立帳單" color="green" glossy v-if="!preview && (props.row.請款單號 == '')" @click="transferReceivable(props.row)" />
                            </q-td>
                          </template>
                            
                        </q-table>
                        <!-- <div v-for="item in salesOrderForm.arListDetail" v-bind:key="item.識別" class="row no-wrap q-col-gutter-md">
                          <div class="col-1 col-md-1" style="max-width: 200px">
                          </div>
                          <div class="col-1 col-md-1 flex" style="max-width: 200px">
                            
                          </div>
                          <div class="col-1 col-md-1 flex" style="max-width: 200px">
                          </div>
                          <div class="col-2 col-md-2 flex" style="max-width: 300px">
                            
                          </div>
                          <div class="col-2 col-md-2 flex" style="max-width: 300px">
                          </div>
                          <br>
                        </div> -->
                      <!-- </q-card-section> -->
                  <br>
                </div>
                <br>
            </div>
          </div>
          <q-card-section style="
                                max-height: 70vh;
                                overflow: auto;
                              ">

                <div style="min-width: 1500px">
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
                        <q-input type="number" min="0" outlined dense readonly v-model="item.金額1" label="金額"
                        :rules="[val =>  !!val || '金額為必填欄位']"/>
                      </div>
                      <div class="col-1 col-md-1" style="max-width: 180px">
                        <q-input type="number" min="0" outlined dense :readonly="readonly || preview" v-model="item.報價單價" @blur="onBlur(item)" label="報價單價"/>
                      </div>
                      <div class="col-1 col-md-1" style="max-width: 180px">
                        <q-input type="number" min="0" outlined dense readonly v-model="item.折數" label="折數"/>
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
                        option-value="typeid" :display-value="getTypeLabel(item.mtype)"
                        option-label="type" emit-value map-options/>
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
                </div>
          </q-card-section>
        </q-form>
        <q-card-section>
          <label class="text-h5">
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
                零件工令單號：{{ salesOrderForm.machineno }}
              </div>
            </div>
          </label>
        </q-card-section>
      </q-card>
  </q-dialog>
  <!--#endregion-->
  <!--#region 子表單-->
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
  <!--轉出貨單視窗-->
  <q-dialog v-model="transToOrderForm" persistent>
      <TransToShipOrderForm v-model:showForm="transToOrderForm" v-model:salesOrderForm="salesOrderForm"/>
  </q-dialog>
  <!--轉零件工令視窗-->
  <q-dialog v-model="showTransToMiscForm" persistent>
      <MiscMfgOrderForm v-model:showForm="showTransToMiscForm" v-model:salesOrderForm="salesOrderForm"/>
  </q-dialog>
  <!--列印視窗-->
  <q-dialog v-model="showPrintDialog" persistent>
    <PrintForm v-model:showForm="showPrintDialog" v-model:salesOrderForm="salesOrderForm"/>
  </q-dialog>
  <!--#endregion-->
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// #region import block start
import PrintForm from '@/components/customer/salesorder/PrintForm.vue';
import dayjs from 'dayjs'
import MiscMfgOrderForm from '@/components/mfg/MiscMfgOrderForm.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import {
    QIcon
  , QTable
  , QBtn
  , QDialog
  , QCard
  , QCardSection
  , QForm
  , QInput
  // , QPageSticky
  // , QFab
  // , QFabAction
  // , QIcon
  , QPopupProxy
  , QDate
  , QCardActions
  , QSelect
  , QCheckbox
  , SessionStorage
  , QTd
} from 'quasar';
import {ref, onMounted, watch} from 'vue'
import { useCustStore } from '@/composables/useCust';
import BankInfoView from '@/components/customer/salesorder/BankInfoView.vue';
import CustListQueryView from '@/components/customer/query/CustListQueryView.vue'
import OrderQueryForm from '@/components/customer/query/OrderQueryForm.vue';
import TransToShipOrderForm from '@/components/customer/salesorder/TransToShipOrderForm.vue';
// #endregion import block start

// #region variable block start
// const fabOpen = ref(true);
const showPrintDialog = ref(false);
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
const selectedAr = ref([]);
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
const showTransToMiscForm = ref(false);
const companyName = ref('');
const errorMessage = ref('');
const secondDialog = ref(false);
const list = ref([]);
const selected = ref([]);
const selectedQuotation = ref([]);
const showDatePopup = ref(false);
const showForm = ref(false);
const custNumberList = ref([]);
const transToOrderForm = ref(false);
const arColumns = [
  { name: '款項期別', label: '款項期別', align: 'left', field: '款項期別', sortable: true },
  { name: '成數', label: '成數(%)', align: 'right', field: '成數', sortable: true },
  { name: '金額', label: '金額', align: 'right', field: '金額', sortable: true,
    format: val => val != null
      ? Number(val).toLocaleString('zh-TW')
      : '' },
  { name: '請款單號', label: '請款單號', align: 'left', field: '請款單號', sortable: true },
];
const columns =
[
  // { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
  { name: '單號', label: '訂單單號', align: 'left', field: '單號', sortable: true },
  { name: '日期', label: '日期', align: 'left', field: '日期', sortable: true ,
  format: val => val != null
    ? dayjs(val).format('YYYY/MM/DD')
    : '' },
  { name: '客戶編號', label: '客戶編號', align: 'left', field: '客戶編號', sortable: true },
  { name: '客戶全稱', label: '客戶全稱', align: 'left', field: '客戶全稱', sortable: true },
  { name: '指配國別', label: '國別', align: 'left', field: '指配國別', sortable: true },
  { name: '總額', label: '訂單總額', align: 'right', field: '總額', sortable: true,
  format: val => val != null
    ? Number(val).toLocaleString('zh-TW')
    : '' },
  { name: '要望日期', label: '預交日', align: 'left', field: '要望日期', sortable: true,
  format: val => val != null
    ? dayjs(val).format('YYYY/MM/DD')
    : ''  },
  { name: '幣別', label: '幣別', align: 'left', field: '幣別', sortable: true },
  { name: '稅率', label: '稅率', align: 'left', field: '稅率', sortable: true },
  { name: '目的港', label: '目的港', align: 'left', field: '目的港', sortable: true },
  { name: '業務員', label: '業代', align: 'left', field: '業務員', sortable: true },
  { name: '業務人員', label: '業務人員', align: 'left', field: '業務人員', sortable: true },
  { name: '核准', label: '核准', align: 'left', field: '核准', sortable: true  },
  { name: '結案', label: '結案', align: 'left', field: '結案', sortable: true ,
  format: val => val != null
    ? val ? 'Y' : 'N'
    : 'N'},
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
const showPrintForm = () =>{
  if (selectedAr.value.length == 0){
    alert("請選取一筆收款資料做列印");
    return;
  } 
  showPrintDialog.value = true;
}
const openOrderDetails = async (orderNo)=>{
  await custStore.getSalesOrderListByNo(orderNo).then((data)=>{
    selected.value = [];
    selected.value.push(data[0]);
    console.log('selected.value', selected.value);
    openCustomerDialog('預覽')
  })
}
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
      salesOrderForm.value.建檔日 = dayjs(salesOrderForm.value.建檔日, "MM/DD/YYYY").format("YYYY/MM/DD")
      salesOrderForm.value.修改日 = dayjs(salesOrderForm.value.修改日, "MM/DD/YYYY").format("YYYY/MM/DD")
      salesOrderForm.value.核准日 = dayjs(salesOrderForm.value.核准日, "MM/DD/YYYY").format("YYYY/MM/DD")
      salesOrderForm.value.orderListDetail.forEach((x)=> onBlur(x));
      console.log('selected customer:', salesOrderForm.value)
      console.log('custNumberList.value',custNumberList.value);
      console.log('salesOrderForm.value.客戶編號', salesOrderForm.value.客戶編號);
      console.log('Customer Number List', custNumberList.value.find((x)=>x.正航編號==salesOrderForm.value.客戶編號));
      salesOrderForm.value.日期 = dayjs(salesOrderForm.value.日期, "MM/DD/YYYY").format("YYYY/MM/DD")
      salesOrderForm.value.要望日期 = dayjs(salesOrderForm.value.要望日期, "MM/DD/YYYY").format("YYYY/MM/DD")
      companyName.value = custNumberList?.value?.find((x)=>x.正航編號==salesOrderForm.value.客戶編號)?.company??'';
      收款帳號.value = custNumberList?.value?.find((x)=>x.正航編號==salesOrderForm.value.客戶編號)?.credibility??'';
      changeSalesName();
      errorMessage.value = "";
      selectedAr.value = [];
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
  console.log('!preview && salesOrderForm.value.客戶編號!=null && salesOrderForm.value.客戶編號 != "" ', !preview.value && salesOrderForm.value.客戶編號!=null && salesOrderForm.value.客戶編號 != "" );
  companyName.value = custNumberList.value.find((x)=>x.正航編號==salesOrderForm.value.客戶編號)?.company;
  收款帳號.value = custNumberList.value.find((x)=>x.正航編號==salesOrderForm.value.客戶編號)?.credibility;
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
    list.value.forEach((x)=>x.日期 = dayjs(x.日期, "MM/DD/YYYY").format("YYYY/MM/DD"))
    list.value.forEach((x)=>x.要望日期 = dayjs(x.要望日期, "MM/DD/YYYY").format("YYYY/MM/DD"))
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
  var percent = 0;
  salesOrderForm.value.arListDetail.forEach((x)=>{
    percent += x.成數;
  })
  if (percent != 100){
    alert('成數異常，請確認款項分配的成數總和為100%');
    return;
  }
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
        salesOrderForm.value = custStore.getSalesOrderListByNo(salesOrderForm.value.單號).then((data)=>{
          salesOrderForm.value = data[0];
          salesOrderForm.value.要望日期 = dayjs(salesOrderForm.value.要望日期, "MM/DD/YYYY").format("YYYY/MM/DD")
          salesOrderForm.value.建檔日 = dayjs(salesOrderForm.value.建檔日, "MM/DD/YYYY").format("YYYY/MM/DD")
          salesOrderForm.value.修改日 = dayjs(salesOrderForm.value.修改日, "MM/DD/YYYY").format("YYYY/MM/DD")
          salesOrderForm.value.核准日 = dayjs(salesOrderForm.value.核准日, "MM/DD/YYYY").format("YYYY/MM/DD")
          salesOrderForm.value.orderListDetail.forEach((x)=> onBlur(x));
        });
      }
      secondDialog.value = false;
      // init();
    });
  }
  
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
      if (data.data.result.結案==true){
        alert('已結案');
      }
      else{
        alert('已取消結案');
      }
      // showForm.value = false;
    }
    secondDialog.value = false;
  });
}
const changeSalesName = () =>{
  salesname.value = salesList.value.find((x)=>x.工號==salesOrderForm.value.業務員)?.姓名;
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
const getTypeLabel = (item) =>{
  console.log('getTypeLabel item', item);
  return eqpTypeList.value.find((x)=>x.typeid == item?.trim())?.type??'';
}
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
  console.log('selectedQuotation.value', selectedQuotation.value);
  for (let i = 0; i < selectedQuotation.value.length; i++) {

    let item = selectedQuotation.value[i];
    var duplicated = salesOrderForm.value.orderListDetail.find((x)=>x.識別碼 == item.識別碼);
    if (duplicated){
      alert('產品編號'+item.產品編號+'已存在訂單品項中，請勿重複帶入');
      continue;
    }
    console.log('item', item);
    salesOrderForm.value.orderListDetail.push({
      識別碼: item.識別碼.toString(),
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
      佣金率: "0.0",
      樣品別: '',
      描述: '',
      showDatePopup: false
    });
  }
  closeQuotationDistributionForm();
}
const openTransToOrderForm = () =>{
  transToOrderForm.value = true;
  // close();
}
watch(
  transToOrderForm, (newVal) => {
    console.log('transToOrderForm', newVal);
    if (!newVal){
      close();
    }
  }
)
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
      salesOrderForm.value.結案 = valid?true:false;
      salesOrderForm.value.核准 = valid?theUser.value.account:'';
      salesOrderForm.value.核准日 = valid?dayjs(new Date(), "YYYY/MM/DD").format("YYYY/MM/DD"):'';
    }
    // close();
    // init();
  })
}
const openTransToMiscForm = () =>{
  // alert('openTransToMiscForm');
  if (salesOrderForm.value.machineno !== null && salesOrderForm.value.machineno.trim() !== ''){
    alert('此訂單已轉開零件申請單，請查明!');
    return;
  }
  if (confirm('您確定是否要轉零件工令?')) {
    showTransToMiscForm.value = true;
  }
}
// #endregion function block end
</script>