import { defineStore } from "pinia";
import { Constant } from './Constant';
import axios from 'axios'

export const useSupplierStore = defineStore('supplier', {
  actions:{
    async getSupplierList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetSupplierList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async querySupplier(parm){
      // alert(parm.supplierNo+','+parm.supplierName);
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetSupplierList?supplierNo='+parm.supplierNo+'&supplierName='+parm.supplierName);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
  }
})
