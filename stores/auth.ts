import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: useState('userId', () => null),  
    status: useState('authStatus', () => null),
  }),
  actions: {
    
    setUser(authResponse: { userId: string; status: string }) {
      this.userId = authResponse.userId;
      this.status = authResponse.status;
    
      // Save to local storage
      if (import.meta.client) {
        localStorage.setItem('userId', authResponse.userId);
        localStorage.setItem('authStatus', authResponse.status);
      }
    },
     logout() {
      this.userId = null;
      this.status = null;

      // Remove from local storage
      if (import.meta.client) {
      localStorage.removeItem('userId');
      localStorage.removeItem('authStatus');

      }
    },

    }
  }
);
