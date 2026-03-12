<template>
  <q-card class="q-pa-md"  style="width: 500px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">出貨單搜尋</div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.soldOutNo" outlined dense label="單號查詢"/>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-10">
          <q-input v-model="param.customerName" outlined dense label="客戶查詢"/>
          <q-icon name="search" size="30px" @click="openSearcCustomerForm" class="cursor-pointer"></q-icon>
          <q-dialog v-model="showSearchCustNoForm" perisitent>
            <CustListQueryView v-model:showForm="showSearchCustNoForm" v-model:custNo="param.customerName"/>
          </q-dialog>
        </div>
      </div>
      <br>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="查詢" color="positive" @click="query()" />
      <q-btn flat label="EXIT" color="negative" @click="close()" />
    </q-card-actions>
  </q-card>
  <LoadingComponent v-model="showSecondDialog"/>
</template>
<script setup>
//#region import
import { useCustStore } from '@/composables/useCust';
import {
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QInput,
  QIcon,
  QDialog
} from 'quasar'
import {
  defineEmits, ref
} from 'vue';
import CustListQueryView from '@/components/customer/query/CustListQueryView.vue'
import LoadingComponent from '@/components/LoadingComponent.vue';
//#endregion

//#region variable
const emits = defineEmits(['update:showForm', 'update:list']);
const param = {
  soldOutNo:'',
  customerName:'',
}
const custStore = useCustStore();
const list = ref([]);
const showSearchCustNoForm = ref(false);
const showSecondDialog = ref(false);
//#endregion

//#region function
const close = () =>{
  emits('update:showForm', false);
}

const query = async ()=>{
  showSecondDialog.value = true;
  await custStore.getShipOrderList().then((data)=>{
    list.value = data;
    if (param.soldOutNo && param.soldOutNo != ''){
      list.value = data.filter((x) => x.單號.indexOf(param.soldOutNo) != -1);
    }
    if (param.customerName && param.customerName != ''){
      list.value = data.filter((x) => x.客戶編號.indexOf(param.customerName) != -1);
    }
    showSecondDialog.value = false;
    emits('update:list', list);
    close();
  });
}

const openSearcCustomerForm = () =>{
  showSearchCustNoForm.value = true;
}
//#endregion
</script>
