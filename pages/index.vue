<template>
  <v-row class="ma-3">
    <!-- タイトル -->
    <v-col cols="12" class="py-4 px-0 mb-8 text-center">
      <span class="text-h3 text--cyan"> TODO </span>
    </v-col>

    <!-- 入力フォーム -->
    <v-col cols="12" class="px-0 mb-6">
      <v-text-field
        class=""
        placeholder="TODOを入力しよう！"
        color="#00BCD4"
        hide-details
        solo
        clearable
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
        <v-list flat>
          <v-list-item-group v-for="(todo, index) in todos" :key="todo.id">
            <v-list-item>
              <v-list-item-action>
                <v-checkbox color="cyan" v-model="todo.status"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <span :class="{ 'text--cyan': todo.status }">
                  {{ todo.body }};{{ todo.id }}</span
                >
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="cyan">mdi-pencil-outline</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider v-if="index !== todos.length - 1"></v-divider>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      todos: [
        { body: '新しいTodo', id: 1, status: false },
        { body: '新しいTodo', id: 2, status: false },
        { body: '新しいTodo', id: 3, status: false },
      ],
      progress: 30,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/colors.scss';

.text--cyan {
  color: $cyan;
  // color: #00bcd4;
}
</style>
