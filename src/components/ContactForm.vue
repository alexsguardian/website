<script setup lang="ts">
import { ref, onMounted } from "vue";

const responseMessage = ref<string>();
const isSubmitting = ref<boolean>(false);
const formVisible = ref<boolean>(true);

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '{TURNSTILE_SITE_KEY}';

const formData = ref({
  name: '',
  email: '',
  phone: '',
  title: '',
  company: '',
  message: '',
  turnstileToken: ''
});

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    if (window.turnstile) {
      window.turnstile.render("#turnstile-container", {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          formData.value.turnstileToken = token;
        },
        "error-callback": () => {
          responseMessage.value = "Turnstile validation failed. Please try again.";
        },
      });
    };
  };
});

function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, ''); 
  const match = cleaned.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  if (!match) return '';
  return !match[2] ? match[1] : `${match[1]}-${match[2]}${match[3] ? '-' + match[3] : ''}`;
};

function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;
  formData.value.phone = formatPhoneNumber(input.value);
};

const nameMaxLength = 100;
const emailMaxLength = 150;
const titleMaxLength = 50;
const companyMaxLength = 100;
const messageMaxLength = 500;

async function submit(e: Event) {
  e.preventDefault();

  if (!formData.value.turnstileToken) {
    responseMessage.value = "Please complete the Turnstile challenge.";
    return;
  };

  if (isSubmitting.value) {
    return;
  };

  isSubmitting.value = true;
  responseMessage.value = '';

  const dataToSend = new FormData();
  dataToSend.append('name', formData.value.name);
  dataToSend.append('email', formData.value.email);
  dataToSend.append('phone', formData.value.phone);
  dataToSend.append('title', formData.value.title);
  dataToSend.append('company', formData.value.company);
  dataToSend.append('message', formData.value.message);
  dataToSend.append('turnstileToken', formData.value.turnstileToken);

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      body: dataToSend,
    });

    const data = await response.json();

    if (response.ok) {
      responseMessage.value = "Message sent successfully!";
      // Instead of resetting the form, hide it.
      formVisible.value = false;
    } else {
      responseMessage.value = `Error: ${data.message || "Something went wrong"}`;
    }
  } catch (error) {
    responseMessage.value = 'An error occurred. Please try again later.';
  } finally {
    isSubmitting.value = false;
  };
};
</script>

<template>
  <div class="flex flex-col max-w-xl mx-auto rounded-lg backdrop-blur border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-[var(--neutral-100)] dark:bg-[var(--highlight-blue-900)] shadow p-4 sm:p-6 lg:p-8 w-full">
    
    <!-- Show the form if formVisible is true -->
    <form v-if="formVisible" @submit="submit">
      <div class="mb-[15px]">
        <label for="name">Name <span class="text-red-600">*</span></label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          v-model="formData.name" 
          required :maxlength="nameMaxLength" 
          placeholder="John Smith" 
          aria-label="Name Input (Required)" 
          class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-[var(--neutral-100)] dark:bg-[var(--highlight-blue-700)]" 
        />
      </div>

      <div class="mb-[15px]">
        <label for="email">Email <span class="text-red-600">*</span></label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          v-model="formData.email" 
          required 
          :maxlength="emailMaxLength" 
          placeholder="email@example.com" 
          aria-label="Email Input (Required)" 
          class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-[var(--neutral-100)] dark:bg-[var(--highlight-blue-700)]" 
        />
      </div>

      <div class="mb-[15px]">
        <div class="relative flex items-center">
          <label for="phone" class="mr-1">Callback Number</label>
          <span
            class="flex items-center cursor-pointer text-[var(--neutral-400)] dark:text-[var(--neutral-100)]"
            title="Callbacks for US numbers only!"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="#6388c5" d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2z" />
            </svg>
          </span>
        </div>
        <div class="mb-[15px]">
          <input
            type="text"
            id="phone"
            name="phone"
            v-model="formData.phone"
            @input="handlePhoneInput"
            placeholder="555-867-5309"
            aria-label="Phone Number Input (Optional) (USA Only)"
            class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-[var(--neutral-100)] dark:bg-[var(--highlight-blue-700)]"
          />
        </div>
      </div>

      <div class="mb-[15px]">
        <label for="company">Company</label>
        <input 
          type="text"
          id="company"
          name="company"
          v-model="formData.company"
          :maxlength="companyMaxLength"
          placeholder="Some Company Inc."
          aria-label="Company Name Input (Optional)"
          class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-[var(--neutral-100)] dark:bg-[var(--highlight-blue-700)]"
        />
      </div>

      <div class="mb-[15px]">
        <label for="title">Job Title</label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          v-model="formData.title" 
          :maxlength="titleMaxLength" 
          placeholder="CEO" 
          aria-label="Job Title Input (Optional)" 
          class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-[var(--neutral-100)] dark:bg-[var(--highlight-blue-700)]" 
        />
      </div>

      <div class="mb-[15px]">
        <label for="message">Message <span class="text-red-600">*</span></label>
        <textarea 
          id="message" 
          name="message" 
          v-model="formData.message" 
          required 
          :maxlength="messageMaxLength" 
          placeholder="Your message here!" 
          aria-label="Message Input (Required)" 
          class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-[var(--neutral-100)] dark:bg-[var(--highlight-blue-700)]"
        />
      </div>

      <div class="mt-3 flex">
        <div class="ml-3 mb-3">
          <p class="text-sm text-[var(--neutral-600)] dark:[var(--neutral-400)]">
            By submitting this contact form, you acknowledge and agree to the collection of your personal information per our <a href="/privacy">privacy policy</a>.
          </p>
        </div>
      </div>

      <button 
        aria-label="Form Submit Button" 
        class="btn-primary border-[var(--highlight-blue-200)] rounded-lg hover:bg-[var(--highlight-blue-200)] dark:hover:bg-[var(--highlight-purple-400)] dark:border-[var(--highlight-blue-400)] dark:focus:bg-[var(--highlight-purple-400)]" 
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">Sending...</span>
        <span v-else>Send Message</span>
      </button>

      <div class="mt-5">
        <div id="turnstile-container"></div>
      </div>

      <p v-if="responseMessage" class="response-message">{{ responseMessage }}</p>
    </form>

    <!-- Show a success message if formVisible is false -->
    <div v-else class="success-message">
      <div class="flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
          <path fill="hsl(136, 48%, 46%)" d="M20 12a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8c.76 0 1.5.11 2.2.31l1.57-1.57A9.8 9.8 0 0 0 12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10M7.91 10.08L6.5 11.5L11 16L21 6l-1.41-1.42L11 13.17z"/>
        </svg>
      </div>
      <h2 class="flex justify-center items-center mb-4">Message Sent!</h2>
      <p class="flex justify-center text-center mb-2">Thank you for contacting us!</p>
      <p class="flex justify-center text-center">We will get back to you within 1-2 business days.</p>
      <p v-if="responseMessage">{{ responseMessage }}</p>
    </div>
  </div>
</template>