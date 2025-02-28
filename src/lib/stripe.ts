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
