import { defineStore } from 'pinia'
const debug = true;
export const Constant = defineStore('constant', {
  state: () => ({
    // APIUrl: 'http://localhost:8080/'
    APIUrl: debug?'http://localhost:5064/':'http://localhost:8080/',
  })
})
