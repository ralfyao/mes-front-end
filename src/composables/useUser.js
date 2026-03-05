import { defineStore } from 'pinia'
import axios from 'axios'
import { Constant } from './Constant'
import { toRaw } from "vue";
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
    async getUserRoles(account) {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.post(constant.APIUrl + 'api/GetMenuFuncByAccount?account='+account)
      if (response.data.errorMessage !== '') {
        return []
      } else {
        if (response.data.resultList) {
          console.log('resultList', response.data.resultList)
          return response.data.resultList
        }
      }
    },
    async getRoleList() {
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      const response = await axios.get(constant.APIUrl + 'api/GetAllPrivilege')
      if (response.data.errorMessage !== '') {
        return []
      } else {
        if (response.data.resultList) {
          console.log('resultList', response.data.resultList)
          return response.data.resultList
        }
      }
    },
    async changePassword(account, password){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      // console.log('user', user)
      const response = await axios.get(constant.APIUrl + 'api/UpdatePassword?account='+account+'&password='+password)
      if (response !== null) {
        return response;
      }
      return null;
    },
    async getPositionList(){
      const constant = Constant()
      console.log('APIUrl', constant.APIUrl)
      // console.log('user', user)
      const response = await axios.get(constant.APIUrl + 'api/PositionList')
      if (response !== null) {
        return response.data.resultList;
      }
      return null;
    },
    async updateUserAuthList(account, authPrivList){
      const constant = Constant();
      const payload = toRaw(authPrivList.value);
      console.log('APIUrl', constant.APIUrl)
      console.log('account', account)
      console.log('payload', payload);
      const param = payload.map(item=>({
        id:item.id,
        職務:account?.職務??'',
        高管:item.高管,
        核准:item.核准,
        編修:item.編修,
        報表:item.報表,
        輸出:item.輸出,
        職務代理效期:item.職務代理效期,
        機號:item.機號,
        註記:item.註記,
        menuID:item.menuID,
        menuSubID:item.menuSubID,
        menuSubUrl:'',
        menuSubName:'',
        createUser:'',
      }));
      console.log('param', param);
      const response = await axios.post(constant.APIUrl + 'api/UpdateUserAuth', JSON.stringify(param), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    logout () {
      this.username = ''
      this.password = ''
    }
  }
})
