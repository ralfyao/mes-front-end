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
            <q-checkbox label="停用" v-model="form.停用" :readonly="readonly || preview" outlined dense />
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
      </q-form>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="關閉" color="blue" flat dense @click="close"/>
    </q-card-actions>
  </q-card>
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
  , QSelect
} from 'quasar';
import {
  ref
  , defineProps,
  onMounted
  , defineEmits
} from 'vue';
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
      ,勾選:false
      ,來源屬性:''})
// #endregion

// #region function
onMounted(()=>{
  init();
})
const init = async () =>{
  preview.value = props.mode == '預覽' ? true : false;
  await itemStore.getItemTypeList().then((data)=>{
    itemTypeList.value = data;
  });
}
const close = () =>{
  emits('update:showForm', false);
}
// #endregion
</script>
