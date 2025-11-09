import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../views/Login.vue'
import DashboardComponent from '@/views/DashboardView.vue'
import ReportPage from '@/views/ReportView.vue'
import SettingPage from '@/views/SystemSettingsView.vue'
import MainLayout from '@/views/MainLayout.vue'
const routes = [
  { 
    path: '/login',
    name: 'login',
    component:LoginComponent
  },
  {
    path:'/',
    component:MainLayout,
    children:[
      { path: 'dashboard', component: DashboardComponent },
      { path: 'report', component: ReportPage },
      { path: 'setting', component: SettingPage }
    ]
  },
  {
    path:'/:pathMatch(.*)*',//捕捉所有未知路由
    redirect:'/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
