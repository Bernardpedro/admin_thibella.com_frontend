import { defineStore } from "pinia";
import { apiFetch } from "~/utils/api";
import { ref, onMounted } from "vue"; 
import { formatCurrency } from "@/stores/currencyFormatter";

export type Product = {
  id: string;
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
  shoesSize: number;
};

const products = ref<Product[]>([]); 

onMounted(async () => {
  try {
    const response = await apiFetch('products2', { 
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
    selectedCurrency: ref("RWF"),
    selectedImage: ref(""),
  }),
  getters: {
    cartTotalQuantity: (state) => computed(() =>{
      return state.cart.reduce((total, product) => total + product.quantity, 0);
    }),
    
   calculateTotalPrice: (state) => computed(() => {
    return state.cart.reduce((total, product) => total + product.priceCents * product.quantity, 0);
   })
    
  },
  actions: {
    convertPrice(priceCents: number) {
      const exchangeRates: Record<string, number> = { USD: 0.00071, EUR: 0.00068, RWF: 1 };
      const convertedPrice = parseFloat((priceCents * exchangeRates[this.selectedCurrency]).toFixed(2));
      return convertedPrice;
    },
    setSelectedImage(imageUrl: string) {
      this.selectedImage = imageUrl;

      if (import.meta.client) {
        localStorage.setItem('selectedImage', imageUrl);
      }
      this.updateLocalStorage();
    },
    setCurrency(newCurrency: string) {
      this.selectedCurrency = newCurrency;

      if (import.meta.client) {
        localStorage.setItem('selectedCurrency', newCurrency);
      }
      
      this.updateLocalStorage();
    },

    loadCart(){
      if(import.meta.client){
    const  storedCart = localStorage.getItem('cart');
    const storedCurrency = localStorage.getItem('selectedCurrency');
    const storedImage = localStorage.getItem('selectedImage');

    this.cart = storedCart ? JSON.parse(storedCart) : [];
    this.selectedCurrency = storedCurrency ? storedCurrency : "RWF";  
    this.selectedImage = storedImage ? storedImage : "";

    this.updateLocalStorage();
    
    }
  },
  updateLocalStorage() {
    if (import.meta.client) {
      localStorage.setItem('cart', JSON.stringify(this.cart)); 
      localStorage.setItem('selectedCurrency', this.selectedCurrency);
      localStorage.setItem('selectedImage', this.selectedImage);
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
    this.updateLocalStorage();
    }
  },
    removeFromCart(productId: string) {
      this.cart = this.cart.filter((item) => item.id !== productId);
      if(import.meta.client){
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateLocalStorage();
    }
  },
  //clear cart
  clearCart() {
    this.cart = [];
    if(import.meta.client){
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateLocalStorage();
  
  }
}  
  }
});
