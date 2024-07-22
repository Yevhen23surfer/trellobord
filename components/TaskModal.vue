<template>
  <div v-if="showModal" class="modal-overlay"> 
    <div class="modal-content"> 
      <div class="flex justify-end mt-4 mb-4">
        <button @click="closeModal" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"> 
          X 
      </button>
      </div>
      <input type="text" v-model="task.title" class="w-full mb-4 px-4 py-2 border rounded-md" />
      <textarea v-model="task.description" class="w-full mb-4 px-4 py-2 border rounded-md" placeholder="Task Description"></textarea>
      <h3>Subtasks</h3>
      <ul>
        <li v-for="subtask in task.subtasks" :key="subtask.id">
          {{ subtask.text }} 
          
          <button @click="editSubtask(subtask); console.log('Editing:', subtask.isEditing)" class="mr-2"> 
            ✏️
          </button>
          <button @click="deleteSubtask(subtask)">🗑️</button>
        </li>
      </ul>
      <div class="flex mt-2"> 
        <input 
          type="text" 
          v-model="newSubtaskText" 
          class="w-full mr-2 px-4 py-2 border rounded-md" 
          placeholder="Add a new subtask"
          @keyup.enter="addNewSubtask"
        />
        <button @click="addNewSubtask" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Add
        </button>
      </div>
      <div class="flex justify-end mt-4"> 
        <button @click="saveChanges" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { Task, Subtask } from '@/types';
import { nanoid } from 'nanoid';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
const props = defineProps<{
  task: Task | null,
  showModal: boolean
}>();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'save', updatedTask: Task): void
}>();

const task = ref({...props.task, subtasks: props.task?.subtasks || [] });
const addNewSubtask = () => {
  if (newSubtaskText.value.trim() !== '') { 
    task.value.subtasks.push({ 
      id: nanoid(), 
      text: newSubtaskText.value, 
      completed: false,
      isEditing: false // Add isEditing property
    });
    newSubtaskText.value = ''; // Clear the input field after adding a subtask
  }
}
const newSubtaskText = ref('');
const editSubtask = (subtask: Subtask) => {
  subtask.isEditing = !subtask.isEditing; 
  console.log('Toggled isEditing to:', subtask.isEditing);
};
const deleteSubtask = (subtask: Subtask) => {
  task.value.subtasks = task.value.subtasks.filter(s => s.id !== subtask.id);
}
const saveChanges = () => {
  emit('save', {
    ...task.value,
    id: task.value.id || '', // Provide an empty string if id is undefined
    title: task.value.title || '', // Provide an empty string if title is undefined
    createdAt: task.value.createdAt || new Date() // Provide current date if createdAt is undefined
  }); 
  closeModal(); 
}
const closeModal = () => {
  emit('close');
}
</script>

<style>
.modal-overlay {
  position: fixed; /* Stay in place even when scrolling */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content
: center;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 1000; /* Ensure it's on top of other elements */
}

.modal-content {
  background-color:#e5e7eb;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); 
  width: 90%; /* Start with a larger width */
  max-width: 600px; /* Limit the maximum width for larger screens */
}
/* Media query for smaller screens (e.g., mobile) */
@media (max-width: 768px) {
  .modal-content {
    width: 95%; /* Adjust width for smaller screens */
  }
}
</style>