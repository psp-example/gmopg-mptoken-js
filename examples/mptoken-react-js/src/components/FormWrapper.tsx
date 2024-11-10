// FormWrapper.tsx
import { useEffect, useState } from 'react';
import { Elements } from '@mul-pay/mptoken-react-js';
import { MultiPayment } from '@mul-pay/mptoken-js';
import Card from './Card';
 
const apiKey = import.meta.env.VITE_MULPAY_API_KEY || '';
const pubKey = import.meta.env.VITE_MULPAY_PUB_KEY || '';

// const apiKey = '';
// const pubKey = import.meta.env.VITE_MULPAY_PUB_KEY || '';


console.log(`apiKey:${apiKey}`);
console.log(`pubKey:${pubKey}`);

const merchantIds = {
  googlePayMerchantId: '01234567890123456789',
};
 
export default function FormWrapper() {
  const [mulpayPromise, setMulpayPromise] = useState<Promise<MultiPayment | null> | null>(null);
 
  useEffect(() => {
    let isMounted = true;
 
    const loadMulpayModule = async () => {
      try {
        const { loadMulpay } = await import('@mul-pay/mptoken-js');
        if (isMounted) {
          const promise = loadMulpay(apiKey, pubKey, merchantIds, true, false);
          setMulpayPromise(promise);
        }
      } catch (error) {
        console.error('Failed to load mulpay module', error);
      }
    };
 
    loadMulpayModule();
 
    return () => {
      isMounted = false;
    };
  }, []);
 
  return (
    <Elements multiPayment={mulpayPromise}>
      <Card />
    </Elements>
  );
}
