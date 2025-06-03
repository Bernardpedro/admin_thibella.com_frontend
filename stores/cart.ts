import { defineStore } from "pinia";
import { apiFetch } from "~/utils/api";
import { ref, onMounted } from "vue"; 

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
  selectedColor?: string;
  selectedClothingSize?: string;
  selectedShoesSize?: string;
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
    cart: [] as Product[],
    selectedCurrency: ref("RWF"),
    selectedImage: ref(""),
    selectedShipping: ref("Standard"),
    selectedColor: ref(""), 
    selectedClothingSize: ref(""),
    selectedShoesSize: ref("")
  }),
  getters: {
    cartTotalQuantity: (state) => computed(() => {
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

    // shipping and handling cost
    getShippingCost() {
      switch (this.selectedShipping) {
        case "Standard":
          return "Free";
        case "Express":
          return "$4"
        case "Overnight":
          return "$12"
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
          deliveryDate.setDate(today.getDate() + 7);
          break;
        case 'Express':
          deliveryDate.setDate(today.getDate() + 3);
          break;
        case 'Overnight':
          deliveryDate.setDate(today.getDate() + 1);
          break;
        default:
          return '';
      }
      
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
    setShipping(shipping: string) { 
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

    // Set selected clothing size
    setSelectedClothingSize(size: string) {
      this.selectedClothingSize = size;
      if (import.meta.client) {
        localStorage.setItem('selectedClothingSize', size);
      }
      this.updateLocalStorage();
    },

    // set shoes size
    setSelectedShoesSize(size: string) {
      this.selectedShoesSize = size;
      if (import.meta.client) {
        localStorage.setItem('selectedShoesSize', size);
      }
      this.updateLocalStorage();
    },

    // loading cart from local storage
    loadCart() {
      if (import.meta.client) {
        const storedCart = localStorage.getItem('cart');
        const storedCurrency = localStorage.getItem('selectedCurrency');
        const storedImage = localStorage.getItem('selectedImage');
        const storedShipping = localStorage.getItem('selectedShipping');
        const storedColor = localStorage.getItem('selectedColor');
        const storedClothingSize = localStorage.getItem('selectedClothingSize');
        const storedShoesSize = localStorage.getItem('selectedShoesSize');

        this.cart = storedCart ? JSON.parse(storedCart) : [];
        this.selectedCurrency = storedCurrency ? storedCurrency : "RWF";  
        this.selectedImage = storedImage ? storedImage : "";
        this.selectedShipping = storedShipping ? storedShipping : "Standard";
        this.selectedColor = storedColor ? storedColor : ""; 
        this.selectedClothingSize = storedClothingSize ? storedClothingSize : "";
        this.selectedShoesSize = storedShoesSize ? storedShoesSize : "";

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
        localStorage.setItem('selectedClothingSize', this.selectedClothingSize);
        localStorage.setItem('selectedShoesSize', this.selectedShoesSize);
      }
    },

    // ADD THIS NEW METHOD - Update product quantity
    updateProductQuantity(cartItemId: string, newQuantity: number) {
      const productIndex = this.cart.findIndex((item) => item.cartItemId === cartItemId);
      
      if (productIndex !== -1) {
        if (newQuantity <= 0) {
          // Remove the product if quantity is 0 or less
          this.cart.splice(productIndex, 1);
        } else {
          // Update the quantity
          this.cart[productIndex].quantity = newQuantity;
        }
        
        // Update localStorage
        if (import.meta.client) {
          localStorage.setItem('cart', JSON.stringify(this.cart));
          this.updateLocalStorage();
        }
      }
    },

    // Alternative method if you need to update by product ID and options
    updateProductQuantityByOptions(
      productId: string, 
      newQuantity: number, 
      selectedOptions: { color?: string; clothingSize?: string; shoesSize?: string }
    ) {
      const product = this.cart.find((item) => 
        item.id === productId && 
        item.selectedColor === selectedOptions.color &&
        item.selectedClothingSize === selectedOptions.clothingSize &&
        item.selectedShoesSize === selectedOptions.shoesSize
      );

      if (product) {
        if (newQuantity <= 0) {
          // Remove the product if quantity is 0 or less
          this.cart = this.cart.filter((item) => 
            !(item.id === productId && 
              item.selectedColor === selectedOptions.color &&
              item.selectedClothingSize === selectedOptions.clothingSize &&
              item.selectedShoesSize === selectedOptions.shoesSize)
          );
        } else {
          // Update the quantity
          product.quantity = newQuantity;
        }
        
        // Update localStorage
        if (import.meta.client) {
          localStorage.setItem('cart', JSON.stringify(this.cart));
          this.updateLocalStorage();
        }
      }
    },

    addToCart(
      product: Product,
      selectedOptions: { color?: string; clothingSize?: string; shoesSize?: string } = {}
    ) {
      if (!product) return;

      // Create a unique key that includes selected options
      const productKey = `${product.id}-${selectedOptions.color || 'default'}-${selectedOptions.clothingSize || 'default'}-${selectedOptions.shoesSize || 'default'}`;

      const existingProduct = this.cart.find((item) => 
        item.id === product.id && 
        item.selectedColor === selectedOptions.color &&
        item.selectedClothingSize === selectedOptions.clothingSize &&
        item.selectedShoesSize === selectedOptions.shoesSize 
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        this.cart.push({ 
          ...product, 
          quantity: 1, 
          selectedColor: selectedOptions.color || '',
          selectedClothingSize: selectedOptions.clothingSize || '',
          selectedShoesSize: selectedOptions.shoesSize || '',
          cartItemId: productKey // Unique identifier for this cart item
        });
      }

      if (import.meta.client) {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateLocalStorage();
      }
    },

    removeFromCart(productId: string) {
      this.cart = this.cart.filter((item) => item.id !== productId);
      if (import.meta.client) {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateLocalStorage();
      }
    },

    // Remove specific cart item by cartItemId
    removeCartItem(cartItemId: string) {
      this.cart = this.cart.filter((item) => item.cartItemId !== cartItemId);
      if (import.meta.client) {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateLocalStorage();
      }
    },

    // clear cart
    clearCart() {
      this.cart = [];
      if (import.meta.client) {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateLocalStorage();
      }
    }  
  }
});