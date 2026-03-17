import { defineStore } from "pinia"
import apiClient from '@/apis/apiClient'
import { Constant } from './Constant'
import { toRaw } from "vue";
export const usePrivilegeStore = defineStore('roles',{
  state:()=>({
    roles:[]
  }),
  actions:{
    async getAllPrivileges(){
      const constant = Constant();
      const response = apiClient.get(constant.APIUrl+'api/GetAllPrivilege')
      console.log('response', response);
      const { data } = await apiClient.get(constant.APIUrl + 'api/GetAllPrivilege')

      if (data && data.result) {
        this.roles = data.result
        return data.result
      } else {
        return []
      }
    },
    async updateUserPrivileges(user, account, privList){
      const constant = Constant();
      const param = {
        user: user,
        account: account,
        privList: privList
      }
      console.log('param', param);
      const response = await apiClient.post(constant.APIUrl + 'api/UpdateUserPrivileges',JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.errorMessage !== '') {
        return response.data.errorMessage
      } else {
        return 'OK'
      }
    },
    async getPrivMenuByRole(roleName){
      const constant = Constant();
      console.log('getPrivMenuByRole APIUrl', constant.APIUrl);
      const response = await apiClient.get(constant.APIUrl + 'api/GetPrivMenuByRole?roleName=' + roleName);
      console.log('getPrivMenuByRole response', response);
      if (response.data.resultList) {
        console.log('response.data.resultList', response.data.resultList);
        return response.data.resultList;
      }
      return [];
    },
    async getUserPrivileges(account){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/GetUserPrivileges?account=' + account);
      console.log('response', response);
      if (response.data.resultList) {
        return response.data.resultList;
      } else {
        return [];
      }
    },
    async saveRolePrivilege(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('payload',payload);
      const param = {
        account: payload.account,
        roleName: payload.roleName,
        privList: payload.privList,
        selectedMenu :payload.selectedMenu.map(m => ({
          menuID: String(m.menuID)
        })),
        selectedSub : payload.selectedSub.map(s => ({
          menuID: String(s.menuID),
          menuSubID: String(s.menuSubID)
        }))
      }
      console.log('param', param);
      const response = await apiClient.post(constant.APIUrl+'api/SaveRolePrivilege',JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.errorMessage !== '') {
        if (response.data.errorMessage) {
          return response.data.errorMessage;
        } else {
          return response.errorMessage;
        }
      } else {
        return 'OK';
      }
    },
    async updateRolePrivilege(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('payload',payload);
      const param = {
        account: payload.account,
        roleName: payload.roleName,
        privList: payload.privList,
        selectedMenu :payload.selectedMenu.map(m => ({
          menuID: String(m.menuID)
        })),
        selectedSub : payload.selectedSub.map(s => ({
          menuID: String(s.menuID),
          menuSubID: String(s.menuSubID)
        }))
      }
      console.log('param', param);
      // console.log(payload);
      // return;
      // const response = apiClient.get(constant.APIUrl+'api/GetAllPrivilege')
      // console.log('response', response);
      const response = await apiClient.post(constant.APIUrl + 'api/UpdateRoleMenu',JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }});
       if (response.data.errorMessage !== '') {
        return response.data.errorMessage
      } else {
        return 'OK'
      }
    },
    async deleteRolePrivilege(roleName){
      const constant = Constant();
      const response = await apiClient.delete(constant.APIUrl + 'api/DeleteRolePrivilege?roleName=' + roleName);
      if (response.data.errorMessage !== '') {
        return response.data.errorMessage
      } else {
        return 'OK'
      }
    }
  }
});
