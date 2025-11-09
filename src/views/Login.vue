<template>
    <q-layout>
    <q-page-container>
    <q-page class="flex flex-center main">
        <q-card class= "q-pa-md shadow-22 col-12 bg-transparent ">
            <q-card-section class="bg-transparent" >
                <div class="title row">MES 登入系統</div>
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
                    <div class="col-6"><button class="btn btn-primary col-12" @click="login" :loading="loading">登入</button></div>
                    <div class="col-6"><button class="btn btn-info  col-12" @click="reset">清除</button></div>
                     &nbsp;
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
import { ref } from 'vue';
import { useUserStore } from '@/composables/useUser';
import { QPageContainer, QLayout, QCard, QPage, QCardSection } from 'quasar' ;
import { SessionStorage } from 'quasar';
import router from '@/router';
export default {
    name:"LoginComponent",
    components:{
        QCard,
        QPage,
        QLayout,QPageContainer, QCardSection,
    },
    setup(){
        const thisuser = useUserStore();
        const loading = ref(false);
        // const session = SessionStorage();
        const errorMessage = ref('');
        function reset(){
            errorMessage.value = ''
            thisuser.username = '';
            thisuser.password = '';
            loading.value = false;
            console.log(`theuser username:${thisuser.username}, password:${thisuser.password}`);
        }
        async function login(){
            errorMessage.value = ''
            console.log(`thisuser username:${thisuser.username}, password:${thisuser.password}`);
            console.log(!thisuser.username || !thisuser.password);
            if (!thisuser.username || !thisuser.password ) {
                errorMessage.value = '請輸入帳號與密碼'
                return;
            }
            loading.value = true;
            var result = await thisuser.loginUser();
            console.log('result', result);
            if (result != "")
            {
                errorMessage.value = result;
            }
            else
            {
                var user = {
                    username:thisuser.username, 
                    password:thisuser.password
                }
                var loginAccount = await thisuser.getUser(user);
                SessionStorage.set('Account', loginAccount);
                router.push('/dashboard');
            }
            loading.value = false
        }
        return{
            //members
            thisuser,
            errorMessage,
            loading,
            
            //methods
            reset,
            login,
        }
    },
}
</script>