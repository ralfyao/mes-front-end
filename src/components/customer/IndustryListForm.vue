<template>
  <q-card class="q-pa-md"  style="width: 1500px; max-width: 95vw;">
    <q-card-section>
      <div class="text-h4">
        業別管理

        <q-card-actions align="right">
          <q-btn flat color="green" label="增加一筆資料" @click="add"/>
          <q-btn flat color="red" label="EXIT" @click="close"/>
          <q-btn flat color="blue" label="送出" @click="submitForm"/>
        </q-card-actions>
      </div>
    </q-card-section>
      <q-card-section style="height: 400px;
          max-height: 70vh; overflow: auto;">
        <q-scroll-area ref="myScrollArea" style="height: 100%;">
          <div v-for="item in list" :key="item.中分類碼" class="row q-col-gutter-md">
            <div class="col-1 col-md-1">
              <q-input ref="detailDateInput" v-model="item.大分類碼" label="大分類" :title="item.大分類" outlined dense />
            </div>
            <div class="col-2 col-md-2">
              <q-input v-model="item.大分類名稱" label="大分類名稱" :title="item.大分類名稱" outlined dense  />
            </div>
            <div class="col-1 col-md-1">
              <q-input v-model="item.中分類碼" label="中分類" :title="item.中分類碼" outlined dense readonly  />
            </div>
            <div class="col-2 col-md-2">
              <q-input v-model="item.中分類名稱" label="中分類名稱" :title="item.中分類名稱" outlined dense  />
            </div>
            <div class="col-2 col-md-2">
              <q-input v-model="item.英文" label="英文" :title="item.英文" outlined dense  />
            </div>
            <div class="col-1 col-md-1">
              <q-input v-model="item.內容" label="內容" :title="item.內容" outlined dense  />
            </div>
            <div class="col-2 col-md-2">
              <q-input v-model="item.其他" label="其他" :title="item.其他" outlined dense  />
            </div>
          </div>
        </q-scroll-area>
    </q-card-section>
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
  QInput,
  QScrollArea
} from 'quasar'
import {
  ref,
  onMounted,
  defineEmits,
  nextTick,
} from 'vue'
// import block end

// variable block start
const custStore = useCustStore();
const list = ref([]);
const emits = defineEmits(['update:showForm']);
// const scrollArea = ref(null);
const myScrollArea = ref(null)
const detailDateInput = ref([]);
// variable block end

// function block start
onMounted(async ()=>{
  await custStore.getIndustryList().then((data)=>{
    list.value = data;
  })
})

const close = () =>{
  emits("update:showForm", false);
}

const add = async () =>{
  list.value.push({
    大分類碼:'',
    大分類名稱:'',
    中分類碼:'',
    中分類名稱:'',
    英文:'',
    內容:'',
    其他:''
  });
  await nextTick();
  scrollWithAPI();
}

const scrollWithAPI = () => {
  // Quasar 提供的 setScrollPosition(offset, [duration])
  // 999999 是一個簡單的做法，確保滾動到最底
  myScrollArea.value.setScrollPosition('vertical', 999999, 300)
  if (detailDateInput.value && detailDateInput.value.length > 0) {
    const lastIndex = detailDateInput.value.length - 1;
    detailDateInput.value[lastIndex].focus();
  }
}

const submitForm = async () =>{
  await custStore.updateIndustryList(list).then((data)=>{
    if (data.data.errorMessage){
      alert(data.data.errorMessage);
    } else {
      alert('更新成功!');
      emits('update:showForm', false);
    }
  })
}
// function block end
</script>
