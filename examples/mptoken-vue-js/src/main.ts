// main.ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueMultiPayment from '@mul-pay/mptoken-vue-js';

const app = createApp(App)
app.use(VueMultiPayment);
app.mount('#app');
