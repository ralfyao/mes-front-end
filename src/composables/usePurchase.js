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
    },
    async getPurchaseOrderByNo(purchaseOrderNo) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/AllPurchasesList?purchaseOrderNo=' + purchaseOrderNo)
      console.log('response', response)
      if (response.data.resultList) {
        return response.data.resultList[0];
      }
      return {};
    },
    async getPONo() {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/GetPONo')
      console.log('response', response)
      return response.data.result;
    },
    async getProcurementorList() {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/GetProcurementorList')
      console.log('response', response)
      return response.data.resultList;
    },
    async createPurchaseOrder(purchaseOrderData) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.post(constant.APIUrl + 'api/CreatePurchaseOrder', purchaseOrderData)
      console.log('response', response)
      return response.data;
    },
    async updatePurchaseOrder(purchaseOrderData) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.post(constant.APIUrl + 'api/UpdatePurchaseOrder', purchaseOrderData)
      console.log('response', response)
      return response.data;
    },
    async deletePurchaseOrder(purchaseOrderId) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/DeletePurchaseOrder?purchaseOrderNo=' + purchaseOrderId)
      console.log('response', response)
      return response.data;
    },
    async voidPurchaseOrder(purchaseOrderId) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/VoidPurchaseOrder?purchaseOrderNo=' + purchaseOrderId)
      console.log('response', response)
      return response.data;
    },
    async voidPurchaseOrderItem(itemId) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/VoidPurchaseOrderItem?itemId=' + itemId)
      console.log('response', response)
      return response.data;
    },
    async evaluatePurchaseOrder(formNo, validate, user){
      const constant = Constant()
      const response = await apiClient.get(constant.APIUrl + `api/EvaluatePurchaseOrder?formNo=${formNo}&validate=${validate}&user=${user}`);
      console.log('response', response);
      if (response.data.result) {
        return response
      }
      return null;
    },
    async getAllPurchaseRequestList(){
      const constant = Constant()
      const response = await apiClient.get(constant.APIUrl + `api/AllPurchaseRequestList`);
      console.log('response', response);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getDeptList(){
      const constant = Constant()
      const response = await apiClient.get(constant.APIUrl + `api/AllDepartmentList`);
      console.log('response', response);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async savePurchaseRequest(form){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.post(constant.APIUrl + 'api/SavePurchaseRequest', form)
      console.log('response', response)
      return response;
    },
    async deletePurchaseRequest(form){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/DeletePurchaseRequest?formSerial='+form.請購序號, )
      console.log('response', response)
      return response;
    }
  }
});
