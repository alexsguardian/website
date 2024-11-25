<script setup lang="ts">
import { ref } from "vue";

// Track form submission state and response message
const responseMessage = ref<string>();
const isSubmitting = ref<boolean>(false);

// Data for form inputs with two-way binding
const formData = ref({
  name: '',
  email: '',
  title: '',
  company: '',
  message: ''
});

// Set character limits
const nameMaxLength = 100;
const emailMaxLength = 150;
const titleMaxLength = 50;
const companyMaxLength = 100;
const messageMaxLength = 500;

// Handle form submission
async function submit(e: Event) {
  e.preventDefault();

  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  responseMessage.value = '';  // Clear previous response message

  const dataToSend = new FormData();
  dataToSend.append('name', formData.value.name);
  dataToSend.append('email', formData.value.email);
  dataToSend.append('title', formData.value.title);
  dataToSend.append('company', formData.value.email);
  dataToSend.append('message', formData.value.message);

  // TODO: Rework this.
  // POST works and message is sent but response is ignored.
  // Make use of the server response!
  
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      body: dataToSend,
    });

    const data = await response.json();

    if (response.ok) {
      responseMessage.value = "Message sent successfully!";
      // resetForm();
    } else {
      responseMessage.value = `Error: ${data.message || "Something went wrong"}`;
    }
  } catch (error) {
    responseMessage.value = 'An error occurred. Please try again later.';
  } finally {
    isSubmitting.value = false;
  }
}

// Reset form data
function resetForm() {
  formData.value = {
    name: '',
    email: '',
    title: '',
    company: '',
    message: ''
  };
  responseMessage.value = '';
}
</script>


<template>
  <div class="flex flex-col max-w-xl mx-auto rounded-lg backdrop-blur border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-[var(--neutral-100)] dark:bg-[var(--highlight-blue-900)] shadow p-4 sm:p-6 lg:p-8 w-full">
    <form @submit="submit">
      
      <div class="mb-[15px]">
        <label for="name">Name <span class="text-red-600">*</span></label>
        <input type="text" id="name" name="name" v-model="formData.name" required :maxlength="nameMaxLength" placeholder="John Smith" class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-white dark:bg-[var(--highlight-blue-700)]" />
      </div>

      <div class="mb-[15px]">
        <label for="email">Email <span class="text-red-600">*</span></label>
        <input type="email" id="email" name="email" v-model="formData.email" required :maxlength="emailMaxLength" placeholder="email@example.com" class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-white dark:bg-[var(--highlight-blue-700)]" />
      </div>

      <div class="mb-[15px]">
        <label for="phone">Callback Number</label>
        <input type="tel" id="phone" name="phone" v-model="formData.phone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" placeholder="123-867-5309" class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-white dark:bg-[var(--highlight-blue-700)]" />
      </div>      

      <div class="mb-[15px]">
        <label for="company">Company</label>
        <input type="text" id="company" name="company" v-model="formData.company" :maxlength="companyMaxLength" placeholder="Some Company Inc." class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-white dark:bg-[var(--highlight-blue-700)]" />
      </div>

      <div class="mb-[15px]">
        <label for="title">Job Title</label>
        <input type="text" id="title" name="title" v-model="formData.title" :maxlength="titleMaxLength" placeholder="CEO" class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-white dark:bg-[var(--highlight-blue-700)]" />
      </div>

      <div class="mb-[15px]">
        <label for="message">Message <span class="text-red-600">*</span></label>
        <textarea id="message" name="message" v-model="formData.message" required :maxlength="messageMaxLength" placeholder="Your message here!" class="py-3 px-4 block w-full text-md rounded-lg border border-[var(--highlight-blue-200)] dark:border-[var(--highlight-blue-400)] bg-white dark:bg-[var(--highlight-blue-700)]"></textarea>
      </div>

      <div class="mt-3 flex">
        <div class="ml-3 mb-3">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            By submitting this contact form, you acknowledge and agree to the collection of your personal information per our <a href="/privacy">privacy policy</a>.
          </p>
        </div>
      </div>

      <button class="btn-primary border-[var(--highlight-blue-200)] rounded-lg hover:bg-[var(--highlight-blue-200)] dark:hover:bg-[var(--highlight-purple-400)] dark:border-[var(--highlight-blue-400)] dark:focus:bg-[var(--highlight-purple-400)]" :disabled="isSubmitting">
        <span v-if="isSubmitting">Sending...</span>
        <span v-else>Send Message</span>
      </button>

      <p v-if="responseMessage" class="response-message">{{ responseMessage }}</p>
    </form>
  </div>
</template>