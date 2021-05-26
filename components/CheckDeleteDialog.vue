<template>
  <v-dialog max-width="350px" v-model="checkDeleteDialog.show">
    <v-card>
      <v-card-title> 削除してもよろしいですか？ </v-card-title>
      <v-card-actions>
        <v-btn text color="cyan" @click.stop="checkDeleteDialog.show = false">
          キャンセル
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="cyan"
          @click="
            eliminate(dialog.todo.id)
            checkDeleteDialog.show = false
          "
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { TodoStore } from '@/compositions/useTodo'
import TodoKey from '@/compositions/useTodoKey'

export default defineComponent({
  setup() {
    const { eliminate, checkDeleteDialog, dialog } = inject(
      TodoKey
    ) as TodoStore
    return {
      eliminate,
      checkDeleteDialog,
      dialog,
    }
  },
})
</script>
