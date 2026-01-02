<template>
    <q-layout class="q-pa-md padding  q-gutter-sm">
        <h5 class="text-left">
            <q-icon name="play_circle" size="30px" >產品設定</q-icon>
        </h5>
        <q-page-container>
          <q-page>
            <q-tabs
                v-model="tab" animated
                class="text-primary"
                dense
                align="left"
                indicator-color="primary">
                <q-tab name="productInfo" label="產品列表">
                </q-tab>
                <q-tab name="productGroupInfo" label="產品群組列表">
                </q-tab>
                <q-tab name="ProductGroupAttribute" label="產品規格">
                </q-tab>
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="productInfo">
                <ProductMaintain />
              </q-tab-panel>
              <q-tab-panel name="productGroupInfo">
                <ProductGroupMaintain/>
              </q-tab-panel>
              <q-tab-panel name="ProductGroupAttribute">
                <ProductSpecMaintain/>
              </q-tab-panel>
          </q-tab-panels>
          </q-page>
        </q-page-container>

    </q-layout>
</template>
<script setup>
import {
    QIcon
  , QPage
  , QPageContainer
  , QLayout
  , QTabs
  , QTab
  , QTabPanels
  , QTabPanel
  , QSeparator
} from 'quasar'
import { ref } from 'vue'
import ProductMaintain from '@/components/product/ProductMaintain.vue'
import ProductSpecMaintain from '@/components/product/ProductSpecMaintain.vue';
import ProductGroupMaintain from '@/components/product/ProductGroupMaintain.vue';
const tab = ref('productInfo') // 預設顯示第一個 tab
</script>
