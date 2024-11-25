import type { APIRoute } from "astro";
import nodemailer from 'nodemailer';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Fetch environment variables
const emailRecieverAddr = import.meta.env.EMAIL_RECIEVER;
const emailSenderAddr = import.meta.env.EMAIL_SENDER;
const emailUser = import.meta.env.EMAIL_USER;
const emailPass = import.meta.env.EMAIL_PASS;
const host = import.meta.env.EMAIL_HOST;
const port = import.meta.env.PORT;
const TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SEC_KEY;

// Set character limits
const nameMaxLength = 100;
const emailMaxLength = 100;
const phoneMaxLength = 15;
const titleMaxLength = 50;
const companyMaxLength = 100;
const messageMaxLength = 500;

// DOMPurify setup to sanitize input
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return new Response(
      JSON.stringify({ message: "Invalid Content-Type" }),
      { status: 400 }
    );
  }

  const data = await request.formData();

  const turnstileToken = data.get("turnstileToken") as string;

  if (!turnstileToken) {
    return new Response(
      JSON.stringify({ message: "Turnstile validation token missing." }),
      { status: 400 }
    );
  }

  // Verify the Turnstile token
  const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: "2x0000000000000000000000000000000AA",
      response: turnstileToken,
    }),
  });

  const verifyData = await verifyResponse.json();

  if (!verifyData.success) {
    return new Response(
      JSON.stringify({ message: "Turnstile verification failed." }),
      { status: 400 }
    );
  }

  let name = data.get("name") as string;
  let email = data.get("email") as string;
  let phone = data.get("phone") as string;
  let title = data.get("title") as string;
  let company = data.get("company") as string;
  let message = data.get("message") as string;

  // Sanitize form input using DOMPurify
  name = purify.sanitize(name);
  email = purify.sanitize(email);
  phone = purify.sanitize(phone);
  title = purify.sanitize(title);
  company = purify.sanitize(company);
  message = purify.sanitize(message);

  // Validate that all fields are provided
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400 }
    );
  }

  // Validate character limits on the server side
  if (name.length > nameMaxLength) {
    return new Response(
      JSON.stringify({ message: `Name exceeds ${nameMaxLength} characters.` }),
      { status: 400 }
    );
  }

  if (email.length > emailMaxLength) {
    return new Response(
      JSON.stringify({ message: `Email exceeds ${emailMaxLength} characters.` }),
      { status: 400 }
    );
  }

  if (phone.length > phoneMaxLength) {
    return new Response(
      JSON.stringify({ message: `Phone number exceeds ${phoneMaxLength} characters.` }),
      { status: 400 }
    );
  }

  if (title.length > titleMaxLength) {
    return new Response(
      JSON.stringify({ message: `Job title exceeds ${titleMaxLength} characters.` }),
      { status: 400 }
    );
  }

  if (company.length > companyMaxLength) {
    return new Response(
      JSON.stringify({ message: `Company name exceeds ${companyMaxLength} characters.` }),
      { status: 400 }
    );
  }

  if (message.length > messageMaxLength) {
    return new Response(
      JSON.stringify({ message: `Message exceeds ${messageMaxLength} characters.` }),
      { status: 400 }
    );
  }

  // Generate timestamp for the email subject
  const now = new Date();
  const timestamp = now.toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-');

  // Create Nodemailer transporter
  let transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: false,
    auth: {
      user: `${emailUser}`,
      pass: `${emailPass}`,
    },
  });
  
  console.log(emailUser, emailPass);
  
  // Send email
  async function main() {
    try {
      await transporter.verify();  // Ensure verification completes
      console.log("Transporter verified successfully.");
    } catch (error) {
      console.error("Transporter verification failed:", error);
      throw error; // Re-throw to be handled in the outer catch block
    }
    
    const info = await transporter.sendMail({
      from: emailSenderAddr, // sender's name and email
      to: emailRecieverAddr, // list of receivers
      replyTo: `${email}`,
      subject: `New Contact Form Submittion: ${timestamp}`, // Subject line with timestamp
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nJob Title: ${title}\nCompany: ${company}\nMessage: ${message}`, // plain text body
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Job title:</strong> ${title}</p>
             <p><strong>Company:</strong> ${company}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
  }

  try {
    await main();
    return new Response(
      JSON.stringify({
        message: "Success!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to send email",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};