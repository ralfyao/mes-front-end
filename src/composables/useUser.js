import { defineStore } from 'pinia';
import  axios  from 'axios';
import { Constant } from './Constant';
export const useUserStore = defineStore('user', {
    state:() =>({
        username:'',
        password:''
    }),
    actions:{
        login(name, pass) {
            this.username = name
            this.password = pass
        },
        async getUser(item){
            console.log('item', item);
            const constant = Constant();
            console.log('APIUrl', constant.APIUrl);
            const response = await axios.post(constant.APIUrl+'api/GetUser',item);
            if (response.data.result)
            {
                return response.data.result;
            }
            return null;
        },
        async loginUser() {
            const constant = Constant();
            console.log('APIUrl', constant.APIUrl);
            const response = await axios.post(constant.APIUrl+'api/Login',{
                username:this.username,
                password:this.password
            });
            if (response.data.errorMessage !== "") {
                return response.data.errorMessage;
            } else {
                return "";
            }
        },
        logout() {
            this.username = '';
            this.password = '';
        }
    }
});