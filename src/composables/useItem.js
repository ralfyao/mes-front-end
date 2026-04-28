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
    },
    async saveUpdateItemInfo(form){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.post(constant.APIUrl + 'api/SaveUpdateItem', form)
      console.log('response', response)
      if (response) {
        return response
      }
      return null;
    },
    async disableItem(itemNo){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/ToggleDisableItem?itemNo='+itemNo)
      console.log('response', response)
      if (response) {
        return response
      }
      return null;
    },
    async deleteItem(form){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/DeleteItem?itemNo='+form.產品編號)
      console.log('response', response)
      if (response) {
        return response
      }
      return null;
    }
  }
});
