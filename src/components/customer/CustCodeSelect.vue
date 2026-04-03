<template>
  <div class="row q-col-gutter-md">
    <div class="col-6 col-md-6 flex" style="max-width: 375px">
      <q-select v-model="客戶編號" outlined dense label="客戶編號" style="width:270px"
                    :options="custNumberList"
                    option-label="正航編號"
                    option-value="正航編號"
                    emit-value map-options
                    @update:model-value="changeCustCompany"
                    />
      <q-icon name="search" size="30px" @click="openSearcCustomerForm" class="cursor-pointer"></q-icon>
      <q-dialog v-model="showSearchCustNoForm" perisitent>
        <CustListQueryView v-model:showForm="showSearchCustNoForm" v-model:custNo="客戶編號"/>
      </q-dialog>
    </div>
    <div class="col-6 col-md-6" style="max-width: 375px">
      <q-input outlined dense readonly v-model="客戶名稱" label="客戶名稱" />
    </div>
  </div>
</template>
<script setup>
// #region import block start
import { QSelect, QIcon, QDialog, QInput } from 'quasar';
import CustListQueryView from './query/CustListQueryView.vue';
import { ref, defineEmits, onMounted, defineProps,watch } from 'vue';
import { useCustStore } from '@/composables/useCust';
// #endregion

// #region variable block start
const showSearchCustNoForm = ref(false);
const custStore = useCustStore();
const custNumberList = ref([]);
const 客戶編號 = ref('');
const emits = defineEmits(['update:客戶編號'])
const props = defineProps({
  客戶編號:{
    type:String,
    default:()=>'',
  }
})
const 客戶名稱 = ref('');
// #endregion

// #region function block start
const openSearcCustomerForm = () =>{
  showSearchCustNoForm.value = true;
}
const changeCustCompany = (pam) =>{
  let data = custNumberList.value.find(x => x.正航編號 === pam)
  if (data){
    客戶名稱.value = data.company;
    emits('update:客戶編號', data.正航編號);
  }
}

onMounted(async ()=>{
  await custStore.getCustNumberList().then((data)=>{
    custNumberList.value = data;
  })
  客戶編號.value = props.客戶編號;
})
watch(
  () => 客戶編號.value,
  (newVal) => {
    客戶編號.value = newVal;
    emits('update:客戶編號',客戶編號.value);
    let data = custNumberList.value.find(x => x.正航編號 === newVal)
    if (data){
      客戶名稱.value = data.company;
    }
  }
)
// #endregion
</script>
