import { defineStore } from "pinia";
import axios from 'axios'
import { Constant } from './Constant';
import { toRaw } from "vue";

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
    async updateSupplier(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        廠商編號:payload.廠商編號,
        廠商簡稱:payload.廠商簡稱,
        廠商名稱:payload.廠商名稱,
        國別:payload.國別,
        公司地址:payload.公司地址,
        工廠地址:payload.工廠地址,
        統一編號:payload.統一編號,
        聯絡人:payload.聯絡人,
        職稱:payload.職稱,
        聯絡手機:payload.聯絡手機,
        電郵:payload.電郵,
        電話:payload.電話,
        傳真:payload.傳真,
        所屬業別:payload.所屬業別,
        管理分類:payload.管理分類,
        等級:payload.等級,
        備註:payload.備註,
        R1:payload.R1,
        R2:payload.R2,
        R3:payload.R3,
        停用:payload.停用,
        建檔:payload.建檔,
        修改:payload.修改,
        核准:payload.核准,
        建檔日:payload.建檔日,
        修改日:payload.修改日,
        核准日:payload.核准日,
      }
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateSupplier', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async addSupplier(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        廠商編號:payload.廠商編號,
        廠商簡稱:payload.廠商簡稱,
        廠商名稱:payload.廠商名稱,
        國別:payload.國別?.code ? payload.國別?.code : payload.國別,
        公司地址:payload.公司地址,
        工廠地址:payload.工廠地址,
        統一編號:payload.統一編號,
        聯絡人:payload.聯絡人,
        職稱:payload.職稱,
        聯絡手機:payload.聯絡手機,
        電郵:payload.電郵,
        電話:payload.電話,
        傳真:payload.傳真,
        所屬業別:payload.所屬業別,
        管理分類:payload.管理分類,
        等級:payload.等級,
        備註:payload.備註,
        R1:payload.R1,
        R2:payload.R2,
        R3:payload.R3,
        停用:payload.停用,
        建檔:payload.建檔,
        修改:payload.修改,
        核准:payload.核准,
        建檔日:payload.建檔日,
        修改日:payload.修改日,
        核准日:payload.核准日,
      }
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveSupplier', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async deleteSupplier(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        廠商編號:payload.廠商編號,
        廠商簡稱:payload.廠商簡稱,
        廠商名稱:payload.廠商名稱,
        國別:payload.國別?.code ? payload.國別?.code : payload.國別,
        公司地址:payload.公司地址,
        工廠地址:payload.工廠地址,
        統一編號:payload.統一編號,
        聯絡人:payload.聯絡人,
        職稱:payload.職稱,
        聯絡手機:payload.聯絡手機,
        電郵:payload.電郵,
        電話:payload.電話,
        傳真:payload.傳真,
        所屬業別:payload.所屬業別,
        管理分類:payload.管理分類,
        等級:payload.等級,
        備註:payload.備註,
        R1:payload.R1,
        R2:payload.R2,
        R3:payload.R3,
        停用:payload.停用,
        建檔:payload.建檔,
        修改:payload.修改,
        核准:payload.核准,
        建檔日:payload.建檔日,
        修改日:payload.修改日,
        核准日:payload.核准日,
      }
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/DeleteSupplier', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
  }
})
