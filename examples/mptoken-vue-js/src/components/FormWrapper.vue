<script setup lang="ts">
import { loadMulpay, MultiPayment } from "@mul-pay/mptoken-js";
import PaymentCardForm from "./PaymentCardForm.vue";  
import { ref } from "vue";

let multiPayment = ref<MultiPayment | null>(null);
// VITE_MULPAY_API_KEY(MPクレカトークンのAPIキー), VITE_MULPAY_PUB_KEY(MPクレカトークンの公開鍵)を.envファイルに設定してください
const apiKey = import.meta.env.VITE_MULPAY_API_KEY || '';
const pubKey = import.meta.env.VITE_MULPAY_PUB_KEY || '';

const mulpayPromise = await loadMulpay(apiKey, pubKey);

if (mulpayPromise) {
  multiPayment.value = mulpayPromise;
}
</script>
<template>
  <Elements :multiPayment="multiPayment">
    <PaymentCardForm />
  </Elements>
</template>
