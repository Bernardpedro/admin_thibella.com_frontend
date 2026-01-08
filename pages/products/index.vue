<template>
  <div>
    <!-- Loading indicator -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-lg shadow-lg">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3">Processing...</span>
        </div>
      </div>
    </div>

    <!-- Upload Button - aligned to right -->
    <div class="flex justify-end">
      <button 
        @click="showUploadModal = true"
        class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add New Product
      </button>
    </div>

    <!-- Display Uploaded Products -->
    <div v-if="uploadedProducts.length > 0" class="mt-8">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Product Inventory</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in uploadedProducts" :key="product.id" class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
          <!-- Product Image -->
          <div class="h-48 overflow-hidden bg-gray-100 relative">
            <img 
              :src="`${product.image}`"
              :alt="product.productName"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <span v-if="product.isOnSale" class="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              ON SALE
            </span>
          </div>
          
          <!-- Product Details -->
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-lg font-semibold text-gray-900">{{ product.productName }}</h4>
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {{ product.category }}
              </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description }}</p>
            
            <div class="space-y-2 text-sm text-gray-500">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700">Price:</span>
                <span class="text-lg font-bold text-green-600">{{ formatPrice(product.priceCents) }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700">Type:</span>
                <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                  {{ product.type }}
                </span>
              </div>
              
              <div v-if="product.color && product.color.length > 0">
                <span class="font-medium text-gray-700 block mb-1">Colors:</span>
                <div class="flex flex-wrap gap-1">
                  <span v-for="color in product.color" :key="color" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {{ color }}
                  </span>
                </div>
              </div>
              
              <div v-if="product.size && product.size.length > 0">
                <span class="font-medium text-gray-700 block mb-1">Sizes:</span>
                <div class="flex flex-wrap gap-1">
                  <span v-for="size in product.size" :key="size" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {{ size }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center justify-between pt-2">
                <span class="text-xs text-gray-400">{{ formatDate(product.date) }}</span>
                <span class="text-xs text-gray-400">{{ product.image }}</span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="mt-4 grid grid-cols-3 gap-2">
              <button 
                @click="openUpdateForm(product)"
                class="flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
              <button 
                @click="releaseProduct(product.id)"
                class="flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Release
              </button>
              <button 
                @click="deleteProduct(product.id)"
                class="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload/Edit Modal -->
    <div 
      v-if="showUploadModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 class="text-2xl font-bold text-gray-900">
            {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
          </h3>
          <button 
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Image Upload Section -->
          <div>
            <label class="block text-gray-700 font-medium mb-3">Product Images</label>
            
            <!-- Image Upload Area -->
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
              <input
                type="file"
                accept="image/*"
                multiple
                @change="handleImage"
                class="hidden"
                id="file-upload"
              />
              <label for="file-upload" class="cursor-pointer">
                <div v-if="imagesPreviewUrls.length === 0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="mt-2 text-sm text-gray-600">
                    <span class="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                  </p>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
                <div v-else>
                  <p class="text-sm text-gray-600 mb-4">{{ imagesPreviewUrls.length }} image(s) selected</p>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="(url, index) in imagesPreviewUrls" :key="index" class="relative group">
                      <img :src="url" alt="Preview" class="h-24 w-full object-cover rounded-lg" />
                      <button 
                        @click.prevent="removePreviewImage(index)"
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="mt-4 text-sm text-blue-600 font-medium">Add more images</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-gray-700 font-medium mb-2">Product Name *</label>
              <input 
                v-model="newProduct.productName"
                type="text" 
                placeholder="Enter product name"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-gray-700 font-medium mb-2">Description *</label>
              <textarea 
                v-model="newProduct.description"
                rows="4"
                placeholder="Describe the product"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Date *</label>
              <input 
                v-model="newProduct.date"
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Time</label>
              <input 
                v-model="newProduct.images"
                type="time"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Possible Images</label>
              <input 
                v-model="newProduct.possibleImages"
                type="text"
                placeholder="Enter possible images info"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Price (in cents) *</label>
              <input 
                v-model="newProduct.priceCents"
                type="number"
                placeholder="e.g., 1999 for $19.99"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Product Type</label>
              <select 
                v-model="newProduct.type"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="workshop">Workshop</option>
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Category</label>
              <select 
                v-model="newProduct.category"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="footwear">Footwear</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-gray-700 font-medium mb-2">Colors (comma-separated)</label>
              <input 
                v-model="colorInput"
                type="text"
                placeholder="e.g., Red, Blue, Green, Yellow"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div v-if="newProduct.color.length > 0" class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="(color, index) in newProduct.color"
                  :key="index"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                >
                  {{ color }}
                  <button
                    type="button"
                    @click="removeColor(index)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-gray-700 font-medium mb-2">Sizes (comma-separated)</label>
              <input 
                v-model="sizeInput"
                type="text"
                placeholder="e.g., S, M, L, XL, XXL"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div v-if="newProduct.size.length > 0" class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="(size, index) in newProduct.size"
                  :key="index"
                  class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
                >
                  {{ size }}
                  <button
                    type="button"
                    @click="removeSize(index)"
                    class="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="flex items-center cursor-pointer">
                <input 
                  v-model="newProduct.isOnSale"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-3 text-gray-700 font-medium">Is On Sale</span>
              </label>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
          <button 
            @click="closeModal"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="editingProduct ? submitUpdateProduct() : createProduct()"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            {{ editingProduct ? 'Update Product' : 'Upload Product' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
// import { useUserStore } from '~/stores/user'

// const userStore = useUserStore()
// const { token, role } = storeToRefs(userStore)

// State
const showUploadModal = ref(false);
const uploadedProducts = ref([]);
const editingProduct = ref(false);
const isLoading = ref(true);

const newProduct = ref({
  productName: '',
  description: '',
  date: '',
  images: '',
  possibleImages: '',
  priceCents: '',
  color: [],
  size: [],
  type: '',
  isOnSale: false,
  category: ''
});

const updateProductVar = ref({
  id: '',
  productName: '',
  description: '',
  date: '',
  images: '',
  possibleImages: '',
  priceCents: '',
  color: [],
  size: [],
  type: '',
  isOnSale: false,
  category: ''
});

const existingImages = ref([]);
const existingPossibleImages = ref([]);
const newImages = ref([]);
const imagesPreviewUrls = ref([]);
const colorInput = ref('');
const sizeInput = ref('');

// Watch for color input
watch(colorInput, (newValue) => {
  if (newValue.includes(',')) {
    const colors = newValue.split(',').map(c => c.trim()).filter(c => c);
    newProduct.value.color = [...new Set([...newProduct.value.color, ...colors])];
    colorInput.value = '';
  }
});

// Watch for size input
watch(sizeInput, (newValue) => {
  if (newValue.includes(',')) {
    const sizes = newValue.split(',').map(s => s.trim()).filter(s => s);
    newProduct.value.size = [...new Set([...newProduct.value.size, ...sizes])];
    sizeInput.value = '';
  }
});

// Handle image upload
const handleImage = (event) => {
  const files = Array.from(event.target.files);
  newImages.value.push(...files);
  
  const newPreviews = files.map(file => URL.createObjectURL(file));
  imagesPreviewUrls.value.push(...newPreviews);
};

// Remove preview image
const removePreviewImage = (index) => {
  const removedUrl = imagesPreviewUrls.value[index];
  
  const existingIndex = existingImages.value.indexOf(removedUrl);
  const existingPossibleImagesIndex = existingPossibleImages.value.indexOf(removedUrl);
  if (existingIndex !== -1) {
    existingImages.value.split(',');
  }
  if (existingPossibleImagesIndex !== -1) {
    existingPossibleImages.value.splice(existingPossibleImagesIndex, 1);
  }
  
  const newIndex = newImages.value.findIndex(
    file => URL.createObjectURL(file) === removedUrl
  );
  if (newIndex !== -1) {
    newImages.value.splice(newIndex, 1);
  }
  
  imagesPreviewUrls.value.splice(index, 1);
};

// Remove color
const removeColor = (index) => {
  newProduct.value.color.splice(index, 1);
};

// Remove size
const removeSize = (index) => {
  newProduct.value.size.splice(index, 1);
};

// Create product
const createProduct = async () => {
  const tokens = localStorage.getItem('token');
  const roles = localStorage.getItem('role');

  try {
    if (!tokens) {
      alert('You are not logged in');
      return;
    }

    if (!['admin'].includes(roles)) {
      alert('You are not allowed to create products');
      return;
    }

    // Add remaining color if any
    if (colorInput.value.trim()) {
      newProduct.value.color.push(colorInput.value.trim());
      colorInput.value = '';
    }

    // Add remaining size if any
    if (sizeInput.value.trim()) {
      newProduct.value.size.push(sizeInput.value.trim());
      sizeInput.value = '';
    }

    const formData = new FormData();
    formData.append('productName', newProduct.value.productName);
    formData.append('description', newProduct.value.description);
    formData.append('date', newProduct.value.date);
    formData.append('images', newProduct.value.images);
    formData.append('possibleImages', newProduct.value.possibleImages);
    formData.append('priceCents', newProduct.value.priceCents);
    formData.append('color', JSON.stringify(newProduct.value.color));
    formData.append('size', JSON.stringify(newProduct.value.size));
    formData.append('type', newProduct.value.type);
    formData.append('isOnSale', newProduct.value.isOnSale);
    formData.append('category', newProduct.value.category);

    newImages.value.forEach(file => {
      formData.append('productImages[]', file);
    });

    const res = await $fetch('https://api.stjosephtssnzuki.com/public/products/add-product.php', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens}`,
      },
      body: formData
    });

    if (res.success) {
      alert(res.message || 'Product created successfully!');
      closeModal();
      fetchProducts();
    } else {
      alert(res.message || 'Failed to create product');
    }
  } catch (error) {
    console.error('Create product error:', error);
    alert('Failed to create product');
  }
};

// Open update form
const openUpdateForm = (product) => {
  editingProduct.value = true;
  updateProductVar.value = product;

  newProduct.value = {
    productName: product.productName,
    description: product.description,
    date: product.date,
    image: product.image,
    possibleImages: product.possibleImages,
    priceCents: product.priceCents,
    color: [...product.color],
    size: [...product.size],
    type: product.type,
    isOnSale: product.isOnSale,
    category: product.category
  };

  existingImages.value = product.image
  existingPossibleImages.value = product.possibleImages.map(
    img => `https://api.stjosephtssnzuki.com/${img}`
  );

  imagesPreviewUrls.value = [...existingImages.value];
  newImages.value = [];

  showUploadModal.value = true;
};

// Submit update
const submitUpdateProduct = async () => {
  try {
    if (!token.value) {
      alert('You are not logged in');
      return;
    }

    if (!['admin'].includes(role.value)) {
      alert('You are not allowed to update products');
      return;
    }

    // Add remaining color/size if any
    if (colorInput.value.trim()) {
      newProduct.value.color.push(colorInput.value.trim());
      colorInput.value = '';
    }
    if (sizeInput.value.trim()) {
      newProduct.value.size.push(sizeInput.value.trim());
      sizeInput.value = '';
    }

    const formData = new FormData();
    formData.append('id', updateProductVar.value.id);
    formData.append('productName', newProduct.value.productName);
    formData.append('description', newProduct.value.description);
    formData.append('date', newProduct.value.date);
    formData.append('images', newProduct.value.images);
    formData.append('possibleImages', newProduct.value.possibleImages);
    formData.append('priceCents', newProduct.value.priceCents);
    formData.append('color', JSON.stringify(newProduct.value.color));
    formData.append('size', JSON.stringify(newProduct.value.size));
    formData.append('type', newProduct.value.type);
    formData.append('isOnSale', newProduct.value.isOnSale);
    formData.append('category', newProduct.value.category);

    newImages.value.forEach(file => {
      formData.append('productImages[]', file);
    });

    existingImages.value.forEach((img, index) => {
      formData.append(`existingImages[${index}]`, img);
    });

    const res = await $fetch(
      'https://api.stjosephtssnzuki.com/public/products/update-product.php',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: formData
      }
    );

    if (res.success) {
      alert(res.message || 'Product updated successfully!');
      closeModal();
      fetchProducts();
    } else {
      alert(`Update failed: ${res.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Update product error:', error);
    alert(`Failed to update product: ${error.message || 'Check backend'}`);
  }
};

// Fetch products
const fetchProducts = async () => {
  const tokens = localStorage.getItem('token');
  const roles = localStorage.getItem('role');

  try {
    // // if (!tokens || tokens) {
    //   alert('You are not allowed to get products');
    // //   return;
    // // }

    // if (!['admin'].includes(roles) || ['admin'].includes(roles)) {
    //   alert('You are not allowed to get products');
    //   return;
    // }

    const res = await $fetch('http://127.0.0.1:3658/m1/1155406-1148305-default/F/products', {
    //   headers: {
    //     Authorization: `Bearer ${tokens}`
    //   }
    });
    console.log('res', res);

    uploadedProducts.value = res;
  } catch (error) {
    console.error('Error fetching products:', error);
    alert('Failed to fetch products. Please try again later.');
  } finally {
    isLoading.value = false;
  }
};

// Delete product
const deleteProduct = async (productId) => {
  const confirmDelete = confirm('Are you sure you want to delete this product?');
  if (!confirmDelete) return;

  try {
    if (!token.value) {
      alert('You are not logged in');
      return;
    }

    if (!['admin'].includes(role.value)) {
      alert('You are not allowed to delete products');
      return;
    }

    const formData = new FormData();
    formData.append('id', productId);

    const res = await $fetch(
      'https://api.stjosephtssnzuki.com/public/products/delete-product.php',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: formData
      }
    );

    if (res.success) {
      alert(res.message || 'Product deleted successfully');
      await fetchProducts();
    } else {
      alert(res.message || 'Delete failed');
    }
  } catch (error) {
    console.error('Delete product error:', error);
    alert('Failed to delete product.');
  }
};

// Release product
const releaseProduct = async (productId) => {
  const confirmRelease = confirm('Are you sure you want to release this product to the public?');
  if (!confirmRelease) return;

  try {
    if (!token.value) {
      alert('You are not logged in');
      return;
    }

    if (!['admin'].includes(role.value)) {
      alert('You are not allowed to release products');
      return;
    }

    const formData = new FormData();
    formData.append('id', productId);

    const res = await $fetch(
      'https://api.stjosephtssnzuki.com/public/products/release-product.php',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: formData
      }
    );

    if (res.success) {
      alert(res.message || 'Product released successfully');
      await fetchProducts();
    } else {
      alert(res.message || 'Release failed');
    }
  } catch (error) {
    console.error('Release product error:', error);
    alert('Failed to release product.');
  }
};

// Close modal
const closeModal = () => {
  showUploadModal.value = false;
  editingProduct.value = false;
  resetForm();
};

// Reset form
const resetForm = () => {
  newProduct.value = {
    productName: '',
    description: '',
    date: '',
    images: '',
    possibleImages: '',
    priceCents: '',
    color: [],
    size: [],
    type: '',
    isOnSale: false,
    category: ''
  };
  imagesPreviewUrls.value = [];
  existingImages.value = [];
  existingPossibleImages.value = [];
  newImages.value = [];
  colorInput.value = '';
  sizeInput.value = '';
};

// Format price
const formatPrice = (cents) => {
  const dollars = (parseInt(cents) / 100).toFixed(2);
  return `${dollars}`;
};

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Handle image error
const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
  event.target.onerror = null;
};

// Mount
onMounted(async () => {
  await fetchProducts();
});

definePageMeta({
  layout: 'default'
});
</script>