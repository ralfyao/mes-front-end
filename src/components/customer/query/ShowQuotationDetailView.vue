<template>
  <q-card class="q-pa-md"  style="width: 1000px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h4">報價單產品列表</div>
      <div class="row">
        <div class="col-12">
          <q-table
          :rows="list"
          row-key="識別"
          :columns="columns"
          >
          </q-table>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn outlined dense label="EXIT" color="primary" @click="close"/>
    </q-card-actions>
  </q-card>
</template>
<script setup>
// #region import
import {
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QTable,
} from 'quasar'
import {
  defineProps,
  defineEmits,
} from 'vue'
// #endregion

// #region variable
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  list:{
    type:Array,
    default:()=>[],
  }
})

// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['update:showForm'])
const columns = [
  { name: 'quono', label: '報價單號', align: 'left', field: 'quono', sortable: true },
  { name: '產品編號', label: '產品編號', align: 'left', field: '產品編號', sortable: true },
  { name: '數量', label: '數量', align: 'left', field: '數量', sortable: true },
  { name: '單位', label: '單位', align: 'left', field: '單位', sortable: true },
  { name: '金額', label: '機台金額類別', align: 'left', field: '金額', sortable: true },
  { name: '描述', label: '描述', align: 'left', field: '描述', sortable: true },
]
// #endregion

// #region function
const close = () =>{
  emits('update:showForm', false);
}
// #endregion


</script>
