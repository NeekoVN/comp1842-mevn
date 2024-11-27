<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)

// Check login status on component mount
onMounted(() => {
  const token = localStorage.getItem('jwt')
  isLoggedIn.value = !!token // Set true if token exists
})

// Logout function
const logout = () => {
  localStorage.removeItem('jwt')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  router.push('/login') // Redirect to login page
}

const user = JSON.parse(localStorage.getItem('user'))
</script>

<template>
  <div class="navbar glass fixed top-0 left-0 w-full z-10">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li><router-link to="/home">Home</router-link></li>
          <li><a>About</a></li>
        </ul>
      </div>
      <router-link to="/home" class="btn btn-ghost text-xl">TheThoughtKeeper</router-link>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><router-link to="/home">Home</router-link></li>
        <li><a>About</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      <p v-if="isLoggedIn" class="hidden md:inline">Welcome back,</p>
      <p v-if="isLoggedIn" class="hidden md:inline font-bold ms-1 me-4">{{ user.displayName }}</p>
      <router-link v-if="!isLoggedIn" to="/login" class="btn btn-primary"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
          />
        </svg>
        Login</router-link
      >
      <button v-else @click="logout" class="btn btn-secondary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>
        Logout
      </button>
    </div>
  </div>
</template>
