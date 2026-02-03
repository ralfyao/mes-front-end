import {defineStore} from 'pinia';
import axios from 'axios';
import {Constant} from './Constant';
import { SessionStorage } from 'quasar';
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
      const response = await axios.get(constant.APIUrl + 'api/ProductList')
      console.log('response', response)
      if (response.data.errorMessage !== '') {
        return []
      } else {
        if (response.data.resultList) {
          console.log('resultList', response.data.resultList)
          return response.data.resultList
        }
      }
    },
    async addProductSpec(parm) {
      console.log('parm', parm);
      const createUser = SessionStorage.getItem('Account').account   || 'Unknown';
      const request =  {
        productSpecName: parm.specName,
        productSpecValue: parm.specValue,
        productSpecMaxValue:parm.specMaxValue,
        productSpecMinValue:parm.specMinValue,
        createUser: createUser,
        modifyUser: createUser
      };
      console.log('request', request);
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl);
      const response = await axios.post(constant.APIUrl + 'api/AddProductSpec', JSON.stringify(request), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    },
    async getProductSpecById(id){
      const constant = Constant();
      const response = await axios.get(constant.APIUrl+'api/GetProductSpecByID?id='+id);
      console.log('response', response);
      if (response.data.errorMessage !== '') {
        return []
      } else {
        if (response.data.result) {
          console.log('result', response.data.result)
          return response.data.result
        }
      }
    },
    async getAllProductSpecs(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/ProductSpecList')
      console.log('response', response)
      if (response.data.errorMessage !== '') {
        return []
      } else {
        if (response.data.resultList) {
          console.log('resultList', response.data.resultList)
          return response.data.resultList
        }
      }
    },
  }
});
