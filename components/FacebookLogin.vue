<script setup>
import { useUserStore } from "~/stores/user";

const userStore = useUserStore(); // Access the store

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
        window.open("https://your-website.com/dashboard", "_blank");
      } else {
        console.log("User cancelled login.");
      }
    },
    { scope: "public_profile,email" }
  );
};

const getUserInfo = () => {
  window.FB.api("/me", { fields: "id,name,email,picture" }, (response) => {
    console.log("User Info:", response);
    userStore.setUser(response); // Store user globally
  });
};

const logout = () => {
  if (!window.FB) return;

  window.FB.logout(() => {
    console.log("User logged out");
    userStore.clearUser(); // Clear user from the store
  });
};
</script>

<template>
  <div>
    <button
      v-if="!userStore.user"
      @click="loginWithFacebook"
      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"
    >
      <img src="assets/img/facebook.svg" alt="facebook icon" />
    </button>

    <div v-if="userStore.user">
      <p>Welcome, {{ userStore.user.name }}!</p>
      <img :src="userStore.user.picture?.data?.url" alt="Profile Picture" class="w-16 h-16 rounded-full" />
      <p>Email: {{ userStore.user.email }}</p>

      <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-lg">
        Sign Out
      </button>
    </div>
  </div>
</template>
