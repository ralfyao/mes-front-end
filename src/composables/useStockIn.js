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
    }
  }});
