import {defineStore} from 'pinia';
import axios from 'axios';
import {Constant} from './Constant';
export const useProductStore = defineStore('product', {
  state: () => ({
    productId: '',
    productName: '',
    productDescription: '',
    createUser: '',
    createDate: '',
    modifyUser: '',
    modifyDate: ''}),
  actions: {
    async getAllProducts() {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetAllProducts')
      console.log('response', response)
      if (response.data.errorMessage !== '') {
        return []
      } else {
        if (response.data.resultList) {
          console.log('resultList', response.data.resultList)
          return response.data.resultList
        }
      }
    }
  }
});
