<template>
 
  <div :class="{ dark: isDarkMode }" class="bg-white dark:bg-gray-900">
    <div>
      <!-- Moved DiscountPopUp here so it can overlay the navbar -->
      <!-- <DiscountPopUp/> -->
      
      <div class="bg-white dark:bg-gray-900">
        <!-- Mobile menu -->
        <TransitionRoot as="template" :show="open">
          <!-- (Mobile menu content here) -->
        </TransitionRoot>

        <header class="relative bg-white dark:bg-gray-900">
          <nav aria-label="Top" class="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
            <div class="border-b border-gray-200 dark:border-gray-700">
              <div class="flex h-16 items-center">
                <!-- Mobile menu button -->
                <button
                  type="button"
                  class="absolute rounded-md bg-white p-2 text-gray-400 dark:bg-gray-800 dark:text-gray-300 lg:hidden"
                  @click="open = true"
                >
                  <span class="sr-only">Open menu</span>
                  <Bars3Icon class="size-6" aria-hidden="true" />
                </button>

                <!-- Logo -->
                <div class="ml-4 flex lg:ml-0">
                  <a href="#">
                    <span class="sr-only">Your Company</span>
                    <img
                      class="h-8 w-auto rounded-full"
                      src="assets/img/IRA-LOGO-ORGINAL.jpg"
                      alt=""
                    />
                  </a>
                </div>

                <!-- Flyout menus -->
                <PopoverGroup class="hidden lg:ml-8 lg:block lg:self-stretch">
                  <div class="flex h-full space-x-8">
                    <Popover
                      v-for="category in navigation.categories"
                      :key="category.name"
                      class="flex"
                      v-slot="{ open }"
                    >
                      <PopoverButton
                        :class="[ 
                          open 
                            ? 'border-indigo-600 text-indigo-600' 
                            : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400', 
                          'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out' 
                        ]"
                      >
                        {{ category.name }}
                      </PopoverButton>
                    </Popover>

                    <a
                      v-for="page in navigation.pages"
                      :key="page.name"
                      :href="page.href"
                      class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400"
                      >{{ page.name }}</a
                    >
                  </div>
                </PopoverGroup>

                <!-- Right Side -->
                <div class="ml-auto flex items-center">
                  <!-- Dark Mode Toggle -->
                  <div class="mr-4">
                    <button
                      @click="toggleDarkMode"
                      class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400"
                    >
                                         
                    </button>
                  </div>

                  <!-- Sign In / Create Account -->
                  <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    <a 
                      href="/account/Facebook" v-if="!userStore.user" @mouseover="showDropdown" @mouseleave="closeDropdown"
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400"
                      >Sign in</a
                    >
                    <a
                    href="" v-if="userStore.user" @click="logout" @mouseover="showDropdown" @mouseleave="closeDropdown"
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400" 
                    >Sign out</a
                  >

                    <!-- Dropdown Menu -->
                      <div 
                      v-if="open2" 
                      @mouseover="cancelClose" 
                      @mouseleave="closeDropdown"
                class="absolute right-[calc(42px+280px)] mt-[175px] w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-0 z-10"
                    >
                      <LoginDropdown/>
                    </div>
                    <span
                      class="h-6 w-px bg-gray-200 dark:bg-gray-700"
                      aria-hidden="true"
                    ></span>
                      
                    <a
                      href="/CreateAccount"
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400"
                      >Create account</a
                    >
                  </div>

                  <!-- Language Selector -->
                  <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
                    <div class="-m-2 flex items-center p-2">
                      <select
                        v-model="$i18n.locale"
                        @change="switchLanguage"
                        class="ml-3 block text-base font-medium text-gray-900 dark:text-gray-300 bg-transparent border-none cursor-pointer"
                      >
                        <option value="en">{{ $t("language.english") }}</option>
                        <option value="rw">{{ $t("language.kinyarwanda") }}</option>
                      </select>
                    </div>
                  </div>

                  <!-- Search -->
                  <div class="flex lg:ml-6">
                    <a href="/products/searchProduct" class="p-2 text-gray-400 hover:text-gray-500">
                      <span class="sr-only">Search</span>
                      <MagnifyingGlassIcon class="size-6" aria-hidden="true" />
                    </a>
                  </div>

                  <!-- Cart -->
                  <div class="ml-4 flow-root lg:ml-6">
                    <a
                      href="/ShoppingCartP" @click.prevent ="toggledisplaySorting"
                      class="group -m-2 flex items-center p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400"
                    >
                      <img src="assets/img/Accessories/images/icons/cart-icon.png" alt="cart-icon"
                        class="size-6 shrink-0"
                        aria-hidden="true">
                      
                      <span v-if="cartStore.cartTotalQuantity.value >= 0" class="size ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >{{cartStore.cartTotalQuantity.value}}</span
                      >
                      <span class="sr-only">items in cart</span>
                    </a>
                  </div>
                </div>
                  <div class="ml-[20px]">
                    <img v-if="userStore.user?.picture?.data?.url" 
                    :src="userStore.user.picture.data.url" 
                    alt="User Profile" 
                    class="w-[50px] h-[50px] ml-[2px] rounded-full">
               
                 </div>
              </div>
            </div>
          </nav>
        </header>
        <Sorting v-if="uiStore.isDisplaySorting"/>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "~/stores/user"; // Import Pinia store

import {
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { Popover, PopoverButton, PopoverGroup } from "@headlessui/vue";
import LoginDropdown from "./AccountComp/loginDropdown.vue";
import {useUiStore} from '@/stores/ui';
import { useRouter } from "vue-router";
// user authentication
const userStore = useUserStore(); 

// cart 
const cartStore = useCartStore();
cartStore.loadCart();
//console.log('cart', cartStore.$state.cart);

// navigation categories
const navigation = ref({
  categories: [], 
  pages: [
    { name: "HOME", href: "/index" },
    { name: "CONTACT", href: "/ContactUs" },
    { name: "ABOUT", href: "/AboutUs" },
    { name: "CATEGORIES", href: "products/AllCategories" },
    { name: "FILTERS", href: "products/filters" },
  ],
});
// vue router 

const router = useRouter();

// Sorting logic
const uiStore = useUiStore();

const toggledisplaySorting = () =>{
  uiStore.toggleSorting(); 
  router.push('/ShoppingCartP')
}


// Dark mode logic
const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (typeof localStorage !== "undefined") {
    document.documentElement.classList.toggle("dark", isDarkMode.value);
    localStorage.setItem("dark-mode", isDarkMode.value);
  }
};

onMounted(() => {
  if (typeof localStorage !== "undefined") {
    const darkModeSetting = localStorage.getItem("dark-mode") === "true";
    isDarkMode.value = darkModeSetting;
    if (darkModeSetting) {
      document.documentElement.classList.add("dark");
    }
  }
});

// Language Logic
const { locale } = useI18n();
const switchLanguage = (event) => {
  const newLocale = event.target.value;
  locale.value = newLocale;
  localStorage.setItem("user-locale", newLocale);
};

// Dropdown menu logic
const open2 = ref(false);
let timeout = null;

const showDropdown = () => {
  open2.value = true;
};

const closeDropdown = () => {
  timeout = setTimeout(() => {
    open2.value = false;
  }, 300);
};

const cancelClose = () => {
  clearTimeout(timeout);
};
</script>
