import { defineStore } from 'pinia';
import { products } from '~/composables/productsList.js';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  getters: {
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    totalItems: (state) => {
      return state.items.reduce((count, item) => count + item.quantity, 0);
    }
  },

  actions: {
    saveToStorage() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items));
      }
    },

    addToCart(productId) {
      if (!process.client) return; 

      const product = products.value.find((p) => p.id === productId);
      
      if (!product) {
        console.error('Product not found');
        return;
      }

      const existingItem = this.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }

      this.saveToStorage();
      console.log(product);
    },

    removeFromCart(productId) {
      if (!process.client) return; 

      const index = this.items.findIndex((item) => item.id === productId);
      if (index !== -1) {
        if (this.items[index].quantity > 1) {
          this.items[index].quantity--;
        } else {
          this.items.splice(index, 1);
        }
      }

      this.saveToStorage();
    },

    clearCart() {
      if (!process.client) return; 

      this.items = [];
      this.saveToStorage();
    },

    loadCart() {
      if (!process.client) return; 

      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.items = JSON.parse(storedCart);
      }
    }
  }
});
