<template>
  <div v-if="props.showHorizon">
    <div class="row q-col-gutter-md">
      <div class="col-10 col-md-10" style="max-width: 500px">
        <q-select v-model="industrycode" :readonly="readonly || preview" label="所屬業別"
          outlined dense :options="industryList" @update:model-value="getIndustryName" emit-value map-options
              option-label="中分類碼"
              option-value="中分類碼">
            <template #before-options>
              <div class="row q-px-md q-py-sm bg-grey-3 text-weight-bold  my-sticky-header-table">
                <div class="col-2">中分類碼</div>
                <div class="col-6">中分類名稱</div>
                <div class="col-2">英文</div>
                <div class="col-2">其他</div>
              </div>
            </template>
            <q-separator />
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section class="col-2">
                  {{ scope.opt.中分類碼 }}
                </q-item-section>
                <q-item-section class="col-6">
                  {{ scope.opt.中分類名稱 }}
                </q-item-section>
                <q-item-section class="col-2">
                  {{ scope.opt.英文 }}
                </q-item-section>
                <q-item-section class="col-2">
                  {{ scope.opt.其他 }}
                </q-item-section>
              </q-item>
            </template>
            <!-- 選中後顯示樣式 -->
            <template #selected-item="scope">
              {{ scope.opt.中分類碼 }} - {{ scope.opt.中分類名稱 }} - {{ scope.opt.英文 }} - {{ scope.opt.其他 }}
            </template>
          </q-select>
      </div>
      <div class="col-2 col-md-2" style="max-width: 500px">
        <label class="text-red text-center" style=" font-size: 24px;">{{ industry }}</label>
      </div>
    </div>
  </div>
  <div v-if="!props.showHorizon">
    <q-select v-model="industrycode" :readonly="props.readonly" label="所屬業別"
    outlined dense :options="industryList" @update:model-value="getIndustryName" emit-value map-options
        option-label="中分類碼"
        option-value="中分類碼">
      <template #before-options>
        <div class="row q-px-md q-py-sm bg-grey-3 text-weight-bold  my-sticky-header-table">
          <div class="col-2">中分類碼</div>
          <div class="col-6">中分類名稱</div>
          <div class="col-2">英文</div>
          <div class="col-2">其他</div>
        </div>
      </template>
      <q-separator />
      <template #option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section class="col-2">
            {{ scope.opt.中分類碼 }}
          </q-item-section>
          <q-item-section class="col-6">
            {{ scope.opt.中分類名稱 }}
          </q-item-section>
          <q-item-section class="col-2">
            {{ scope.opt.英文 }}
          </q-item-section>
          <q-item-section class="col-2">
            {{ scope.opt.其他 }}
          </q-item-section>
        </q-item>
      </template>
      <!-- 選中後顯示樣式 -->
      <template #selected-item="scope">
        {{ scope.opt.中分類碼 }} - {{ scope.opt.中分類名稱 }} - {{ scope.opt.英文 }} - {{ scope.opt.其他 }}
      </template>
    </q-select>
    <label class="text-red text-center" style=" font-size: 24px;">{{ industry }}</label>
  </div>
</template>
<script setup>
// import start
import { useCustStore } from '@/composables/useCust';
import {
  QSelect,
  QItem,
  QItemSection,
  QSeparator,
} from 'quasar';
import { defineProps,
  defineEmits,
  ref,
  onMounted,
} from 'vue';
// import end

// variable start
const props = defineProps({
  industrycode:{
    type: [String, Object],
    default:()=>'',
  },
  showHorizon:{
    type:Boolean,
    default:false,
  },
  readonly:{
    type:Boolean,
    default:false,
  },

});
const custStore = useCustStore();
const industry = ref('');
// const industryName = ref(''); // 顯示用的名稱
const industrycode = ref('');
const emits = defineEmits(['update:industrycode']);
const industryList = ref([]);
// variable end

// function start
onMounted(async ()=>{
  console.log('props.industrycode', props.industrycode);
  await custStore.getIndustryList().then((data)=>{
    industryList.value = data;// 如果掛載時已經有值，先找一次名稱
    getIndustryName(props.industrycode);
  });
})
const getIndustryName = (code) =>{console.log('選擇的業別代碼:', code);
  const industryItem = industryList.value.find(item => item.中分類碼.trim() ===(code.中分類碼?code.中分類碼?.trim():code?.trim()));
  industry.value =  industryItem ? industryItem.中分類名稱 : '';
  industrycode.value = industryItem;
  console.log('industrycode.value', industrycode.value);
  emits('update:industrycode' , industrycode.value);
}
 // function end
</script>
