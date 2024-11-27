<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar is fixed, so it's not part of the height calculation -->
    <Navbar />
    <main class="flex flex-col flex-grow mt-16">
      <div class="flex flex-col items-center flex-grow px-4">
        <div v-if="error" class="text-center text-red-500">
          <p>{{ error }}</p>
        </div>
        <div v-else class="w-full flex flex-col items-center gap-4">
          <!-- Loop through notes and display them one by one in NoteItem -->
          <NoteItem
            v-for="note in notes"
            :key="note._id"
            :note="note"
            @noteUpdated="handleNoteUpdated"
            @noteDeleted="handleNoteDeleted"
            class="w-full max-w-xl mt-4"
          />
        </div>
        <button class="btn btn-accent fixed bottom-7 right-7" onclick="new_note_add.showModal()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create new note
        </button>
      </div>
    </main>
  </div>

  <dialog id="new_note_add" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Create a New Note</h3>
      <div class="py-4">
        <!-- Title Input -->
        <label for="title" class="block text-sm font-medium">Title</label>
        <input
          v-model="newNoteTitle"
          type="text"
          id="title"
          class="input input-bordered w-full mt-2"
          placeholder="Enter note title"
        />
      </div>
      <div class="py-4">
        <!-- Content Input -->
        <label for="content" class="block text-sm font-medium">Content</label>
        <textarea
          v-model="newNoteContent"
          id="content"
          class="textarea textarea-bordered w-full mt-2"
          rows="4"
          placeholder="Enter note content"
        ></textarea>
      </div>
      <div class="modal-action">
        <button
          class="btn btn-accent flex items-center justify-center gap-2"
          :class="{ 'loading loading-spinner': isSaving }"
          :disabled="isSaving"
          @click="addNewNote"
        >
          <span v-if="isSaving">Saving...</span>
          <span v-else>Save Note</span>
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import NoteItem from '@/components/NoteItem.vue'
import ApiService from '@/services/apiService'

const notes = ref([])
const error = ref(null)

const newNoteTitle = ref('')
const newNoteContent = ref('')
const isSaving = ref(false)

const fetchNotes = async () => {
  try {
    const response = await ApiService.get('/note')
    notes.value = response.notes // Adjust this based on your API response structure
  } catch (err) {
    if (err.status && err.status === 404) {
      error.value = 'No notes found. You can create a new one!'
    } else {
      error.value = 'An error occurred while fetching notes. Please try again later.'
    }
  }
}

const addNewNote = async () => {
  isSaving.value = true
  try {
    await ApiService.post('/note', {
      title: newNoteTitle.value,
      content: newNoteContent.value,
    })
    new_note_add.close()
    newNoteTitle.value = ''
    newNoteContent.value = ''
    fetchNotes()
  } catch (err) {
    error.value = 'An error occurred while adding a new note. Please try again later.'
  } finally {
    isSaving.value = false
  }
}

const handleNoteUpdated = (updatedNote) => {
  const index = notes.value.findIndex((note) => note._id === updatedNote._id)
  if (index !== -1) {
    notes.value[index] = updatedNote // Update the note in the list
  }
}

const handleNoteDeleted = (noteId) => {
  notes.value = notes.value.filter((note) => note._id !== noteId) // Remove the deleted note from the list
}

// Fetch notes when the component is mounted
onMounted(() => {
  fetchNotes()
})
</script>

<style>
/* Add any custom styles here */
</style>
