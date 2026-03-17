<template>
  <q-card class="q-pa-md"  style="width: 500px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">
        廠商供料詢價
      </div>
    </q-card-section>
    <!--#region 表單本體-->
    <q-form ref="myForm">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-input v-model="form.廠商編號" label="廠商編號" readonly outlined dense />
          </div>
        </div>
        <br>
        <!--詢價日期-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-input v-model="form.詢價日期" label="詢價日期" outlined dense >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover v-model="showConDatePopup" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.詢價日期" mask="YYYY/MM/DD" no-title>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat @click="showConDatePopup = false" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <br>
        <!--品項編號-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-select
            v-model="form.品項編號"
            label="品項編號" outlined dense
            emit-value map-options :options="itemList" option-label="產品編號" option-value="產品編號"/>
          </div>
        </div>
        <br>
        <!--採購單位-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-input v-model="form.採購單位" label="採購單位" outlined dense />
          </div>
        </div>
        <br>
        <!--最低採購量-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-input type="number" min="1" v-model="form.最低採購量" label="最低採購量" outlined dense />
          </div>
        </div>
        <br>
        <!--最大採購量-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-input type="number" min="1" v-model="form.最大採購量" label="最大採購量" outlined dense />
          </div>
        </div>

        <br>
        <!--單價-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-input type="number" min="1" v-model="form.單價" label="單價" outlined dense />
          </div>
        </div>

        <br>
        <!--幣別-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-select :options="currencyList"
            v-model="form.幣別" label="幣別" outlined dense emit-value map-options
            option-value="currency"
            option-label="currency" />
          </div>
        </div>
        <br>
        <!--詢價人員-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-select
            v-model="form.詢價人員" label="詢價人員" outlined dense />
          </div>
        </div>
        <br>
        <!--報價有效日期-->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-input v-model="form.報價有效日期" label="報價有效日期" outlined dense >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover v-model="showEffDatePopup" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.報價有效日期" mask="YYYY/MM/DD" no-title>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat @click="showEffDatePopup = false" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <br>
            <!--廠商品號-->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12" style="max-width: 500px">
                <q-input v-model="form.廠商品號" label="廠商品號" outlined dense />
              </div>
            </div>
            <br>
          </div>
        </div>
      </q-card-section>
    </q-form>
    <q-card-actions align="right">
      <q-btn flat label="取消" color="negative" @click="close" />
      <q-btn v-if="!preview" label="送出" color="primary" @click="handleOtherAction" />
    </q-card-actions>
    <!--#endregion-->
  </q-card>
  <loading-component v-model="secondDialog"/>
</template>
<script setup>
//#region import
import { useCustStore } from '@/composables/useCust';
import { useItemStore } from '@/composables/useItem';
import { useSupplierStore } from '@/composables/useSupplier';
import {
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QIcon,
  QPopupProxy,
  QDate,
  QInput,
  QSelect,
  QForm,
  // QDialog,
} from 'quasar';
import { defineProps, ref, defineEmits, onMounted } from 'vue'
//#endregion

//#region variable
// const showItemQueryForm = ref(false);
// const showSupplierQueryForm = ref(false);
const supplierList = ref([]);
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  supplier:{
    type:Object,
    default:()=>{}
  }
})
const myForm = ref(null);
const secondDialog = ref(false);
const emits = defineEmits(['update:showForm'])
const supplierStore = useSupplierStore();
const form = ref({
  廠商編號:'',
  詢價日期:'',
  品項編號:'',
  採購單位:'',
  最低採購量:1,
  最大採購量:1,
  單價:0,
  幣別:'',
  詢價人員:'',
  報價有效日期:'',
  廠商品號:'',
})
const showConDatePopup = ref(false);
const itemList = ref([]);
const itemStore = useItemStore();
const currencyList  = ref([]);
const showEffDatePopup = ref(false);
const custStore = useCustStore();
//#endregion

//#region function
const close = () =>{
  emits('update:showForm', false);
}
onMounted(async ()=>{
  await init();
})

const init = async () =>{

  form.value.廠商編號 = props.supplier.廠商編號;
  await itemStore.getAllItems().then((data)=>{
    itemList.value = data;
  });

  await custStore.getCurrencyList().then((data)=>{
    currencyList.value  = data;
  });
  await supplierStore.getSupplierList().then((data)=>{
    supplierList.value = data;
  })
}

const handleOtherAction = async() =>{
  secondDialog.value = true;
  if (myForm.value.validate()){
    await supplierStore.addSupplierQuotation(form).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('新增成功');
      }
      secondDialog.value = false;
      emits('update:showForm', false);
      init();
    })
  }
}
//#endregion
</script>
