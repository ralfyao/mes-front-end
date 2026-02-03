<template>
<div>
  <q-table
    :columns="columns"
    :rows="productSpecList"
    flat
    bordered
    virtual-scroll
    class="rounded-borders"
    selection="single"
    v-model:selected="selected"
    @update:selected="log"
  >
  </q-table>
  <div class="row justify-start padding-top">
    <div class="padding-right">
      <q-btn color="primary" class="padding-right" glossy
        :loading="loading" @click="openFormDialog('add')">
        新增產品規格
      </q-btn>
    </div>
    <div class="padding-right">
      <q-btn color="info"
             class="padding-right"
             glossy
            :loading="loading"
            @click="getProductSpec()">修改產品規格</q-btn>
    </div>
    <div class="padding-right">
      <q-btn color="red" class="padding-right" glossy
        :loading="loading">刪除產品規格</q-btn>
    </div>
  </div>
  <q-dialog v-model="showForm" persistent>
    <q-card class="q-pa-md"  style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h4">{{ title }}</div>
      </q-card-section>
      <q-card-section>
        規格名稱：<q-input v-model="specName" outlined dense placeholder="請輸入規格名稱" /> <br/>
        規格值：<q-input v-model="specValue" outlined dense placeholder="請輸入規格值" /> <br/>
        規格最大值：<q-input type="number" v-model="specMaxValue" outlined dense placeholder="請輸入規格最大值" /> <br/>
        規格最小值：<q-input type="number" v-model="specMinValue" outlined dense placeholder="請輸入規格最小值" /> <br/>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="right">
        <q-btn flat label="保存" color="primary" @click="submitForm()"></q-btn>
        <q-btn flat label="關閉" color="primary" v-close-popup @click="closeForm()"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <LoadingComponent v-model="secondDialog"/>
</div>
</template>
<script setup>
import {
  QTable
  , QBtn
  , QDialog
  , QCard
  , QCardSection
  , QCardActions
  , QSeparator
  , QInput
} from 'quasar'
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/composables/useProduct';
import LoadingComponent from '../LoadingComponent.vue'
const log = () =>{
  console.log('selected', selected.value);
}
const getProductSpec = async () =>{
  // console.log('id', selected.value[0].id);
  // return;
  const thisProductSpec = await useProductStore.getProductSpecById(selected.value[0].id);
  console.log('thisProductSpec', getProductSpec);
  productSpec.value = thisProductSpec;
  console.log('thisProductSpec', thisProductSpec);
}
const productStore = useProductStore();
const secondDialog = ref(false);
const showForm = ref(false);
const title = ref('');
const productSpecList = ref([]);
const productSpec = ref({});
const loading = ref(false);
const specName = ref('');
const specValue = ref('');
const specMaxValue = ref(0);
const specMinValue = ref(0);
const selected = ref([]);
const columns = ref([
    // { name: 'productSpecId', label: '規格ID', align: 'left', field: 'productSpecId', sortable: true },
    { name: 'productSpecName', label: '規格名稱', align: 'left', field: 'productSpecName', sortable: true },
    { name: 'productSpecValue', label: '規格值', align: 'left', field: 'productSpecValue', sortable: true },
    { name: 'productSpecValue', label: '規格最大值', align: 'left', field: 'productSpecMaxValue', sortable: true },
    { name: 'productSpecValue', label: '規格最小值', align: 'left', field: 'productSpecMinValue', sortable: true },
    { name: 'createUser', label: '建立人員', align: 'left', field: 'createUser', sortable: true },
    { name: 'createDate', label: '建立日期', align: 'left', field: 'createDate', sortable: true },
    { name: 'modifyUser', label: '修改人員', align: 'left', field: 'modifyUser', sortable: true },
    { name: 'modifyDate', label: '修改日期', align: 'left', field: 'modifyDate', sortable: true },
]);
onMounted(async () => {
  reload();
});
const reload = async () =>{
  let res = await productStore.getAllProductSpecs();
  console.log('res', res);
  productSpecList.value = res;
}
const openFormDialog = (type) => {
  showForm.value = true;
  if (type === 'add') {
    title.value = '新增產品規格';
  } else if (type === 'edit') {
    title.value = '修改產品規格';
    // Logic for editing a product spec
  }
};
const submitForm = async () => {
  // Logic to submit the form data
  if (title.value === '新增產品規格') {
    console.log('Submitting form with:', specName.value, specValue.value);
    const parm = {
      specName: specName.value,
      specValue: specValue.value,
      specMaxValue:specMaxValue.value,
      specMinValue:specMinValue.value
    };
    console.log('Parameters for API:', parm);
    const response = await productStore.addProductSpec(parm);
    console.log('response', response);
    if (response.result && response.result == 0){
      if (response.errorMessage || response.errorMessage != '')
        alert(response.errorMessage);
      else
        alert('產品規格新增成功');
    } else {
      alert('產品規格新增成功');
    }
  } else if (title.value === '修改產品規格') {
    // Logic to update the product spec
  }
  showForm.value = false;
};
const closeForm = () => {
  showForm.value = false;
};
</script>
