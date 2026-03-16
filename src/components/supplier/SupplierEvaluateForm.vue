<template>
  <q-card class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">
        {{ mode }}廠商評鑑表
        <q-card-actions align="right">
            <q-btn flat label="取消" color="negative" @click="close" />
            <q-btn v-if="(hasAllAuth || auth.編修) && !preview" label="送出" color="primary" @click="handleOtherAction" />
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
        <!--#region 日期、單號、廠商編號、廠商簡稱、評鑑人員-->
          <div class="row q-col-gutter-md">
            <div class="col-2 col-md-2" style="max-width: 400px">
              <q-input outlined dense v-model="form.日期" label="日期" readonly mask="####/##/##" :rules="[val =>  !!val || '日期為必填欄位']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover v-model="showDatePopup" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.日期" readonly mask="YYYY/MM/DD" no-title>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat @click="showDatePopup = false" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-2 col-md-2" style="max-width: 400px">
              <q-input outlined dense v-model="form.單號" label="單號" readonly :rules="[val =>  !!val || '單號為必填欄位']"></q-input>
            </div>
            <div class="col-2 col-md-2" style="max-width: 400px">
              <q-select outlined dense v-model="form.廠商編號" label="廠商編號" readonly
              emit-value map-options :options="supplierNoList"
              >
              </q-select>
            </div>
            <div class="col-3 col-md-3" style="max-width: 400px">
              <q-input outlined dense v-model="form.廠商簡稱" label="廠商簡稱" readonly :rules="[val =>  !!val || '單號為必填欄位']"></q-input>
            </div>
            <div class="col-3 col-md-3" style="max-width: 400px">
              <q-select outlined dense v-model="form.評鑑人員" label="評鑑人員" :readonly="readonly || preview"
              emit-value map-options
              >
              </q-select>
            </div>
          </div>
        <!--#endregion-->
        <br>
        <!--#region 統一編號、所屬業別、廠商名稱、複審人員-->
          <div class="row q-col-gutter-md">
            <div class="col-2 col-md-2" style="max-width: 400px">
              <q-input v-model="form.統一編號" label="統一編號" outlined dense readonly />
            </div>
            <div class="col-2 col-md-2" style="max-width: 400px">
              <q-input v-model="form.所屬業別" label="所屬業別" outlined dense readonly/>
            </div>
            <div class="col-6 col-md-6" style="max-width: 600px">
              <q-input v-model="form.廠商名稱" label="廠商名稱" outlined dense readonly/>
            </div>
            <div class="col-2 col-md-2" style="max-width: 600px">
              <q-select emit-value map-options v-model="form.覆審人員" label="覆審人員" outlined dense :readonly="readonly || preview"/>
            </div>
          </div>
        <!--#endregion-->
        <br>
        <!--#region 工廠地址、公司地址、複審日期-->
          <div class="row q-col-gutter-md">
            <div class="col-5 col-md-5" style="max-width: 600px">
              <q-input v-model="form.工廠地址" label="工廠地址" outlined dense readonly/>
            </div>
            <div class="col-5 col-md-5" style="max-width: 600px">
              <q-input v-model="form.公司地址" label="公司地址" outlined dense readonly/>
            </div>
            <div class="col-2 col-md-2" style="max-width: 300px">
              <q-input v-model="form.覆審日期" label="覆審日期" outlined dense :readonly="readonly || preview">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover v-model="showReDatePopup" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.覆審日期" :readonly="readonly || preview" mask="YYYY/MM/DD" no-title>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat @click="showReDatePopup = false" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
         </div>
        <!--#endregion-->
        <br>
        <!--#region 評鑑項目-->
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
              <q-input type="number" v-model="form.達成客戶要求的能力" min="0" max="10" label="達成客戶要求的能力" @blur="calculateTotal" outlined dense :readonly="readonly || preview"/>
            </div>
            <div class="col-8 col-md-8" style="max-width: 1200px">
              <q-input v-model="form.達" outlined dense min="0" :readonly="readonly || preview"/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
              <q-input type="number" v-model="form.提升經營效能的企圖" min="0" max="10" label="提升經營效能的企圖" @blur="calculateTotal" outlined dense :readonly="readonly || preview"/>
            </div>
            <div class="col-8 col-md-8" style="max-width: 1200px">
              <q-input v-model="form.提" outlined dense :readonly="readonly || preview"/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
              <q-input type="number" v-model="form.勞動安全與職工福利" min="0" max="10" label="勞動安全與職工福利" @blur="calculateTotal" outlined dense :readonly="readonly || preview"/>
            </div>
            <div class="col-8 col-md-8" style="max-width: 1200px">
              <q-input v-model="form.勞" outlined dense :readonly="readonly || preview"/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
              <q-input type="number" v-model="form.能迅速處理客戶抱怨" min="0" max="10" label="能迅速處理客戶抱怨" @blur="calculateTotal" outlined dense :readonly="readonly || preview"/>
            </div>
            <div class="col-8 col-md-8" style="max-width: 1200px">
              <q-input v-model="form.能" outlined dense :readonly="readonly || preview"/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
              <q-input type="number" v-model="form.設備的產能與準確度" min="0" max="10" label="設備的產能與準確度" @blur="calculateTotal" outlined dense :readonly="readonly || preview"/>
            </div>
            <div class="col-8 col-md-8" style="max-width: 1200px">
              <q-input v-model="form.設" outlined dense :readonly="readonly || preview"/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
              <q-input type="number" v-model="form.足夠的人力資源條件" min="0" max="10" label="足夠的人力資源條件" @blur="calculateTotal" outlined dense :readonly="readonly || preview"/>
            </div>
            <div class="col-8 col-md-8" style="max-width: 1200px">
              <q-input v-model="form.足" outlined dense :readonly="readonly || preview"/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
              <q-input type="number" v-model="form.產銷接單適當無過載" min="0" max="10" label="產銷接單適當無過載" @blur="calculateTotal" outlined dense :readonly="readonly || preview"/>
            </div>
            <div class="col-8 col-md-8" style="max-width: 1200px">
              <q-input v-model="form.產" outlined dense :readonly="readonly || preview"/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
              <q-input type="number" v-model="form.健全的產品驗證系統" min="0" max="10" label="健全的產品驗證系統" @blur="calculateTotal" outlined dense :readonly="readonly || preview"/>
            </div>
            <div class="col-8 col-md-8" style="max-width: 1200px">
              <q-input v-model="form.健" outlined dense :readonly="readonly || preview"/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
              <q-input type="number" v-model="form.符合訂單的品質要求" min="0" max="10" label="符合訂單的品質要求" @blur="calculateTotal" outlined dense :readonly="readonly || preview"/>
            </div>
            <div class="col-8 col-md-8" style="max-width: 1200px">
              <q-input v-model="form.符" outlined dense :readonly="readonly || preview"/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
              <q-input type="number" v-model="form.依產品標準進行檢測" min="0" max="10" label="依產品標準進行檢測" @blur="calculateTotal" outlined dense :readonly="readonly || preview"/>
            </div>
            <div class="col-8 col-md-8" style="max-width: 1200px">
              <q-input v-model="form.依" outlined dense :readonly="readonly || preview"/>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 300px">
                <q-input type="number" v-model="total" min="0" label="評分合計" outlined dense :readonly="readonly || preview" />
            </div>
          </div>
        <!--#endregion -->
        <br>
        <!--#region 表單尾簽核欄位-->
          <div class="row q-col-gutter-md">
            <div class="col-4 col-md-4" style="max-width: 500px">
              <label class="text-h5">核准人員：{{ form.核准 }} {{ form.核准日 }}</label>
            </div>
            <div class="col-4 col-md-4" style="max-width: 500px">
              <label class="text-h5">修改人員：{{ form.修改 }} {{ form.修改日 }}</label>
            </div>
            <div class="col-4 col-md-4" style="max-width: 500px">
              <label class="text-h5">建檔人員：{{ form.建檔 }} {{ form.建檔日 }}</label>
            </div>
          </div>
        <!--#endregion-->
      </q-card-section>
    </q-form>
  </q-card>
  <loading-component v-model="secondDialog"/>
</template>
<script setup>
//#region import
import { useAuth } from '@/composables/useAuth';
import { useSupplierStore } from '@/composables/useSupplier';
import dayjs from 'dayjs';
import {
  QCard,
  QCardSection,
  QCardActions,
  QForm,
  QBtn,
  QInput,
  QIcon,
  QPopupProxy,
  QDate,
  QSelect,
} from 'quasar'
import {defineProps,
  onMounted,
  ref,
  defineEmits,
} from 'vue';
import LoadingComponent from '../LoadingComponent.vue';
//#endregion

//#region variable
const total = ref(0);
const preview = ref(false);
const showDatePopup = ref(false);
const showReDatePopup = ref(false);
const supplierStore = useSupplierStore();
const authStore = useAuth();
const auth = ref({});
const mode = ref('');
const myForm = ref(null);
const emits = defineEmits(['update:showForm']);
const props = defineProps({
  formName:{
    type:String,
    default:()=>'',
  },
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  supplier:{
    type:Object,
    default:()=>{}
  },
  mode:{
    type:String,
    default:()=>'新增',
  },
  preview:{
    type:Boolean,
    default:()=>false,
  }
})
const secondDialog = ref(false);
// const supplier = ref({});
const supplierNoList = ref([]);
const hasAllAuth = ref(false);
const form = ref({
  日期:'',
  單號:'',
  廠商編號:'',
  統一編號:'',
  所屬業別:'',
  廠商名稱:'',
  覆審人員:'',
  達成客戶要求的能力:0,
  提升經營效能的企圖:0,
  勞動安全與職工福利:0,
  能迅速處理客戶抱怨:0,
  設備的產能與準確度:0,
  足夠的人力資源條件:0,
  產銷接單適當無過載:0,
  健全的產品驗證系統:0,
  符合訂單的品質要求:0,
  依產品標準進行檢測:0,
  建檔	:'',
  建檔日	:'',
  修改	:'',
  修改日	:'',
  核准	:'',
  核准日	:'',
  達		:'',
  提		:'',
  勞		:'',
  能		:'',
  設		:'',
  足		:'',
  產		:'',
  健		:'',
  符		:'',
  依		:''
});
//#endregion

//#region function
const close = () =>{
  emits('update:showForm', false);
}
const init = async () =>{
  if (props.supplier.廠商編號){
    // supplier.value = props.supplier;
    mode.value = props.mode;
    preview.value = props.preview;
    console.log('props supplier', props.supplier)
    form.value = props.supplier;
    hasAllAuth.value = authStore.hasAllAuth(props.formName);
    auth.value = authStore.getAuth(props.formName);
  }

  if (mode.value == '新增') {
    form.value.日期 = dayjs().format("YYYY/MM/DD");
    const formNo = await supplierStore.getEvaluateFormNo();
    form.value.單號 = formNo;
    form.value.評鑑人員 = '',
    form.value.覆審人員 = '',
    form.value.覆審日期 = '',
    form.value.達成客戶要求的能力=0;
    form.value.提升經營效能的企圖=0;
    form.value.勞動安全與職工福利=0;
    form.value.能迅速處理客戶抱怨=0;
    form.value.設備的產能與準確度=0;
    form.value.足夠的人力資源條件=0;
    form.value.產銷接單適當無過載=0;
    form.value.健全的產品驗證系統=0;
    form.value.符合訂單的品質要求=0;
    form.value.依產品標準進行檢測=0;
    form.value.建檔	='';
    form.value.建檔日	='';
    form.value.修改	='';
    form.value.修改日	='';
    form.value.核准	='';
    form.value.核准日	='';
    form.value.達		='';
    form.value.提		='';
    form.value.勞		='';
    form.value.能		='';
    form.value.設		='';
    form.value.足		='';
    form.value.產		='';
    form.value.健		='';
    form.value.符		='';
    form.value.依		='';
  }

  const data = await supplierStore.getAllSupplierList();
  supplierNoList.value = data.map((x)=>x.廠商編號);
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
  if (props.mode == '新增') {
    secondDialog.value = true;
    form.value.建檔 = authStore.getUser().account;
    await supplierStore.addSupplierEvaliate(form).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('新增成功!');
        emits('update:showForm', false);
      }
      secondDialog.value = false;
    })
  }
}
onMounted(async ()=>{
  await init();
  // console.log('mode')
})

const calculateTotal =() =>{
  total.value = 0;
  total.value += parseInt(form.value.達成客戶要求的能力);
  total.value += parseInt(form.value.提升經營效能的企圖);
  total.value += parseInt(form.value.勞動安全與職工福利);
  total.value += parseInt(form.value.能迅速處理客戶抱怨);
  total.value += parseInt(form.value.設備的產能與準確度);
  total.value += parseInt(form.value.足夠的人力資源條件);
  total.value += parseInt(form.value.產銷接單適當無過載);
  total.value += parseInt(form.value.健全的產品驗證系統);
  total.value += parseInt(form.value.符合訂單的品質要求);
  total.value += parseInt(form.value.依產品標準進行檢測);
}

const validate = async (validate) =>{
  const user = authStore.getUser().account;
  await supplierStore.evaluateSupplier(form.value.單號, validate, user).then((data)=>{
    if(data.data.errorMessage){
      alert(data.data.errorMessage)
    } else {
      alert('核准完成');
    }
    emits('update:showForm', false);
  })
}
//#endregion
</script>
