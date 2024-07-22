<script setup lang="ts">

import type { Column, Task, ID } from '~~/types';
import { ref } from 'vue';
import { nanoid } from "nanoid";
import TrelloBoardTask from './TrelloBoardTask.vue';
import NewTask from './NewTask.vue';
import draggable from 'vuedraggable';
import TaskModal from './TaskModal.vue'; 

const columns = ref<Column[]>([
    {
        id: nanoid(),
        title: "Backlog",
        tasks: [
            {
                title: "Create marketing landing page", createdAt: new Date(), id: nanoid(), subtasks: []
            },
            {
                title: "Develop cool new feature", createdAt: new Date(), id: nanoid(), subtasks: []
            },
            {
                title: "Research new startup", createdAt: new Date(), id: nanoid(), subtasks: []
            },
        ],

    },
    { title: "Selected for Dev", id: nanoid(), tasks: [] },
    { title: "In Progress", id: nanoid(), tasks: [] },
    { title: "QA", id: nanoid(), tasks: [] },
    { title: "Complete", id: nanoid(), tasks: [] },

]);

const alt = useKeyModifier("Alt"); // clone tasks with alt key when you drag and drop to another column

function createColumn() {
  const column: Column = {
    id: nanoid(),
    title: "",
    tasks: [],
  };
  columns.value.push(column);
  nextTick(() => {
    (
      document.querySelector(
        ".column:last-of-type .title-input"
      ) as HTMLInputElement
    ).focus();
  });
}

const showModal = ref(false);
const selectedTask = ref<Task>({
  id: '',
  title: '',
  createdAt: new Date(),
  description: '',
  subtasks: []
}); 

const openTaskModal = (task: Task) => {
  console.log('openTaskModal called with task:', task);
  selectedTask.value = task;
  showModal.value = true;
}

const updateTask = (updatedTask: Task) => {
  // Find the column that contains the task
  const columnIndex = columns.value.findIndex(column => 
    column.tasks.some(task => task.id === updatedTask.id)
  );
  if (columnIndex !== -1) {
    // Find the task within the column
    const taskIndex = columns.value[columnIndex].tasks.findIndex(task => 
      task.id === updatedTask.id
    );
    if (taskIndex !== -1) {
      // Update the task
      columns.value[columnIndex].tasks[taskIndex] = updatedTask;
    }
  }
  showModal.value = false; // Close the modal after updating
}

const deleteTask = (taskId: ID) => {
  // Find the column that contains the task
  const columnIndex = columns.value.findIndex(column => 
    column.tasks.some(task => task.id === taskId)
  );
  if (columnIndex !== -1) {
    // Remove the task from the column
    columns.value[columnIndex].tasks = columns.value[columnIndex].tasks.filter(task => task.id !== taskId);
  }
}


</script>

<template>
    <div class="flex items-start overflow-x-auto gap-4">
        <draggable 
            v-model="columns" 
            group="columns" 
            :animation="150"
            handle=".drag-handle"
            item-key="id" 
            class="flex gap-4 items-start">
            <template #item="{ element: column }: { element: Column } ">
                <div class="column bg-gray-200 p-5 rounded min-w-[250px]">
                    <header class="font-bold mb-4">
                        <DragHandle />
                        <input
              class="title-input bg-transparent focus:bg-white rounded px-1 w-4/5"
              @keyup.enter="($event.target as HTMLInputElement).blur()"
              @keydown.backspace="
                column.title === ''
                  ? (columns = columns.filter((c) => c.id !== column.id))
                  : null
              "
              type="text"
              v-model="column.title"
                        />
                    </header>
                    <draggable 
                        v-model="column.tasks" 
                        :group="{name: 'tasks', pull: alt ? 'clone' : true }" 
                        :animation="150"
                        item-key="id" 
                        >
                        <template #item="{ element: task }: { element: Task }">
                            <div>
                              <TrelloBoardTask 
                                
                                :task="task" 
                                @delete="deleteTask" 
                                @openModal="openTaskModal"  />
                            </div>
                            
                        </template>
                    </draggable>
                    <footer>
                        <NewTask @add="column.tasks.push($event)" />
                    </footer>
                </div>
            </template>
        </draggable>
        <button
      @click="createColumn"
      class="bg-gray-200 whitespace-nowrap p-2 rounded opacity-50"
    >
      + Add Another Column
    </button>
    <TaskModal 
    v-if="showModal" 
    :task="selectedTask" 
    :showModal="showModal" 
    @close="showModal = false" 
    @save="updateTask" 
    @delete="deleteTask"  />
    </div>

</template>