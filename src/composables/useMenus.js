import { defineStore } from 'pinia'
import axios from 'axios'
import { Constant } from './Constant'
export const useMenuStore = defineStore('menu', {
  state: () => (
    {
      menus: []
    }),
  actions: {
    async getMenus (account) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetMenu?account=' + account)
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getAllMenus(){
      const constant = Constant()
      console.log('getAllMenus APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetMenu?account=null');
      console.log('getAllMenus response', response);
      if (response.data.resultList) {
        console.log('response.data.resultList', response.data.resultList);
        return response.data.resultList
      }
      return null;
    }
  }
})
