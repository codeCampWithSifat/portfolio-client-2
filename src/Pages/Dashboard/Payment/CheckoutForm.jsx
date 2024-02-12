import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [cart, refetch] = useCart();
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (totalPrice > 0) {
      axiosSecure
        .post("/create-payment-intent", { price: totalPrice })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [axiosSecure, totalPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }
    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setError("");
    }

    const { paymentIntent, error: paymentError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user.email,
            name: user.displayName,
          },
        },
      });

    if (paymentError) {
      console.log(paymentError);
    } else {
      console.log("paymentIntent", paymentIntent);
      if (paymentIntent.status === "succeeded") {
        setTransactionId(paymentIntent.id);
        // sent data to the server
        const payment = {
          email: user?.email,
          price: totalPrice,
          date: new Date(),
          transactionId: paymentIntent.id, // utc converted
          cartItems: cart.map((item) => item._id),
          menuItemIds: cart.map((item) => item.menuItem),
          status: "pending",
          itemNames: cart.map((item) => item.name),
        };

        const res = await axiosSecure.post("/payments", payment);
        console.log(res, "payment res");
        if (res.data?.insertResult?.insertedId) {
          refetch();
          navigate("/dashboard/paymentHistory");
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${user.displayName} Your Payment Successfull`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    }
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <button
          type="submit"
          className="btn btn-sm btn-primay text-white bg-indigo-600 hover:bg-indigo-600 mt-4"
          disabled={!stripe || !clientSecret}
        >
          Pay
        </button>
      </form>
      <p className="text-red-700 mt-4">{error}</p>
      {transactionId && (
        <p className="text-green-600 mt-3">
          {" "}
          Your transaction id: {transactionId}
        </p>
      )}
    </div>
  );
};

export default CheckoutForm;
