import { defineStore } from 'pinia';
import axios from 'axios'
import { Constant } from './Constant';
import { toRaw } from "vue";
export const useARStore = defineStore('ar',  {
  actions:{
    async getARNo(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetArNo')
      console.log('response', response)
      if (response){
        return response.data.result;
      }
      return null;
    },
    async getAccSourceList(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetAccountSourceAndCode')
      console.log('response', response)
      if (response){
        return response.data.resultList;
      }
      return null;
    },
    async saveAR(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      payload.匯率 = payload.匯率.匯率;
      const param = {...payload}
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveAR', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async updateAR(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      payload.匯率 = payload.匯率.匯率;
      const param = {...payload}
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateAR', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async deleteAR(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      // payload.匯率 = payload.匯率.匯率;
      const param = {...payload}
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/DeleteAR', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getArList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetArList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async updateCloseFlag(formNo){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/UpdateCloseFlag?formNo='+formNo)
      console.log('response', response)
      if (response){
        return response;
      }
      return null;
    }
  }
});
