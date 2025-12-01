import { defineStore } from "pinia";
import { apiFetch } from "~/utils/api";
import { ref, onMounted, computed } from "vue"; 
// import { formatCurrency } from "@/stores/currencyFormatter"; // Removed as it is not used

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
  size: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  selectedColor?: string;
  selectedSize?: string;
  cartItemId?: string;
};

const products = ref<Product[]>([]); 

onMounted(async () => {
  try {
    const response = await apiFetch('api/products', { 
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
    selectedShipping: ref("Standard"),
    selectedColor: ref(""), 
    selectedSize: ref(""),
  }),
  getters: {
    cartTotalQuantity: (state) => computed(() =>{
      return state.cart.reduce((total, product) => total + product.quantity, 0);
    }),
    
   calculateTotalPrice: (state) => computed(() => {
    return state.cart.reduce((total, product) => total + product.priceCents * product.quantity, 0);
   }),

   // Getter to access cart items (for easier access)
   cartItems: (state) => state.cart
  },
  actions: {
    convertPrice(priceCents: number) {
      const exchangeRates: Record<string, number> = { USD: 0.00071, EUR: 0.00068, RWF: 1 };
      const convertedPrice = parseFloat((priceCents * exchangeRates[this.selectedCurrency]).toFixed(2));
      return convertedPrice;
    },

    // Method to generate consistent cartItemId
    generateCartItemId(productId: string, options: { color?: string; size?: string} = {}) {
      return `${productId}-${options.color || 'default'}-${options.size || 'default'}`;
    },

    // Method to check if a product with specific options is already in cart
    isProductInCart(productId: string, options: { color?: string; size?: string } = {}) {
      if (!this.cart || this.cart.length === 0) {
        return false;
      }

      // Generate the same cartItemId that would be created when adding to cart
      const cartItemId = this.generateCartItemId(productId, options);
      
      // Check if an item with this cartItemId exists in the cart
      return this.cart.some(item => item.cartItemId === cartItemId);
    },

    // shipping and handling cost
      getShippingCost() {
        switch (this.selectedShipping) {
          case "Standard":
            return "Free";
          default:
            return "Free";
        }
      },
      // delivery time

getEstimatedDeliveryDate() {
  if (!this.selectedShipping) return '';
  
  const today = new Date();
  let deliveryDate = new Date(today);
  
  switch (this.selectedShipping) {
    case 'Standard':
      deliveryDate.setDate(today.getDate() + 7); // 5-7 days
      break;
    case 'Express':
      deliveryDate.setDate(today.getDate() + 3); // 2-3 days
      break;
    case 'Overnight':
      deliveryDate.setDate(today.getDate() + 1); // 1 day
      break;
    default:
      return '';
  }
  
  // Format the date
  return deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
},

    // set image   

    setSelectedImage(imageUrl: string) {
      this.selectedImage = imageUrl;

      if (import.meta.client) {
        localStorage.setItem('selectedImage', imageUrl);
      }
      this.updateLocalStorage();
    },
    // set shipping 
    setShipping(shipping: string){ 
      this.selectedShipping = shipping;

      if (import.meta.client) {
        localStorage.setItem('selectedShipping', shipping);
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

    // Set selected color 

  setSelectedColor(color: string) {
    this.selectedColor = color;

    if (import.meta.client) {
      localStorage.setItem('selectedColor', color);
    }
    
    this.updateLocalStorage();
  },
    // Set selected size 

  setSelectedSize(size: string) {
    this.selectedSize = size;

    if (import.meta.client) {
      localStorage.setItem('selectedSize', size);
    }
    
    this.updateLocalStorage();
  },

  // loading cart from local storage

  loadCart(){
    if(import.meta.client){
  const  storedCart = localStorage.getItem('cart');
  const storedCurrency = localStorage.getItem('selectedCurrency');
  const storedImage = localStorage.getItem('selectedImage');
  const storedShipping = localStorage.getItem('selectedShipping');
  const storedColor = localStorage.getItem('selectedColor');
  const storedSize = localStorage.getItem('selectedSize');

  this.cart = storedCart ? JSON.parse(storedCart) : [];
  this.selectedCurrency = storedCurrency ? storedCurrency : "RWF";  
  this.selectedImage = storedImage ? storedImage : "";
  this.selectedShipping = storedShipping ? storedShipping :  "Standard";
  this.selectedColor = storedColor ? storedColor : ""; 
  this.selectedSize = storedSize ? storedSize : "";

  this.updateLocalStorage();

    }
  },

  // update local storage

  updateLocalStorage() {
    if (import.meta.client) {
      localStorage.setItem('cart', JSON.stringify(this.cart)); 
      localStorage.setItem('selectedCurrency', this.selectedCurrency);
      localStorage.setItem('selectedImage', this.selectedImage);
      localStorage.setItem('selectedShipping', this.selectedShipping);
      localStorage.setItem('selectedColor', this.selectedColor);
      localStorage.setItem('selectedSize', this.selectedSize);
    }
  },

    addToCart(
      product: Product,
      selectedOptions: { color?: string; size?: string } = {}
    ) {
      if (!product) return;

      // Create a unique cartItemId using the helper method
      const cartItemId = this.generateCartItemId(product.id, selectedOptions);

      // Find existing product with same options
      const existingProduct = this.cart.find((item) => item.cartItemId === cartItemId);
      
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        this.cart.push({ 
          ...product, 
          quantity: 1, 
          selectedColor: selectedOptions.color || '',
          selectedSize: selectedOptions.size || '',
          cartItemId: cartItemId // Unique identifier for this cart item
        });
      }
      
      if(import.meta.client){
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateLocalStorage();
      }
    },

  // remove from cart base on cartItemId
    removeFromCart(cartItemId: string) {
      this.cart = this.cart.filter((item) => item.cartItemId !== cartItemId);
      if(import.meta.client){
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateLocalStorage();
    }
  },

  // Method to get specific cart item by cartItemId
  getCartItem(cartItemId: string) {
    return this.cart.find(item => item.cartItemId === cartItemId);
  },

  // Method to update cart item quantity
  updateCartItemQuantity(cartItemId: string, newQuantity: number) {
    const item = this.cart.find(item => item.cartItemId === cartItemId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeFromCart(cartItemId);
      } else {
        item.quantity = newQuantity;
        if(import.meta.client){
          localStorage.setItem('cart', JSON.stringify(this.cart));
          this.updateLocalStorage();
        }
      }
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