<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >{{ formName }}</q-icon>
        </div>
        <!-- <div class="padding-right"> -->
        <div v-if="(hasAllAuth ||(auth && auth.編修))">
          <q-btn color="primary" class="padding-right"
            glossy @click="openCARDialog('新增')"
            :loading="loading">新增客戶訴願</q-btn>&nbsp;
        <!-- </div>
        <div class="padding-right"> -->
          <q-btn color="info" class="padding-right"
            glossy @click="openCARDialog('修改')"
            :loading="loading">修改客戶訴願</q-btn>&nbsp;
        <!-- </div>
        <div class="padding-right"> -->
            <q-btn color="red" class="padding-right"
              glossy @click="deleteCAR"
              :loading="loading">刪除客戶訴願</q-btn>&nbsp;
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.查詢))">
        <!-- <div class="padding-right"> -->
          <q-btn color="green" class="padding-right"
              glossy @click="openCARDialog('預覽')"
                :loading="loading">客戶訴願預覽</q-btn>&nbsp;
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
            {{mode}}客戶訴願單
            <div v-if="mode == '修改'">
            </div>
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
            <!--客戶簡稱、專案序號、機台類型、機台名稱、聯絡窗口、訴願類別-->
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
                      @update:model-value="onSelection"
                    />
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
                    <q-input v-model="form.訴願聯絡窗口" label="聯絡窗口" :readonly="readonly||preview" outlined dense/>
                  </div>
                  <div class="col-6 col-md-6" style="max-width: 600px">
                    <q-select v-model="form.訴願類別" label="訴願類別" :readonly="readonly||preview" outlined dense
                      :options = "reasonList"
                      option-label="原因類別"
                      option-value="原因類別"
                      emit-value
                      map-options/>
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
            <!--客戶反應內容、業務人員、鑑定人員、希望服務日期-->
            <div class="row q-col-gutter-md">
              <div class="col-9">
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input type="textarea" outlined dense v-model="form.訴求內容" label="客戶反應內容" :readonly="readonly||preview"/>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12">
                    <q-select v-model="form.業務人員"
                              label="業務人員"
                              outlined dense class=""
                              :readonly="readonly||preview"
                              :options="salesList"
                              option-label="工號"
                              option-value="工號"
                              emit-value map-options
                              @update:model-value="changeSalesName"/>
                    <label class="text-red text-center" style=" font-size: 24px;">
                      {{ salesname }}
                    </label>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12">
                    <q-select v-model="form.鑑定人員1" label="鑑定人員"
                     outlined dense class=""
                     :options="repairatorList"
                              option-label="工號"
                              option-value="工號"
                      :readonly="readonly||preview"
                      map-options emit-value
                      @update:model-value="changeRepairatorsName"/>
                      <label class="text-red text-center" style=" font-size: 24px;">
                        {{ repairatorname }}
                      </label>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12">
                    <q-input outlined dense v-model="form.回覆日期" label="希望服務日期" :readonly="readonly || preview" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover v-model="showServiceDatePopup" transition-show="scale" transition-hide="scale">
                            <q-date v-model="form.回覆日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
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
            <!--解決方式、決議人員、維修單號-->
            <div class="row q-col-gutter-md">
              <div class="col-9">
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 flex column">
                    <q-input type="textarea" outlined dense v-model="form.解決對策" label="解決方式" :readonly="readonly||preview"/>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12">
                    <q-select v-model="form.議決人員"
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
                    </label>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                   <q-card-actions align="right">
                    <q-btn v-if="!preview && (form.維修服務單號 == null || form.維修服務單號 == '')" color="blue" glossy label="轉開維修單" @click="transferToRepair"/><br>
                    <q-input v-model="form.維修服務單號" outlined dense label="維修單號" readonly />
                   </q-card-actions>
                </div>
              </div>
            </div>
            <div class="row q-col-gutter-md">
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
            </div>
          </q-card-section>
        </q-form>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="negative" @click="close" />
          <q-btn v-if="!preview" label="送出" color="primary" @click="handleOtherAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
  <loading-component v-model="secondDialog"/>
</template>
<script setup>
// import block start
import { useCustStore } from '@/composables/useCust';
import {
  QLayout,
  QIcon,
  QBtn,
  QPageContainer,
  QPage,
  QTable,
  QDialog,
  QCard,
  QCardSection,
  QForm,
  QPopupProxy,
  QDate,
  QCardActions,
  QInput,
  QSelect,
  SessionStorage
} from 'quasar'
import { ref, onMounted, } from 'vue';
import dayjs  from 'dayjs';
import LoadingComponent from '@/components/LoadingComponent.vue';
// import block end

// variable block start
const errorMessage = ref('');
const repairatorList  =  ref([]);
const decidorsname = ref('');
const repairatorname = ref('');
const formName = '客訴處理';
const auth = ref({});
const hasAllAuth = ref(false);
const theUser = ref({});
const secondDialog = ref(false);
const reasonList = ref([]);
const salesname = ref([]);
const salesList = ref([]);
const projectSerial = ref([]);
const theWorkOrder = ref({});
const workOrderList = ref([]);
const Account = SessionStorage.getItem('Account');
const showServiceDatePopup = ref(false);
const theCust = ref({});
const custStore = useCustStore();
const custAliasList = ref([]);
const showDatePopup = ref(false);
const form = ref({
  識別碼:0,
  日期:'',
  單號:'',
  機台型號:'',
  客戶簡稱:'',
  專案序號:'',
  機台類型:'',
  機台名稱:'',
  客戶名稱:'',
  訴願聯絡窗口:'',
  訴願類別:'',
  訴求內容:'',
  業務人員:'',
  鑑定人員:'',
  回覆日期:'',
  解決對策:'',
  解決方式:'',
  議決人員:'',
  維修單號:'',
  轉維修:'',
  維修服務單號:'',
  原因鑑定1:'',
  原因類別1:'',
  原因類別2:'',
  原因類別3:'',
  建檔:'',
  修改:'',
})
const myForm = ref(null);
const preview = ref(false);
const mode = ref('');
const list = ref([]);
const selected = ref([])
const columns = ref([
  { name: '申請日期', label: '申請日期', align: 'left', field: '申請日期', sortable: true },
  { name: '單號', label: '單號', align: 'left', field: '單號', sortable: true },
  { name: '機台型號', label: '機台型號', align: 'left', field: '機台型號', sortable: true },
  { name: '客戶簡稱', label: '客戶簡稱', align: 'left', field: '客戶簡稱', sortable: true },
]);
const showForm = ref(false);
// variable block end

// function block start
const changeSalesName = () =>{
  if (!form.value.業務人員)
    return;
  console.log('sales no',form.value.業務人員)
  console.log('form.value.業務人員',form.value.業務人員)
  let salesFound = salesList.value.find(sales => sales.工號 == form.value.業務人員);
  console.log('salesFound',salesFound)
  salesname.value = salesList.value.find(sales => sales.工號 == form.value.業務人員)
        ?salesList.value.find(sales => sales.工號 == form.value.業務人員).姓名
        :'';
  console.log('name:',salesname.value)
}

const changeRepairatorsName = () =>{
  if (!form.value.鑑定人員1)
    return;
  console.log('repairator no',form.value.鑑定人員1)
  console.log('form.value.鑑定人員',form.value.鑑定人員1)
  let salesFound = repairatorList.value.find(sales => sales.工號 == form.value.鑑定人員1);
  console.log('repairatorsFound',salesFound)
  console.log('name:',salesFound.姓名)
  repairatorname.value = salesFound.姓名;
}

const changeDecidorsName = () =>{
  if (!form.value.議決人員)
    return;
  console.log('decidors no',form.value.議決人員)
  console.log('form.value.業務人員',form.value.業務人員)
  let salesFound = salesList.value.find(sales => sales.工號 == form.value.議決人員);
  console.log('decidors Found',salesFound)
  decidorsname.value = salesList.value.find(sales => sales.工號 == form.value.議決人員)
        ?salesList.value.find(sales => sales.工號 == form.value.議決人員).姓名
        :'';
  console.log('name:',decidorsname.value)
}

const handleOtherAction =  async () =>{
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}
const submitForm = async () => {
  secondDialog.value = true;
  if (mode.value == '新增') {
    await custStore.addCAR(form).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('新增訴願單成功!');
      }
      showForm.value = false;
      secondDialog.value = false;
      init();
    });
  } else {
    await custStore.updateCAR(form).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('更新訴願單成功!');
      }
      showForm.value = false;
      secondDialog.value = false;
      init();
    })
  }
}
const close = () =>{
  showForm.value = false;
}
const deleteCAR = async () =>{
  if (selected.value.length == 0){
      errorMessage.value = '請選取一筆資料做刪除!'
      showForm.value = false;
      return;
  }
  var result = confirm('您是否確認要刪除?');
  if (!result){
    return;
  }
  secondDialog.value = true;
  let select = selected.value[0];
  await custStore.deleteCAR(select.單號).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert('刪除成功');
    }
    showForm.value = false;
    secondDialog.value = false;
    init();
  })
}

const openCARDialog = async (type) =>{
  console.log('type',type);
  mode.value = type;
  showForm.value = true;
  if (type == '新增')
  {
    console.log('type',type);
    form.value = {
      識別碼:0,
      申請日期:'',
      單號:'',
      機台型號:'',
      客戶簡稱:'',
      專案序號:'',
      機台類型:'',
      機台名稱:'',
      客戶名稱:'',
      訴願聯絡窗口:'',
      訴願類別:'',
      訴求內容:'',
      業務人員:'',
      鑑定人員:'',
      希望服務日期:'',
      解決對象:'',
      解決方式:'',
      議決人員:'',
      維修單號:'',
      轉維修:'',
      維修服務單號:'',
      原因鑑定1:'',
      原因類別1:'',
      原因類別2:'',
      原因類別3:'',
      建檔:Account.account,
      修改:'',
    }
    form.value.申請日期 = dayjs(new Date(), "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
    await custStore.getCARNo().then((data)=>{
      form.value.單號 = data;
    })
    salesname.value = '';
  }
  else if (type == '修改' || type == '預覽')
  {
    if (selected.value.length == 0){
      errorMessage.value = '請選取一筆資料做'+type+'!'
      showForm.value = false;
      return;
    }
    console.log('type',type);
    form.value = selected.value[0];
    form.value.修改 = Account.account
    if (type == '預覽') {
      preview.value = true;
    } else {
      preview.value = false;
    }
    changeSalesName();
    changeDecidorsName();
    changeRepairatorsName();
  }
  // showForm.value = false;
}

const onPrjSrialSelec = (val) =>{
  console.log('projectSerial', projectSerial.value, 'val', val);
  theWorkOrder.value = workOrderList.value.find((x)=>x.專案序號 == val);
  console.log('theWorkOrder', theWorkOrder.value);
  form.value.機台名稱 = theWorkOrder.value.機台名稱;
  form.value.機台類型 = theWorkOrder.value.機台類型;
  form.value.機台型號 = theWorkOrder.value.機台型號;
}

const onSelection = async (val) =>{
  console.log('select val',val)
  theCust.value = custAliasList.value.find((x)=>x.正航編號 == val);
  console.log('theCust',theCust.value);
  form.value.客戶名稱 = theCust.value.company;
  workOrderList.value = [];
  projectSerial.value = [];
  form.value.機台名稱 = '';
  form.value.機台類型 = '';
  form.value.專案序號 = '';
  form.value.機台型號 = '';
  await custStore.getProjectSerial(val).then((data)=>{
    for(var i = 0; i < data.length; i++){
      console.log('data[i]',data[i]);
      workOrderList.value.push(data[i]);
      projectSerial.value.push(data[i].專案序號);
    }
  });
}
const init = async () => {
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
  await custStore.getCARList().then((data)=>{
    list.value = data;
  })
  await custStore.getRepairtorList().then((data)=>{
    repairatorList.value = data;
    console.log('repairatorList', repairatorList.value);
  })
  custAliasList.value = custAliasList.value.sort((x, y)=>x.正航編號 - y.正航編號);
  selected.value = [];
  salesname.value = '';
  decidorsname.value = '';
  repairatorname.value = '';
  theUser.value = SessionStorage.getItem('Account');
  console.log('theUser.value', theUser.value)
  auth.value = theUser.value.authList.find((x)=>x.menuSubName == formName);
  console.log('auth.value ', auth.value )
  hasAllAuth.value =
      (!auth.value.高管 && !auth.value.核准 && !auth.value.編修 && !auth.value.報表 && !auth.value.輸出);
  // await custStore.getProjectSerial().then((data)=>{
  //   projectSerial.value = data;
  // })
  console.log('custList', custAliasList.value);
  console.log('salesList', salesList.value);
}
onMounted(async ()=>{
  init();
})
const transferToRepair = async () =>{
  console.log('form before', form);
  await custStore.transferToRepair(form).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      // form.value = data.data.result;
      // custStore.updateCAR(form).then((data)=>{
      //   if (data.data.errorMessage){
      //     alert(data.data.errorMessage);
      //   } else {
            alert('轉開完成!');
            form.value = data.data.result;
            showForm.value = false;
            init();
      //   }
      // })
    }
  })
}
// function block end

</script>
