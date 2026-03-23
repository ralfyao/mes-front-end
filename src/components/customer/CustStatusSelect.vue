<template>
  <q-select v-model="status" :readonly="preview" label="狀態" outlined dense
                  :options="statusList"
                  option-value="狀況"
                  option-label="狀況"
                  @update:model-value="updateStatus"
                  emit-value map-options
                />
                <label class="text-red text-center" style=" font-size: 24px;">
                  {{ custStatus }}
                </label>
</template>
<script setup>
// #region import
import { useCustStore } from '@/composables/useCust';
import { QSelect,

} from 'quasar';
import { ref,
  onMounted,
  defineEmits
} from 'vue';
// #endregion

// #region variable
const statusList = ref([])
const custStatus = ref('');
const custStore = useCustStore();
const status = ref('')
const emits = defineEmits(['update:status'])
// #endregion

// #region function
onMounted(async ()=>{
  statusList.value = await custStore.getStatusList();
})
const updateStatus = (pam) =>{
 console.log('parm status:'+pam)
  emits('update:status', pam)
  let data = statusList.value.find(x => x.狀況 === pam)
  if (data){
    custStatus.value = data.狀況說明;
  }
}
// #endregion
</script>
