<template>
  <div class="top">
    <h1>MpToken.js Vueのサンプルコード</h1>
  </div>
  <div class="payment-container">
    <div class="card-form">
      <h2>カード情報</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="cardNumber">カード番号</label>
          <div id="cardNumber" class="input-wrapper">
            <CardNumberElement
              :onBlur="() => logEvent('blur')"
              :onChange="() => logEvent('change')"
              :onFocus="() => logEvent('focus')"
              :onReady="() => logEvent('ready')"
              :options="{ style: styleObject }"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="cardExpiry">有効期限</label>
            <div id="cardExpiry" class="input-wrapper">
              <CardExpiryElement
                :onBlur="() => logEvent('blur')"
                :onChange="() => logEvent('change')"
                :onFocus="() => logEvent('focus')"
                :onReady="() => logEvent('ready')"
                :options="{ style: styleObject }"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="cardCvc">セキュリティコード</label>
            <div id="cardCvc" class="input-wrapper">
              <CardCvcElement
                :onBlur="() => logEvent('blur')"
                :onChange="() => logEvent('change')"
                :onFocus="() => logEvent('focus')"
                :onReady="() => logEvent('ready')"
                :options="{ style: cvcInputStyle, placeholder: '123' }"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <!-- カード名義人はElementsで提供しないため自前で設定する -->
          <label for="cardholderName">カード名義人</label>
          <div class="input-wrapper">
            <input
            id="cardholderName"
            v-model="cardholderName"
            type="text"
            placeholder="カード名義人を入力してください"
            />
          </div>
        </div>


        <button class="button-class" type="submit">トークンを取得する</button>
      </form>
    </div>

    <div class="transaction-history">
      <h3>トークン取得履歴</h3>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="timestamp">日時</th>
              <th class="status">結果</th>
              <th class="details">詳細</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(transaction, index) in transactions" :key="index">
              <td class="timestamp">{{ transaction.timestamp }}</td>
              <td class="status" :class="transaction.status">{{ transaction.status }}</td>
              <td class="details">
                <div class="details-content">{{ transaction.details }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { usePaymentContext } from "../utils/usePaymentContext";
import { ErrorResponse, TokenObj,  } from "@mul-pay/mptoken-js";

/**
 * mptoken-jsのiframe部分のスタイルを設定するオブジェクト
 */
const styleObject = {
  base: {
    fontFamily: "'Noto Sans Japanese', sans-serif",
    "::placeholder": {
      color: "rgba(0, 0, 0, 0.54)",
    },
    caretColor: "#198FCC",
    lineHeight: "28px",
  },
  invalid: {
    color: "rgba(0, 0, 0, 0.87)",
  },
};
const cvcInputStyle = {
  base: {
    fontFamily: '\'Noto Sans Japanese\', sans-serif',
    '::placeholder': {
      color: 'rgba(0, 0, 0, 0.54)',
    },
    color:'#660',
    caretColor: '#FF8FCC',
  },
  invalid: {
    color: 'rgba(0, 0, 0, 0.87)',
  }
};
// トークン発行時のオプション
// tokenNumber: トークンの発行数を1~10の範囲で指定
const cardOptions = ref({
  tokenNumber: "1",
});

// usePaymentContextからelementsとmultiPaymentを取得
const { elements, multiPayment } = usePaymentContext();
const result = ref<TokenObj | null>(null);
const errorMessage = ref<ErrorResponse | null>(null);
const transactions = ref<Array<{ timestamp: string; status: string; details: string }>>([]);
const cardholderName = ref("");

const logEvent = (name: string) => (event: Event) => {
  console.log(`[${name}]`, event);
};

/**
 * トークン発行処理を実行する
 * @param event 
 */
const handleSubmit = async (event: Event) => {
  event.preventDefault();
  if (!multiPayment || !elements) {
    return;
  }

  const cardNumberElement = elements.getElement("cardNumber");
  if (cardNumberElement === null) return;

  const tokenResponse = await multiPayment.getTokenThroughIframe(
    cardNumberElement,
    cardholderName.value,  // カード名義人の値を渡す
    cardOptions.value
  );

  const timestamp = new Date().toLocaleString();
  if (tokenResponse.result === "success") {
    result.value = (tokenResponse as TokenObj);
    errorMessage.value = null;
    transactions.value.unshift({
      timestamp,
      status: "success",
      details: `カード名義人: ${cardholderName.value}, ${JSON.stringify(tokenResponse as TokenObj)}`
    });
  } else {
    errorMessage.value = (tokenResponse as ErrorResponse);
    transactions.value.unshift({
      timestamp,
      status: "error",
      details: JSON.stringify(tokenResponse as ErrorResponse)
    });
  }
};

</script>
<style scoped>
h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
}
.top{
  max-width: 1600px;
  margin: 2rem auto;
  margin-left: 6rem;
  text-align: left;
}
.payment-container {
  max-width: 1600px;
  margin: 2rem auto;
  margin-left: 6rem;
  gap: 2rem;
}

.card-form {
  max-width: 400px;
  max-height: 600px;
  margin-bottom: 3rem;
  flex: 1 1 300px;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.transaction-history {
  flex: 1 1 300px;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2, h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #555;
}

.input-wrapper {
  height: 1rem;
  min-height: 1rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input[type="text"] {
  z-index: 5;
  position: relative;
  width: 100%;
  height: auto;
  width: 100%;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
}

.button-class {
  z-index: 10;
  position: relative;
}

.input-wrapper:focus-within {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

button {
  z-index: 5;
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1.5rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3a7bc8;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

th {
  background-color: #f8f8f8;
  font-weight: bold;
}

.timestamp {
  width: 25%;
}

.status {
  width: 15%;
}

.details {
  width: 60%;
}

.details-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.success {
  color: #2e7d32;
}

.error {
  color: #d32f2f;
}
</style>
