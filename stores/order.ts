import { defineStore } from 'pinia';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: (import.meta.client && localStorage.getItem('orders')) 
    ? JSON.parse(localStorage.getItem('orders')!) 
    : [] as { id: string; userId: string; items: any[]; status: string; }[]
  }),
  getters:{
    getOrdersByUserId: (state) => (userId: string) => {
      return state.orders.filter(order => order.userId === userId);
  }
},
  actions: {
    placeOrder(userId: string) {
      const cartStore = useCartStore(); // Get the cart store
      const authStore = useAuthStore(); // Get the auth store

      // Check if user is logged in
      if (!authStore.userId) {
        alert("Please log in first!");
        return;
      }

      // Check if cart is empty
      if (cartStore.cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

         // Set order status based on Facebook login status
         let orderStatus = "Pending"; // Default status
         if (authStore.status === "connected") {
           orderStatus = "Confirmed"; // If user is logged in, mark as "Confirmed"
         } else {
           orderStatus = "Pending Verification"; // If status is different, require verification
         }

      // Create a new order
      const newOrder = {
        id: "ORD" + Date.now(), // Unique order ID
        userId: authStore.userId,  
        items: [...cartStore.cart], // Copy all cart items into the order
        status: "Pending"
      };

      this.orders.push(newOrder);
      // Save orders to local storage
      if (import.meta.client) {
      localStorage.setItem('orders', JSON.stringify(this.orders));
      } 
      cartStore.clearCart(); // Clear the cart after order is placed
      return newOrder.id;
    }
  }
});
