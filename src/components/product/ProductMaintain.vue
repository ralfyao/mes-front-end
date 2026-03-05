<template>
<div>
  <q-table  class="rounded-borders my-sticky-header-table"
    :columns="columns"
    row-key="productId"
    :rows="productList"
    flat
    bordered
    virtual-scroll
    selection="single"
    v-model:selected="selected"
  ></q-table >
  <div class="row justify-start padding-top">
    <div class="padding-right">
      <q-btn color="primary" class="padding-right" glossy
        @click="openProductForm()"
        :loading="loading">
        新增產品
      </q-btn>
    </div>
    <div class="padding-right">
      <q-btn color="info" class="padding-right" glossy
        :loading="loading">修改產品</q-btn>
    </div>
    <div class="padding-right">
      <q-btn color="red" class="padding-right" glossy
        :loading="loading">刪除產品</q-btn>
    </div>
  </div>
  <q-dialog v-model="showForm" persistent >
    <q-card class="q-pa-md"  style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h4">{{ action }}</div>
      </q-card-section>
      <q-card-section>
        產品品號：<q-input outlined dense v-model="product.productId" placeholder="請輸入產品品號" :rules="[val => !!val || '產品品號為必填欄位']"/> <br/>
        產品品名：<q-input outlined dense v-model="product.productName" placeholder="請輸入產品品名" :rules="[val => !!val || '產品品名為必填欄位']"/> <br/>
        產品描述：<q-input outlined dense v-model="product.productDescription" placeholder="請輸入產品描述" :rules="[val => !!val || '產品描述為必填欄位']"/> <br/>
        產品群組：<q-select outlined dense v-model="product.productGroup" :options="[]" placeholder="請選擇產品群組"/> <br/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="取消" color="primary" @click="closeWindow" v-close-popup />
          <q-btn flat label="保存" color="primary" />
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
  , QInput
  , QSelect
} from 'quasar'
import { ref, onMounted } from 'vue'
import LoadingComponent from '../LoadingComponent.vue'
import { useProductStore } from '@/composables/useProduct'
const productStore = useProductStore();
const loading = ref(false);
const productList = ref([]);
const columns = ref([
  { name: 'productId', label: '產品品號', align: 'left', field: 'productId', sortable: true },
  { name: 'productName', label: '產品品名', align: 'left', field: 'productName', sortable: true },
  { name: 'productDescription', label: '產品描述', align: 'left', field: 'productDescription', sortable: true },
  { name: 'createUser', label: '建立人員', align: 'left', field: 'lastModifier', sortable: true },
  { name: 'createDate', label: '建立日期', align: 'left', field: 'lastModifyDate', sortable: true },
  { name: 'modifyUser', label: '修改人員', align: 'left', field: 'lastModifier', sortable: true },
  { name: 'modifyDate', label: '修改日期', align: 'left', field: 'lastModifyDate', sortable: true },
]);

onMounted(() => {
  fetchProductList();
});

const closeWindow = () => {
  showForm.value = false;
};

const openProductForm = () => {
  action.value = '新增產品';
  showForm.value = true;
};

const product = {
  productId: '',
  productName: '',
  productDescription: '',
  createUser: '',
  createDate: '',
  modifyUser: '',
  modifyDate: ''
};
const fetchProductList = async () => {
  secondDialog.value = true
  try {
    let products = productStore.getAllProducts();
    productList.value = await products;
    console.log('產品列表:', productList.value);
  } catch (error) {
    console.error('取得產品列表失敗:', error)
  } finally {
    secondDialog.value = false
  }
}
const selected = ref([]);
const showForm = ref(false);
const secondDialog = ref(false);
const action = ref('');
</script>
