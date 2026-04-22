import { defineStore } from "pinia";
import { Constant } from "./Constant";
import apiClient from '@/apis/apiClient'

export const useStockIn = defineStore('stockIn', {
  state: () => ({
    itemId: '',}),
  actions:{
    async getAllStockInLists() {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/AllStockInList')
      console.log('response', response)
      return response.data.resultList;
    },
    async getFormNo(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/GetFormNo')
      console.log('response', response)
      return response.data.result;
    },
    async getWarehouseWorkers(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/GetWarehouseWorkers')
      console.log('response', response)
      return response.data.resultList;
    },
    async stockInDetailLists(stockInNo){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/StockInDetailList?stockInNo='+stockInNo)
      console.log('response', response)
      return response.data.resultList;
    },
    async saveUpdateForm(form){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.post(constant.APIUrl + 'api/SaveUpdateStockInForm', form)
      console.log('response', response)
      if (response) {
        return response
      }
      return null;
    },
    async deleteStockInForm(form){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.post(constant.APIUrl + 'api/DeleteStockInForm', form)
      console.log('response', response)
      if (response) {
        return response
      }
      return null;
    }
  }});
