import { defineStore } from 'pinia';
import apiClient from '@/apis/apiClient'
import { Constant } from './Constant';
import { toRaw } from "vue";
export const useMfgStore = defineStore('mfg',  {
  actions:{
    async getMiscMfgOrderNo(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await apiClient.get(constant.APIUrl+'api/GetMiscMfgNo')
      console.log('response', response);
      if (response){
        return response.data.result;
      }
      return null;
    },
    async createMiscMfgOrder(form){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      console.log('form', form)
      const payload = { ...toRaw(form.value) };
      console.log('payload', payload);
      const param = {...payload}
      console.log('param', param);
      const response =await apiClient.post(constant.APIUrl+'api/CreateMiscMfgOrder', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      })
      console.log('response', response);
      return response;
    }
  }
})
