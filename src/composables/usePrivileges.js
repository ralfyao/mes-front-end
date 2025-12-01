import { defineStore } from "pinia"
import axios from 'axios'
import { Constant } from './Constant'
export const usePrivilegeStore = defineStore('roles',{
  state:()=>({
    roles:[]
  }),
  actions:{
    async getAllPrivileges(){
      const constant = Constant();
      const response = axios.get(constant.APIUrl+'api/GetAllPrivilege')
      console.log('response', response);
      const { data } = await axios.get(constant.APIUrl + 'api/GetAllPrivilege')

      if (data && data.result) {
        this.roles = data.result
        return data.result
      } else {
        return []
      }
    }
  }
});
