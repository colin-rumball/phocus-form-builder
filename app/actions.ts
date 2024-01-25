"use server";

import { z } from "zod";
import { Resend } from "resend";
import { env } from "@/env.js";
import { RSCActionResponse } from "@/lib/type";

const resend = new Resend(env.RESEND_API_KEY);

export const newsletterSignUp = async (email: string) => {
  const { data, error } = await resend.emails.send({
    from: "info@growinggood.ca",
    to: "info@growinggood.ca",
    subject: "New Newsletter Sign Up",
    html: email,
  });

  if (error) {
    console.error(error);
  }

  const res: RSCActionResponse = {
    success: !!error,
    error: error
      ? {
          code: 500,
          message: error?.message,
        }
      : undefined,
  };

  return res;
};

export const contactFormSubmission = async (formData: {
  name?: string;
  email: string;
  phone?: string;
  message: string;
}) => {
  if (!formData.email) throw new Error("Email is required");
  if (!formData.message) throw new Error("Message is required");

  try {
    z.string().email().parse(formData.email);
  } catch (error) {
    console.error("🚀 ~ contactFormSubmission email format error", error);
    throw new Error("Invalid Email");
  }

  const { data, error } = await resend.emails.send({
    from: "info@growinggood.ca",
    to: "info@growinggood.ca",
    subject: "New Contact Form Submission",
    html: `NAME: ${formData.name} <br />EMAIL: ${formData.email} <br />PHONE: ${formData.phone} <br />MESSAGE: ${formData.message}`,
  });

  if (error) {
    console.error(error);
    throw new Error("Error sending email");
  }

  return true;
};
