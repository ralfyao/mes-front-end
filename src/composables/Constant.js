import { defineStore } from 'pinia';
export const Constant = defineStore('constant', {
    state:() =>({
        APIUrl:'http://localhost:5000/'
    })});