<script setup lang="ts">

import type { Column, Task } from '~~/types';
import { ref } from 'vue';
import { nanoid } from "nanoid";
import draggable from 'vuedraggable';

const columns = ref<Column[]>([
    {
        id: nanoid(),
        title: "Backlog",
        tasks: [
            {
                title: "Create marketing landing page", createdAt: new Date(), id: nanoid(),
            },
            {
                title: "Develop cool new feature", createdAt: new Date(), id: nanoid(),
            },
            {
                title: "Research new startup", createdAt: new Date(), id: nanoid(),
            },
        ],

    },
    { title: "Selected for Dev", id: nanoid(), tasks: [] },
    { title: "In Progress", id: nanoid(), tasks: [] },
    { title: "QA", id: nanoid(), tasks: [] },
    { title: "Complete", id: nanoid(), tasks: [] },

]);

const alt = useKeyModifier("Alt"); // clone tasks with alt key when you drag and drop to another column


</script>

<template>
    <div>
        <draggable 
            v-model="columns" 
            group="columns" 
            :animation="150"
            handle=".drag-handle"
            item-key="id" 
            class="flex gap-4 overflow-x-auto items-start">
            <template #item="{ element: column }: { element: Column } ">
                <div class="column bg-gray-200 p-5 rounded min-w-[250px]">
                    <header class="font-bold mb-4">
                        <DragHandle />
                        {{ column.title }}
                    </header>
                    <draggable 
                        v-model="column.tasks" 
                        :group="{name: 'tasks', pull: alt ? 'clone' : true }" 
                        :animation="150"
                        item-key="id" 
                        >
                        <template #item="{ element: task }: { element: Task }">
                            <TrelloBoardTask :task="task"/>
                        </template>
                    </draggable>
                    <footer>
                        <button class="text-gray-500">+ Add a Card</button>
                    </footer>
                </div>
            </template>
        </draggable>

    </div>

</template>