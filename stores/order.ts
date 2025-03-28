import { defineStore } from 'pinia';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: (import.meta.client && localStorage.getItem('orders')) 
      ? JSON.parse(localStorage.getItem('orders')!) 
      : [] as { 
          id: string; 
          userId: string; 
          items: any[]; 
          status: string; 
          totalAmount?: number;
          orderDate?: string;
        }[]
  }),
  getters: {
    getOrdersByUserId: (state) => (userId: string) => {
      return state.orders.filter((order) => order.userId === userId);
    },
    getOrderById: (state) => (orderId: string) => {
      return state.orders.find((order: { id: string; userId: string; items: any[]; status: string; totalAmount?: number; orderDate?: string }) => order.id === orderId);
    }
  },
  actions: {
    async placeOrder(userId: string) {
      const cartStore = useCartStore();
      const authStore = useAuthStore();

      // Input validation
      if (!authStore.userId) {
        throw new Error("Please log in first!");
      }

      if (cartStore.cart.length === 0) {
        throw new Error("Your cart is empty!");
      }

      // Determine order status
      const orderStatus = authStore.status === "connected" 
        ? "Confirmed" 
        : "Pending Verification";

      // Calculate total amount
      const totalAmount = cartStore.cart.reduce((total, item) => 
        total + (item.priceCents * item.quantity), 0);

      // Create a new order
      const newOrder = {
        id: `ORD${Date.now()}`,
        userId: authStore.userId,
        items: [...cartStore.cart],
        status: orderStatus,
        totalAmount: totalAmount,
        orderDate: new Date().toISOString()
      };

      console.log("Placing order:", newOrder);

      try {
        // Send order to API
        const response = await apiFetch(`orders`, {
          method: 'POST', 
          headers: {
            "Content-Type": "application/json",
            'Accept-Language': 'en'
          },
          body: JSON.stringify(newOrder), 
        });
       console.log("Full response:", response);

        // Update local state
        this.orders.push({
          ...newOrder
        });

        // Update local storage
        if (import.meta.client) {
          localStorage.setItem('orders', JSON.stringify(this.orders));
        }

        // Clear cart
        cartStore.clearCart();

        return newOrder;

      } catch (error) {
        throw error;
      }
    },
  }
});