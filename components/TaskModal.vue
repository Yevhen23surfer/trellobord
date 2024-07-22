<template>
  <div v-if="showModal" class="modal-overlay"> 
    <div class="modal-content"> 
      <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-transparent"> 
        X 
      </button>
      <input type="text" v-model="task.title" class="w-full mb-4 px-4 py-2 border rounded-md" />
      <textarea v-model="task.description" class="w-full mb-4 px-4 py-2 border rounded-md" placeholder="Task Description"></textarea>
      <h3>Subtasks</h3>
      <ul>
        <li v-for="subtask in task.subtasks" :key="subtask.id">
          {{ subtask.text }} 
          <button @click="editSubtask(subtask)">Edit</button>
          <button @click="deleteSubtask(subtask)">Delete</button>
        </li>
      </ul>
      <div class="flex mt-2"> 
        <input 
          type="text" 
          v-model="newSubtaskText" 
          class="w-full mr-2 px-4 py-2 border rounded-md" 
          placeholder="Add a new subtask"
        />
        <button @click="addNewSubtask" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Add
        </button>
      </div>
      <button @click="saveChanges" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4">
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { Task, Subtask } from '@/types';
import { nanoid } from 'nanoid';
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
  if (task.value.subtasks) { // Check if subtasks exists
    task.value.subtasks.push({ 
      id: nanoid(), 
      text: newSubtaskText.value, 
      completed: false 
    });
    newSubtaskText.value = ''; // Clear the input field after adding a subtask
  }
}
const newSubtaskText = ref('');
const editSubtask = (subtask: Subtask) => {
  // Implement subtask editing logic here (e.g., open an edit field)
  console.log('Editing subtask:', subtask);
}
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