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
    async getAccSourceList(custNo){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetARAccountSourceAndCode?custNo='+custNo)
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
      if (payload.匯率.匯率){
        payload.匯率 = payload.匯率.匯率;
      }
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
    },
    async getItemNumberList() {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetItemNumberList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getOtherIncomeNo(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetOtherIncomeNo');
      if (response.data.resultList) {
        return response.data.result
      }
      return null;
    },
    async saveOtherIncome(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      // payload.匯率 = payload.匯率.匯率;
      const param = {...payload}
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveOtherIncome', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async updateOtherIncome(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      // payload.匯率 = payload.匯率.匯率;
      const param = {...payload}
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateOtherIncome', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getOtherIncomeList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetOtherIncomeList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async deleteOtherIncome(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      if (payload.匯率.匯率){
        payload.匯率 = payload.匯率.匯率;
      }
      // payload.匯率 = payload.匯率.匯率;
      const param = {...payload}
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/DeleteOtherIncome', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async validateOtherIncome(formNo, valid, account){
      const constant = Constant();
      const response = await axios.get(constant.APIUrl + 'api/ValidateOtherIncome?formNo='+formNo+'&valid='+valid+'&account='+account, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async validateAR(formNo, valid, account){
      const constant = Constant();
      const response = await axios.get(constant.APIUrl + 'api/ValidateAR?formNo='+formNo+'&valid='+valid+'&account='+account, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getUnclosedARList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/UnclosedARList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    }
  }
});
