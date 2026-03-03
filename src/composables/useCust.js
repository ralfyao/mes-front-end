import { defineStore } from 'pinia';
import axios from 'axios'
import { Constant } from './Constant';
import { toRaw } from "vue";
export const useCustStore = defineStore('',  {
  actions:{
    async getUserCompany(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetUserCompany');
      if (response.data.resultList) {
        return response.data.result
      }
      return null;
    },
    async getCustList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetCustList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getCustListByCondition(param){
      const constant = Constant();
      const payload = { ...toRaw(param.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const paramA = {
        company:payload.company,
        companyAlias:payload.companyAlias,
        custNo:payload.custNo,
        country:payload.country?.國別 ? payload.country?.國別 : payload.country,
        industryCode:payload.industryCode?.中分類碼 ? payload.industryCode?.中分類碼 : payload.industryCode,
        eqpType:payload.eqpType,
        custType:payload.custType,
        remark:payload.remark,
      }
      console.log('paramA', paramA);
      const response = await axios.post(constant.APIUrl + 'api/QueryCustListByCondition', JSON.stringify(paramA), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getProjectSerial(custNo){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetProjectSerialList?custNo='+custNo);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getCARNo(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetCARNo');
      if (response.data.result) {
        return response.data.result
      }
      return null;
    },
    async getUniqueCust(companyName){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetUniqueCust?companyName=' + companyName);
      if (response.data.resultList) {
        return response.data.result
      }
      return null;
    },
    async getCountryList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetCountryList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getCustNo(country){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/CustNo?country='+country);
      if (response) {
        return response
      }
      return null;
    },
    async updateIndustryList(list){
      const constant = Constant();
      const payload = toRaw(list.value) ;
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = payload.map(item=>({
        大分類碼:item.大分類碼,
        大分類名稱:item.大分類名稱,
        中分類碼:item.中分類碼,
        中分類名稱:item.中分類名稱,
        英文:item.英文,
        內容:item.內容,
        其他:item.其他,
      }));
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateIndustryList', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getIndustryList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetIndustryCodeList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getBankList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetBankList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async saveCustomer(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        company: payload.company,
        ma:payload.ma,
        tel:payload.tel,
        fax:payload.fax,
        contactperson: payload.contactperson,
        position:payload.position,
        email: payload.email,
        country: payload.country,
        正航編號: payload.正航編號,
        address: payload.address,
        欄位2: payload.欄位2,
        欄位1: payload.欄位1,
        source:payload.source,
        daddress: payload.daddress,
        zipcode:payload.zipcode,
        website:payload.website,
        industrycode: payload.industrycode?.中分類碼 ?? payload.industrycode ?? null,
        industry:payload.industry,
        建檔:payload.account,
        machineissue:payload.machineissue,
        credibility: payload.credibility?.銀存編碼 ?? payload.credibility ?? null,
        memo:payload.memo,
        account:payload.account,
        contactDetails: payload.contactDetails,
        contactLists: payload.contactLists,
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveCustomer', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async updateCustomer(form){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const payload = { ...toRaw(form.value) };
      const param = {
        識別: payload.識別,
        company: payload.company,
        country: payload.country?.code ? payload.country?.code : payload.country,
        ma:payload.ma,
        tel:payload.tel,
        fax:payload.fax,
        contactperson: payload.contactperson,
        position:payload.position,
        email: payload.email,
        正航編號: payload.正航編號,
        address: payload.address,
        欄位2: payload.欄位2,
        欄位1: payload.欄位1,
        source:payload.source,
        daddress: payload.daddress,
        zipcode:payload.zipcode,
        website:payload.website,
        industrycode: payload.industrycode?.中分類碼 ?? payload.industrycode ?? null,
        industry:payload.industry,
        machineissue:payload.machineissue,
        credibility: payload.credibility?.銀存編碼 ?? payload.credibility ?? null,
        memo:payload.memo,
        account:payload.account,
        contactDetails: payload.contactDetails,
        contactLists: payload.contactLists,
        修改:payload.account
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateCustomer', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async updateCompanyName(originalName, changeToName){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/UpdateCompanyName?originalName='+originalName+'&changeToName='+changeToName);
      if (response) {
        return response
      }
      return null;
    },
    async deleteCustomer(form){
      const constant = Constant();
      console.log('form', form);
      console.log('APIUrl', constant.APIUrl)
      const param = {
        識別: form,
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/DeleteCustomer', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async updateCustomerExpiry(form){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const param = {
        識別: form.識別,
        停用日: form.停用日
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateCustomerExpiry', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getSalesRecordList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetSalesRecordList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getCompanyList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetCompanyList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getSalesList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetSalesList');
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getContactList(companyName){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetContactList?companyName=' + companyName);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getRanking(){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + 'api/GetRankingList');
      if (response.data.resultList){
        return response.data.resultList;
      }
      return null;
    },
    async getStatusList(){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + 'api/GetCustStatusList')
      if (response.data.resultList){
        return response.data.resultList;
      }
      return null;
    },
    async getAgentOptions(){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + 'api/GetAgentOptionList')
      if (response.data.resultList){
        return response.data.resultList;
      }
      return null;
    },
    async getRfqNo(){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl + 'api/GetRfqNo')
      if (response.data.result){
        return response.data.result;
      }
      return null;
    },
    async getQuotationList(rfqNo){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      console.log('rfqNo 2', rfqNo);
      const response = await axios.get(constant.APIUrl + `api/GetQuotationList?rfqNo=${rfqNo}`);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getQuotationDetailList(quoNo){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetQuotationDetailList?quoNo=' + quoNo);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async getSalesWorkRecordList(rfqNo){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetSalesWorkRecordList?rfqNo=' + rfqNo);
      if (response.data.resultList) {
        return response.data.resultList
      }
      return null;
    },
    async saveRfq(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        rfqno:payload.rfqno,
        rfqdate:payload.rfqdate,
        sales:payload.sales.工號,
        company:payload.company,
        companyid:payload.companyid,
        contact:payload.contact,
        commission:payload.commission,
        ma:payload.ma,
        tel:payload.tel,
        position:payload.position,
        email:payload.email,
        country:payload.country,
        industrycode:payload.industrycode,
        industry:payload.industry,
        machine:payload.machine,
        enduser:payload.enduser,
        source:payload.source,
        status:payload.status.狀況,
        description:payload.description,
        quono:payload.quono,
        rfqstatus:payload.rfqstatus,
        agent:payload.agent.agent,
        ranking:payload.ranking.ranking,
        account:payload.account,
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveRfq', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async updateRfq(form) {
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('update payload',payload)
      const param = {
        rfqno: payload.rfqno ?? '',
        rfqdate: payload.rfqdate ?? '',
        sales: payload.sales.工號?payload.sales.工號 :payload.sales,
        company: payload.company ?? '',
        companyid:payload.companyid ?? 0,
        contact:payload.contact,
        commission:payload.commission,
        ma: payload.ma ?? '',
        tel: payload.tel ?? '',
        position: payload.position ?? '',
        email: payload.email ?? '',
        country: payload.country ?? '',
        industrycode: payload.industrycode ?? '',
        industry: payload.industry ?? '',
        machine: payload.machine ?? '',
        enduser: payload.enduser ?? '',
        source: payload.source ?? '',
        status: payload.status.狀況?payload.status.狀況 :payload.status,
        description: payload.description ?? '',
        quono: payload.quono ?? '',
        rfqstatus: payload.rfqstatus ?? '',
        agent: payload.agent?.agent ?? '',
        ranking: payload.ranking.ranking ? payload.ranking.ranking : payload.ranking,
        account: payload.account ?? ''
      };

      const response = await axios.post(
        constant.APIUrl + 'api/UpdateRfq',
        param   // ✅ 不要 stringify
      );

      return response;
    },
    async deleteRfq(form){
      console.log('delete form',form)
      const constant = Constant()
      const payload = { ...toRaw(form) };
      console.log('payload',payload)
      const response = await axios.get(constant.APIUrl+'api/DeleteRfq?rfqNo='+payload.rfqno)
      if (response){
        return response;
      }
      return null;
    },
    async getQuono(){
      const constant = Constant()
      const response = await  axios.get(constant.APIUrl+'api/GetQuono')
      if (response){
        return response.data.result;
      }
    },
    async getEqpType(){
      const constant = Constant()
      const response = await  axios.get(constant.APIUrl+'api/GetEqpType')
      if (response){
        return response.data.resultList;
      }
    }
    ,
    async getCurrencyList(){
      const constant = Constant()
      const response = await  axios.get(constant.APIUrl+'api/GetCurrencyList')
      if (response){
        return response.data.resultList;
      }
    },
    async getTaxRateList(){
      const constant = Constant()
      const response = await  axios.get(constant.APIUrl+'api/GetTaxRateList')
      if (response){
        return response.data.resultList;
      }
    },
    async getExRateList(val){
      const constant = Constant()
      const response = await  axios.get(constant.APIUrl+'api/GetExRateList?currency='+val)
      if (response){
        return response.data.resultList;
      }
    },
    async getTxConditionList(type){
      const constant = Constant()
      const response = await  axios.get(constant.APIUrl+'api/GetTxCondition?condition='+type)
      if (response){
        return response.data.resultList;
      }
    },
    async saveQuotation(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        idno		    :payload.idno,
        quono       :payload.quono,
        mtype       :payload.mtype.typeid?payload.mtype.typeid:payload.mtype,
        mmodel      :payload.mmodel,
        currency    :payload.currency.currency?payload.currency.currency:payload.currency,
        amount      :payload.amount,
        commission  :payload.commission,
        status      :payload.status,
        contact     :payload.contact,
        machineno   :payload.machineno,
        rfqno       :payload.rfqno,
        condate     :payload.condate,
        shipdate    :payload.shipdate,
        quodate     :payload.quodate,
        rfqdate     :payload.rfqdate,
        ranking     :payload.ranking.company?payload.ranking.company:payload.ranking,
        address     :payload.address,
        exrate      :payload.exrate.匯率?payload.exrate.匯率:payload.exrate,
        daddress    :payload.daddress.工號?payload.daddress.工號:payload.daddress,
        稅率        :payload.稅率,
        價格條件    :payload.價格條件.條文編號?payload.價格條件.條文編號:payload.價格條件,
        交貨方式    :payload.交貨方式.條文編號?payload.交貨方式.條文編號:payload.交貨方式,
        付款方式    :payload.付款方式.條文編號?payload.付款方式.條文編號:payload.付款方式,
        remark      :payload.remark,
        交貨日期    :payload.交貨日期.條文編號?payload.交貨日期.條文編號:payload.交貨日期,
        建檔        :payload.建檔,
        修改        :payload.修改,
        核准        :payload.核准,
        建檔日      :payload.建檔日,
        修改日      :payload.修改日,
        核准日      :payload.核准日,
        quotationDetailFormList:payload.quotationDetailFormList,
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveQuotation', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async updateQuotation(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        idno		    :payload.idno,
        quono       :payload.quono,
        mtype       :payload.mtype.typeid?payload.mtype.typeid:payload.mtype,
        mmodel      :payload.mmodel,
        currency    :payload.currency.currency?payload.currency.currency:payload.currency,
        amount      :payload.amount,
        commission  :payload.commission,
        status      :payload.status,
        contact     :payload.contact,
        machineno   :payload.machineno,
        rfqno       :payload.rfqno,
        condate     :payload.condate,
        shipdate    :payload.shipdate,
        quodate     :payload.quodate,
        rfqdate     :payload.rfqdate,
        ranking     :payload.ranking?.company?payload.ranking?.company:payload.ranking,
        address     :payload.address,
        exrate      :payload.exrate.匯率?payload.exrate.匯率:payload.exrate,
        daddress    :payload.daddress.工號?payload.daddress.工號:payload.daddress,
        價格條件    :payload.價格條件.條文編號?payload.價格條件.條文編號:payload.價格條件,
        交貨方式    :payload.交貨方式.條文編號?payload.交貨方式.條文編號:payload.交貨方式,
        付款方式    :payload.付款方式.條文編號?payload.付款方式.條文編號:payload.付款方式,
        remark      :payload.remark,
        交貨日期    :payload.交貨日期.條文編號?payload.交貨日期.條文編號:payload.交貨日期,
        稅率        :payload.稅率,
        建檔        :payload.建檔,
        修改        :payload.修改,
        核准        :payload.核准,
        建檔日      :payload.建檔日,
        修改日      :payload.修改日,
        核准日      :payload.核准日,
        quotationDetailFormList:payload.quotationDetailFormList,
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateQuotation', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async deleteQuotation(form){
      console.log('delete form',form)
      const constant = Constant()
      const payload = { ...toRaw(form) };
      console.log('payload',payload)
      const response = await axios.get(constant.APIUrl+'api/DeleteQuotation?quono='+payload.quono)
      if (response){
        return response;
      }
      return null;
    },
    async getQuotationByNo(quono){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl+'api/GetQuotation?quono='+quono)
      console.log('response', response)
      if (response){
        return response.data.result;
      }
      return null;
    },
    async getQuotationByRfqNo(rfqno){
      const constant = Constant()
      const response = await axios.get(constant.APIUrl+'api/GetQuotationByRfqNo?rfqno='+rfqno)
      console.log('response', response)
      if (response){
        return response.data.result;
      }
      return null;
    },
    async updateExpiryFlag(quono, account, type){
        const constant = Constant()
        const response =await axios.get(constant.APIUrl+'api/UpdateQuotationExpiry?quono='+quono+'&type='+type+'&account='+account)
        console.log('response', response)
        if (response){
          return response.data.result;
        }
        return null;
    },
    async getRfq(rfqno){
      const constant = Constant()
        const response =await axios.get(constant.APIUrl+'api/GetRfq?rfqno='+rfqno)
        console.log('response', response)
        if (response){
          return response.data.result;
        }
        return null;
    },
    async getCompany(company){
      const constant = Constant()
        const response =await axios.get(constant.APIUrl+'api/GetCompany?company='+company)
        console.log('response', response)
        if (response){
          return response.data.result;
        }
        return null;
    },
    async transferToSalesOrder(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        idno		    :payload.idno,
        quono       :payload.quono,
        mtype       :payload.mtype.typeid?payload.mtype.typeid:payload.mtype,
        mmodel      :payload.mmodel,
        currency    :payload.currency.currency?payload.currency.currency:payload.currency,
        amount      :payload.amount,
        commission  :payload.commission,
        status      :payload.status,
        contact     :payload.contact,
        machineno   :payload.machineno,
        rfqno       :payload.rfqno,
        condate     :payload.condate,
        shipdate    :payload.shipdate,
        quodate     :payload.quodate,
        rfqdate     :payload.rfqdate,
        ranking     :payload.ranking.company?payload.ranking.company:payload.ranking,
        address     :payload.address,
        exrate      :payload.exrate.匯率?payload.exrate.匯率:payload.exrate,
        daddress    :payload.daddress.工號?payload.daddress.工號:payload.daddress,
        稅率        :payload.稅率,
        價格條件    :payload.價格條件.條文編號?payload.價格條件.條文編號:payload.價格條件,
        交貨方式    :payload.交貨方式.條文編號?payload.交貨方式.條文編號:payload.交貨方式,
        付款方式    :payload.付款方式.條文編號?payload.付款方式.條文編號:payload.付款方式,
        remark      :payload.remark,
        交貨日期    :payload.交貨日期.條文編號?payload.交貨日期.條文編號:payload.交貨日期,
        建檔        :payload.建檔,
        修改        :payload.修改,
        核准        :payload.核准,
        建檔日      :payload.建檔日,
        修改日      :payload.修改日,
        核准日      :payload.核准日,
        quotationDetailFormList:payload.quotationDetailFormList,
      };
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/TransferToSalesOrder', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getSalesOrderList(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetSalesOrderList')
      console.log('response', response)
      if (response){
        return response.data.resultList;
      }
      return null;
    },
    async getCustNumberList(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetCustNumberList')
      console.log('response', response)
      if (response){
        return response.data.resultList;
      }
      return null;
    },
    async updateCloseFlag(flag, salesOrderNo){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/UpdateSalesOrderCloseFlag?flag='+flag+'&orderNo='+salesOrderNo)
      console.log('response', response)
      if (response){
        return response;
      }
      return null;
    },
    async saveSalesOrder(form){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
              account:payload.account,
              識別:payload.識別,
              日期:payload.日期,
              單號:payload.單號,
              客戶編號:payload.客戶編號,
              業務員:payload.業務員,
              幣別:payload.幣別,
              稅別:payload.稅別,
              稅率:payload.稅率,
              總額:payload.總額,
              佣金:payload.佣金,
              // 結案:payload.,
              要望日期:payload.要望日期,
              交貨地址:payload.交貨地址,
              指配國別:payload.指配國別,
              目的港:payload.目的港,
              價格條件:payload.價格條件,
              交貨方式:payload.交貨方式,
              付款方式:payload.付款方式,
              交貨日期:payload.交貨日期,
              machineno:payload.mtype,
              remark:payload.remark,
              建檔:payload.account,
              修改:payload.修改,
              核准:payload.核准,
              建檔日:payload.建檔日,
              修改日:payload.修改日,
              核准日:payload.核准日,
              orderListDetail:payload.orderListDetail,
              arListDetail:payload.arListDetail,
            }
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveSalesOrder', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async updateSalesOrderForm (form) {
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
              識別:payload.識別,
              日期:payload.日期,
              單號:payload.單號,
              客戶編號:payload.客戶編號,
              業務員:payload.業務員,
              幣別:payload.幣別,
              稅別:payload.稅別,
              稅率:payload.稅率,
              總額:payload.總額,
              佣金:payload.佣金,
              // 結案:payload.,
              要望日期:payload.要望日期,
              交貨地址:payload.交貨地址,
              指配國別:payload.指配國別,
              目的港:payload.目的港,
              價格條件:payload.價格條件,
              交貨方式:payload.交貨方式,
              付款方式:payload.付款方式,
              交貨日期:payload.交貨日期,
              machineno:payload.mtype,
              remark:payload.remark,
              建檔:payload.建檔,
              修改:payload.account,
              核准:payload.核准,
              建檔日:payload.建檔日,
              修改日:payload.修改日,
              核准日:payload.核准日,
              orderListDetail:payload.orderListDetail,
              arListDetail:payload.arListDetail,
            }
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateSalesOrder', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getSalesNo(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetSalesOrderNo')
      console.log('response', response)
      if (response){
        return response.data.result;
      }
      return null;
    },
    async deleteSalesOrder (salesOrderNo) {
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/DeleteSalesOrderNo?salesOrderNo='+salesOrderNo)
      console.log('response', response)
      if (response){
        return response;
      }
      return null;
    },
    async getTaxType(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetTaxType')
      console.log('response', response)
      if (response){
        return response.data.resultList;
      }
      return null;
    },
    async getInstallmentType(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetInstallmentType')
      console.log('response', response)
      if (response){
        return response.data.resultList;
      }
      return null;
    },
    async getBankInfo(account){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetBankInfo?bankAccount='+account);
      console.log('response', response)
      if (response){
        return response.data.result;
      }
      return null;
    },
    async getQuotationDistributionList(custNo, orderDate){
      console.log('custNo', custNo, 'orderDate', orderDate)
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetQuotationDistributionList?custNo='+custNo+"&orderDate="+orderDate);
      console.log('response', response)
      if (response){
        return response.data.resultList;
      }
      return null;
    },
    async transferToShipOrder (form){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
              account:payload.account,
              識別:payload.識別,
              日期:payload.日期,
              單號:payload.單號,
              客戶編號:payload.客戶編號,
              業務員:payload.業務員,
              幣別:payload.幣別,
              稅別:payload.稅別,
              稅率:payload.稅率,
              總額:payload.總額,
              佣金:payload.佣金,
              // 結案:payload.,
              要望日期:payload.要望日期,
              交貨地址:payload.交貨地址,
              指配國別:payload.指配國別,
              目的港:payload.目的港,
              價格條件:payload.價格條件,
              交貨方式:payload.交貨方式,
              付款方式:payload.付款方式,
              交貨日期:payload.交貨日期,
              machineno:payload.mtype,
              remark:payload.remark,
              建檔:payload.建檔,
              修改:payload.修改,
              核准:payload.核准,
              建檔日:payload.建檔日,
              修改日:payload.修改日,
              核准日:payload.核准日,
              orderListDetail:payload.orderListDetail,
              arListDetail:payload.arListDetail,
            }
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/TransferToShipOrder', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getShipOrderList(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetShippingOrderList')
      console.log('response', response)
      if (response){
        return response.data.resultList;
      }
      return null;
    },
    async getWarehouseList(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetWarehouseList')
      console.log('response', response)
      if (response){
        return response.data.resultList;
      }
      return null;
    },
    async updateShipOrder(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        識別:payload.識別,
        日期:payload.日期,
        單號:payload.單號,
        客戶編號:payload.客戶編號,
        業務員:payload.業務員,
        幣別:payload.幣別,
        匯率:payload.匯率,
        稅別:payload.稅別,
        稅率:payload.稅率,
        佣金:payload.佣金,
        原定交貨日期:payload.原定交貨日期,
        交貨地址:payload.交貨地址,
        指配國別:payload.指配國別,
        目的港:payload.目的港,
        價格條件:payload.價格條件,
        交貨方式:payload.交貨方式,
        付款方式:payload.付款方式,
        remark:payload.remark,
        總額:payload.總額,
        收款帳號:payload.收款帳號,
        shipOrderLists:payload.shipOrderLists,
      }
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateShippingOrder', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async saveShipOrder(form){
      const constant = Constant();
      const payload = { ...toRaw(form.value) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const param = {
        識別:parseInt(payload.識別),
        日期:payload.日期,
        單號:payload.單號,
        客戶編號:payload.客戶編號,
        業務員:payload.業務員,
        幣別:payload.幣別,
        匯率:payload.匯率,
        稅別:payload.稅別,
        稅率:payload.稅率,
        佣金:payload.佣金,
        原定交貨日期:payload.原定交貨日期,
        交貨地址:payload.交貨地址,
        指配國別:payload.指配國別,
        目的港:payload.目的港,
        價格條件:payload.價格條件,
        交貨方式:payload.交貨方式,
        付款方式:payload.付款方式,
        remark:payload.remark,
        總額:payload.總額,
        收款帳號:payload.收款帳號,
        建檔:payload.建檔,
        修改:payload.修改,
        shipOrderLists:payload.shipOrderLists,
      }
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/SaveShippingOrder', param, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    async getShippingOrderNo(){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetShippingOrderNo')
      console.log('response', response)
      if (response){
        return response.data.result;
      }
      return null;
    },
    async deleteShippingOrder(form){
      console.log('delete form',form)
      const constant = Constant()
      const payload = { ...toRaw(form) };
      console.log('payload',payload)
      const response = await axios.get(constant.APIUrl+'api/DeleteShippingOrder?shippingOrderNo='+payload.單號)
      if (response){
        return response;
      }
      return null;
    },
    async getQuotationListByCustid(custid){
      const constant = Constant();
      console.log('APIUrl', constant.APIUrl)
      const response =await axios.get(constant.APIUrl+'api/GetQuotationListByCustid?custid='+custid)
      console.log('response', response)
      if (response){
        return response.data.resultList;
      }
      return null;
    },
    async getRfqListByCust(custid){
      const constant = Constant()
      const response =await axios.get(constant.APIUrl+'api/GetRfqListByCust?custid='+custid)
      console.log('response', response)
      if (response){
        return response.data.resultList;
      }
      return null;
    },
    async transferReceivable(form){
      const constant = Constant();
      const payload = { ...toRaw(form) };
      console.log('APIUrl', constant.APIUrl)
      console.log('payload', payload);
      const response = await axios.post(constant.APIUrl + 'api/TransferReceivable', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
  }
})
