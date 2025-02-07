<template>
  <div>
    <!-- Dropdown menu -->
    <div >
      <span class="px-4 py-1 pt-3 text-white">Continue with:</span>
      <ul class=" text-sm text-gray-700 dark:text-gray-200">
        <li class="p-0 m-0">
          <span class="flex items-center px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
            <img src="assets/img/facebookLogo.png" alt="facebook-icon" class="w-8 h-8 rounded-full mr-2" @click="loginWithFacebook"> 
            <span>Facebook</span> 
          </span>
        </li>
       
        <li class="p-0 m-0">
          <a href="#" class="flex items-center px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            <img src="assets/img/google.png" alt="facebook-icon" class="w-8 h-8 rounded-full mr-2"> 
            <span>Google</span> 
          </a>
        </li>
        <li class="p-0 m-0">
          <a href="#" class="flex items-center px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            <img src="assets/img/useLogin.png" alt="facebook-icon" class="w-8 h-8 rounded-full mr-2"> 
            <span>Log in</span> 
          </a>
        </li>
        <li class="p-0 m-0">
          <span  class="flex items-center px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="logout">
            <img src="assets/img/logOut.png" alt="facebook-icon" class="w-8 h-8 rounded-full mr-2"> 
            <span>Sign out</span> 
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/user";
import { logout } from "~/composables/useFacebookAuth"; // Import the function

const userStore = useUserStore();

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
</script>
