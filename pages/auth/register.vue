<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-green-700 dark:text-green mb-2">Create Account</h1>
        <p class="text-gray-600 dark:text-gray-300">Join us today and get started</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full px-4 py-3 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="John Doe"
          />
          <p v-if="errors.name" class="text-red-500 dark:text-red-400 text-xs mt-1">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
          <input
            v-model="formData.email"
            type="email"
            required
            class="w-full px-4 py-3 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="john@example.com"
          />
          <p v-if="errors.email" class="text-red-500 dark:text-red-400 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <!-- Phone Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number (Optional)</label>
          <input
            v-model="formData.phone"
            type="tel"
            class="w-full px-4 py-3 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="+250 XXX XXX XXX"
          />
          <p v-if="errors.phone" class="text-red-500 dark:text-red-400 text-xs mt-1">{{ errors.phone }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <div class="relative">
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 8 characters with letters and numbers</p>
          <p v-if="errors.password" class="text-red-500 dark:text-red-400 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <!-- <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
          <div class="relative">
            <input
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
        </div> -->

        <!-- Terms & Conditions -->
        <div class="flex items-start">
          <input
            v-model="formData.agreeToTerms"
            type="checkbox"
            required
            class="mt-1 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:ring-offset-gray-800"
          />
          <label class="ml-2 text-sm text-gray-600 dark:text-gray-300">
            I agree to the <a href="#" class="text-green-600 dark:text-green-400 hover:underline">Terms & Conditions</a> and <a href="#" class="text-green-600 dark:text-green-400 hover:underline">Privacy Policy</a>
          </label>
        </div>
        <p v-if="errors.agreeToTerms" class="text-red-500 dark:text-red-400 text-xs">{{ errors.agreeToTerms }}</p>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-green-600 dark:bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-800 transition duration-200 transform hover:scale-[1.02]"
        >
          Create Account
        </button>

        <!-- Social Login -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="handleSocialLogin('google')"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            @click="handleSocialLogin('facebook')"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <!-- Login Link -->
        <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account? 
          <NuxtLink to="/auth/login" class="text-green-600 dark:text-green-400 font-semibold hover:underline">
            Login
          </NuxtLink>
        </p>
      </form>

      <!-- Success Message -->
      <div v-if="showSuccess" class="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
        <p class="text-green-800 dark:text-green-200 text-sm">✅ Account created successfully!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NuxtLink } from '#components';
import { ref, reactive } from 'vue'

const loading = ref(false)
const errorMessage = ref('')

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  // confirmPassword: '',
  agreeToTerms: false
});

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  // confirmPassword: '',
  agreeToTerms: ''
});

const showPassword = ref(false)
// const showConfirmPassword = ref(false)
const showSuccess = ref(false)

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password) => {
  const minLength = password.length >= 8
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  return minLength && hasLetter && hasNumber
}

const validatePhone = (phone) => {
  if (!phone) return true // Optional field
  const phoneRegex = /^\+?[\d\s-]{10,}$/
  return phoneRegex.test(phone)
}

const clearErrors = () => {
  Object.keys(errors).forEach(key => errors[key] = '')
}

const handleSubmit = async () => {
  clearErrors()
  let isValid = true

  // Validate Full Name
  if (formData.name.trim().length < 2) {
    errors.name = 'Please enter your full name'
    isValid = false
  }

  // Validate Email
  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Validate Phone (if provided)
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
  }

  // Validate Password
  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 8 characters with letters and numbers'
    isValid = false
  }

  // Validate Confirm Password
  // if (formData.password !== formData.confirmPassword) {
  //   errors.confirmPassword = 'Passwords do not match'
  //   isValid = false
  // }

  // Validate Terms
  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the Terms & Conditions'
    isValid = false
  }

  if (isValid) {
    // console.log('Form submitted:', formData)
    showSuccess.value = true
    
  try {

    const res = await $fetch('http://localhost/thibellaApi/auth/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData
    })

    // console.log('Register response:', res)

    if (res.success) {

      alert(res.message);

      navigateTo('/auth/login');

    } else {
       errorMessage.value = res.message || 'Registration failed.'
    }
  } catch (error) {
    console.error('Registration error:', error)

      // Debugging details
  if (error?.data) {
    console.error('Backend error data:', error.data)
    errorMessage.value = error.data.message || 'Server error occurred.'
  } else if (error?.status) {
    console.error('HTTP Status:', error.status)
    errorMessage.value = `Request failed (status ${error.status})`
  } else {
    errorMessage.value = 'Network error. Please check your connection.'
  }

  } finally {
    loading.value = false
  }
    
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  }
}

const handleSocialLogin = (provider) => {
  console.log(`Login with ${provider}`)
  // In a real app, implement OAuth flow here
}

definePageMeta({
  layout:'default'
});
</script>