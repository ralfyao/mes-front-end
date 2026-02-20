<template>
  <q-card  class="q-pa-md"  style="width: 500px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h4">銀行帳戶核對</div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-12" style="max-width: 500px">
          <q-input v-model="bankForm.銀存編碼" label="銀存編碼"
            readonly outlined dense/>
        </div>
        <div class="col-12 col-md-12" style="max-width: 500px">
          <q-input v-model="bankForm.銀行名稱" label="銀行名稱"
            readonly outlined dense/>
        </div>
        <div class="col-12 col-md-12" style="max-width: 500px">
          <q-input v-model="bankForm.bankname" label="Bank Name"
            readonly outlined dense/>
        </div>
        <div class="col-12 col-md-12" style="max-width: 500px">
          <q-input v-model="bankForm.銀行地址" label="Bank Address"
            readonly outlined dense/>
        </div>
        <div class="col-12 col-md-12" style="max-width: 500px">
          <q-input v-model="bankForm.帳號" label="帳號"
            readonly outlined dense/>
        </div>
        <div class="col-12 col-md-12" style="max-width: 500px">
          <q-input v-model="bankForm.swiftCode" label="SwiftCode"
            readonly outlined dense/>
        </div>
        <div class="col-12 col-md-12" style="max-width: 500px">
          <q-input v-model="bankForm.電話" label="電話"
            readonly outlined dense/>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="取消" color="negative" @click="closeCheckAction" />
    </q-card-actions>
  </q-card>
</template>
<script setup>
// import block start
import {
  QCard
  , QCardActions
  , QCardSection
  , QInput
  , QBtn
} from 'quasar'
import {
  ref,
  defineProps,
  defineEmits,
  onMounted, watch,} from 'vue'
// import block end

//variable block start
const emits = defineEmits(['update:showForm']);
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  bankAccountCheckForm:{
    type:Object,
    default:()=>({
      銀存編碼:'',
      銀行名稱:'',
      Bankname:'',
      銀行地址:'',
      帳號:'',
      SwiftCode:'',
      電話:''
    })
  }
});
const bankForm = ref({
      銀存編碼:'',
      銀行名稱:'',
      Bankname:'',
      銀行地址:'',
      帳號:'',
      SwiftCode:'',
      電話:''
    });
//variable block end

//function block start
const closeCheckAction = () =>{
  emits('update:showForm', false);
}
onMounted(async () =>{
  console.log('form', props.bankAccountCheckForm)
})
watch(
  () => props.bankAccountCheckForm,
  (newVal) => {
    console.log('資料更新了', newVal)
    bankForm.value = newVal;
  },
  { deep: true, immediate: true }
)
//function block end
</script>
