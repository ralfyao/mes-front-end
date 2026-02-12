import { defineStore } from 'pinia';
import axios from 'axios'
import { Constant } from './Constant';
import { toRaw } from "vue";
export const useCustStore = defineStore('',  {
  actions:{
    async getCustList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetCustList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getUniqueCust(companyName){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetUniqueCust?companyName=' + companyName);
      if (response.data.resultList) {
        return response.data.result
      }
      return null;
    },
    async getCountryList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetCountryList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getIndustryList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetIndustryCodeList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getBankList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetBankList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async saveCustomer(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        company: payload.company,
        ma:payload.ma,
        tel:payload.tel,
        fax:payload.fax,
        contactperson: payload.contactperson,
        position:payload.position,
        email: payload.email,
        country: payload.country,
        正航編號: payload.正航編號,
        address: payload.address,
        欄位2: payload.欄位2,
        欄位1: payload.欄位1,
        source:payload.source,
        daddress: payload.daddress,
        zipcode:payload.zipcode,
        website:payload.website,
        industrycode: payload.industrycode?.中分類碼 ?? payload.industrycode ?? null,
        industry:payload.industry,
        建檔:payload.account,
        machineissue:payload.machineissue,
        credibility: payload.credibility?.銀存編碼 ?? payload.credibility ?? null,
        memo:payload.memo,
        account:payload.account,
        contactDetails: payload.contactDetails,
        contactLists: payload.contactLists
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveCustomer', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async updateCustomer(form){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const payload = { ...toRaw(form.value) };
      const param = {
        識別: payload.識別,
        company: payload.company,
        country: payload.country,
        ma:payload.ma,
        tel:payload.tel,
        fax:payload.fax,
        contactperson: payload.contactperson,
        position:payload.position,
        email: payload.email,
        正航編號: payload.正航編號,
        address: payload.address,
        欄位2: payload.欄位2,
        欄位1: payload.欄位1,
        source:payload.source,
        daddress: payload.daddress,
        zipcode:payload.zipcode,
        website:payload.website,
        industrycode: payload.industrycode?.中分類碼 ?? payload.industrycode ?? null,
        industry:payload.industry,
        machineissue:payload.machineissue,
        credibility: payload.credibility?.銀存編碼 ?? payload.credibility ?? null,
        memo:payload.memo,
        account:payload.account,
        contactDetails: payload.contactDetails,
        contactLists: payload.contactLists
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateCustomer', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async deleteCustomer(form){
      const constant = Constant();
      console.log('form', form);
      console.log('APIUrl', constant.APIUrl)
      const param = {
        識別: form,
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/DeleteCustomer', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async updateCustomerExpiry(form){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const param = {
        識別: form.識別,
        停用日: form.停用日
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateCustomerExpiry', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getSalesRecordList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetSalesRecordList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getCompanyList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetCompanyList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getSalesList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetSalesList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getContactList(companyName){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetContactList?companyName=' + companyName);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getRanking(){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + 'api/GetRankingList');
      if (response.data.resultList){
        return response.data.resultList;
      }
      return null;
    },
    async getStatusList(){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + 'api/GetCustStatusList')
      if (response.data.resultList){
        return response.data.resultList;
      }
      return null;
    },
    async getAgentOptions(){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + 'api/GetAgentOptionList')
      if (response.data.resultList){
        return response.data.resultList;
      }
      return null;
    },
    async getRfqNo(){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + 'api/GetRfqNo')
      if (response.data.result){
        return response.data.result;
      }
      return null;
    },
    async getQuotationList(rfqNo){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetQuotationList?rfqNo=' + rfqNo);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getQuotationDetailList(quoNo){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetQuotationDetailList?quoNo=' + quoNo);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getSalesWorkRecordList(rfqNo){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetSalesWorkRecordList?rfqNo=' + rfqNo);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async saveRfq(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {

      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveCustomer', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    }
  }
})
