"use server";
import Stripe from "stripe";
import { auth } from "@/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const priceId = "price_1QxZwxA9IV9sV7VaSDAJ8pYt";

//Create a function to generate a checkout link

export const createCheckoutSession = async ({
  email,
}: {
  email: string | null | undefined;
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: email!,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: "http://localhost:3000/new-product",
      cancel_url: "http://localhost:3000/",
    });
    return { url: session.url };
  } catch (error) {
    console.log(error);
    throw new Error("Error creating checkout session");
  }
};

// Create a function to get customer portal link
export const createCustomerLink = async () => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.email
    ) {
      throw new Error("User not authenticated");
    }

    const email = authenticatedUser.user.email;

    console.log(email, "email");

    const customers = await stripe.customers.list({
      email: email,
    });

    if (!customers || customers.data.length == 0) {
      throw new Error("Customer not found");
    }

    const customer = customers.data[0];

    if (!customer || !customer.id) {
      throw new Error("Customer not found");
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `http://localhost:3000/my-products`,
    });

    return portal.url;
  } catch (error) {
    console.error("Stripe error:", error);

    throw new Error("Customer not found");
  }
};
