<template>
  <q-card class="q-pa-md"  style="width: 1000px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h4">{{props.mode!=''&&props.mode!=''?props.mode:'新增'}}報價單</div>
        <div v-if="props.mode=='修改'">
          <q-btn  dense outlined label="複製" color="warning" @click="copy" />&nbsp;
          <q-btn  dense outlined label="轉開訂單" color="primary" />&nbsp;
          <q-btn  dense outlined label="取消停用" color="green" v-if="!quotationForm.核准 || quotationForm.核准 == ''" @click="updateExpiryFlag('Y')" />
          <q-btn  dense outlined label="停用" color="negative" v-if="quotationForm.核准 && quotationForm.核准 != ''" @click="updateExpiryFlag('N')" />
        </div>
      </q-card-section>
      <q-form ref="myForm">
        <q-card-section>
          <!--日期、報價單號-->
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-input outlined dense v-model="quotationForm.quodate" :readonly="props.mode!=''" label="日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                      <q-date v-model="quotationForm.quodate" mask="YYYYMMDD" no-title>
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
              <q-input outlined dense v-model="quotationForm.quono" label="報價單號"/>
            </div>
          </div>
          <!--報價有效日期、詢問單號-->
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-input outlined dense v-model="quotationForm.condate" label="報價有效日期" mask="####/##/##" :rules="[val => !!val || '日期為必填欄位']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover v-model="showConDatePopup" transition-show="scale" transition-hide="scale">
                      <q-date v-model="quotationForm.condate" mask="YYYY/MM/DD" no-title>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat @click="showConDatePopup = false" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-input outlined dense v-model="quotationForm.rfqno" :readonly="props.form" label="詢價單號"/>
            </div>
          </div>
          <!--業務人員-->
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-select v-model="quotationForm.daddress" :readonly="readonly" label="業務人員" outlined dense
                    :options="salesList"
                            option-value="工號" emit-value map-options
                            option-label="工號" @update:model-value="changeSalesName"
                            ></q-select>
            </div>
            <div class="col-6 col-md-6" style="max-width: 500px">
              <label class="text-red text-center" style=" font-size: 24px;">
                {{ salesname }}
              </label>
            </div>
          </div>
          <br>
          <!--客戶編號、客戶簡稱-->
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-input outlined dense v-model="companyNo" :readonly="props.form" label="公司編號"/>
            </div>

            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-input outlined dense v-model="companyAlias" :readonly="props.form" label="公司簡稱"/>
            </div>
          </div>
          <br>
          <!--客戶全名-->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-12" style="max-width: 1000px">
              <q-input outlined dense v-model="companyName" :readonly="props.form" label="客戶全名"/>
            </div>
          </div>
          <br>
          <!--幣別、匯率--><!--匯率> 在dbo_F匯率中查詢=幣別[CURRENCY]的最近一筆紀錄-->
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-select outlined dense  label="幣別"
                v-model="quotationForm.currency"
                :options="currencyList"
                option-value="currency"
                option-label="currency"
                @update:model-value="changeExRate" emit-value map-options
                 :rules="[val => !!val || '幣別為必填欄位']"/>
            </div>
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-select outlined dense  label="匯率"
                :options="exRateList"
                v-model="quotationForm.exrate"
                option-label="匯率"
                option-value="匯率"  emit-value map-options
                :rules="[val => !!val || '匯率為必填欄位']"
                />
            </div>
          </div>
          <br>
          <!--聯絡人、機台類別--><!--聯絡人[RANKING]> dbo_C客戶聯絡人清單--><!--機台類型[MTYPE]> dbo_A機台類型-->
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-select  outlined dense v-model="quotationForm.ranking" emit-value map-options
              :options="contactList" option-label="姓名" option-value="姓名"  label="聯絡人"/>
            </div>
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-select  outlined dense v-model="quotationForm.mtype"  label="機台類別"
                :options="eqpTypeList"
                option-value="typeid"
                option-label="type" emit-value map-options
                :rules="[val => !!val || '機台類別為必填欄位']"/>
            </div>
          </div>
          <br>
          <!--交貨地址-->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-12" style="max-width: 1000px">
              <q-input outlined dense v-model="quotationForm.address" label="交貨地址"/>
            </div>
          </div>
          <br>
          <!--稅率、價格條件--><!--稅率> 選單直接寫入5%,0兩個選項-->
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-select  outlined dense v-model="quotationForm.稅率"  label="稅率"
                :rules="[val => !!val || '稅率為必填欄位']"  emit-value map-options
                :options="taxRateList"/>
            </div>
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-select  outlined dense v-model="quotationForm.價格條件"  label="價格條件"
                :options="priceCondList"
                :rules="[val => !!val || '價格條件為必填欄位']"  emit-value map-options
                option-value="條文編號"
                option-label="條文名稱"/>
            </div>
          </div>
          <br>
          <!--交期要求、報價總額-->
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-select  outlined dense  label="交期要求" :options="dueDateTerm" v-model="quotationForm.交貨日期"
                :rules="[val => !!val || '交期要求為必填欄位']"  emit-value map-options
                option-value="條文編號"
                option-label="條文名稱"/>
            </div>
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-input  outlined dense readonly v-model="quotationForm.amount"  label="報價總額"/>
              <label>台幣換算：{{ NTD }}</label>
            </div>
          </div>
          <br>
          <!--交貨方式、付款方式-->
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-select  outlined v-model="quotationForm.交貨方式" dense  label="交貨方式"
                :options="handMethod"
                :rules="[val => !!val || '交貨方式為必填欄位']"
                option-value="條文編號"
                option-label="條文名稱"
                emit-value map-options
              />
            </div>
            <div class="col-6 col-md-6" style="max-width: 500px">
              <q-select  outlined v-model="quotationForm.付款方式" dense  label="付款方式"
                :options="paymentTerm"
                :rules="[val => !!val || '付款方式為必填欄位']"
                emit-value map-options
                option-value="條文編號"
                option-label="條文名稱"/>
            </div>
          </div>
          <br>
          <!--備註-->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-12" style="max-width: 1000px">
              <q-input outlined dense v-model="quotationForm.remark" label="備註"/>
            </div>
          </div>
          <br>
          <hr>
          <!--產品列表-->
          <h6>
            產品列表
            <q-btn size="sm" label="新增產品" color="primary" @click="AddProductItem"/>
          </h6>
          <div v-for="item in quotationForm.quotationDetailFormList" :key="item.識別">
            <div class="row q-col-gutter-md">
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input outlined dense v-model="item.產品編號" label="產品編號"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input outlined dense v-model="item.品名規格" label="品名規格"/>
              </div>
              <div class="col-1 col-md-1" style="max-width: 116px">
                <q-input type="number" min="0" outlined dense v-model="item.數量" label="數量"/>
              </div>
              <div class="col-1 col-md-1" style="max-width: 116px">
                <q-input outlined dense v-model="item.單位" label="單位"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input type="number" min="0" outlined dense v-model="item.單價" @blur="onBlur(item)" label="單價"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input type="number" min="0" outlined dense readonly v-model="item.金額" label="金額"/>
              </div>
              <div class="col-2 col-md-2" style="max-width: 166px">
                <q-input outlined dense v-model="item.描述" label="描述"/>
              </div>
            </div>
            <br>
          </div>
          <q-card-actions align="right">
            <h6>
              總金額：{{ quotationForm.amount }}
            </h6>
          </q-card-actions>
          <br>
        </q-card-section>
      </q-form>
      <q-card-actions align="right">
          <q-btn flat label="取消" color="negative" @click="close" />
          <q-btn label="送出" color="primary" @click="handleOtherAction"/>
      </q-card-actions>
  </q-card>
</template>
<script setup>
// import block
import { useCustStore } from '@/composables/useCust';
import {
  QCard
  , QCardSection
  , QCardActions
  , QForm
  , QBtn
  , QInput
  , QIcon
  , QPopupProxy
  , QDate
  , QSelect
  , SessionStorage
} from 'quasar';
import {ref, defineProps, defineEmits, onMounted} from 'vue';
// import block

// variable block
const myForm = ref(null);
const mode = ref('');
const custStore = useCustStore();
const salesList = ref([]);
const companyNo = ref('');
const companyAlias = ref('');
const companyName = ref('');
const NTD = ref('');
const props = defineProps({
  mode:{
    type:String,
    default:() =>''
  },
  quono:{
    type:String,
    default:()=>''
  },
  form:{
    type:Object,
    default: () => ({
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
    })
  },
  showForm:{
    type:Boolean,
    default:() => false
  },
  salesList:{
    type:Array,
    default:()=>[]
  }
});
const emit = defineEmits(['update:showForm']);
const showDatePopup = ref(false);
const showConDatePopup = ref(false);
const currencyList  = ref([]);
const eqpTypeList   = ref([]);
const taxRateList   = ref([]);
const exRateList    = ref([]);
const contactList   = ref([]);
const priceCondList = ref([]);
const dueDateTerm   = ref([]);
const handMethod    = ref([]);
const paymentTerm   = ref([]);
// const realExRate    = ref([]);
// const customerAlias = ref('');
const quotationForm = ref({
  idno		:'',
  quono       :'',
  mtype       :'',
  mmodel      :'',
  currency    :'',
  amount      :0,
  commission  :'',
  status      :'',
  contact     :'',
  machineno   :'',
  rfqno       :'',
  condate     :'',
  shipdate    :'',
  quodate     :'',
  // rfqdate     :'',
  ranking     :'',
  address     :'',
  exrate      :0,
  daddress    :'',
  價格條件    :'',
  交貨方式    :'',
  付款方式    :'',
  remark      :'',
  交貨日期    :'',
  稅率        :0.0,
  建檔        :'',
  修改        :'',
  核准        :'',
  建檔日      :'',
  修改日      :'',
  核准日      :'',
  quotationDetailFormList:[],
});
const salesname = ref('');
// variable block

// function block
const close = () =>{
  emit('update:showForm', false);
  console.log('showForm', props.showForm);
}
onMounted(async ()=>{
  console.log('props.mode',props.mode);
 await init();
})
const init =async () =>{
  currencyList.value  = await custStore.getCurrencyList();
  eqpTypeList.value   = await custStore.getEqpType();
  taxRateList.value  = await custStore.getTaxRateList();
  // exRateList.value    = await custStore.getExRateList();
  // console.log('exRateList',exRateList.value);
  contactList.value   = await custStore.getContactList(props.form.company);
  console.log('contactList', contactList.value);
  priceCondList.value = await custStore.getTxConditionList('T');
  // console.log('priceCondList',priceCondList.value);
  dueDateTerm.value   = await custStore.getTxConditionList('R');
  handMethod.value    = await custStore.getTxConditionList('D');
  paymentTerm.value   = await custStore.getTxConditionList('Y');
  console.log('paymentTerm.value',paymentTerm.value);
  if (!props.salesList || props.salesList.length == 0)
  {
    salesList.value = await custStore.getSalesList();
  } else {
    salesList.value = props.salesList;
  }
  console.log('salesList.value',salesList.value);
  if (props.form){
    console.log('form', props.form)
    mode.value = props.mode;
    console.log('rfqdate',props.form.rfqdate)
    // quotationForm.value = props.form ;
    console.log('rfqno',props.form.rfqno)
    console.log('quono',quotationForm.value.quono)
    quotationForm.value.rfqno = props.form.rfqno;
    try{
      if (quotationForm.value.quono == '')
      {
        quotationForm.value.quono = props.quono;
      }
      await custStore.getQuotationByNo(quotationForm.value.quono).then((data1)=>{
        Object.assign(quotationForm.value, data1);
        quotationForm.value.付款方式 = quotationForm.value.付款方式.trim()
        changeSalesName();
        changeExRate(quotationForm.value.currency)

      });

    } catch(e) {console.log(e)}
    await custStore.getRfq(props.form.rfqno).then((data2)=>{
          console.log('rfq obj', data2)
          console.log('data2.company', data2.company)
          companyName.value = data2.company;
          custStore.getCompany(data2.company).then((data3)=>{
            console.log('data3', data3)
            companyNo.value = data3.正航編號;
            companyAlias.value = data3.欄位2;
          })
        });


    console.log('quotationForm', quotationForm)
    console.log('salesList', props.salesList);
    console.log('正航編號', props.form.正航編號);


    contactList.value = await custStore.getContactList(companyName.value);
    console.log('contactList', contactList.value);
    // let company = await custStore.getCompanyList()
  } else {
    quotationForm.value.quodate = new Date().toLocaleDateString('en-GB')
  }

  await useCustStore().getQuono().then((data)=>{
    if (mode.value == "新增") {
      quotationForm.value.quono = data
    }

  })
  console.log('salesList',props.salesList);
  if (quotationForm.value.quono == '')
  {
    quotationForm.value.quono = props.quono;
  }
  sumAmount();
}
const changeSalesName = () =>{
  console.log('sales no',quotationForm.value.daddress)
  salesname.value = salesList.value.find(sales => sales.工號 == quotationForm.value.daddress)
        ?salesList.value.find(sales => sales.工號 == quotationForm.value.daddress).姓名
        :'';
  console.log('name:',salesname.value)
}
const submitForm = async () =>{
  console.log('quotationForm',quotationForm.value)
  const Account = SessionStorage.getItem('Account');
  if (mode.value == '新增'){
    console.log('mode', mode.value)
    quotationForm.value.建檔 = Account.account;
    await custStore.saveQuotation(quotationForm).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('寫入成功');
      }
    });
    // quotationForm.value.
  } else if (mode.value == '修改') {
    console.log('mode', mode.value)
    quotationForm.value.修改 = Account.account;
    await custStore.updateQuotation(quotationForm).then((data)=>{
      console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('修改成功');
      }
    });
  }
  // props.showForm = false;
  quotationForm.value = {
    idno		:'',
    quono       :'',
    mtype       :'',
    mmodel      :'',
    currency    :'',
    amount      :0,
    commission  :'',
    status      :'',
    contact     :'',
    machineno   :'',
    rfqno       :'',
    condate     :'',
    shipdate    :'',
    quodate     :'',
    // rfqdate     :'',
    ranking     :'',
    address     :'',
    exrate      :0,
    daddress    :'',
    價格條件    :'',
    交貨方式    :'',
    付款方式    :'',
    remark      :'',
    交貨日期    :'',
    稅率        :0.0,
    建檔        :'',
    修改        :'',
    核准        :'',
    建檔日      :'',
    修改日      :'',
    核准日      :'',
    quotationDetailFormList:[],
  };
  emit("update:showForm", false);
  init();
}
const handleOtherAction = async () => {
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}
const changeExRate = async (val) =>{
  console.log('val.currency', val);
  exRateList.value = await custStore.getExRateList(val);
  quotationForm.value.exrate = exRateList.value[0];
}
const sumAmount = () =>{
  quotationForm.value.amount = 0;
  for(let i = 0; i <  quotationForm.value.quotationDetailFormList.length; i++) {
    quotationForm.value.amount += quotationForm.value.quotationDetailFormList[i].金額;
  }
}
const onBlur = (item) =>{
  item.金額 = item.單價 * item.數量;
  sumAmount();
}
const AddProductItem = () =>{
  console.log('quotationForm in AddProductItem:', quotationForm.value);
  quotationForm.value.quotationDetailFormList.push({ 識別碼: 0
                                                                                                                , 產品編號: ''
                                                                                                                , 品名規格: ''
                                                                                                                , 數量: 0
                                                                                                                , 單位: ''
                                                                                                                , 單價: 0
                                                                                                                , 金額: 0
                                                                                                                , 描述: ''
                                                                                                                , quono:quotationForm.value.quono})
}
const copy = async () =>{
  quotationForm.value.quono = await custStore.getQuono();
  await custStore.saveQuotation(quotationForm).then((data)=>{
    console.log('response', data);
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('複製成功');
      }
  });
}
const updateExpiryFlag = async (type) =>{
  const account = SessionStorage.getItem('Account');
  if (type == 'Y')
    quotationForm.value.核准 = account.account;
  else
    quotationForm.value.核准 = '';
  await custStore.updateExpiryFlag(quotationForm.value.quono, quotationForm.value.核准, type);
}
// function block
</script>
