import { defineStore } from "pinia";
import { Constant } from "./Constant";
import { axios } from "axios";

export const useItemStore = defineStore('item', {
  state: () => ({
    itemId: '',}),
  actions: {
    async getAllItems() {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/ItemList')
      console.log('response', response)
    }
  }
});
