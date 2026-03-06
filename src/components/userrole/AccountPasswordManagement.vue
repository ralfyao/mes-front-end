<template>
  <q-card class="q-pa-md"  style="width: 1000px; max-width: 80vw;">
    <q-card-section>
      <q-card-section>
        <div class="text-h4">
          帳號密碼管理
        </div>
      </q-card-section>
      <q-card-section>
         <q-table  class="rounded-borders my-sticky-header-table text-h5"
            style="height: 400px"
            :columns="columns"
            row-key="id"
            :rows="accountPasswordList"
            flat
            bordered
            virtual-scroll
          >
          <!-- 高管欄位 -->
          <template v-slot:body-cell-帳號="props">
            <q-td :props="props">
              <label outlined dense >{{ props.row.account }}</label>
            </q-td>
          </template>
          <template v-slot:body-cell-密碼="props">
            <q-td :props="props">
              <q-input type="password" outlined dense v-model="props.row.password" />
            </q-td>
          </template>
          <template v-slot:body-cell-帳號稱謂="props">
            <q-td :props="props">
              <q-input outlined dense v-model="props.row.accountName" />
            </q-td>
          </template>
          <template v-slot:body-cell-啟用="props">
              <q-td :props="props">
                <q-checkbox v-model="props.row.isActivate" />
              </q-td>
            </template>
            <template v-slot:body-cell-寄件允許="props">
              <q-td :props="props">
                <q-checkbox v-model="props.row.isEmail" />
              </q-td>
            </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="red" label="EXIT" @click="close"/>
        <q-btn flat color="blue" label="送出" @click="handleOtherAction"/>
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>
<script setup>
// import block start
import { useUserStore } from '@/composables/useUser';
import {
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QTable,
  QInput,
  QTd,
  QCheckbox,
} from 'quasar'
import {
  defineProps,
  onMounted,
  ref,
  defineEmits,
} from 'vue';
// import block end

// variable block start
const columns = ref([
  { name: '帳號', label: '帳號', align: 'left', field: 'account', sortable: true },
  { name: '密碼', label: '密碼', field: 'password', align: 'left', sortable: true  },
  { name: '帳號稱謂', label: '帳號稱謂', field: 'accountName', align: 'left', sortable: true  },
  { name: '啟用', label: '啟用', field: 'isActivate', align: 'left', sortable: true  },
  { name: '寄件允許', label: '寄件允許', field: 'isEmail', align: 'left', sortable: true  },
])
const userStore = useUserStore();
const accountPasswordList = ref([]);
const showForm = ref(false);
const props = defineProps({
  showForm:{
    type:Boolean,
    default:()=>false,
  }
});
const emits = defineEmits(['update:showForm']);
// variable block end

// function block start
const close = () =>{
  emits('update:showForm', false);
}
const handleOtherAction = async () =>{
  let message = '';
  for(var i = 0; i < accountPasswordList.value.length; i++){
    let autheiticate = accountPasswordList.value[i];
    let user = {
      username:autheiticate.account,
      password:autheiticate.password,
      name:autheiticate.accountName,
      isActivate:autheiticate.isActivate,
      isEmail:autheiticate.isEmail,
      lastModifier:autheiticate.lastModifier,
      position:autheiticate.職務,
      empNo:autheiticate.員工編號,
    }
    await userStore.updateUser(user).then((data)=>{
      if (data){
        message += data;
      }
    });
  }
  if (message != '') {
    alert('更新完成!');
    emits('update:showForm', false);
  } else {
    alert(message);
  }
}
onMounted(async ()=>{
  showForm.value = props.showForm;
  await userStore.getAllUsers().then((data)=>{
    accountPasswordList.value = data
  })
})
// function block end
</script>
