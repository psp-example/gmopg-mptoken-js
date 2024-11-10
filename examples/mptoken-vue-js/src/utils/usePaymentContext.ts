// usePaymentContext.ts
import { MultiPaymentElements, MultiPayment } from "@mul-pay/mptoken-js";
import { getCurrentInstance } from "vue";

export const usePaymentContext = (): { elements: MultiPaymentElements | undefined, multiPayment: MultiPayment | undefined } => {
  const instance = getCurrentInstance();
  const elements = instance?.appContext.config.globalProperties.$useElements();
  const multiPayment = instance?.appContext.config.globalProperties.$useMultiPayment();
  return { elements, multiPayment };
}
