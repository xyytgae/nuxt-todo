<template>
  <v-dialog max-width="350px" v-model="calendarDialog">
    <v-date-picker
      v-model="dialogTodo.deadline"
      @change="update(dialogTodo)"
      @input="calendarDialog = false"
      locale="ja"
      no-title
    ></v-date-picker>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { TodoStore } from '@/compositions/useTodo'
import TodoKey from '@/compositions/useTodoKey'

export default defineComponent({
  setup() {
    const { update, calendarDialog, dialogTodo } = inject(TodoKey) as TodoStore
    return {
      update,
      calendarDialog,
      dialogTodo,
    }
  },
})
</script>
