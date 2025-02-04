<template>
  <div class="flex flex-col items-center space-y-4">
    <button
      v-if="!user"
      @click="loginWithFacebook"
      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
    <img src="assets/img/facebook.svg" alt="facebook icon">
    </button>

    <div v-if="user" class="flex flex-col items-center space-y-2" target="_blank">
      <p>Welcome, {{ user.name }}!</p>
      <img :src="user.picture?.data?.url" alt="Profile Picture" class="w-16 h-16 rounded-full" />
      <p>Email: {{ user.email }}</p>

      <button
        @click="logout"
        class="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import HomeComp from "./HomeComp/HomeComp.vue";

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

        // Open a new tab after login
        window.open("https://your-website.com/dashboard", "_blank");
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

const logout = () => {
  if (!window.FB) return;

  window.FB.logout(() => {
    console.log("User logged out");
    user.value = null;
  });
};
</script>
