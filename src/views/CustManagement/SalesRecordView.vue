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
                       :loading="loading">新增詢問函</q-btn>&nbsp;
        <!-- </div> -->
        <!-- <div class="padding-right"> -->
          <q-btn color="info" class="padding-right"
                       glossy @click="openCustomerDialog('修改')"
                       :loading="loading">修改詢問函</q-btn>&nbsp;
        <!-- </div> -->
        <!-- <div class="padding-right"> -->
          <q-btn color="red" class="padding-right"
                       glossy @click="deleteCustomer"
                       :loading="loading">刪除詢問函</q-btn>&nbsp;
        </div>
        <div v-if="(hasAllAuth ||(auth && auth.查詢))">
        <!-- </div> -->
        <!-- <div class="padding-right"> -->
          <q-btn color="grey" class="padding-right"
                       glossy @click="openCustomerDialog('查詢')"
                       :loading="loading">查詢詢問函</q-btn>&nbsp;
          <q-btn color="green" class="padding-right"
                       glossy @click="openCustomerDialog('預覽')"
                       :loading="loading">預覽詢問函</q-btn>&nbsp;
        <!-- </div> -->
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
                row-key="rfqno"
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
    <!--詢問函-->
    <q-dialog v-model="showForm" persistent >
      <q-card  class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
        <q-card-section>
          <div class="text-h4">
            {{mode}}詢問函
            <q-btn v-if="!preview" color="info" glossy @click="openQuotationForm">新增報價單</q-btn>
            <q-btn v-if="!preview" color="primary" glossy @click="openSalesRecordTrackingForm">撰寫詢問函追蹤紀錄</q-btn>
            <q-card-actions align="right">
              <q-btn flat label="取消" color="negative" @click="close" />
              <q-btn v-if="!preview" label="送出" color="primary" @click="handleOtherAction" />
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
            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-input filled dense :readonly="preview" v-model="form.rfqdate" label="洽談日期" mask="####/##/##" :rules="[val =>  !!val || '洽談日期為必填欄位']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.rfqdate" :readonly="preview" mask="DD/MM/YYYY" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-input v-model="form.rfqno" :readonly="true" label="詢問函號" outlined dense/>
              </div>
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-select v-model="form.sales" :readonly="preview" label="業務編號" outlined dense
                    :options="salesList"
                            option-value="工號"
                            option-label="工號" @update:model-value="changeSalesName"
                            :rules="[val =>  !!val || '業務編號為必填欄位']"
                            ></q-select>
                <label class="text-red text-center" style=" font-size: 24px;">
                  {{ salesname }}
                </label>
              </div>
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-input v-model="form.source" :readonly="readonly" label="開發來源" outlined dense/>
              </div>
            </div>
            <br>
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 750px">
                <CompanySelect v-model="form.company" :readonly="preview" :company-list="companyList" :label="'客戶全稱'" @update:model-value="getSelectedCustomer"/>
              </div>
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-select v-model="form.ranking" :readonly="preview" label="成交率"
                  :options="rankginList"
                  option-value="ratio"
                  option-label="ranking"  outlined dense :rules="[val =>  !!val || '成交率為必填欄位']"
                ></q-select>
              </div>
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-input v-model="form.machine" :readonly="readonly" label="機台" outlined dense/>
              </div>
            </div>
            <br>
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 750px">
                <q-input v-model="alias" :readonly="preview" label="客戶簡稱" outlined dense/>
              </div>
              <div class="col-6 col-md-6" style="max-width: 750px">
                <IndustryCodeSelect v-model:industrycode="form.industrycode" :readonly="preview"/>
                <!-- <IndustrySelect v-model="form.industrycode" :readonly="preview" :industryList="industryList" :label="'產業別'" outlined dense/> -->
              </div>
            </div>
            <br>
            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-select v-model="form.contact" label="聯絡人" :readonly="preview" :options="contactList" option-value="姓名" option-label="姓名" outlined dense></q-select>
                <!-- <label class="text-red text-center" style=" font-size: 24px;">
                  {{ position }}
                </label> -->
              </div>
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-input v-model="form.position" :readonly="preview" label="職位" outlined dense/>
              </div>

              <div class="col-6 col-md-6 flex" style="max-width: 750px">
                <q-select v-model="form.status" style="max-width: 375px" :readonly="preview" label="狀態" outlined dense
                  :options="statusList"
                  option-value="狀況"
                  option-label="狀況"
                  @update:model-value="updateStatus"
                />
                <label class="text-red text-center" style=" font-size: 24px;max-width: 375px">
                  {{ custStatus }}
                </label>
              </div>
            </div>
            <br>
            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-input v-model="form.tel" :readonly="preview" label="聯絡電話" outlined dense/>
              </div>
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-input v-model="form.country" :readonly="preview" label="國別" outlined dense/>
                <label class="text-red text-center" style=" font-size: 24px;">
                  {{ _country }}
                </label>
              </div>
              <div class="col-6 col-md-6" style="max-width: 750px">
                <q-input v-model="form.description" :readonly="preview" label="備註" outlined dense/>
              </div>
            </div>
            <br>
            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-input v-model="form.email" :readonly="preview" label="電子郵件" outlined dense/>
              </div>
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-input v-model="form.ma" :readonly="preview" label="型態分類" outlined dense/>
              </div>
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-input v-model="form.enduser" :readonly="preview" label="終端使用" outlined dense/>
              </div>
              <div class="col-3 col-md-3" style="max-width: 375px">
                <q-select v-model="form.agent" :readonly="preview" label="配合代理" outlined dense
                  :options="agentOptions"
                  option-value="agent"
                  option-label="agent"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6" style="max-width: 750px">
                <QuotationList :quotationList="quotationList"/>
              </div>
              <div class="col-6 col-md-6" style="max-width: 750px">
                <SalesWorkRecordList :workRecordList="workRecordList" />
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
    <!--報價單-->
    <q-dialog  class="q-pa-md"  style="width: 1000px; max-width: 80vw;" v-model="showQuotationForm" persistent>
      <QuotationView :form="form" :mode="'新增'" :custList="salesList" v-model:showForm="showQuotationForm" v-if="(hasAllAuth && auth.核准)"/>
    </q-dialog>
    <!--#region 查詢畫面-->
    <q-dialog v-model="showQueryForm" persistent>
      <RFQQueryForm v-model:showForm="showQueryForm" v-model:list="list"/>
    </q-dialog>
    <q-dialog v-model="showSalesRecordTrackingForm" persistent>
      <SalesRecordTrackingForm v-model:showForm="showSalesRecordTrackingForm" v-model:rfqno="form.rfqno" />
    </q-dialog>
    <!--#endregion -->
    <LoadingComponent v-model="secondDialog"/>
  </q-layout>
</template>
<script setup>
// #region import
import {
    QIcon
  , QLayout
  , QPageContainer
  , QPage
  , QTable
  , QBtn
  , QDialog
  , QCard
  , QCardSection
  , QForm
  , QInput
  , QCardActions
  , QPopupProxy
  , QDate
  , QSelect
  , SessionStorage
} from 'quasar';
import { ref, onMounted, readonly } from 'vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useCustStore } from '@/composables/useCust';
import  CompanySelect  from '@/components/customer/CompanySelect.vue';
// import IndustrySelect from '@/components/customer/IndustrySelect.vue';
import QuotationList from '@/components/customer/QuotationList.vue';
import SalesWorkRecordList from '@/components/customer/SalesWorkRecordList.vue';
import QuotationView from '@/components/customer/quotation/QuotationView.vue';
import dayjs  from 'dayjs';
import IndustryCodeSelect from '@/components/customer/IndustryCodeSelect.vue';
import RFQQueryForm from '@/components/customer/rfq/RFQQueryForm.vue';
import SalesRecordTrackingForm from '@/components/customer/rfq/SalesRecordTrackingForm.vue'
//  #endregion import

// #region 變數
const formName = '客戶詢問函';
const auth = ref({});
const hasAllAuth = ref(false);
const theUser = ref({});
const myForm = ref(null);
const secondDialog = ref(false)
const custStore = useCustStore();
const showDatePopup = ref(false);
const mode = ref('');
const alias = ref('');
const _country = ref('');
const showForm = ref(false);
const companyList = ref([]);
const contactList = ref([]);
const salesList = ref([]);
const quotationList = ref([]);
const workRecordList = ref([]);
const salesname = ref('');
const columns =
[
  { name: 'rfqno', label: '詢問函號', align: 'left', field: 'rfqno', sortable: true },
  { name: 'rfqdate', label: '詢問函日期', align: 'left', field: 'rfqdate', sortable: true },
  //{ name: 'sales', label: '業務編號', align: 'left', field: 'sales', sortable: true },
  { name: 'company', label: '客戶名稱', align: 'left', field: 'company', sortable: true },
  { name: 'contact', label: '聯絡人', align: 'left', field: 'contact', sortable: true },
  { name: 'country', label: '國別', align: 'left', field: 'country', sortable: true },
  { name: 'industrycode', label: '詢問業別', align: 'left', field: 'industrycode', sortable: true },
  { name: 'status', label: '追蹤狀況', align: 'left', field: 'status', sortable: true },
  { name: '', label: '預計再訪日', align: 'left', field: '', sortable: true },
  { name: '業務人員', label: '業務人員', align: 'left', field: '業務人員', sortable: true },
];
const form = ref({
  rfqno: '',
  rfqdate: '',
  sales: '',
  company: '',
  ma:'',
  tel:'',
  contact:'',
  position:'',
  email:'',
  country:'',
  industrycode:'',
  industry:'',
  machine:'',
  commission:'',
  enduser:'',
  source:'',
  status:'',
  description:'',
  quono:'',
  rfqstatus:'',
  agent:'',
  account:'',
  欄位2:'',
  正航編號:'',
});
const list = ref([]);
const errorMessage = ref('');
const selected = ref([]);
const position = ref('');
const industryList = ref([])
const rankginList = ref([])
const statusList = ref([])
const custStatus = ref('');
const agentOptions = ref([]);
const countryList = ref([]);
const showQuotationForm = ref(false);
const preview = ref(false);
const showQueryForm = ref(false);
const showSalesRecordTrackingForm = ref(false);
// #endregion 變數

// #region functions
const openCustomerDialog = async (amode) => {
  console.log('Open Customer Dialog in mode:', amode);
  mode.value = amode;
  errorMessage.value = "";
  // 根據 mode 進行相應的操作，例如打開對話框或載入資料
  if (mode.value === '新增') {
    // 打開新增客戶的對話框
    console.log('Opening dialog for adding new customer');
    alias.value = '';
    _country.value = '';
    custStatus.value = '';
    position.value = '';
    form.value = {
      rfqno: '',
      rfqdate: '',
      sales: '',
      company: '',
      companyid:0,
      ma:'',
      tel:'',
      contact:'',
      position:'',
      email:'',
      country:'',
      industrycode:'',
      industry:'',
      machine:'',
      commission:'',
      enduser:'',
      source:'',
      status:'',
      description:'',
      quono:'',
      rfqstatus:'',
      agent:'',
    };
    await custStore.getRfqNo().then((data) =>{
      console.log('data',data)
      form.value.rfqno = data;
      showForm.value = true;
      form.value.rfqdate = dayjs(new Date(), "MM/DD/YYYY HH:mm:ss").format("YYYY/MM/DD")
    });

    showForm.value = true;
    init();
  } else if (mode.value === '修改' || mode.value == '預覽') {
      if (selected.value.length === 0) {
        errorMessage.value = `請先選擇要${mode.value}的詢問函`;
        return;
      }
      console.log('mode.value',mode.value)
      console.log('mode.value == "預覽"',mode.value == "預覽")
      if (mode.value == '預覽')
      {
        preview.value = true;
      } else {
        preview.value = false;
      }
      console.log('preview', preview.value)
      errorMessage.value = '';
      console.log('selected.value[0]',selected.value[0]);
      const rfqNo = selected.value[0].rfqno;
      console.log('rfqNo',rfqNo);
      const data = await custStore.getQuotationList(rfqNo);
      quotationList.value = data ?? [];

      const data2 = await custStore.getSalesWorkRecordList(rfqNo);
      workRecordList.value = data2 ?? [];
      const rfqSelected = list.value.find((x) => x.rfqno == rfqNo);
      if (rfqSelected){
        form.value = {...rfqSelected};
        console.log('form', form.value);
        // getSelectedRfqData();
        getSelectedCustomer();
      }

      showForm.value = true;
      init();
    } else if (mode.value == '查詢'){
      showQueryForm.value = true;
    }

    // 打開修改詢問函的對話框，並載入選中的詢問函資料
    console.log('Opening dialog for editing customer:', selected.value);
}
const deleteCustomer = async () => {
  if (selected.value.length === 0) {
    errorMessage.value = '請先選擇要刪除的客戶詢問函';
    return;
  }
  errorMessage.value = '';
  const result = confirm('您確定要刪除?');
  if (!result){
    return;
  }
  secondDialog.value = true;
  console.log('Delete Sales Record:', selected.value[0]);
  await custStore.deleteRfq(selected.value[0]).then((data)=>{
    if (data.errorMessage){
      alert(data.errorMessage)
    }
    else{
      alert('刪除成功')
      selected.value = [];
      init();
    }
    secondDialog.value = false;
  })
}
const changeSalesName = () => {
  console.log('sales no',form.value.sales.工號)
  salesname.value = salesList.value.find(sales => sales.工號 == form.value.sales.工號)
        ?salesList.value.find(sales => sales.工號 == form.value.sales.工號).姓名
        :'';
  console.log('name:',salesname.value)
}
const getSelectedCustomer = async () => {
  console.log('Selected Company in getSelectedCustomer:', form.value.company);
  const selectedCompany = ref('');
  await custStore.getUniqueCust(form.value.company).then(async (data) =>{
    console.log('Fetched Customer List in getSelectedCustomer:', data);
    const foundCompany = data;
    form.value.source = '';
    form.value.industrycode = '';
    form.value.contact = '';
    form.value.tel = '';
    form.value.欄位2 = '';
    form.value.正航編號='';
    position.value = '';
    _country.value = '';
    form.value.country = '';
    if (foundCompany) {
      console.log('Found matching company in customer list:', foundCompany);
      selectedCompany.value = foundCompany;
      form.value.source = selectedCompany.value.source || '';
      form.value.industrycode = selectedCompany.value.industrycode || '';
      form.value.tel = selectedCompany.value.tel || '';
      form.value.country = selectedCompany.value.country || '';
      alias.value = selectedCompany.value.欄位2 || '';
      form.value.欄位2 = alias.value;
      form.value.正航編號=selectedCompany.value.正航編號;
      form.value.companyid = selectedCompany.value.識別;
      console.log('form.value.companyid:'+form.value.companyid);
      console.log('form.value.正航編號', form.value.正航編號);
      await custStore.getContactList(form.value.company).then((contacts) => {
        contactList.value = contacts;
        form.value.contact = selectedCompany.value.contactperson || '';
        let contactPerson = contactList.value.find(contact => contact.姓名 === form.value.contact);

        // console.log('Selected contact person length:', contactPerson.length);
        if (contactPerson ) {
          position.value = contactPerson.職稱;
        }
        console.log('Selected contact person:', contactPerson);
        console.log('Fetched Contact List for selected company:', contactList.value);
        custStatus.value = statusList.value.find(status => status.狀況 == form.value.status)?statusList.value.find(status => status.狀況 == form.value.status).狀況說明:'';
        salesname.value = salesList.value.find(sales => sales.工號 == form.value.sales)?salesList.value.find(sales => sales.工號 == form.value.sales).姓名:''
      });
      await custStore.getCountryList().then((countries) => {
        const country = countries.find(c => c.國別 === form.value.country);

        _country.value = country ? country.code : '';
        console.log('Fetched Country:', country);
        console.log('Fetched Country List:', countries);
        console.log('Matched country for selected company:', form.value.country);
      });
      console.log('Updated form.source based on selected company:', form.value.source);
    } else {
      console.warn('No matching company found for:', form.value.company);
    }
  })
}
const updateStatus = (pam) =>{
  console.log('parm status:'+pam)
  let data = statusList.value.find(x => x.狀況 === pam.狀況)
  if (data){
    custStatus.value = data.狀況說明;
  }
}
const init = async () => {
  list.value = [];
  secondDialog.value = true
  list.value = await custStore.getSalesRecordList();
  // console.log('Fetched Sales Record List:', list.value);
  companyList.value = await custStore.getCompanyList();
  salesList.value = await custStore.getSalesList();
  industryList.value = await custStore.getIndustryList();
  rankginList.value = await custStore.getRanking();
  statusList.value = await custStore.getStatusList();
  agentOptions.value = await custStore.getAgentOptions();
  countryList.value = await custStore.getCountryList();
  secondDialog.value = false;
  // console.log('Fetched Company List:', companyList.value);
  theUser.value = SessionStorage.getItem('Account');
  auth.value = theUser.value.authList.find((x)=>x.menuSubName == formName);
  console.log('prjquo auth', auth.value)
  hasAllAuth.value =
      (!auth.value.高管 && !auth.value.核准 && !auth.value.編修 && !auth.value.報表 && !auth.value.輸出);
  // console.log('Fetched Industry List:', industryList.value);
}
const handleOtherAction = async () => {
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}
const submitForm = async () => {
  console.log('送出的表單資料:', form.value);
  const Account = SessionStorage.getItem('Account');
  form.value.account = Account.account;
  secondDialog.value = true;
  if (mode.value == '新增') {
    console.log('新增客戶資料:', form.value);
    await custStore.saveRfq(form).then((data) =>{
      console.log('data add',data);
      if (!data.data.errorMessage){
        alert('新增完成')
        init();
      } else if (data.data.errorMessage){
        alert(data.data.errorMessage)
      } else
        alert(data.errorMessage)
      showForm.value = false;
      secondDialog.value = false;
    });
  } else if (mode.value == '修改'){
    console.log('修改客戶資料:', form.value);
    await custStore.updateRfq(form).then((data) =>{
      console.log('data',data);
      if (data.errorMessage){
        alert(data.errorMessage)
      } else if (data.data.errorMessage){
        alert(data.data.errorMessage)
      } else {
        alert('修改完成')
        init();
      }
      showForm.value = false;
      secondDialog.value = false;
    });
  }
};
onMounted( async () => {
  init();
});
const openQuotationForm = () =>{

  showQuotationForm.value = true
}
const close = () =>{
  showForm.value = false
  preview.value = false;
}

const openSalesRecordTrackingForm = () =>{
  showSalesRecordTrackingForm.value = true;
}
// #endregion functions
</script>
