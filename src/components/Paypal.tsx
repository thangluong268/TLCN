import React from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
interface PaypalProps {
  amount: number;
  callback: () => void;
}
function Paypal(props: PaypalProps) {
  const { amount, callback } = props;
  return (
    <PayPalScriptProvider
      options={
        {
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        } as any
      }
    >
      <PayPalButtons
        forceReRender={[amount]}
        createOrder={(data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
              },
            ],
          });
        }}
        onApprove={(data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            callback();
          });
        }}
      />
    </PayPalScriptProvider>
  );
}

export default Paypal;
