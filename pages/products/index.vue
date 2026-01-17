<template>
  <div>
    <!-- Loading indicator -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-lg shadow-lg">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span class="ml-3">Processing...</span>
        </div>
      </div>
    </div>

    <!-- Upload Button - aligned to right -->
    <div class="flex justify-end">
      <button 
        @click="showUploadModal = true"
        class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
              :src="product.imageUrl"
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
          <h3 class="text-2xl font-bold text-green-600">
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

          <!-- Form Fields 1 -->
          <div class="md:col-span-2">
            <label class="block text-gray-700 font-medium mb-2">
              URLs of Image for a Product (paste one and press Enter)
            </label>

            <div class="flex gap-2">
              <input
                v-model="imageInput"
                type="text"
                placeholder="https://example.com/image.jpg"
                @keydown.enter.prevent="addImage"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <button
                type="button"
                @click="addImage"
                class="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add
              </button>
            </div>

            <!-- Image URL chips -->
            <div v-if="newProduct.imageUrl.trim() !== ''" class="mt-3 flex flex-wrap gap-2">
              <span
                class="px-3 py-1 bg-purple-100 text-green-800 rounded-full text-sm flex items-center gap-2"
              >
                Image {{ 1 }}
                <button
                  type="button"
                  @click="removeImage()"
                  class="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            </div>

            <!-- Image preview -->
            <div v-if="newProduct.imageUrl.trim() !== ''" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <img
                :src="newProduct.imageUrl"
                alt="Product image urls"
                class="w-full h-32 object-cover rounded-lg border"
              />
            </div>
          </div>

          <!-- Form Fields 2 -->
          <div class="md:col-span-2">
            <label class="block text-gray-700 font-medium mb-2">
              URLs of Possible Images for a Product (paste one and press Enter)
            </label>

            <div class="flex gap-2">
              <input
                v-model="possibleImagesInput"
                type="text"
                placeholder="https://example.com/image.jpg"
                @keydown.enter.prevent="addPossibleImages"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <button
                type="button"
                @click="addPossibleImages"
                class="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add
              </button>
            </div>

            <!-- Image URL chips -->
            <div v-if="newProduct.possibleImagesUrls.length > 0" class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="(img, index) in newProduct.possibleImagesUrls"
                :key="index"
                class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2"
              >
                Image {{ index + 1 }}
                <button
                  type="button"
                  @click="removePossibleImages(index)"
                  class="text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            </div>

            <!-- Image preview -->
            <div v-if="newProduct.possibleImagesUrls.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <img
                v-for="(img, index) in newProduct.possibleImagesUrls"
                :key="'preview-' + index"
                :src="img"
                alt="Product image urls"
                class="w-full h-32 object-cover rounded-lg border"
              />
            </div>
          </div>



          <!-- Form Fields 3 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-gray-700 font-medium mb-2">Product Name</label>
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
              <label class="block text-gray-700 font-medium mb-2">Price (in cents) *</label>
              <input 
                v-model="newProduct.priceCents"
                type="number"
                placeholder="e.g., 1999 for $19.99"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2" required>Product Type *</label>
               <input type="text" v-model="newProduct.type" placeholder="Enter product type" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Category *</label>
                <input type="text" v-model="newProduct.category" placeholder="Enter category" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
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
            :disabled="isLoading"
            @click="editingProduct ? submitUpdateProduct() : createProduct()"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 16a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 10-2 0v1H5v-1a1 1 0 10-2 0v2z" />
              <path d="M7 9l3-3 3 3M10 6v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
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

// State
const showUploadModal = ref(false);
const uploadedProducts = ref([]);
const editingProduct = ref(false);
const isLoading = ref(true);

const newProduct = ref({
  productName: '',
  description: '',
  priceCents: '',
  color: [],
  size: [],
  type: '',
  isOnSale: false,
  category: '',
  imageUrl: '',
  possibleImagesUrls: []
});


const imageInput = ref('')

const possibleImagesInput = ref('')

const addImage = () => {
  const url = imageInput.value.trim()

  if (!url) return

  if (!newProduct.value.imageUrl.includes(url)) {
    newProduct.value.imageUrl = url;
  }

  imageInput.value = ''
}
const addPossibleImages = () => {
  const url = possibleImagesInput.value.trim()

  if (!url) return

  if (!newProduct.value.possibleImagesUrls.includes(url)) {
    newProduct.value.possibleImagesUrls.push(url)
  }

  possibleImagesInput.value = ''
}

const removePossibleImages = (index) => {
  newProduct.value.possibleImagesUrls.splice(index, 1)
}
const removeImage = () => {
  newProduct.value.imageUrl = '';
}


const updateProductVar = ref({
  id: '',
  productName: '',
  description: '',
  priceCents: '',
  color: [],
  size: [],
  type: '',
  isOnSale: false,
  category: '',
  imageUrl: '',
  possibleImagesUrls: []
});

const existingImageUrl = ref('');
const existingPossibleImagesUrls = ref([]);
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
    formData.append('priceCents', newProduct.value.priceCents);
    formData.append('size', JSON.stringify(newProduct.value.size));
    formData.append('color', JSON.stringify(newProduct.value.color));
    formData.append('type', newProduct.value.type);
    formData.append('isOnSale', newProduct.value.isOnSale ? '1' : '0');
    formData.append('category', newProduct.value.category);
    formData.append('imageUrl', newProduct.value.imageUrl);
    formData.append('possibleImagesUrls', JSON.stringify(newProduct.value.possibleImagesUrls));

    const res = await $fetch('http://localhost/thibellaApi/public/products/add-product.php', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens}`,
      },
      body: formData
    });

    console.log('Create product response:', res);

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

// Fetch products
const fetchProducts = async () => {
  const tokens = localStorage.getItem('token');

  try {
    const res = await $fetch('http://localhost/thibellaApi/public/products/get-products.php', {
      headers: {
        Authorization: `Bearer ${tokens}`
      }
    });
    
    console.log('Fetched products:', res.data);
    uploadedProducts.value = res.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    alert('Failed to fetch products. Please try again later.');
  } finally {
    isLoading.value = false;
  }
};

// Open update form
const openUpdateForm = (product) => {
  editingProduct.value = true;
  updateProductVar.value = product;

  newProduct.value = {
    productName: product.productName,
    description: product.description,
    priceCents: product.priceCents,
    color: Array.isArray(product.color) ? [...product.color] : [],
    size: Array.isArray(product.size) ? [...product.size] : [],
    type: product.type,
    isOnSale: product.isOnSale,
    category: product.category,
    imageUrl: product.imageUrl || '',
    possibleImagesUrls: Array.isArray(product.possibleImagesUrls) ? [...product.possibleImagesUrls] : []
  };

  showUploadModal.value = true;
};

// Submit update
const submitUpdateProduct = async () => {
  const tokens = localStorage.getItem('token');
  const roles = localStorage.getItem('role');

  try {
    if (!tokens) {
      alert('You are not logged in');
      return;
    }

    if (!['admin'].includes(roles)) {
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
    formData.append('priceCents', newProduct.value.priceCents);
    formData.append('size', JSON.stringify(newProduct.value.size));
    formData.append('color', JSON.stringify(newProduct.value.color));
    formData.append('type', newProduct.value.type);
    formData.append('isOnSale', newProduct.value.isOnSale ? '1' : '0');
    formData.append('category', newProduct.value.category);
    formData.append('imageUrl', newProduct.value.imageUrl);
    formData.append('possibleImagesUrls', JSON.stringify(newProduct.value.possibleImagesUrls));

    const res = await $fetch(
      'http://localhost/thibellaApi/public/products/update-product.php',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens}`
        },
        body: formData
      }
    );

    if (res.success) {
      alert(res.message);
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


// Delete product
const deleteProduct = async (productId) => {
  const confirmDelete = confirm('Are you sure you want to delete this product?');
  if (!confirmDelete) return;

  const tokens = localStorage.getItem('token');
  const roles = localStorage.getItem('role');

  try {
    if (!tokens) {
      alert('You are not logged in');
      return;
    }

    if (!['admin'].includes(roles)) {
      alert('You are not allowed to delete products');
      return;
    }

    const formData = new FormData();
    formData.append('id', productId);

    const res = await $fetch(
      'http://localhost/thibellaApi/public/products/delete-product.php',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens}`
        },
        body: formData
      }
    );

    if (res.success) {
      alert(res.message);
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

  const tokens = localStorage.getItem('token');
  const roles = localStorage.getItem('role');

  try {
    if (!tokens) {
      alert('You are not logged in');
      return;
    }

    if (!['admin'].includes(roles)) {
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
          Authorization: `Bearer ${tokens}`
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
    priceCents: '',
    color: [],
    size: [],
    type: '',
    isOnSale: false,
    category: '',
    imageUrl: '',
    possibleImagesUrls: []
  };
  imagesPreviewUrls.value = [];
  existingImageUrl.value = '';
  existingPossibleImagesUrls.value = [];
  newImages.value = [];
  colorInput.value = '';
  sizeInput.value = '';
};

// Format price
const formatPrice = (cents) => {
  const dollars = (parseInt(cents) / 100).toFixed(2);
  return `${dollars}`;
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