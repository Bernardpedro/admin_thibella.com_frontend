import { useUserStore } from "~/stores/user";

export const logout = () => {
  const userStore = useUserStore(); // Access the store

  if (!window.FB) return;

  window.FB.logout(() => {
    console.log("User logged out");
    userStore.clearUser(); // Clear user from the store
  });
};
