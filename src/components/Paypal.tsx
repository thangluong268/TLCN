import React from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
interface PaypalProps {
  amount: number;
  callback: () => void;
}
function Paypal(props: PaypalProps) {
  const { amount, callback } = props;
  const [rates, setRates] = React.useState<any>(null);
  React.useEffect(() => {
    axios
      .get(
        "http://data.fixer.io/api/latest?access_key=99f152b66433c5949fabcd136df41f73"
      )
      .then((res) => {
        setRates(res.data.rates);
      });
  }, []);

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
                  value: +(amount / (rates ? rates.VND : 24250)).toFixed(2),
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
