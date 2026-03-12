<template>
  <q-card  class="q-pa-md"  style="width: 500px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">維修單搜尋</div>
      <div class="row">
        <div class="col-10">
          <q-select
            v-model="param.custNo"
            outlined
            dense
            :options="custAliasList"
            option-value="正航編號"
            option-label="正航編號"
            emit-value map-options
            label="客戶篩選"/>
          <q-icon name="search" size="30px" @click="openSearcCustomerForm" class="cursor-pointer"></q-icon>
          <q-dialog v-model="showSearchCustNoForm" perisitent>
            <CustListQueryView v-model:showForm="showSearchCustNoForm" v-model:custNo="param.custNo"/>
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
  <loading-component v-model="secondDialog"/>
</template>
<script setup>
// #region ---------------------------------import-----------------------------------
import LoadingComponent from '@/components/LoadingComponent.vue';
import CustListQueryView from '@/components/customer/query/CustListQueryView.vue'
import { useCustStore } from '@/composables/useCust';
import {
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QSelect,
  QIcon,
  QDialog,
} from 'quasar'
import {
  defineProps,
  defineEmits,
  ref,
} from 'vue'
// #endregion

// #region ---------------------------------variable---------------------------------
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  list:{
    type:Array,
    default:()=>[],
  },
  custAliasList:{
    type:Array,
    default:()=>[],
  }
})
const param = ref({
  custNo:'',
});
// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['update:showForm', 'update:list']);
const custStore = useCustStore();
const secondDialog = ref(false);
const showSearchCustNoForm = ref(false);
// #endregion

// #region ---------------------------------function---------------------------------
const close = () =>{
  emits('update:showForm', false);
}
const query = async () =>{
  secondDialog.value = true;
  console.log('param', param);
  await custStore.queryRepairTestFormByCondition(param.value.custNo).then((data)=>{
    if (data.length == 0)
    {
      alert('無資料');
    }
    else
    {
      emits('update:list', data);
    }
    emits('update:showForm', false);
    secondDialog.value = false;
  })
}
const openSearcCustomerForm = () =>{
  showSearchCustNoForm.value = true;
}
// #endregion
</script>
