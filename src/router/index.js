import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../views/Login.vue'
import DashboardComponent from '@/views/DashboardView.vue'
import ReportPage from '@/views/ReportView.vue'
import SettingPage from '@/views/SystemSettingsView.vue'
import MainLayout from '@/views/MainLayout.vue'
import UserManagementView from '@/views/UserManagementView.vue'
const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginComponent
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'report', component: ReportPage },
      { path: 'setting', component: SettingPage },
      //系統設定
      { path: 'setting/user', component: UserManagementView },//使用者管理
      { path: 'setting/role', component: () => import('@/views/RoleManagementView.vue') },//角色權限
      { path: 'setting/userrole', component: () => import('@/views/UserRole.vue') },//使用者角色
      //進銷存貨
      { path: 'inventory/items', component: () => import('@/views/Inventory/ItemView.vue') },//品項維護
      { path: 'inventory/soldout', component: () => import('@/views/Inventory/SoldOutView.vue') },//銷貨出庫
      { path: 'inventory/stockin', component: () => import('@/views/Inventory/StockInView.vue') },//進貨入庫
      { path: 'inventory/transfer', component: () => import('@/views/Inventory/TransferView.vue') },//庫存移轉
      { path: 'inventory/costcarryforward', component: () => import('@/views/Inventory/CostCarryForwardView.vue') },//成本結轉
      //採購供應
      { path: 'procurement/supplier', component: () => import('@/views/Procurement/SupplierView.vue') },//供應商管理
      { path: 'procurement/quotation', component: () => import('@/views/Procurement/QuotationView.vue') },//廠商詢價
      { path: 'procurement/purchase', component: () => import('@/views/Procurement/PurchaseView.vue') },//採購作業
      { path: 'procurement/outsourcing', component: () => import('@/views/Procurement/OutsourcingView.vue') },//委外加工
      { path: 'procurement/invoicewoff', component: () => import('@/views/Procurement/InvoiceWoffView.vue') },//付款作業
      //客戶維護
      { path: 'custmanagement/customer', component: () => import('@/views/CustManagement/CustomerView.vue') },//客戶資料維護
      { path: 'custmanagement/salesrecord', component: () => import('@/views/CustManagement/SalesRecordView.vue') },//業務記錄
      { path: 'custmanagement/projquotation', component: () => import('@/views/CustManagement/ProjectQuotationView.vue') },//專案報價
      { path: 'custmanagement/ordercontract', component: () => import('@/views/CustManagement/OrderContractView.vue') },//訂單合約
      { path: 'custmanagement/repairtest', component: () => import('@/views/CustManagement/RepairTestView.vue') },//維修測試
      //應收應付
      { path: 'accounts/receivable', component: () => import('@/views/Accounts/AccountsReceivableView.vue') },
      { path: 'accounts/otherincome', component: () => import('@/views/Accounts/OtherIncomeView.vue') },
      // 404 → 回首頁
      { path: '/:catchAll(.*)*', redirect: '/' },
      // { path: 'product', component: () => import('@/views/ProductView.vue') }
    ]
  },
  {
    path: '/:pathMatch(.*)*', // 捕捉所有未知路由
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
