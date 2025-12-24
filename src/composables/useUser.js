import { defineStore } from 'pinia'
import axios from 'axios'
import { Constant } from './Constant'
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    username: '',
    password: '',
    lastModifier: ''
  }),
  actions: {
    login (name, pass) {
      this.username = name
      this.password = pass
    },
    async getUser (item) {
      console.log('item', item)
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.post(constant.APIUrl + 'api/GetUser', item)
      if (response.data.result) {
        return response.data.result
      }
      return null
    },
    async loginUser () {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.post(constant.APIUrl + 'api/Login', {
        name: '',
        username: this.username,
        password: this.password,
        lastModifier: ''
      })
      if (response.data.errorMessage !== '') {
        return response.data.errorMessage
      } else {
        return ''
      }
    },
    async getAllUsers () {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetAllUsers')
      console.log('response', response)
      if (response.data.errorMessage !== '') {
        return []
      } else {
        if (response.data.resultList) {
          console.log('resultList', response.data.resultList)
          return response.data.resultList
        }
      }
    },
    async addUser (user) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      console.log('user', user)
      const response = await axios.post(constant.APIUrl + 'api/AddUser', user)
      if (response.data.errorMessage !== '') {
        return response.data.errorMessage
      } else {
        return 'OK'
      }
    },
    async updateUser (user) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      console.log('user', user)
      const response = await axios.post(constant.APIUrl + 'api/UpdateUser', user)
      if (response.data.errorMessage !== '') {
        return response.data.errorMessage
      } else {
        return 'OK'
      }
    },
    async delUser (user) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      console.log('user', user)
      const response = await axios.post(constant.APIUrl + 'api/DeleteUser', user)
      if (response.data.errorMessage !== '') {
        return response.data.errorMessage
      } else {
        return 'OK'
      }
    },
    async getUserRoles() {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.post(constant.APIUrl + 'api/GetUserRoles')
      if (response.data.errorMessage !== '') {
        return []
      } else {
        if (response.data.resultList) {
          console.log('resultList', response.data.resultList)
          return response.data.resultList
        }
      }
    },
    logout () {
      this.username = ''
      this.password = ''
    }
  }
})
