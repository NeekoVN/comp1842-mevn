<script setup>
import ApiService from '@/services/apiService'
import { ref, defineProps, defineEmits } from 'vue'

// Define props to access 'note'
const props = defineProps({
  note: {
    type: Object,
    required: true,
    default: () => ({
      title: 'Untitled Note',
      content: 'No content available',
      createdAt: new Date().toISOString(),
    }),
  },
})

// Define emit function to trigger events
const emit = defineEmits()

const updatedNoteTitle = ref('')
const updatedNoteContent = ref('')

// Open modal and pre-fill the fields with the current note data
const openModal = (id, note) => {
  updatedNoteTitle.value = note.title
  updatedNoteContent.value = note.content
  document.getElementById(id).showModal()
}

const closeModal = (id) => {
  document.getElementById(id).close() // Close the modal
}

const updateNote = async (noteId) => {
  try {
    await ApiService.put(`/note/${noteId}`, {
      title: updatedNoteTitle.value,
      content: updatedNoteContent.value,
    })
    closeModal('edit-modal-' + noteId)
    emit('noteUpdated', {
      ...props.note, // Now correctly referencing the note prop from props
      title: updatedNoteTitle.value,
      content: updatedNoteContent.value,
    }) // Emit the updated note to the parent
  } catch (error) {
    console.error('Failed to update note:', error)
    alert('Failed to update note. Please try again later.')
  }
}

const deleteNote = async (noteId) => {
  try {
    await ApiService.delete(`/note/${noteId}`)
    closeModal('edit-modal-' + noteId)
    emit('noteDeleted', noteId) // Emit the note ID to delete it from the list
  } catch (error) {
    console.error('Failed to delete note:', error)
    alert('Failed to delete note. Please try again later.')
  }
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="w-full max-w-xl card glass shadow-md p-4 hover:shadow-lg transition-all hover:bg-pink-50"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold truncate">{{ note.title }}</h2>
      <p class="text-xs text-gray-500">{{ new Date(note.createdAt).toLocaleString() }}</p>
    </div>
    <p
      class="text-gray-700 text-sm mt-2 overflow-hidden text-ellipsis max-h-16 whitespace-pre-wrap"
    >
      {{ note.content }}
    </p>

    <div class="flex justify-end mt-4">
      <button class="btn btn-sm btn-secondary" @click="openModal('edit-modal-' + note._id, note)">
        Edit
      </button>
    </div>
  </div>

  <!-- Modal -->
  <dialog :id="'edit-modal-' + note._id" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Edit Note</h3>
      <form>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="updatedNoteTitle" type="text" class="input input-bordered w-full mt-2" />
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            v-model="updatedNoteContent"
            class="textarea textarea-bordered w-full mt-2"
            rows="4"
          ></textarea>
        </div>
        <div class="modal-action justify-between">
          <button type="button" class="btn btn-ghost text-error hover:bg-error hover:text-base-100">
            Delete
          </button>
          <button type="button" class="btn btn-secondary" @click="updateNote(note._id)">
            Save Note
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Close</button>
    </form>
  </dialog>
</template>

<style scoped></style>
