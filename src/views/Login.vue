<template>
    <q-layout>
    <q-page-container>
    <q-page class="flex flex-center main">
        <q-card class= "q-pa-md shadow-22 col-12 bg-transparent ">
            <q-card-section class="bg-transparent" >
                <div class="title row">營運管理系統</div>
                <div class="row">
                    <label class="subtitle">Login Account： </label>
                    <input type="text" class="col-12 form-control" placeholder="請輸入帳號" v-model="thisuser.username"/>
                </div>
                <div class="row">
                    <label class="subtitle">Password： </label>
                    <input type="password" class="col-12 form-control" placeholder="請輸入密碼" v-model="thisuser.password"/>
                </div>
                <br>
                <div class="row">
                    <div class="q-pa-md q-gutter-sm">
                        <q-btn color="primary" @click="login" style="width: 175px;"  :loading="loading" label="登入"></q-btn>
                    </div>
                    <div class="q-pa-md q-gutter-md">
                        <q-btn color="info" @click="reset" style="width: 175px;" label="清除"></q-btn>
                    </div>
                </div>
            </q-card-section>
            <q-card-section v-if="errorMessage" class="text-negative text-center">
                {{ errorMessage }}
            </q-card-section>
        </q-card>
    </q-page>
    </q-page-container>
    </q-layout>
</template>
<style>
.my-card{
  width: 100%;
  max-width: 250px;
}
.main{
    /* 背景圖 */
    background-image: url('@/assets/Background.jpg');
    background-size: cover;          /* 等比例放大，填滿整個畫面 */
    background-position: center;     /* 圖片置中 */
    background-repeat: no-repeat;    /* 不重複 */

    /* 尺寸設定 */
    width: 100vw;                    /* 視窗寬度 */
    height: 100vh;                   /* 視窗高度 */

    /* 排版用 */
    display: flex;                   /* 讓文字置中 */
    justify-content: center;         /* 水平置中 */
    align-items: center;             /* 垂直置中 */

    color: white;                    /* 讓文字在圖片上清楚 */

}
.title{
    font-style: italic;
    font-family: 'Times New Roman', Times, serif;
    font-size: 4rem;
}
.subtitle{
    font-style: bold;
    font-family: 'Times New Roman', Times, serif;
    font-size: 2rem;
}
</style>
<script>
import { ref } from 'vue'
import { useUserStore } from '@/composables/useUser'
import { QPageContainer, QLayout, QCard, QPage, QCardSection, QBtn, SessionStorage } from 'quasar'

import router from '@/router'
export default {
  name: 'LoginComponent',
  components: {
    QCard,
    QPage,
    QLayout,
    QPageContainer,
    QCardSection,
    QBtn
  },
  setup () {
    const thisuser = useUserStore()
    const loading = ref(false)
    // const session = SessionStorage();
    const errorMessage = ref('')
    function reset () {
      errorMessage.value = ''
      thisuser.name = ''
      thisuser.username = ''
      thisuser.password = ''
      thisuser.lastModifier = ''
      loading.value = false
      console.log(`theuser username:${thisuser.username}, password:${thisuser.password}`)
    }
    async function login () {
      errorMessage.value = ''
      console.log(`thisuser username:${thisuser.username}, password:${thisuser.password}`)
      console.log(!thisuser.username || !thisuser.password)
      if (!thisuser.username || !thisuser.password) {
        errorMessage.value = '請輸入帳號與密碼'
        return
      }
      loading.value = true
      try {
        const result = await thisuser.loginUser()
        console.log('result', result)
        if (result != '') {
          errorMessage.value = result
        } else {
          const user = {
            name: '',
            username: thisuser.username,
            password: thisuser.password,
            lastModifier: ''
          }
          reset()
          const loginAccount = await thisuser.getUser(user)
          SessionStorage.set('Account', loginAccount)
          router.push('/dashboard')
        }
        loading.value = false
      } catch (error) {
        alert('登入有誤或伺服器無法連接');
        loading.value = false
      }

    }
    return {
      // members
      thisuser,
      errorMessage,
      loading,

      // methods
      reset,
      login
    }
  }
}
</script>
