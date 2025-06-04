<script setup>
import { ref, onMounted, watch } from "vue";
import { apiFetch } from "~/utils/api";
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

const route = useRoute();
const router = useRouter();
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedImage = ref(null); // Add this for tracking selected image
const isAddedToCart = ref(false); // Add this to track cart state

const selectedColor = ref('');
const selectedClothingSize = ref('');
const selectedShoesSize = ref('');

// use local state to select color 

const selectColor = (color) => {
  selectedColor.value = color;
};
// use local state to select clothing size

const selectClothingSize = (size) => {
  selectedClothingSize.value = size;
};

// use local state to select shoessize

const selectShoesSize = (size) => {
  selectedShoesSize.value = size;
};

cartStore.loadCart();

onMounted(async () => {
  try {
    loading.value = true;
    const productId = route.params.id;

    // Validate UUID format (optional but recommended)
    if (!productId || typeof productId !== 'string') {
      throw new Error('Invalid product ID');
    }

    // Fetch single product directly from backend
    const response = await apiFetch(`api/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
      },
    });

    // Your Spring controller returns the ProductDTO directly, not wrapped in a data property
    product.value = response;
    console.log("product from data loader",product.value);
  } catch (err) {
    console.error("Error fetching product:", err);
    if (err.status === 404) {
      error.value = "Product not found";
    } else {
      error.value = "Failed to load product details";
    }
  } finally {
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

// Track the permanently selected image (from clicks)
const permanentlySelectedImage = ref(null);

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
  if (product.value) {
    // Change button state
    isAddedToCart.value = true;
    
    // Show alert with product name and selected options
   
     const optionsText = [];
    if (selectedColor.value) optionsText.push(`Color: ${selectedColor.value}`);
    if (selectedClothingSize.value) optionsText.push(`Size: ${selectedClothingSize.value}`);
    if (selectedShoesSize.value) optionsText.push(`Size: ${selectedShoesSize.value}`);

    alert(`${product.value.name}${optionsText.length ? ` (${optionsText.join(', ')})` : ''} is added to cart`);

    

     // Add product to cart store with selected options
    cartStore.addToCart(product.value, {
      color: selectedColor.value,
      clothingSize: selectedClothingSize.value,
      shoesSize : selectedShoesSize.value
    });
    
  }

console.log("Product added to cart:", product.value);
  console.log("Selected options:", {
    color: selectedColor.value,
    clothingSize: selectedClothingSize.value,
    shoesSize: selectedShoesSize.value
  });

};

 // function allowing to move to shopping cart

  const moveToCart = () => {
    // Navigate to the shopping cart page
    router.push('/ShoppingCartP');
  };
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="container mx-auto p-4 text-center">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
    <p class="mt-4 text-gray-600">Loading product details...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="container mx-auto p-4 text-center">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>{{ error }}</p>
      <button 
        @click="$router.go(-1)" 
        class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Go Back
      </button>
    </div>
  </div>

  <!-- Product Details -->
  <div v-else-if="product" class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <!-- Image Gallery (Top-Left) - Modified Layout -->
      <div class="self-start">
        <div class="flex gap-4 max-h-96">
          <!-- Main Product Image -->
          <div class="flex-1">
            <img 
              :src="selectedImage || product.image" 
              alt="Product" 
              class="w-full h-96 object-contain rounded-lg shadow-lg bg-gray-50 transition-all duration-300"
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
      <div>
        <h1 class="text-2xl font-bold">{{ product.name }}</h1>
        <p class="text-gray-500">{{ product.description }}</p>
        <div class="flex items-center mt-2">
          <span class="text-yellow-500">
            <!-- Add rating stars display here when available from API -->
            ⭐⭐⭐⭐⭐
          </span>
          <span class="ml-2 text-gray-600">(19 orders)</span>
        </div>
        <p class="text-3xl text-blue-600 font-bold my-4">
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
              class="px-3 py-1 bg-gray-100 rounded-lg text-sm"
            >
            <button v-if="color == 'blue'" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'red'" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'white'" class="bg-white-500 text-black px-2 py-1 rounded hover:bg-gray-200 hover:text-black transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'green'" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors">
              {{ color }}
            </button>
            <button v-else-if="color == 'yellow'" class="bg-yellow-300 text-white px-2 py-1 rounded hover:bg-yellow-500 transition-colors">
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
              <span class="px-3 py-1 m-1 bg-gray-400 rounded-lg text-sm hover:bg-gray-100" v-for="size in product.clothingSizes" 
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
              <span class="px-3 py-1 m-1 bg-gray-400 rounded-lg text-sm hover:bg-gray-100" v-for="size in product.shoesSizes" 
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
           :class="isAddedToCart ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'"
           class="mt-6 text-white px-6 py-3 rounded-lg w-48 transition-colors"
           >
           {{ isAddedToCart ? 'Added to Cart' : 'Buy Now' }}
          </button>
          <!--  Move to shopping cart Button with dynamic styling :disabled="!isAddedToCart" -->
          <button 
          @click="moveToCart"
          
          class=" bg-blue-500 hover:bg-blue-600 mt-6 text-white px-6 py-3 rounded-lg w-48 transition-colors"
          >
          Shopping Cart
        </button>
      </span>
      </div>
    </div>
  </div>

  <!-- Product Not Found -->
  <div v-else class="container mx-auto p-4 text-center">
    <p class="text-gray-500">Product not found</p>
    <button 
      @click="$router.go(-1)" 
      class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Go Back
    </button>
  </div>
</template>