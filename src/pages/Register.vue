<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ApiService from '@/services/apiService'

const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const router = useRouter()

const register = async () => {
  if (password.value === confirmPassword.value) {
    try {
      await ApiService.post('/auth/register', {
        displayName: displayName.value,
        email: email.value,
        password: password.value,
      })

      const loginResponse = await ApiService.post('/auth/login', {
        email: email.value,
        password: password.value,
      })

      localStorage.setItem('jwt', loginResponse.token)
      localStorage.setItem('user', JSON.stringify(loginResponse.user))

      // Redirect to the home page
      router.push('/home')
    } catch (error) {
      console.error(error)

      // Handle specific error responses
      if (error.status && error.status === 400) {
        alert('A user with this email already exists. Please try a different email.')
      } else {
        alert('An error occurred while registering')
      }
    }
  } else {
    alert('Passwords do not match')
  }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="card bg-base-200 shadow-md w-full max-w-md flex items-center flex-grow">
      <div class="card-body w-full">
        <h2 class="card-title mb-2">Register</h2>
        <div>
          <input
            v-model="displayName"
            type="text"
            placeholder="Display Name"
            class="input input-bordered w-full"
            required
          />
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="input input-bordered w-full mt-6"
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
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="input input-bordered w-full mt-6"
            required
          />
        </div>
        <div class="card-actions justify-between mt-4">
          <router-link to="/login" class="btn btn-ghost">Login</router-link>
          <button @click="register" class="btn btn-primary px-7">Register</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
