<template>
  <q-card class="q-pa-md"  style="width: 1000px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h4">{{props.mode}}報價單</div>
      </q-card-section>
      <q-form ref="myForm">
        <q-card-section>
        </q-card-section>
      </q-form>
      <q-card-actions align="right">
          <q-btn flat label="取消" color="negative" @click="close" />
          <q-btn label="送出" color="primary" />
      </q-card-actions>
  </q-card>
</template>
<script setup>
// import block
import {
  QCard
  , QCardSection
  , QCardActions
  , QForm
  , QBtn
} from 'quasar';
import {ref, defineProps, defineEmits} from 'vue';
// import block

// variable block
const myForm = ref(null);
const props = defineProps({
  mode:{
    type:String,
    default:() =>''
  },
  form:{
    type:Object,
    default: () => ({
      rfqno: '',
      rfqdate: '',
      sales: '',
      company: '',
      ma:'',
      tel:'',
      contact:'',
      position:'',
      email:'',
      country:'',
      industrycode:'',
      industry:'',
      machine:'',
      commission:'',
      enduser:'',
      source:'',
      status:'',
      description:'',
      quono:'',
      rfqstatus:'',
      agent:'',
      account:'',
    })
  },
  showForm:{
    type:Boolean,
    default:() => false
  }
});
const emit = defineEmits(['update:showForm'])
// variable block

// function block
const close = () =>{
  emit('update:showForm', false);
  console.log('showForm', props.showForm);
}
// function block
</script>
