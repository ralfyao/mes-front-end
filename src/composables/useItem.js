import { defineStore } from "pinia";
import { Constant } from "./Constant";
import apiClient from '@/apis/apiClient'

export const useItemStore = defineStore('item', {
  state: () => ({
    itemId: '',}),
  actions: {
    async getAllItems() {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/ItemList')
      console.log('response', response)
      return response.data.resultList;
    },
    async getItemTypeList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/ItemTypeList')
      console.log('response', response)
      return response.data.resultList;
    }
  }
});
