<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { apiFetch } from "~/utils/api";
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

const route = useRoute();
const router = useRouter();
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedImage = ref(null);

const selectedColor = ref('');
const selectedClothingSize = ref('');
const selectedShoesSize = ref('');

// Track the permanently selected image (from clicks)
const permanentlySelectedImage = ref(null);

// Computed property to check if current product with selected options is already in cart
const isProductInCart = computed(() => {
  if (!product.value) return false;
  
  // Generate the same cartItemId that would be used when adding to cart
  const currentOptions = {
    color: selectedColor.value,
    clothingSize: selectedClothingSize.value,
    shoesSize: selectedShoesSize.value
  };
  
  // Check if item exists in cart using the cart store method
  return cartStore.isProductInCart(product.value.id, currentOptions);
});

// Computed property for button text
const buttonText = computed(() => {
  return isProductInCart.value ? 'Added to Cart' : 'Buy Now';
});

// use local state to select color 
const selectColor = (color) => {
  selectedColor.value = color;
};

// use local state to select clothing size
const selectClothingSize = (size) => {
  selectedClothingSize.value = size;
};

// use local state to select shoes size
const selectShoesSize = (size) => {
  selectedShoesSize.value = size;
};

cartStore.loadCart();

// Function to find product by ID in local storage
// Function to find product by ID in local storage
const findProductInLocalStorage = (productId) => {
  try {
    const cachedProducts = localStorage.getItem('products');
    if (cachedProducts) {
      const products = JSON.parse(cachedProducts);
      const foundProduct = products.find(p => p.id === productId);
      
      if (foundProduct) {
        // Transform the product to match the expected structure
        return {
          ...foundProduct,
          colors: foundProduct.color ? [foundProduct.color] : [],
          clothingSizes: foundProduct.clothingSize ? [foundProduct.clothingSize] : [],
          shoesSizes: foundProduct.shoesSize && foundProduct.shoesSize !== 0 ? [foundProduct.shoesSize] : [],
          possibleImagesOfProduct: foundProduct.image ? [foundProduct.image] : []
        };
      }
    }
  } catch (e) {
    console.error('Error reading from local storage:', e);
  }
  return null;
};

onMounted(async () => {
  try {
    loading.value = true;
    const productId = route.params.id;

    // Validate UUID format
    if (!productId || typeof productId !== 'string') {
      throw new Error('Invalid product ID');
    }

    // Try to load from API first
    try {
      const response = await apiFetch(`api/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
        },
      });

      // If API call is successful, use the response
      product.value = response;
      console.log("Product loaded from API:", product.value);
      loading.value = false;
      return; // Exit early if API call succeeds
    } catch (apiError) {
      console.warn("API request failed, trying local storage...", apiError);
      
      // If API fails, try to find the product in local storage
      const cachedProduct = findProductInLocalStorage(productId);
      
      if (cachedProduct) {
        console.log("Using product from local storage:", cachedProduct);
        product.value = cachedProduct;
        loading.value = false;
        error.value = null; // Clear any errors
        return; // Exit successfully
      }
      
      // If not found in local storage either, set error
      console.error("Product not found in API or localStorage");
      error.value = "Product not found";
      loading.value = false;
    }
  } catch (err) {
    console.error("Error loading product:", err);
    error.value = "Failed to load product details";
    loading.value = false;
  }
});

// Initialize selected image when product loads
watch(product, (newProduct) => {
  if (newProduct) {
    // Set initial image as the main product image
    selectedImage.value = newProduct.image;
    permanentlySelectedImage.value = newProduct.image; // Set as permanently selected
  }
});

// Function to handle image selection (click)
const selectImage = (image) => {
  selectedImage.value = image;
  permanentlySelectedImage.value = image; // Remember the clicked image
};

// Function to handle hover (for hover effect)
const hoverImage = (image) => {
  selectedImage.value = image;
};

// Function to reset to permanently selected image when hover ends
const resetImage = () => {
  if (permanentlySelectedImage.value) {
    selectedImage.value = permanentlySelectedImage.value;
  } else if (product.value) {
    selectedImage.value = product.value.image;
  }
};

// Function to handle buy now button click
const handleBuyNow = () => {
  if (!product.value) return;

  const currentOptions = {
    color: selectedColor.value,
    clothingSize: selectedClothingSize.value,
    shoesSize: selectedShoesSize.value
  };

  // Check if product with these exact options is already in cart
  if (cartStore.isProductInCart(product.value.id, currentOptions)) {
    // Show confirmation dialog for adding duplicate item
    const userConfirmed = confirm(`Do you want to add ${product.value.name} again into your cart?`);
    
    if (userConfirmed) {
      // Add product to cart again
      cartStore.addToCart(product.value, currentOptions);
      
      const optionsText = [];
      if (selectedColor.value) optionsText.push(`Color: ${selectedColor.value}`);
      if (selectedClothingSize.value) optionsText.push(`Size: ${selectedClothingSize.value}`);
      if (selectedShoesSize.value) optionsText.push(`Size: ${selectedShoesSize.value}`);

      alert(`${product.value.name}${optionsText.length ? ` (${optionsText.join(', ')})` : ''} is added to cart again`);
    }
  } else {
    // Add product to cart for the first time
    cartStore.addToCart(product.value, currentOptions);
    
    const optionsText = [];
    if (selectedColor.value) optionsText.push(`Color: ${selectedColor.value}`);
    if (selectedClothingSize.value) optionsText.push(`Size: ${selectedClothingSize.value}`);
    if (selectedShoesSize.value) optionsText.push(`Size: ${selectedShoesSize.value}`);

    alert(`${product.value.name}${optionsText.length ? ` (${optionsText.join(', ')})` : ''} is added to cart`);
  }

  console.log("Product added to cart:", product.value);
  console.log("Selected options:", currentOptions);
};

</script>

<template>
    <!-- Add dark mode background to the main wrapper -->
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">

  <!-- Loading State -->
  <div v-if="loading" class="container mx-auto p-4 text-center">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
    <p class="mt-4 text-gray-600 dark:text-gray-300">Loading product details...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="container mx-auto p-4 text-center">
    <div class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg shadow">
      <p class="font-medium">{{ error }}</p>
      <button 
        @click="$router.go(-1)" 
        class="mt-3 bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-200"
      >
        Go Back
      </button>
    </div>
  </div>

  <!-- Product Details -->
  <div v-else-if="product" class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-800">
      <!-- Image Gallery (Top-Left) - Modified Layout -->
      <div class="self-start">
        <div class="flex gap-4 max-h-96">
          <!-- Main Product Image -->
          <div class="flex-1">
            <img 
              :src="selectedImage || product.image" 
              alt="Product" 
              class="w-full h-96 object-contain rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800 transition-all duration-300"
            />
          </div>
          
          <!-- Thumbnail Images on the Right Side -->
          <div class="flex flex-col gap-2 w-20 overflow-y-auto">
            
            <!-- Additional product images thumbnails -->
            <img
              v-for="(image, index) in product.possibleImagesOfProduct"
              :key="index"
              :src="image"
              alt="Product variation"
              class="w-16 h-16 object-contain rounded-lg cursor-pointer border-2 transition-all duration-200 flex-shrink-0"
              :class="selectedImage === image ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-blue-400'"
              @mouseenter="hoverImage(image)"
              @mouseleave="resetImage"
              @click="selectImage(image)"
            /> 
          </div>
        </div>
      </div>

      <!-- Product Details (Right) -->
      <div class="text-gray-900 dark:text-white">
        <h1 class="text-2xl font-bold dark:text-white">{{ product.name }}</h1>
        <p class="text-gray-500 dark:text-gray-300">{{ product.description }}</p>
        <div class="flex items-center mt-2">
          <span class="text-yellow-500">
            <!-- Add rating stars display here when available from API -->
            ⭐⭐⭐⭐⭐
          </span>
          <span class="ml-2 text-gray-600 dark:text-gray-300">(19 orders)</span>
        </div>
        <p class="text-3xl text-blue-600 dark:text-blue-400 font-bold my-4">
          {{ formatCurrency(cartStore.convertPrice(product.priceCents), cartStore.selectedCurrency) }}
        </p>

        <!-- loop in product.color and display buttons of Colors -->
        <div v-if="product.colors?.length">
          <p class="font-semibold">Available Colors:</p>
          <div class="flex space-x-2">
            <span
              v-for="color in product.colors"
              :key="color"
               @click="selectColor(color)"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
            >
            <button v-if="color == 'blue'" class="bg-blue-500 dark:bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'red'" class="bg-red-500 dark:bg-red-400 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'white'" class="bg-white-500 dark:bg-gray-700 text-black px-2 py-1 rounded hover:bg-gray-200 hover:text-black transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'green'" class="bg-green-500 dark:bg-green-400 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'yellow'" class="bg-yellow-300 dark:bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition-colors">
              {{ color }}
            </button>
          </span>
        </div>
            <!-- Display selected color -->
           <div v-if="selectedColor" class="mt-2">
              <p class="font-semibold">
                Selected color: <span 
                v-if="selectedColor == 'blue'" :class="' text-blue-500 w-24 px-2 py-1 rounded hover:bg-blue-600 '"
                class="font-medium">{{ selectedColor }}</span>

               <span 
                v-if="selectedColor == 'red'" :class="' text-red-500 w-24 px-2 py-1 rounded hover:bg-red-600 '"
                class="font-medium">{{ selectedColor }}</span>

                <span 
                v-if="selectedColor == 'yellow'" :class="' text-yellow-300 w-24 px-2 py-1 rounded hover:bg-yellow-600 '"
                class="font-medium">{{ selectedColor }}</span>

                <span 
                v-if="selectedColor == 'white'" :class="' text-gray-300 w-24 px-2 py-1 rounded hover:bg-gray-500 '"
                class="font-medium">{{ selectedColor }}</span>

                <span 
                v-if="selectedColor == 'green'" :class="' text-green-500 w-24 px-2 py-1 rounded hover:bg-green-600 '"
                class="font-medium">{{ selectedColor }}</span>
              </p>
          
            </div>
        </div>

        <!-- loop in product.clothingSizes and Display Sizes of clothing-->
        <div v-if="product.clothingSizes && product.clothingSizes.length > 0" class="mt-4">
          <p class="font-semibold">Available Sizes:</p>
          <div class="flex space-x-2 flex-wrap">
            <button>
              <span class="px-3 py-1 m-1 bg-gray-400 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-100" v-for="size in product.clothingSizes" 
              :key="size"
              @click="selectClothingSize(size)">
                {{ size }}
              </span>
            </button>
          </div>
        </div>

         <!-- Display selected size of clothing -->
           <div v-if="selectedClothingSize" class="mt-2">
              <p class="font-semibold">
                Selected size: <span 
                class="' text-black-500 w-24 px-2 py-1 rounded hover:bg-black-600 font-medium '"
              >
              {{ selectedClothingSize }}
            </span>
              </p>
           </div>

        <!-- loop in product.shoesSizes and display Shoe Sizes (if applicable) -->
        <div v-if="product.shoesSizes && product.shoesSizes.length > 0" class="mt-4">
          <p class="font-semibold">Shoe Size:</p>
          <div class="flex space-x-2 flex-wrap">
            <button>
              <span class="px-3 py-1 m-1 bg-gray-400 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-100" v-for="size in product.shoesSizes" 
              :key="size"
              @click="selectShoesSize(size)">
                {{ size }}
              </span>
            </button>
          </div>
        </div>

         <!-- Display selected size of shoes -->
           <div v-if="selectedShoesSize" class="mt-2">
              <p class="font-semibold">
                Selected size: <span 
                class="' text-black-500 w-24 px-2 py-1 rounded hover:bg-black-600 font-medium '"
              >
              {{ selectedShoesSize }}
            </span>
              </p>
           </div>

        <!-- Buy Now Button with dynamic styling -->
         <span class="flex flex-row gap-4">
           <button 
           @click="handleBuyNow"
           :class="isProductInCart ? 'bg-green-500 dark:bg-green-400 hover:bg-green-600' : 'bg-blue-500 dark:bg-blue-400 hover:bg-blue-600'"
           class="mt-6 text-white px-6 py-3 rounded-lg w-48 transition-colors"
           >
           {{ buttonText }}
          </button>
      </span>
      </div>
    </div>
  </div>

  <!-- Product Not Found -->
  <div v-else class="container mx-auto p-4 text-center">
    <p class="text-gray-500 dark:text-gray-300">Product not found</p>
    <button 
      @click="$router.go(-1)" 
      class="mt-2 bg-blue-500 dark:bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Go Back
    </button>
  </div>
  </div>
</template>