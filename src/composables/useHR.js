import { defineStore } from "pinia";
import { Constant } from "./Constant";
import apiClient from '@/apis/apiClient'

export const useHRStore = defineStore('hr', {
  state: () => ({
    itemId: '',}),
  actions: {
    async getEmployeeByAccount(account) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/EmployeeByAccount?account=' + account)
      console.log('response', response)
      if (response.data.result) {
        return response.data.result
      }
      return {};
    },
    async saveUpdateJournal(journalData) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.post(constant.APIUrl + 'api/SaveUpdateJournal', journalData)
      console.log('response', response)
      if (response) {
        return response
      }
      return null;
    },
    async getJournalByNo(journalNo) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await apiClient.get(constant.APIUrl + 'api/JournalByNo?journalNo=' + journalNo)
      console.log('response', response)
      if (response.data.result) {
        return response.data.result
      }
      return null;
    },
  }
});
