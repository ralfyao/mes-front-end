import { defineStore } from "pinia";
import { Constant } from "./Constant";
import apiClient from '@/apis/apiClient'

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    itemId: '',}),
  actions: {
    async getAllPurchasesList() {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/AllPurchasesList')
      console.log('response', response)
      return response.data.resultList;
    }
  }
});
