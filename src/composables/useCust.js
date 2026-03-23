import { defineStore } from 'pinia';
import { custActions } from './cust/actions'
export const useCustStore = defineStore('',  {
  actions:{
    ...custActions,
  }
})
