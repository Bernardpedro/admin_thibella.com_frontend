import { defineStore } from 'pinia';
import { useCartStore } from '@/stores/cart';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as {
      id: string;
      userId: string;
      items: {  id: string;
        image: string;
        imageOfColors: {
          imageA: string;
          imageB: string;
          imageC: string;
          imageD: string;
        };
        name: string;
        description: string;
        rating: {
          stars: number;
          count: number;
        };
        priceCents: number;
        keywords: string[];
        quantity: number;
        type: string;
        color: {
          color1: string;
          color2: string;
          color3: string;
          color4: string;
        };
        clothingSize: {
          small: string;
          medium: string;
          large: string;
          xlarge: string;
        };
        shoesSize: number;}[];
      status: string;
    }[]
  }),
  getters:{
    getOrdersByUserId: (state) => (userId: string) => {
      return state.orders.filter(order => order.userId === userId);
  }
},
  actions: {
    placeOrder(userId: string) {
      const cartStore = useCartStore();

      if (cartStore.cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const newOrder = {
        id: "ORD" + Date.now(), // Unique order ID
        userId,
        items: [...cartStore.cart], // Copy all cart items into the order
        status: "Pending"
      };

      this.orders.push(newOrder);
      cartStore.clearCart(); // Clear the cart after order is placed
      return newOrder.id;
    }
  }
});
