<template>
  <div class="flex flex-col items-center space-y-4">
    <button @click="loginWithFacebook" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      Login with Facebook
    </button>

    <div v-if="user">
      <p>Welcome, {{ user.name }}!</p>
      <img :src="user.picture?.data?.url" alt="Profile Picture" class="w-16 h-16 rounded-full" />
      <p>Email: {{ user.email }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const user = ref(null);

const loginWithFacebook = () => {
  if (!window.FB) {
    alert("Facebook SDK not loaded!");
    return;
  }

  window.FB.login(
    (response) => {
      if (response.authResponse) {
        console.log("Logged in!", response);
        getUserInfo();
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    },
    { scope: "public_profile,email" }
  );
};

const getUserInfo = () => {
  window.FB.api("/me", { fields: "id,name,email,picture" }, (response) => {
    console.log("User Info:", response);
    user.value = response;
  });
};
</script>
