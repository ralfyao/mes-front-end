import { defineStore } from 'pinia'
import { Constant } from './Constant'
import apiClient from '@/apis/apiClient'
export const useMenuStore = defineStore('menu', {
  state: () => (
    {
      menus: []
    }),
  actions: {
    async getMenus (account) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/GetMenu?account=' + account)
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getMenuByRole(roleName){
      const constant = Constant()
      console.log('getMenuByRole APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/GetMenuByRole?roleName=' + roleName);
      console.log('getMenuByRole response', response);
      if (response.data.resultList) {
        console.log('response.data.resultList', response.data.resultList);
        return response.data.resultList
      }
    },
    async getAllMenus(){
      const constant = Constant()
      console.log('getAllMenus APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/GetMenuList');
      console.log('getAllMenus response', response);
      if (response.data.resultList) {
        console.log('response.data.resultList', response.data.resultList);
        return response.data.resultList
      }
      return null;
    }
  }
})
