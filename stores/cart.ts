import { defineStore } from "pinia";
import { apiFetch } from "~/utils/api";
import { ref, onMounted } from "vue"; 
import { formatCurrency } from "@/stores/currencyFormatter";

export type Product = {
  id: string; 
  image: string;
  name: string;
  rating: {
    stars: number;
    count: number;
  };
  priceCents: number; 
  keywords: string[]; 
  quantity: number;
  type: string;
};


const products = ref<Product[]>([]); 

onMounted(async () => {
  try {
    const response = await apiFetch('products', { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Accept-Language': 'en' }
    });
    products.value = response as Product[];
  } catch (error) {
    console.error('Error fetching products', error);
  }
});

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [] as Product[] ,
    selectedCurrency: "RWF",
  }),
  getters: {
    getProduct: (state) => (productId: string) => {
      return state.cart.find((item) => item.id === productId);
    },
    getProductQuantity: (state) =>(productId : string) =>{
      const product = state.cart.find((item) => item.id === productId);
      return product ? product.quantity : 0;
    },
    cartTotalQuantity: (state) =>(productId : string) =>{
      return state.cart.reduce((total, product)=> total + product.quantity, 0);
    },
    calculateTotalPrice: (state) =>{
      return state.cart.reduce((total, product)=> total + product.priceCents * product.quantity, 0);
    },
    convertPrice: (state) => (priceCents: number) => {
      const exchangeRates = { USD: 0.00071, EUR: 0.00068, RWF: 1 };
      return parseFloat((priceCents * exchangeRates[state.selectedCurrency]).toFixed(2));
    }
  },
  actions: {
    loadCart(){
      if(import.meta.client){
    const  storedCart = localStorage.getItem('cart');
    this.cart = storedCart ? JSON.parse(storedCart) : [];
    }
  },
    addToCart(product: Product) {
      if (!product) return;

      const existingProduct = this.cart.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
      if(import.meta.client){
    localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  },
    removeFromCart(productId: string) {
      this.cart = this.cart.filter((item) => item.id !== productId);
      if(import.meta.client){
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }
  }
});
