<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ApiService from '@/services/apiService'

const email = ref('')
const password = ref('')

const router = useRouter()

const login = async () => {
  try {
    const response = await ApiService.post('/auth/login', {
      email: email.value,
      password: password.value,
    })

    // Store the token and user object in localStorage
    localStorage.setItem('jwt', response.token)
    localStorage.setItem('user', JSON.stringify(response.user)) // Store the user object as a string

    // Redirect to home
    router.push('/home')
  } catch (error) {
    console.error('Login failed:', error)
    alert('Failed to login. Please check your credentials and try again.')
  }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="card bg-base-200 shadow-md w-full max-w-md flex items-center flex-grow">
      <div class="card-body w-full">
        <h2 class="card-title mb-2">Login</h2>
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="input input-bordered w-full"
            required
          />
        </div>
        <div class="mt-4">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="input input-bordered w-full"
            required
          />
        </div>
        <div class="card-actions justify-between mt-4">
          <router-link to="/register" class="btn btn-ghost">Register</router-link>
          <button @click="login" class="btn btn-primary px-7">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
