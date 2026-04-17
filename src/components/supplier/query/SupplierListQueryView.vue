<template>
  <q-card class="q-pa-md"  style="width: 1000px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h6">廠商列表查詢</div>
    </q-card-section>
    <q-card-section>
      <q-form>
        <div class="row">
          <div class="col-12 col-md-12">
            <q-input v-model="queryCriteria.supplierName" label="廠商名稱" outlined dense />
           </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section>
      <q-table
      class="rounded-borders my-sticky-header-table"
                :columns="columns"
                row-key="廠商編號"
                :rows="supplierList"
                flat
                bordered
                virtual-scroll
                style="max-height: 500px"
                selection="single"
                v-model:selected="selected"
                :pagination="{ rowsPerPage: 5 }"
                @selection="onRowClick"
      >
      </q-table>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="查詢" flat color="primary" @click="searchSuppliers" />
      <q-btn label="重置" flat color="secondary" @click="resetSearchCriteria" />
      <q-btn label="關閉" flat color="red" @click="close" />
    </q-card-actions>
  </q-card>
</template>
<script setup>
//#region import
import { QCard,
  QCardSection,
  QTable,QForm,QInput,QBtn, QCardActions,
} from 'quasar';
import { useSupplierStore } from '@/composables/useSupplier';
import { ref,
  defineEmits,
  defineProps,
  // onMounted
} from 'vue';
//#endregion

//#region veriable
const supplierStore = useSupplierStore();
const supplierList = ref([]);
const queryCriteria = ref({
  supplierName: '',
  contactPerson: '',
  phoneNumber: ''
});
const selected = ref([])
const emits = defineEmits(['update:supplierNo', 'update:showForm']);
const columns = [
  { name: '廠商編號', label: '廠商編號', align: 'left', field: '廠商編號', sortable: true },
  { name: '廠商簡稱', label: '廠商簡稱', align: 'left', field: '廠商簡稱', sortable: true },
  { name: '廠商名稱', label: '廠商名稱', align: 'left', field: '廠商名稱', sortable: true },
  { name: '公司地址', label: '公司地址', align: 'left', field: '公司地址', sortable: true },
  // { name: '聯絡人', label: '聯絡人', align: 'left', field: '聯絡人', sortable: true },
  // { name: '電話號碼', label: '電話號碼', align: 'left', field: '電話號碼', sortable: true }
];
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  supplierNo: {
    type: String,
    default: ''
  },
  showForm: {
    type: Boolean,
    default: false
  }
});
//#endregion

//#region function
const resetSearchCriteria = () => {
  queryCriteria.value = {
    supplierNo: '',
    supplierName: '',
  };
};

const searchSuppliers = async () => {
  await supplierStore.querySupplier(queryCriteria.value).then(response => {
    console.log('Search response:', response);
    supplierList.value = response; // 假設 response 是一個包含廠商資料的陣列
  }).catch(error => {
    console.error('Search error:', error);
    supplierList.value = [];
  });
};

const onRowClick = (row) => {
  console.log('Selected supplier:', row);
  emits('update:supplierNo', row.rows[0].廠商編號); // 向父組件傳遞選擇的廠商編號
  emits('update:showForm', false); // 關閉查詢表單
  // 在這裡可以進行其他操作，例如發出事件或更新父組件的資料
  // 在這裡可以進行其他操作，例如發出事件或更新父組件的資料
};

const close = () => {
  emits('update:showForm', false); // 向父組件傳遞 false 值表示關閉表單
};
//#endregion
</script>
