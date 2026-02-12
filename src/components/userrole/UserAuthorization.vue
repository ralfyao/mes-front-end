<template>
  <q-card class="q-pa-md"  style="width: 1500px; max-width: 80vw;" >
    <q-card-section>
      <div class="text-h4">編輯使用者授權代理</div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-1 col-md-1" style="max-width: 100px">
          帳號：admin
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          職務：業務
        </div>
        <div class="col-2 col-md-2" style="max-width: 200px">
          <q-btn glossy color="red">新增授權</q-btn>
        </div>
      </div>
      <br>
      <div class="row q-col-gutter-md">

        <div class="col-1 col-md-1" style="max-width: 100px">
          授權表單：<select>
                    <option>報價單</option>
                   </select>
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          高管<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          核准<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          編修<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          列印<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          輸出<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          查詢<input type="checkbox">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          註記<input type="text">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          代理截止<input type="date">
        </div>
        <div class="col-1 col-md-1" style="max-width: 100px">
          機號<input type="text">
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="取消" color="negative" @click="close" />
      <q-btn label="送出" color="primary" />
    </q-card-actions>
  </q-card>
</template>
<script setup>
import {QCard, QCardSection, QBtn, QCardActions} from 'quasar'
</script>
