<template>
  <v-dialog max-width="350px" v-model="calendarDialog.show">
    <v-date-picker
      v-model="dialog.todo.deadline"
      @change="update(dialog.todo)"
      @input="calendarDialog.show = false"
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
    const { update, calendarDialog, dialog } = inject(TodoKey) as TodoStore
    return {
      update,
      calendarDialog,
      dialog,
    }
  },
})
</script>
