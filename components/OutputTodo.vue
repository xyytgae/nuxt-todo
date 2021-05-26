<template>
  <v-list-item>
    <v-list-item-action>
      <!-- 編集中に非表示 -->
      <v-checkbox
        v-if="!isEdit"
        color="cyan"
        v-model="todo.status"
        @change="update(todo)"
      ></v-checkbox>

      <!-- 編集中に表示 -->
      <v-icon v-else color="cyan">mdi-format-text</v-icon>
    </v-list-item-action>

    <v-list-item-content>
      <v-list-item-title>
        <input
          type="text"
          v-model="todo.body"
          @change="update(todo)"
          @blur="isEdit = false"
          ref="inputFocus"
          :class="{ 'text--cyan': todo.status }"
          :readonly="!isEdit"
        />
      </v-list-item-title>
      <v-list-item-subtitle> 〆{{ todo.deadline }} </v-list-item-subtitle>
    </v-list-item-content>

    <!-- 編集中に非表示 -->
    <template v-if="!isEdit">
      <v-list-item-action>
        <v-btn icon @click.stop="showCalendarDialog(todo)">
          <v-icon color="cyan">mdi-calendar</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-action>
        <v-btn
          icon
          @click="
            isEdit = true
            $refs.inputFocus.focus()
          "
        >
          <v-icon color="cyan">mdi-pencil-outline</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>

    <!-- 編集中に表示 -->
    <template v-else>
      <v-list-item-action>
        <v-btn icon @mousedown.stop="showCheckDeleteDialog(todo)">
          <v-icon color="red">mdi-delete-outline</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { TodoStore } from '@/compositions/useTodo'
import TodoKey from '@/compositions/useTodoKey'

export default defineComponent({
  setup() {
    const { update, showCheckDeleteDialog, showCalendarDialog } = inject(
      TodoKey
    ) as TodoStore
    return {
      update,
      showCheckDeleteDialog,
      showCalendarDialog,
    }
  },
  props: {
    todo: {
      type: Object,
    },
  },
  data() {
    return {
      // この値のみcompositionではなく各コンポーネントにて実装
      isEdit: false,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/styles/colors.scss';
.text--cyan {
  color: $cyan;
}
</style>
