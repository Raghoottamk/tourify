import axios from "axios";
import { showAlert } from "./alerts";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "../../config.js";

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    if (!session.data.session.id) {
      console.error("Session ID is undefined.");
      showAlert("error", "Failed to retrieve session ID.");
      return;
    }
    // 2) Ensure the Stripe object is loaded before using it
    console.log("stripePromise", stripePromise);
    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe failed to initialize.");
      showAlert("error", "Stripe failed to initialize.");
      return;
    }
    console.log("stripe", stripe);
    // 3) Redirect to Stripe Checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
