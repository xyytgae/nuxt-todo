<template>
  <v-row class="ma-3">
    <!-- タイトル -->
    <v-col cols="12" class="py-4 px-0 mb-8 text-center">
      <span class="text-h3 text--cyan"> TODO </span>
    </v-col>

    <!-- 入力フォーム -->
    <v-col cols="12" class="px-0 mb-6">
      <v-text-field
        placeholder="TODOを入力しよう！"
        color="#00BCD4"
        hide-details
        solo
        clearable
        v-model="inputTodo.body"
        @keyup.enter="addTodo()"
      >
      </v-text-field>
    </v-col>

    <!-- todo一覧 -->
    <v-col cols="12" class="px-0">
      <v-card>
        <v-progress-linear
          v-model="progress"
          color="cyan"
          height="10"
        ></v-progress-linear>

        <!-- 締切日で並び替え -->
        <v-card-text class="pb-0">
          締切日
          <v-btn icon @click="descending = !descending">
            <v-icon>{{
              descending ? 'mdi-chevron-up' : 'mdi-chevron-down'
            }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-list flat>
          <v-divider></v-divider>
          <v-list-item-group
            v-for="(todo, index) in sortedTodos"
            :key="todo.id"
          >
            <OutputTodo :todo="todo" />

            <v-divider v-if="index !== sortedTodos.length - 1"></v-divider>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>

    <CalendarDialog />
  </v-row>
</template>

<script lang="ts">
import { defineComponent, inject, provide } from '@nuxtjs/composition-api'
import useTodo, { TodoStore } from '@/compositions/useTodo'
import TodoKey from '@/compositions/useTodoKey'

import OutputTodo from '@/components/OutputTodo.vue'
import CalendarDialog from '@/components/CalendarDialog.vue'

export default defineComponent({
  components: {
    OutputTodo,
    CalendarDialog,
  },
  setup() {
    provide(TodoKey, useTodo())
    const { descending, sortedTodos, inputTodo, progress, addTodo, onMounted } =
      inject(TodoKey) as TodoStore
    return {
      descending,
      sortedTodos,
      inputTodo,
      progress,
      addTodo,
      onMounted,
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
