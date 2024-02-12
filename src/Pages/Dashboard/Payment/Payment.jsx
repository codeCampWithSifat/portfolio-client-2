import { loadStripe } from "@stripe/stripe-js";
import SectionTitle from "../../../Components/SectionTitle";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);
const Payment = () => {
  //   console.log(stripePromise);
  return (
    <div>
      {" "}
      <SectionTitle
        heading={"Payment"}
        subHeading={"Please Pay First"}
      ></SectionTitle>
      <div className="max-w-screen-sm mx-auto mt-10">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
