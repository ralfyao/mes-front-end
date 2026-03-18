import { defineStore } from "pinia";
import axios from 'axios'
import { Constant } from './Constant';
import { toRaw } from "vue";
import apiClient from '@/apis/apiClient'

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
    async getAllSupplierList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetAllSupplierList');
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
    async getEvaluateFormNo(){
       const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetSupplierNo');
      if (response.data.result) {
        return response.data.result
      }
      return null;
    },
    async addSupplierEvaliate(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        單號 : payload.單號,
        日期	:payload.日期			,
        廠商編號:payload.廠商編號			,
        評鑑人員:payload.評鑑人員			,
        覆審人員:payload.覆審人員			,
        覆審日期:payload.覆審日期			,
        達成客戶要求的能力:payload.達成客戶要求的能力,
        提升經營效能的企圖:payload.提升經營效能的企圖,
        勞動安全與職工福利:payload.勞動安全與職工福利,
        能迅速處理客戶抱怨:payload.能迅速處理客戶抱怨,
        設備的產能與準確度:payload.設備的產能與準確度,
        足夠的人力資源條件:payload.足夠的人力資源條件,
        產銷接單適當無過載:payload.產銷接單適當無過載,
        健全的產品驗證系統:payload.健全的產品驗證系統,
        符合訂單的品質要求:payload.符合訂單的品質要求,
        依產品標準進行檢測:payload.依產品標準進行檢測,
        建檔	:payload.建檔	,
        建檔日	:payload.建檔日	,
        修改	:payload.修改	,
        修改日	:payload.修改日	,
        核准	:payload.核准	,
        核准日	:payload.核准日	,
        達		:payload.達		,
        提		:payload.提		,
        勞		:payload.勞		,
        能		:payload.能		,
        設		:payload.設		,
        足		:payload.足		,
        產		:payload.產		,
        健		:payload.健		,
        符		:payload.符		,
        依		:payload.依		,
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveSupplierEvaluate', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async evaluateSupplier(formNo, validate, user){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + `api/EvaluateSupplier?formNo=${formNo}&validate=${validate}&user=${user}`);
      if (response.data.result) {
        return response
      }
      return null;
    },
    async validateSupplier(formNo, validate, user){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + `api/ValidateSupplier?formNo=${formNo}&validate=${validate}&user=${user}`);
      if (response) {
        return response
      }
      return null;
    },
    async activateSupplier(formNo, validate, user){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + `api/ActivateSupplier?formNo=${formNo}&validate=${validate}&user=${user}`);
      if (response) {
        return response
      }
      return null;
    },
    async getSupplierQuotationList(){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + `api/GetSupplierQuotationList`);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async addSupplierQuotation(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param ={
        識別:payload.識別,
        廠商編號:payload.廠商編號,
        詢價日期:payload.詢價日期,
        品項編號:payload.品項編號,
        採購單位:payload.採購單位,
        最低採購量:payload.最低採購量,
        最大採購量:payload.最大採購量,
        單價:payload.單價,
        幣別:payload.幣別,
        詢價人員:payload.詢價人員,
        報價有效日期:payload.報價有效日期,
        廠商品號:payload.廠商品號,
      }
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/AddSupplierQuotation', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getQuotationByItem (itemNo) {
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + `api/QuotationByItem?itemNo=${itemNo}`);
      if (response.data.result) {
        return response.data.result
      }
      return null;
    },
    async updateSupplierQuotation(quotationData){
      const constant = Constant();
      console.log('quotationData', quotationData);
      const payload = toRaw(quotationData.value.materialList) ;
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = payload.map(item=>({
          識別:item.識別,
          廠商編號		:item.廠商編號			,
          詢價日期		:item.詢價日期	        ,
          品項編號		:item.品項編號	        ,
          採購單位		:item.採購單位	        ,
          最低採購量	    :item.最低採購量	    ,
          最大採購量	    :item.最大採購量	    ,
          單價			:item.單價		        ,
          幣別			:item.幣別		        ,
          詢價人員		:item.詢價人員	        ,
          報價有效日期	:item.報價有效日期      ,
          廠商品號		:item.廠商品號	        ,
      }));
      console.log('param', param);
      const response = await apiClient.post(constant.APIUrl + 'api/UpdateSupplierQuotationList', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async deleteSupplierQuotation(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', form)
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        識別:form.value.識別,
          廠商編號		:form.value.廠商編號			,
          詢價日期		:form.value.詢價日期	        ,
          品項編號		:form.value.品項編號	        ,
          採購單位		:form.value.採購單位	        ,
          最低採購量	    :form.value.最低採購量	    ,
          最大採購量	    :form.value.最大採購量	    ,
          單價			:form.value.單價		        ,
          幣別			:form.value.幣別		        ,
          詢價人員		:form.value.詢價人員	        ,
          報價有效日期	:form.value.報價有效日期      ,
          廠商品號		:form.value.廠商品號	        ,
        產品編號:form.value.產品編號,

      }
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/DeleteSupplierQuotation', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    }
  }
})
