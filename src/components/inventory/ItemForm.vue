<template>
  <q-card class="q-pa-md"  style="width: 1500px; max-width: 100vw;">
    <q-card-section>
      <div class="text-h4">
        {{props.mode}}品項
        <q-btn label="停用管理" v-if="!preview" outlined dense glossy color="green"/>&nbsp;
        <q-btn label="生效" v-if="!preview && (hasAllAuth) && form.停用" outlined dense glossy color="grey"/>&nbsp;
        <q-btn label="取消生效" v-if="!preview && (hasAllAuth) && !form.停用" outlined dense glossy color="grey"/>&nbsp;
      </div>
    </q-card-section>
    <q-card-section>
      <q-form ref="myForm">
        <div class="row q-col-gutter-md">
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-input label="品項編號" v-model="form.產品編號" :readonly="readonly || preview" outlined dense />
          </div>
          <div class="col-7 col-md-7" style="max-width: 875px">
            <q-input label="品名" v-model="form.品名規格" :readonly="readonly || preview" outlined dense />
          </div>
          <div class="col-1 col-md-1" style="max-width: 125px">
            <q-checkbox label="停用" v-model="form.停用" :readonly="readonly || preview" outlined dense @update:model-value="changeDisabled(form)" />
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-select
              label="品別"
              v-model="form.品別"
              :readonly="readonly || preview"
              outlined dense
              :options="itemTypeList"
              />
          </div>
          <div class="col-8 col-md-8" style="max-width: 1000px">
            <q-input label="英文品名" v-model="form.英文品名" :readonly="readonly || preview" outlined dense />
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-select label="主分類" v-model="form.大分類" outlined dense :readonly="readonly || preview" :options="grossClassList" emit-value map-options/>
          </div>
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-select label="庫存成本單位" v-model="form.庫存單位" outlined dense :readonly="readonly || preview" :options="stockUnitList" emit-value map-options/>
          </div>
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-input type="number" label="長mm" v-model="form.外尺寸長" outlined dense :readonly="readonly || preview" />
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-select label="次分類" v-model="form.小分類" outlined dense :readonly="readonly || preview" :options="grainedClassList" emit-value map-options/>
          </div>
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-select label="採購單位" v-model="form.採購單位" outlined dense :readonly="readonly || preview" :options="purchaseUnitList" emit-value map-options/>
          </div>
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-input type="number" label="寬mm" v-model="form.外尺寸寬" outlined dense :readonly="readonly || preview" />
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-select label="來源屬性" v-model="form.來源屬性" outlined dense :readonly="readonly || preview" :options="sourceAttrList" emit-value map-options/>
          </div>
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-input type="number" label="採購換算倍數" v-model="form.採購換算倍數" outlined dense :readonly="readonly || preview" />
          </div>
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-input type="number" label="厚mm" v-model="form.厚度" outlined dense :readonly="readonly || preview" />
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-input label="材料代碼" v-model="form.產品代號" outlined dense :readonly="readonly || preview" />
          </div>
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-select label="銷售單位" v-model="form.銷售單位" outlined dense :readonly="readonly || preview" :options="salesUnitList" emit-value map-options/>
          </div>
          <div class="col-4 col-md-4" style="max-width: 500px">
            <q-input type="number" label="外徑mm" v-model="form.外徑" outlined dense :readonly="readonly || preview" />
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <div class="col-4 col-md-4 " style="max-width: 500px">
            <q-btn label="採購預查新增臨時品號" glossy color="blue" outlined dense />&nbsp;
            <q-btn label="放棄" color="brown" glossy outlined dense />
          </div>
          <div class="col-4 col-md-4 " style="max-width: 500px">
            <q-input label="銷售換算倍數" v-model="form.銷售換算倍數" outlined dense :readonly="readonly || preview" />
          </div>
          <div class="col-4 col-md-4 " style="max-width: 500px">
            <q-input type="number" label="內徑mm" v-model="form.內徑" outlined dense :readonly="readonly || preview" />
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-4 " style="max-width: 500px">
          <label class="text-h5">核准：{{ form.核准}} 核准日：{{ form.核准日 }}</label>
        </div>
        <div class="col-4 col-md-4 " style="max-width: 500px">
          <label class="text-h5">建檔：{{ form.建檔}} 建檔日：{{ form.建檔日 }}</label>
        </div>
        <div class="col-4 col-md-4 " style="max-width: 500px">
          <label class="text-h5">修改：{{ form.修改}} 修改日：{{ form.修改日 }}</label>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="關閉" color="blue" flat dense @click="close"/>
      <q-btn label="送出" color="red" flat dense @click="submit"/>
    </q-card-actions>
  </q-card>
  <loading-component v-model="secondDialog"/>
</template>
<script setup>
// #region import
import { useAuth } from '@/composables/useAuth';
import { useItemStore } from '@/composables/useItem';
// import ItemView from '@/views/Inventory/ItemView.vue';
import {
  QCard
  , QCardSection
  , QCardActions
  , QBtn
  , QForm
  , QInput
  , QCheckbox
  , QSelect,
  SessionStorage
} from 'quasar';
import {
  ref
  , defineProps,
  onMounted
  , defineEmits
  // , watch
} from 'vue';
import LoadingComponent from '../LoadingComponent.vue';
import dayjs from 'dayjs';
// #endregion

// #region variable
const props = defineProps({
  mode:{
    type:String,
    default:'新增',
  },
  form:{
    type:Object,
    default:()=>({}),
  }
});
const secondDialog = ref(false);
const grossClassList = ref([]);
const grainedClassList = ref([]);
const stockUnitList = ref([]);
const purchaseUnitList = ref([]);
const sourceAttrList = ref([]);
const salesUnitList = ref([]);
const emits = defineEmits(['update:showForm'])
const preview = ref(false);
const myForm = ref(null);
const itemStore = useItemStore();
const authStore = useAuth();
const itemTypeList = ref([]);
const formName = ref('品項維護');
const hasAllAuth = authStore.hasAllAuth(formName.value);
const form = ref({產品編號:''
      ,品別:''
      ,大分類:''
      ,小分類:''
      ,產品代號:''
      ,品名規格:''
      ,英文品名:''
      ,外尺寸長:0
      ,外尺寸寬:0
      ,厚度:0
      ,內徑:0
      ,外徑:0
      ,庫存單位:''
      ,採購單位:''
      ,採購換算倍數:0
      ,銷售單位:''
      ,銷售換算倍數:0
      ,停用:false
      ,建檔:''
      ,建檔日:''
      ,修改:''
      ,修改日:''
      ,核准:''
      ,核准日:''
      ,勾選:false
      ,來源屬性:''})
// #endregion

// #region function
const changeDisabled = async (form) =>{
  secondDialog.value = true;
  // console.log('產品編號', form.產品編號);

  console.log('form', form);
  await itemStore.disableItem(form.產品編號).then((data)=>{
    if (data.data.errorMessage && data.data.errorMessage != ''){
      alert(data.data.errorMessage);
    } else {
      alert('執行成功');
    }
    secondDialog.value = false;
    close();
  })
}
onMounted(()=>{
  init();
})
const init = async () =>{
  preview.value = props.mode == '預覽' ? true : false;
  form.value = props.form;
  console.log('form', form.value);
  form.value.建檔日 = form.value.建檔日 && form.value.建檔日 != null && form.value.建檔日 != '' ? dayjs(form.value.建檔日).format("YYYY/MM/DD") : ''
  form.value.修改日 = form.value.修改日 && form.value.修改日 != null && form.value.修改日 != '' ? dayjs(form.value.修改日).format("YYYY/MM/DD") : ''
  form.value.核准日 = form.value.核准日 && form.value.核准日 != null && form.value.核准日 != '' ? dayjs(form.value.核准日).format("YYYY/MM/DD") : ''
  await itemStore.getItemTypeList().then((data)=>{
    itemTypeList.value = data;
  });
}
const close = () =>{
  emits('update:showForm', false);
}

const submit = async () =>{
  if (props.mode == '新增') {
    form.value.建檔 = SessionStorage.getItem('Account').account;
    form.value.建檔日 = dayjs().format('YYYY/MM/DD')
  } else if (props.mode == '修改') {
    form.value.修改 = SessionStorage.getItem('Account').account;
    form.value.修改日 = dayjs().format('YYYY/MM/DD')
  }
  secondDialog.value = true;
  await itemStore.saveUpdateItemInfo(form.value).then((data)=>{
    if (data.data.errorMessage && data.data.errorMessage != ''){
      alert(data.data.errorMessage);
    } else {
      alert('儲存成功!');
    }
    secondDialog.value = false;
    close();
  })
}
// watch()
// #endregion
</script>
