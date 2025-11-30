<template>
  <div>    
    <section class="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">   

      <!-- Loading State -->
      <div v-if="loading" class="mx-auto max-w-screen-xl px-4 2xl:px-0 text-center">
        <p class="text-gray-600 dark:text-gray-400">Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mx-auto max-w-screen-xl px-4 2xl:px-0 text-center">
        <p class="text-red-600 dark:text-red-400">Error loading products: {{ error }}</p>
      </div>

      <!-- Product Grid -->
      <div class="mx-auto max-w-screen-xl px-4 2xl:px-0" v-if="!loading && !error">
        <div class="mb-4 grid gap-6 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
          <!-- Product Card -->
          <div
            v-for="(product, index) in displayedProducts"
            :key="product.id || index"
            class="group block rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
          >
            <!-- Product Title -->
            <div class="text-center bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg">
              <p
                class="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400"
              >
                {{ product.name }}
              </p>
            </div>

            <!-- Product Image -->
            <div 
            @click="goToProductDetails(product.id)"
            class="h-48 w-full overflow-hidden rounded-md cursor-pointer">
              <NuxtLink to="/products/ProductOverView">
              
              <img
                class="block h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                :src="product.image"
                :alt="product.name"
              />
              </NuxtLink>
            </div>

            <!-- Product Details -->
            <div class="pt-4">
              <p class="text-gray-500 dark:text-gray-400">Type: {{ product.type }}</p>

              <div class="mt-4 flex items-center justify-between gap-2">
                <p class="text-xl font-extrabold leading-tight text-gray-900 dark:text-white">
                  {{ formatCurrency(cartStore.convertPrice(product.priceCents), cartStore.selectedCurrency) }}
                </p>
                <button
                  type="button"
                  class="add-to-cart-btn relative overflow-hidden rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-black transition-transform duration-300 hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
                  @click="cartStore.addToCart(product)"
                >
                  <span class="relative z-10 flex items-center">
                    <svg
                      class="h-5 w-5 mr-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                      />
                    </svg>
                    Add to cart
                  </span>
                  <!-- Ripple Effect -->
                  <span
                    class="absolute inset-0 z-0 block scale-0 rounded-full bg-black opacity-20 transition-transform duration-500 group-hover:scale-150"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Products Found -->
        <div v-if="displayedProducts.length === 0" class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400">No products found.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, } from 'vue';
import { apiFetch } from '~/utils/api';
import { useSearchStore } from '~/stores/search';
import { useCartStore } from '~/stores/cart';
import { useRouter } from "vue-router";

const router = useRouter();

// Reactive state
const data = ref([]);
const f = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Fetch fresh data from API
    const res = await apiFetch('/products', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en'
      }
    });
    
    // Handle different possible response structures
    let products = [];
    
    if (Array.isArray(res)) {
      products = res;
    } else if (res && res.data && Array.isArray(res.data)) {
      products = res.data;
    } else if (res && res.products && Array.isArray(res.products)) {
      products = res.products;
    } else if (res && typeof res === 'object') {
      const arrayKeys = Object.keys(res).filter(key => Array.isArray(res[key]));
      if (arrayKeys.length > 0) {
        products = res[arrayKeys[0]];
      }
    }
    
    if (products.length > 0) {
      data.value = res;
      f.value = products;
      
      // Transform products to match expected structure before caching
      const transformedProducts = products.map(product => ({
        ...product,
        colors: product.colors || (product.color ? [product.color] : []),
        clothingSizes: product.clothingSizes || (product.clothingSize ? [product.clothingSize] : []),
        shoesSizes: product.shoesSizes || (product.shoesSize && product.shoesSize !== 0 ? [product.shoesSize] : []),
        possibleImagesOfProduct: product.possibleImagesOfProduct || (product.image ? [product.image] : [])
      }));
      
      // Cache with the correct key: "products"
      localStorage.setItem("products", JSON.stringify(transformedProducts));
      console.log("Cached transformed products:", transformedProducts);
    } else {
      console.warn("No products found in API response");
      if (f.value.length === 0) {
        error.value = "No products available";
      }
    }
    
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = err.message || 'Failed to load products';
    
    // If API fails, try to use cached data with CORRECT key
    const cachedProducts = localStorage.getItem("products"); // ✅ Fixed key
    if (cachedProducts && f.value.length === 0) {
      try {
        f.value = JSON.parse(cachedProducts);
        console.log("Using cached products due to API error:", f.value);
        error.value = null; // Clear error if we have cached data
      } catch (parseError) {
        console.error("Failed to parse cached products:", parseError);
      }
    }
  } finally {
    loading.value = false;
  }
});

const productsData = computed(() => {
  // Use f.value (cached/processed products) as the primary source
  return f.value.length > 0 ? f.value : (data.value?.data ?? []);
});

// Search functionality using store
const searchStore = useSearchStore();
const query = computed({
  get: () => searchStore.query,
  set: (value) => searchStore.setQuery(value)
});

const filteredItems = computed(() => {
  const products = productsData.value;
  if (!query.value) {
    return products;
  }
  return products.filter((product) => {
    return product.name && product.name.toLowerCase().includes(query.value.toLowerCase());
  });
});

// Sorting options
const sortOption = useState('sortOption', () => 'price-desc');

const displayedProducts = computed(() => {
  return [...filteredItems.value].sort((a, b) => {
    if (sortOption.value === 'price-asc') return (a.priceCents || 0) - (b.priceCents || 0);
    if (sortOption.value === 'price-desc') return (b.priceCents || 0) - (a.priceCents || 0);
    if (sortOption.value === 'name-asc') return (a.name || '').localeCompare(b.name || '');
    if (sortOption.value === 'name-desc') return (b.name || '').localeCompare(a.name || '');
    return 0;
  });
});

// Navigation
const goToProductDetails = (id) => {
  if (id) {
    router.push(`products/${id}`);
  }
};

// Cart store
const cartStore = useCartStore();

// displayed products
console.log("Displayed Products:", displayedProducts.value);
</script>

<style scoped>
.add-to-cart-btn {
  position: relative;
  overflow: hidden;
}
.add-to-cart-btn:hover .ripple {
  transform: scale(1.5);
}
</style>