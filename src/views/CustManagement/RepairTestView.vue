<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.編修))">
          <q-btn color="primary" class="padding-right"
            glossy @click="openCARDialog('新增')"
            :loading="loading">新增維修單</q-btn>&nbsp;
          <q-btn color="info" class="padding-right"
            glossy @click="openCARDialog('修改')"
            :loading="loading">修改維修單</q-btn>&nbsp;
          <q-btn color="red" class="padding-right"
              glossy @click="deleteCAR"
              :loading="loading">刪除維修單</q-btn>&nbsp;
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.查詢))">
        <!-- <div class="padding-right"> -->
          <q-btn color="green" class="padding-right"
              glossy @click="openCARDialog('預覽')"
                :loading="loading">維修單預覽</q-btn>&nbsp;
        </div>
      </div>
      <div class="row justify-start padding-top">
        <div class="text-left text-red">{{ errorMessage }}</div>
      </div>
    </h5>
    <q-page-container>
      <q-page>
        <q-table  class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="單號"
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
      <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
        <q-card-section>
          <div class="text-h4">
            {{mode}}檢測維修單
            <div v-if="mode == '修改'">
            </div>
            <q-card-actions align="right">
              <q-btn flat label="取消" color="negative" @click="close" />
              <q-btn v-if="!preview" label="送出" color="primary" @click="handleOtherAction" />
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
            <!--日期、單號、機台型號-->
            <div class="row q-col-gutter-md">
              <div class="col-4 col-md-4" style="max-width: 500px">
                <q-input outlined dense v-model="form.申請日期" label="日期" :readonly="readonly || preview" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.申請日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-4 col-md-4" style="max-width: 500px">
                <q-input v-model="form.單號" label="單號" :readonly="true" outlined dense></q-input>
              </div>
              <div class="col-4 col-md-4" style="max-width: 500px">
                <q-input v-model="form.機台型號" label="機台型號" :readonly="true" outlined dense></q-input>
              </div>
            </div>
            <!--客戶簡稱、專案序號、機台類型、客戶名稱、機台名稱、聯絡窗口、維修地點-->
            <div class="row q-col-gutter-md">
              <!-- 左邊 9 欄 -->
              <div class="col-9">
                <!-- 第一排 -->
                <div class="row q-col-gutter-md">
                  <div class="col-4">
                    <q-select  outlined dense label="客戶簡稱"
                      v-model="form.客戶簡稱"
                      :options="custAliasList"
                      option-value="正航編號"
                      option-label="正航編號"
                      emit-value
                      map-options
                      :readonly="readonly||preview"
                      @update:model-value="onSelection"
                    />
                    <q-icon name="search" size="30px" @click="openSearcCustomerForm" class="cursor-pointer"
                      v-if="!readonly&&!preview"></q-icon>
                    <q-dialog v-model="showSearchCustNoForm" perisitent>
                      <CustListQueryView v-model:showForm="showSearchCustNoForm" v-model:custNo="form.客戶簡稱"/>
                    </q-dialog>
                  </div>
                  <div class="col-4">
                    <q-select v-model="form.專案序號" label="專案序號"  :readonly="readonly||preview" outlined dense
                      emit-value map-options
                      :options="projectSerial"
                      @update:model-value="onPrjSrialSelec"/>
                  </div>
                  <div class="col-4">
                    <q-input v-model="form.機台類型" label="機台類型" :readonly="true" outlined dense></q-input>
                  </div>
                </div>

                <!-- 第二排 -->
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12">
                    <q-input v-model="form.客戶名稱" label="客戶名稱" :readonly="readonly||preview" outlined dense />
                  </div>
                </div>
                <!--聯絡窗口、訴願類別-->
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-6 col-md-6" style="max-width: 500px">
                    <q-input v-model="form.客戶聯絡窗口" label="聯絡窗口" :readonly="readonly||preview" outlined dense/>
                  </div>
                  <div class="col-6 col-md-6" style="max-width: 600px">
                    <!-- <q-select v-model="form.訴願類別" label="訴願類別" :readonly="readonly||preview" outlined dense
                      :options = "reasonList"
                      option-label="原因類別"
                      option-value="原因類別"
                      emit-value
                      map-options/> -->
                    <q-input v-model="form.維修地點" label="維修地點" :readonly="readonly||preview" outlined dense/>
                  </div>
                </div>
              </div>

              <!-- 右邊 3 欄（跨兩排效果） -->
              <div class="col-3 flex column">
                <q-input
                  class="col"
                  type="textarea"
                  v-model="form.機台名稱" :readonly="true"
                  label="機台名稱"
                  outlined
                />
              </div>
            </div>
            <!--故障情形、維修檢查人員、服務型態、結案日期-->
            <div class="row q-col-gutter-md">
              <div class="col-9">
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input type="textarea" outlined dense v-model="form.故障情形" label="故障情形" :readonly="readonly||preview"/>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12">
                    <q-select v-model="form.維修檢查人員"
                              label="檢修人員"
                              outlined dense class=""
                              :readonly="readonly||preview"
                              :options="salesList"
                              option-label="工號"
                              option-value="工號"
                              emit-value map-options @update:model-value="changeSalesName"
                              />
                    <label class="text-red text-center" style=" font-size: 24px;">
                      {{ salesname }}
                    </label>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12">
                    <q-select v-model="form.服務型態" label="服務型態"
                     outlined dense class=""
                     :options="serviceTypeList"
                              option-label="工號"
                              option-value="工號"
                      :readonly="readonly||preview"
                      map-options emit-value/>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12">
                    <q-input outlined dense v-model="form.實際服務日期" label="實際服務日期" :readonly="readonly || preview" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover v-model="showServiceDatePopup" transition-show="scale" transition-hide="scale">
                            <q-date v-model="form.實際服務日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat @click="showServiceDatePopup = false" />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                </div>
                </div>
              </div>
            </div>
            <!--原因鑑定1、簡要描述1、原因類別123、處置建議-->
            <div class="row q-col-gutter-md">
              <div class="col-9">
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input type="textarea" outlined dense v-model="form.原因鑑定1" label="查修結果" :readonly="readonly||preview"/>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input type="textarea" outlined dense v-model="form.簡要描述1" label="可能原因" :readonly="readonly||preview"/>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input  outlined dense v-model="form.原因類別1" label="原因類別" :readonly="readonly||preview"/>
                    <q-input  outlined dense v-model="form.原因類別2" label="原因類別" :readonly="readonly||preview"/>
                    <q-input  outlined dense v-model="form.原因類別3" label="原因類別" :readonly="readonly||preview"/>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input type="textarea" outlined dense v-model="form.處置建議" label="建議更換或維修零件" :readonly="readonly||preview"/>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12">
                    <q-input outlined dense v-model="form.希望服務日期" label="開始日期時間" :readonly="readonly || preview" mask="####/##/##">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover v-model="showStartServiceDatePopup" transition-show="scale" transition-hide="scale">
                            <q-date v-model="form.希望服務日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat @click="showStartServiceDatePopup = false" />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input outlined dense v-model="form.維修結案日期" label="結束日期時間" :readonly="readonly || preview" mask="####/##/##">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover v-model="showEndServiceDatePopup" transition-show="scale" transition-hide="scale">
                            <q-date v-model="form.維修結案日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat @click="showEndServiceDatePopup = false" />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-input type="number" min="0" outlined dense v-model="form.維修服務時數" label="維修服務時數" :readonly="readonly || preview"/>
                    <!-- <q-select v-model="form.議決人員"
                              label="決議人員"
                              outlined dense class=""
                              :readonly="readonly||preview"
                              :options="salesList"
                              option-label="工號"
                              option-value="工號"
                              emit-value map-options
                              @update:model-value="changeDecidorsName"/>
                    <label class="text-red text-center" style=" font-size: 24px;">
                      {{ decidorsname }}
                    </label> -->
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                   <q-card-actions align="right">
                    <q-btn v-if="!preview && (form.零件工令編號 == null || form.零件工令編號 == '')" color="blue" glossy label="開立零件申請單" @click="transferToWorkOrder"/><br>
                    <q-input v-model="form.零件工令編號" outlined dense label="零件申請單" readonly />
                   </q-card-actions>
                </div>
              </div>
            </div>
            <!-- <div class="row q-col-gutter-md">
              <div class="col-9">
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input type="textarea" outlined dense v-model="form.原因鑑定1" label="可能原因" :readonly="readonly||preview"/>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input outlined dense v-model="form.原因類別1" label="原因類別1" :readonly="readonly||preview"/>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input outlined dense v-model="form.原因類別2" label="原因類別2" :readonly="readonly||preview"/>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input outlined dense v-model="form.原因類別3" label="原因類別3" :readonly="readonly||preview"/>
                  </div>
                </div>
              </div>
            </div> -->
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </q-layout>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// import block start
import {
    QIcon
  , QLayout
  , QBtn
  , SessionStorage
  , QPageContainer
  , QPage
  , QTable
  , QInput
  , QPopupProxy
  , QDate
  , QDialog
  , QCard
  , QCardActions
  , QSelect
  , QForm
} from 'quasar';
import {
  onMounted,
  ref,
  watch
} from 'vue';
import { useCustStore } from '@/composables/useCust';
import dayjs from 'dayjs';
import CustListQueryView from '@/components/customer/query/CustListQueryView.vue'
import LoadingComponent from '@/components/LoadingComponent.vue';
// import block end

// variable block start
const formName = ref('檢測維修');
const showForm = ref(false);
const myForm = ref(null);
const salesname = ref('');
const secondDialog = ref(false);
const showSearchCustNoForm = ref(false);
const form = ref({
  識別碼:0,
  單號:'',
  申請日期:'',
  維修檢查人員:'',
  服務型態:'',
  客戶簡稱:'',
  客戶名稱:'',
  專案序號:'',
  機台型號:'',
  機台名稱:'',
  機台類型:'',
  客戶聯絡窗口:'',
  維修地點:'',
  希望服務日期:'',
  實際服務日期:'',
  故障情形:'',
  處置建議:'',
  零件工令編號:'',
  客戶反應:'',
  維修結案日期:'',
  維修服務時數:0,
  轉零件申請:false,
  建檔:'',
  修改:'',
  核准:'',
  建檔日:'',
  修改日:'',
  核准日:'',
  原因類別1:'',
  原因類別2:'',
  原因類別3:'',
  簡要描述1:'',
  簡要描述2:'',
  簡要描述3:'',
  原因鑑定1:'',
  原因鑑定2:'',
  原因鑑定3:'',
})
const showStartServiceDatePopup = ref(false);
const showEndServiceDatePopup = ref(false);
const custStore = useCustStore();
const list = ref([]);
const serviceTypeList = ref([]);
const mode = ref('');
const errorMessage = ref('');
const preview = ref(false);
const auth = ref({});
const theCust = ref({});
const hasAllAuth = ref(false);
const custAliasList = ref([]);
const workOrderList = ref([]);
const theWorkOrder = ref('');
const projectSerial = ref([]);
const reasonList = ref([]);
const salesList = ref([]);
const theUser = ref({});
const selected = ref([]);
const repairatorList = ref([]);
const showDatePopup = ref(false);
const showServiceDatePopup = ref(false);
const columns = ref([
  { name: '申請日期', label: '日期', align: 'left', field: '申請日期', sortable: true },
  { name: '單號', label: '單號', align: 'left', field: '單號', sortable: true },
  { name: '機台型號', label: '機台型號', align: 'left', field: '機台型號', sortable: true },
  { name: '客戶簡稱', label: '客戶簡稱', align: 'left', field: '客戶簡稱', sortable: true },
]);
// variable block end

// function block start
onMounted(()=>{
  init();
})

const close = () =>{
  showForm.value = false;
}

const handleOtherAction = async () =>{
  const success = await myForm.value.validate()
  if (success) {
    console.log('form value:', form.value);
    submitForm();
  } else {
    return;
  }
}

const transferToWorkOrder = async () =>{
  secondDialog.value = true;
  await custStore.transferToWorkOrder(form).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert('開立成功');
    }
    secondDialog.value = false;
    init();
  })
}

const submitForm = async()=>{
  const Account = SessionStorage.getItem('Account');
  secondDialog.value = true;
  if (mode.value == '新增') {
    form.value.建檔 = Account.account;
    await custStore.addRepairForm(form).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('新增維修單成功!');
      }
      showForm.value = false;
      secondDialog.value = false;
      init();
    })
  } else {
    form.value.修改 = Account.account;
    await custStore.updateRepairForm(form).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('更新維修單成功!');
      }
      showForm.value = false;
      secondDialog.value = false;
      init();
    })
  }
}

const init = async () =>{
  await custStore.getRepairTestList().then((data)=>{
    list.value = data;
    list.value.forEach((x)=> x.申請日期 = dayjs(x.申請日期, "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD"))
  })
  theUser.value = SessionStorage.getItem('Account');
  console.log('theUser.value', theUser.value)
  auth.value = theUser.value.authList.find((x)=>x.menuSubName == formName.value);
  console.log('auth.value ', auth.value )
  hasAllAuth.value =
      (!auth.value.高管 && !auth.value.核准 && !auth.value.編修 && !auth.value.報表 && !auth.value.輸出);

  await custStore.getCustList().then((data)=>{
    for(var i = 0; i < data.length; i++){
      if (data[i].正航編號 != '')
        custAliasList.value.push(data[i]);
    }
  });
  await custStore.getSalesList().then((data)=>{
    salesList.value = data;
  })
  await custStore.getCARRepairReasons().then((data)=>{
    console.log('getCARRepairReasons data', data);
    reasonList.value = data;
  })
  await custStore.getRepairtorList().then((data)=>{
    repairatorList.value = data;
    console.log('repairatorList', repairatorList.value);
  })
  custAliasList.value = custAliasList.value.sort((x, y)=>x.正航編號 - y.正航編號);
  selected.value = [];
  salesname.value = '';
  // decidorsname.value = '';
  // repairatorname.value = '';
}

const deleteCAR = async () =>{
  if (selected.value.length == 0){
    errorMessage.value = '請選取一筆資料做刪除'
    return;
  }
  var result = confirm('確認要刪除?')
  if (result){
    form.value = selected.value[0];
    await custStore.deleteRepairTestForm(form).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('刪除完成');
      }
      init();
    })
  }
}

const openCARDialog = async (type) =>{
  mode.value = type;
  errorMessage.value = '';
  if (type == '新增') {
    form.value = {
      識別碼:0,
      單號:'',
      申請日期:'',
      維修檢查人員:'',
      服務型態:'',
      客戶簡稱:'',
      客戶名稱:'',
      專案序號:'',
      機台型號:'',
      機台名稱:'',
      機台類型:'',
      客戶聯絡窗口:'',
      維修地點:'',
      希望服務日期:'',
      實際服務日期:'',
      故障情形:'',
      處置建議:'',
      零件工令編號:'',
      客戶反應:'',
      維修結案日期:'',
      維修服務時數:0,
      轉零件申請:false,
      建檔:'',
      修改:'',
      核准:'',
      建檔日:'',
      修改日:'',
      核准日:'',
      原因類別1:'',
      原因類別2:'',
      原因類別3:'',
      簡要描述1:'',
      簡要描述2:'',
      簡要描述3:'',
      原因鑑定1:'',
      原因鑑定2:'',
      原因鑑定3:'',
    }
    form.value.申請日期 = dayjs(new Date(), "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
    await custStore.getRepairFormNo().then((data)=>{
      form.value.單號 = data
    });
    salesname.value = '';
  } else {
    if (selected.value.length == 0){
      errorMessage.value = '請選取一筆作'+type+'!';
      return;
    }
    if (type == '預覽')
    {
      preview.value = true;
    }
    else
    {
      preview.value = false;
    }
    form.value = selected.value[0];
    console.log('selected.value[0]:', selected.value[0]);
    form.value.實際服務日期 = dayjs(form.value.實際服務日期 , "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
    form.value.希望服務日期 = dayjs(form.value.希望服務日期 , "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
    form.value.維修結案日期 = dayjs(form.value.維修結案日期 , "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
    console.log('form value:', form.value);
    changeSalesName();
    onPrjSrialSelec(form.value.專案序號)
  }
  showForm.value = true;
}


const onPrjSrialSelec = (val) =>{

  console.log('projectSerial', projectSerial.value, 'val', val);
  theWorkOrder.value = workOrderList.value.find((x)=>x.專案序號 == val);
  console.log('theWorkOrder', theWorkOrder.value);
  if (theWorkOrder.value){
    if (theWorkOrder.value.機台名稱 && theWorkOrder.value.機台名稱 != '')
      form.value.機台名稱 = theWorkOrder?.value?.機台名稱??'';
    if (theWorkOrder.value.機台類型 && theWorkOrder.value.機台類型 != '')
      form.value.機台類型 = theWorkOrder?.value?.機台類型??'';
    if (theWorkOrder.value.機台型號 && theWorkOrder.value.機台型號 != '')
      form.value.機台型號 = theWorkOrder?.value?.機台型號??'';
  }
}

const openSearcCustomerForm = () =>{
  showSearchCustNoForm.value = true;
}

const onSelection = async (val) =>{
  console.log('select val',val)
  theCust.value = custAliasList.value.find((x)=>x.正航編號 == val);
  console.log('theCust',theCust.value);
  form.value.客戶名稱 = theCust.value?.company;
  workOrderList.value = [];
  projectSerial.value = [];
  // form.value.機台名稱 = '';
  // form.value.機台類型 = '';
  // form.value.專案序號 = '';
  // form.value.機台型號 = '';
  await custStore.getProjectSerial(val).then((data)=>{
    for(var i = 0; i < data.length; i++){
      console.log('data[i]',data[i]);
      workOrderList.value.push(data[i]);
      projectSerial.value.push(data[i].專案序號);
    }
  });
}

const changeSalesName = () =>{
  if (!form.value.維修檢查人員)
    return;
  console.log('sales no',form.value.維修檢查人員)
  console.log('form.value.業務人員',form.value.維修檢查人員)
  let salesFound = salesList.value.find(sales => sales.工號 == form.value.維修檢查人員);
  console.log('salesFound',salesFound)
  salesname.value = salesList.value.find(sales => sales.工號 == form.value.維修檢查人員)
        ?salesList.value.find(sales => sales.工號 == form.value.維修檢查人員).姓名
        :'';
  console.log('name:',salesname.value)
}

const validate = async (valid) => {
  console.log('props.theUser.value', theUser.value);
  await custStore.validateRepairForm(form.value.單號, valid, theUser.value.account).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert((valid?'覆核':'取消覆核')+'成功!');
    }
    close();
    init();
  })
}
watch(
  () => form.value.客戶簡稱,
  (newVal) => {
    console.log('資料更新了', newVal)
    if(newVal)
      onSelection(newVal);
  },
  { deep: true, immediate: true }
)
// function bloxk end
</script>
