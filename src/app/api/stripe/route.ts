import { NextResponse, NextRequest } from "next/server";

import Stripe from "stripe";
import prisma from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const webhookSigningSecret = process.env.STRIPE_WEBHOOK_SINGING_SECRET!;

const handlePremiumSubscription = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_email;

  if (!email) return;

  // find the user by email and update isPremium to true

  const user = await prisma.user.findFirst({ where: { email } });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { isPremium: true },
    });
    console.log(`User ${email} is now premium`);
  } else {
    console.log(`User ${email} not found`);
  }
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await req.headers.get("stripe-signature")) as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSigningSecret,
    );
  } catch (error: any) {
    console.log(" Error message: " + error);
    return new NextResponse("Webhook error " + error.message);
  }

  console.log(`Webhook received: ${event.id}: ${event.type}  `);

  //handle create subscription

  if (event.type === "checkout.session.completed") {
    await handlePremiumSubscription(event);
  }
  return new NextResponse(null, { status: 200 });
}
