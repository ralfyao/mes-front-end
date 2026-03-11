import { defineStore } from "pinia";
import { SessionStorage } from "quasar";

export const useAuth = defineStore('auth', {
  props:{
    auth:{},
    user:{},
  },
  actions:{
    setAuth(auth){
      this.auth = auth;
    },
    getUser(){
      if (!this.user){
        this.user = SessionStorage.getItem('Account');
      }
      return this.user;
    },
    getAuth(formName){
      if (!this.user){
        this.user = SessionStorage.getItem('Account');
      }
      this.auth = this.user.authList.find((x)=>x.menuSubName == formName);
      return this.auth;
    },
    hasAllAuth(formName){
      if (!this.user){
        this.getUser();
      }
      this.getAuth(formName);
      return (!this.auth?.value?.高管 && !this.auth?.value?.核准 && !this.auth?.value?.編修 && !this.auth?.value?.報表 && !this.auth?.value?.輸出)
    }
  }
})
