<template>
  <q-card  class="q-pa-md"  style="width: 500px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">
        全稱更名
      </div>
    </q-card-section>
    <q-form ref="myForm" >
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-input v-model="originalName" outlined dense label="變更前名稱" readonly/>
          </div>
        </div>
        <br>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12" style="max-width: 500px">
            <q-input v-model="changeToName" outlined dense label="變更後名稱" :rules="[val => !!val || '變更後名稱為必填欄位']"/>
          </div>
        </div>
      </q-card-section>
    </q-form>
    <q-card-actions align="right">
      <q-btn label="EXIT" color="red" flat @click="close"></q-btn>
      <q-btn label="送出" color="blue" flat @click="handleOtherAction"></q-btn>
    </q-card-actions>
    <LoadingComponent v-model="secondDialog"/>
  </q-card>
</template>
<script setup>
// import block start
import { useCustStore } from '@/composables/useCust';
import {
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QForm,
  QInput,
} from 'quasar'
import {
  defineProps,
  defineEmits,
  onMounted,
  ref
 } from 'vue'
// import block end

// variable block start
const changeToName = ref('');
const secondDialog = ref(false);
const custStore = useCustStore();
const theCust = ref({});
const myForm = ref(null);
const originalName = ref('');
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  },
  識別:{
    type:Number,
    default:()=>-1,
  }
});
const emits = defineEmits(['update:showForm']);
const id = ref(0);
// variable block end

// function block start
const submitForm = async () =>{
  var result = confirm('您確認是否要更名?');
  if (!result)
    return;
  secondDialog.value = true;
  await custStore.updateCompanyName(originalName.value, changeToName.value).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert('更名成功!');
      emits('update:showForm', false);
    }
    secondDialog.value = false;
  })
}
const handleOtherAction = async () => {
  const success = await myForm.value.validate()
  if (success) {
    submitForm();
  } else {
    return;
  }
}
const close = () =>{
  emits("update:showForm", false);
}
onMounted(async ()=>{
  id.value = props.識別;
  await custStore.getCustList().then((data)=>{
    theCust.value = data.find((x)=>x.識別 == id.value);
    originalName.value = theCust.value.company;
  });
})
// function block end
</script>
