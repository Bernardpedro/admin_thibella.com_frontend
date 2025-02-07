import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null); // Store user data

  // Function to set user data
  const setUser = (userData) => {
    user.value = userData;
  };

  // Function to clear user data (logout)
  const clearUser = () => {
    user.value = null;
  };

  return { user, setUser, clearUser };
});
