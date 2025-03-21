
import { useUserStore } from "~/stores/user";
import { useAuthStore } from '@/stores/auth';

const userStore = useUserStore(); // Access the store

export const loginWithFacebook = () => {
  if (!window.FB) {
    alert("Facebook SDK not loaded!");
    return;
  }

  window.FB.login(
    (response) => {
      if (response.authResponse) {
        console.log("Logged in!", response);
        console.log("Logged in Id!", response.authResponse.userID);
        console.log("Logged in status!", response.status);
          const authStore = useAuthStore();
          authStore.setUser({
            userId: response.authResponse.userID, 
            status: response.status
          });
          

        getUserInfo();
        window.open("https://your-website.com/dashboard", "_blank");
      } else {
        console.log("User cancelled login.");
      }
    },
    { scope: "public_profile,email" }
  );
};

export const getUserInfo = () => {
  window.FB.api("/me", { fields: "id,name,email,picture" }, (response) => {
    console.log("User Info:", response);
    userStore.setUser(response); // Store user globally
  });
};

export const logout = () => {
  if (!window.FB) return;

  window.FB.logout(() => {
    console.log("User logged out");
    userStore.clearUser(); // Clear user from the store
  });
};

