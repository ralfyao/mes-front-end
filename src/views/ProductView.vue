<template>
    <q-layout class="q-pa-md padding  q-gutter-sm">
        <h5 class="text-left">
            <q-icon name="play_circle" size="30px" >產品列表</q-icon>
        </h5>
        <q-page-container>
          <q-page>
            <q-table
                :columns="columns"
                row-key="productId"
                :rows="productList"
                flat
                bordered
                virtual-scroll
                selection="single"
                v-model:selected="selected"
                class="rounded-borders"
            ></q-table>
          </q-page>
        </q-page-container>
        <LoadingComponent v-model="secondDialog"/>
    </q-layout>
</template>
<script setup>
import { QIcon, QPage, QPageContainer, QTable, QLayout } from 'quasar'
import { ref, onMounted } from 'vue'
import LoadingComponent from '../components/LoadingComponent.vue'

const productList = ref([]);
const selected = ref([]);
const secondDialog = ref(false);
const columns = ref([
  { name: 'productId', label: '產品品號', align: 'left', field: 'productId', sortable: true },
  { name: 'productName', label: '產品品名', align: 'left', field: 'productName', sortable: true },
  { name: 'productDescription', label: '產品描述', align: 'left', field: 'productDescription', sortable: true },
  { name: 'createUser', label: '建立人員', align: 'left', field: 'lastModifier', sortable: true },
  { name: 'createDate', label: '建立日期', align: 'left', field: 'lastModifyDate', sortable: true },
  { name: 'modifyUser', label: '修改人員', align: 'left', field: 'lastModifier', sortable: true },
  { name: 'modifyDate', label: '修改日期', align: 'left', field: 'lastModifyDate', sortable: true },
])
onMounted(() => {
  fetchProductList();
})

const fetchProductList = async () => {
  secondDialog.value = true
  try {
    // 模擬 API 請求
    // await new Promise(resolve => setTimeout(resolve, 1000))
    // productList.value = [
    //   { productId: 'P001', productName: '產品A', productDescription: '這是產品A的描述', createUser: 'admin', createDate: '2024-01-01', modifyUser: 'admin', modifyDate: '2024-01-02' },
    //   { productId: 'P002', productName: '產品B', productDescription: '這是產品B的描述', createUser: 'user1', createDate: '2024-02-01', modifyUser: 'user2', modifyDate: '2024-02-02' },
    //   // 更多產品資料...
    // ]
  } catch (error) {
    console.error('取得產品列表失敗:', error)
  } finally {
    secondDialog.value = false
  }
}
</script>
