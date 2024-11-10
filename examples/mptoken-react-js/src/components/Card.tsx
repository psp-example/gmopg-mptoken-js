// Card.tsx
import { useState } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useMultiPayment,
} from "@mul-pay/mptoken-react-js";
import {
  ErrorResponse,
  MultiPaymentEventType,
  TokenObj,
  TokenResponse,
} from "@mul-pay/mptoken-js";
 
const styleObject = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#aab7c4",
      },
      padding: "12px",
    },
    invalid: {
      color: "#fa755a",
    },
  },
};
 
const styles = `
  .container {
    width: 1024px;
    min-height: 100vh;
    background-color: #f3f4f6;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
 
  .card-wrapper {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    padding: 0 1rem;
    box-sizing: border-box;
  }
 
  .card {
    background-color: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    width: 100%;
    box-sizing: border-box;
  }
 
  .form-container {
    width: 100%;
  }
 
  .form-section {
    width: 100%;
  }
 
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }
 
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
 
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
  }
 
  @media (max-width: 480px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
 
  .label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }
 
  .input-wrapper {
    width: 100%;
    margin-top: 0.25rem;
  }
 
  .input-field {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: white;
    box-sizing: border-box;
  }
 
  .input-field:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
 
  .text-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    box-sizing: border-box;
  }
 
  .text-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
 
  .error-message {
    width: 100%;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0.375rem;
    background-color: #fef2f2;
    box-sizing: border-box;
  }
 
  .error-text {
    font-size: 0.875rem;
    color: #dc2626;
    word-break: break-all;
  }
 
  .submit-button {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0.875rem 1.5rem;
    border: none;
    border-radius: 0.375rem;
    background-color: #4f46e5;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
 
  .submit-button:hover:not(:disabled) {
    background-color: #4338ca;
  }
 
  .submit-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }
 
  .submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
 
  .token-display {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    width: 100%;
    box-sizing: border-box;
  }
 
  .token-text {
    font-size: 0.75rem;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }
 
  * {
    box-sizing: border-box;
  }
`;
 
const Card = () => {
  const elements = useElements();
  const mulpay = useMultiPayment();
  const [cardHolderName, setCardHolderName] = useState<string>("");
  const [tokenObject, setTokenObject] = useState<TokenObj | null>(null);
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cardNumberError, setCardNumberError] = useState<boolean>(false);
  const [expiryError, setExpiryError] = useState<boolean>(false);
  const [cvcError, setCvcError] = useState<boolean>(false);
 
  const handleSubmit = () => {
    if (!mulpay || !elements) return;
    const cardElement = elements.getElement("cardNumber");
    if (cardElement === null) return;
 
    setLoading(true);
    const options = { tokenNumber: "2" };
 
    mulpay
      .getTokenThroughIframe(cardElement, cardHolderName, options)
      .then((tokenResponse: TokenResponse) => {
        if (tokenResponse.result === "success") {
          setErrorResponse(null)
          setTokenObject(tokenResponse as TokenObj);
        } else {
          setErrorResponse(tokenResponse as ErrorResponse);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
 
  interface PaymentEvent {
    elementType: 'cardNumber' | 'cardExpiry' | 'cardCvc';
    invalid?: boolean;
  }
  
  const logEvent = (name: MultiPaymentEventType) => (event: PaymentEvent) => {
    // console.log(`[${name}]`, JSON.stringify(event));
    console.log(`[${name}]`);

    if (name !== "change") return;
    console.log(`[${name}]`, JSON.stringify(event, null, 2));
  
    const errorHandlers = {
      cardNumber: setCardNumberError,
      cardExpiry: setExpiryError,
      cardCvc: setCvcError,
    };
  
    const setError = errorHandlers[event.elementType];
    if (setError) {
      setError(event.invalid ?? false);
    }
  };
 
  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="card-wrapper">
          <div className="card">
            <div className="form-container">
              <div className="form-section">
                <form className="form">
                  <div className="form-group">
                    <label className="label" htmlFor="cardNumber">
                      カード番号
                    </label>
                    <div className="input-wrapper">
                      <div className="input-field">
                        <CardNumberElement
                          id="cardNumber"
                          onBlur={logEvent("blur")}
                          onChange={logEvent("change")}
                          onFocus={logEvent("focus")}
                          options={styleObject}
                        />
                      </div>
                    </div>
                  </div>
 
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label" htmlFor="expiry">
                        有効期限
                      </label>
                      <div className="input-wrapper">
                        <div className="input-field">
                          <CardExpiryElement
                            id="expiry"
                            onBlur={logEvent("blur")}
                            onChange={logEvent("change")}
                            onFocus={logEvent("focus")}
                            onReady={logEvent("ready")}
                            options={styleObject}
                          />
                        </div>
                      </div>
                    </div>
 
                    <div className="form-group">
                      <label className="label" htmlFor="cvc">
                        セキュリティコード
                      </label>
                      <div className="input-wrapper">
                        <div className="input-field">
                          <CardCvcElement
                            id="cvc"
                            onBlur={logEvent("blur")}
                            onChange={logEvent("change")}
                            onFocus={logEvent("focus")}
                            onReady={logEvent("ready")}
                            options={styleObject}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
 
                  <div className="form-group">
                    <label className="label" htmlFor="cardHolderName">
                      カード名義
                    </label>
                    <input
                      id="cardHolderName"
                      required
                      placeholder="TARO YAMADA"
                      value={cardHolderName}
                      onChange={(e) => setCardHolderName(e.target.value)}
                      className="text-input"
                    />
                  </div>
 
                  {errorResponse && (
                    <div className="error-message">
                      <div className="error-text">
                        {JSON.stringify(errorResponse, null, 2)}
                      </div>
                    </div>
                  )}
 
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!mulpay || loading}
                    className="submit-button"
                  >
                    {loading ? "処理中..." : "支払う"}
                  </button>
                  {/* setCardNumberErrorである場合はメッセージを表示する */}
                  {cardNumberError && (
                    <div className="error-message">
                      <div className="error-text">
                        カード番号が正しくありません
                      </div>
                    </div>
                  )}
                  {/* setExpiryErrorである場合はメッセージを表示する */}
                  {expiryError && (
                    <div className="error-message">
                      <div className="error-text">
                        有効期限が正しくありません
                      </div>
                    </div>
                  )}
                  {/* setCvcErrorである場合はメッセージを表示する */}
                  {cvcError && (
                    <div className="error-message">
                      <div className="error-text">
                        セキュリティコードが正しくありません
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
 
            {tokenObject && (
              <div className="token-display">
                <pre className="token-text">
                  {JSON.stringify(tokenObject, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
 
export default Card;
