<template>
  <q-layout class="q-pa-md padding  q-gutter-sm">
    <h5 class="no-wrap text-left">
      <div class="row justify-start padding-top">
        <div class="col-2 col-md-2">
          <q-icon name="play_circle" size="30px" >客戶訴願單</q-icon>
        </div>
        <div class="padding-right">
          <q-btn color="primary" class="padding-right"
            glossy @click="openCARDialog('新增')"
            :loading="loading">新增客戶訴願</q-btn>
        </div>
        <div class="padding-right">
          <q-btn color="info" class="padding-right"
            glossy @click="openCARDialog('修改')"
            :loading="loading">修改客戶訴願</q-btn>
        </div>
        <div class="padding-right">
            <q-btn color="red" class="padding-right"
              glossy @click="deleteCAR"
              :loading="loading">刪除客戶訴願</q-btn>
        </div>
        <div class="padding-right">
          <q-btn color="green" class="padding-right"
              glossy @click="openCARDialog('預覽')"
                :loading="loading">客戶訴願預覽</q-btn>
        </div>
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
                <q-input outlined dense v-model="form.日期" label="日期" :readonly="readonly || preview" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.日期" :readonly="readonly || preview" mask="YYYYMMDD" no-title>
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
                    <q-select v-model="form.訴願類別" label="訴願類別" :readonly="readonly||preview" outlined dense emit-value
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
                    <q-select v-model="form.鑑定人員" label="鑑定人員" outlined dense class="" :readonly="readonly||preview"/>
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
                    <q-input type="textarea" outlined dense v-model="form.解決對象" label="解決方式" :readonly="readonly||preview"/>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12">
                    <q-select outlined dense v-model="form.議決人員" label="決議人員" :readonly="readonly||preview"
                        emit-value map-options/>
                  </div>
                </div>
                <div class="row q-col-gutter-md q-mt-md">
                   <q-card-actions align="right">
                    <q-btn  color="blue" glossy label="轉開維修單"/><br>
                    <q-input v-model="維修單號" outlined dense label="維修單號" readonly/>

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
// import block end

// variable block start
const salesname = ref([]);
const salesList = ref([]);
const projectSerial = ref([]);
const theWorkOrder = ref({});
const workOrderList = ref([]);
const Account = SessionStorage.getItem('Account');
const 維修單號 = ref('')
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
  希望服務日期:'',
  解決對象:'',
  解決方式:'',
  議決人員:'',
  維修單號:'',
  原因鑑定1:'',
  原因類別1:'',
  原因類別2:'',
  原因類別3:'',
  建檔:'',
  修改:'',
})
const myForm = ref(null);
const mode = ref('');
const list = ref([]);
const selected = ref([])
const columns = ref([
  { name: '日期', label: '日期', align: 'left', field: '申請日期', sortable: true },
  { name: '單號', label: '單號', align: 'left', field: '單號', sortable: true },
  { name: '機台型號', label: '機台型號', align: 'left', field: '機台型號', sortable: true },
  { name: '客戶簡稱', label: '客戶簡稱', align: 'left', field: '客戶簡稱', sortable: true },
]);
const showForm = ref(false);
// variable block end

// function block start
const changeSalesName = () =>{
  console.log('sales no',form.value.業務人員)
  let salesFound = salesList.value.find(sales => sales.工號 == form.value.業務人員);
  console.log('salesFound',salesFound)
  salesname.value = salesList.value.find(sales => sales.工號 == form.value.業務人員)
        ?salesList.value.find(sales => sales.工號 == form.value.業務人員).姓名
        :'';
  console.log('name:',salesname.value)
}
const handleOtherAction =  async () =>{
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}
const submitForm = () => {

}
const close = () =>{
  showForm.value = false;
}
const deleteCAR = () =>{

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
      希望服務日期:'',
      解決對象:'',
      解決方式:'',
      議決人員:'',
      維修單號:'',
      原因鑑定1:'',
      原因類別1:'',
      原因類別2:'',
      原因類別3:'',
      建檔:Account.account,
      修改:'',
    }
    form.value.日期 = dayjs(new Date(), "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
    await custStore.getCARNo().then((data)=>{
      form.value.單號 = data;
    })
  }
  else if (type == '修改' || type == '預覽')
  {
    console.log('type',type);
    form.value = selected.value[0];
    form.value.修改 = Account.account
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
onMounted(async ()=>{
  await custStore.getCustList().then((data)=>{
    for(var i = 0; i < data.length; i++){
      if (data[i].正航編號 != '')
        custAliasList.value.push(data[i]);
    }
  });
  await custStore.getSalesList().then((data)=>{
    salesList.value = data;
  })
  custAliasList.value = custAliasList.value.sort((x, y)=>x.正航編號 - y.正航編號);
  // await custStore.getProjectSerial().then((data)=>{
  //   projectSerial.value = data;
  // })
  console.log('custList', custAliasList.value);
  console.log('salesList', salesList.value);
})
// function block end

</script>
