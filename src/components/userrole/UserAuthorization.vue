<template>
  <q-card class="q-pa-md"  style="width: 1500px; max-width: 80vw;" >
    <q-card-section>
      <div class="text-h4">編輯使用者授權代理</div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-3 col-md-3" style="max-width: 400px">
          <label class="subtitle">帳號：{{ theUser.account }}</label>
        </div>
        <div class="col-4 col-md-4" style="max-width: 400px">
          <label class="subtitle">職務：{{ theUser.職務 }}</label>
        </div>
        <div class="col-4 col-md-4" style="max-width: 400px">
          <label class="subtitle">員工編號：{{ theUser.員工編號 }}</label>
        </div>
      </div>
      <br>
      <div class="row q-col-gutter-md">
        <q-form ref="myForm">
          <q-table  class="rounded-borders my-sticky-header-table text-h5"
            style="height: 400px"
            :columns="columns"
            row-key="id"
            :rows="authPrivList"
            flat
            bordered
            virtual-scroll
            :pagination="{ rowsPerPage: 1000 }"
          >
            <!-- 授權表單欄位 -->
            <template v-slot:body-cell-menuSubName="props">
              <q-td :props="props">
                {{ props.row.menuSubName }}
              </q-td>
            </template>

            <!-- 高管欄位 -->
            <template v-slot:body-cell-高管="props">
              <q-td :props="props">
                <q-checkbox v-model="props.row.高管" />
              </q-td>
            </template>

            <!-- 核准欄位 -->
            <template v-slot:body-cell-核准="props">
              <q-td :props="props">
                <q-checkbox v-model="props.row.核准" />
              </q-td>
            </template>

            <!-- 編修欄位 -->
            <template v-slot:body-cell-編修="props">
              <q-td :props="props">
                <q-checkbox v-model="props.row.編修" />
              </q-td>
            </template>

            <!-- 報表欄位 -->
            <template v-slot:body-cell-報表="props">
              <q-td :props="props">
                <q-checkbox v-model="props.row.報表" />
              </q-td>
            </template>

            <!-- 輸出欄位 -->
            <template v-slot:body-cell-輸出="props">
              <q-td :props="props">
                <q-checkbox v-model="props.row.輸出" />
              </q-td>
            </template>

            <!-- 輸出欄位 -->
            <template v-slot:body-cell-查詢="props">
              <q-td :props="props">
                <q-checkbox v-model="props.row.查詢" />
              </q-td>
            </template>

            <!-- 註記欄位 -->
            <template v-slot:body-cell-註記="props">
              <q-td :props="props">
                <q-input outlined dense v-model="props.row.註記" />
              </q-td>
            </template>

            <!-- 職務代理效期欄位 -->
            <template v-slot:body-cell-職務代理效期="props">
              <q-td :props="props">
                <q-input class="col-6" outlined dense :readonly="readonly || preview" v-model="props.row.職務代理效期" mask="##/##/####" :rules="['props.row.職務代理效期']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover v-model="props.row.showDatePopup" transition-show="scale" transition-hide="scale">
                        <q-date class="col-6" outlined dense :readonly="readonly || preview" v-model="props.row.職務代理效期" mask="DD/MM/YYYY" no-title>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat @click="props.row.showDatePopup = false" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-td>
            </template>

            <!-- 機號欄位 -->
            <template v-slot:body-cell-機號="props">
              <q-td :props="props">
                <q-input outlined dense v-model="props.row.機號" />
              </q-td>
            </template>
          </q-table >
        </q-form>

        <!-- <div class="col-1 col-md-1" style="max-width: 100px">
          授權表單：<select>
                    <option>報價單</option>
                   </select>
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          高管<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          核准<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          編修<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          列印<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          輸出<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          查詢<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          註記<input type="text">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          代理截止<input type="date">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          機號<input type="text">
        </div> -->
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="取消" color="negative" @click="close" />
      <q-btn label="送出" color="primary" @click="handleOtherAction"/>
    </q-card-actions>
  </q-card>
  <LoadingComponent v-model="secondDialog"/>
</template>
<script setup>
// import block start
import { useUserStore } from '@/composables/useUser';
import {
  QCard,
  QCardSection,
  QBtn,
  QCardActions,
  QTable,
  QTd,
  QCheckbox,
  QInput,
  QDate,
  QPopupProxy,
  QIcon
} from 'quasar'
import {
  defineProps,
  defineEmits,
  ref,
  onMounted,
} from 'vue'
// import block end

// variable block start
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=> false,
  },
  account:{
    type:String,
    default:()=>'',
  }
})
const columns = ref([
  { name: 'menuSubName', label: '授權表單', align: 'left', field: 'menuSubName', sortable: true },
  { name: '高管', label: '高管', field: '高管', align: 'left', sortable: true  },
  { name: '核准', label: '核准', field: '核准', align: 'left', sortable: true  },
  { name: '編修', label: '編修', field: '編修', align: 'left', sortable: true  },
  { name: '報表', label: '報表', field: '報表', align: 'left', sortable: true  },
  { name: '輸出', label: '輸出', field: '輸出', align: 'left', sortable: true  },
  { name: '查詢', label: '查詢', field: '查詢', align: 'left', sortable: true  },
  { name: '註記', label: '註記', field: '註記', align: 'left', sortable: true  },
  { name: '職務代理效期', label: '職務代理效期', align: 'left', field: '職務代理效期', sortable: true },
  { name: '機號', label: '機號', align: 'left', field: '機號', sortable: true }
])
const userStore = useUserStore();
const emits = defineEmits(['update:showForm']);
const account = ref('');
const showForm = ref(false);
const theUser = ref({});
const authPrivList = ref([]);
const myForm = ref(null);
const secondDialog = ref(false);
// variable block end

// function block start
const close = () =>{
  emits('update:showForm', false);
}

const init = async () =>{
  console.log('props.account', props.account);
  console.log('props.showForm', props.showForm);
  account.value = props.account;
  await userStore.getAllUsers().then((data)=>{
    theUser.value = data.find((x)=>x.account == account.value);
  })
  await userStore.getUserRoles(account.value).then((data)=>{
    console.log('auth data', data);
    authPrivList.value = data;
    authPrivList.value = authPrivList.value.filter((x)=>x.menuSubName != '' && x.menuSubName != null)
  })
  showForm.value = props.showForm;
}

onMounted(async ()=>{
  init();
})
const handleOtherAction = () =>{
  if (theUser.value.職務.trim() == ''){
    alert('請維護使用者職務!');
    return;
  }
  submitForm();
}
const submitForm = async() =>{
  secondDialog.value  =true;
  await userStore.getAllUsers().then((data)=>{
    theUser.value = data.find((x)=>x.account == account.value);
    userStore.updateUserAuthList(theUser.value, authPrivList).then((data)=>{
      if (data.data.errorMessage){
        alert(data.data.errorMessage);
      } else {
        alert('更新成功!');
        close();
      }
      secondDialog.value  =false;
      init();
    })
  })
}
// function block end
</script>
