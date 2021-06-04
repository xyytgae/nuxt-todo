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
        <v-btn icon @mousedown.stop="eliminate(todo.id)">
          <v-icon color="red">mdi-delete-outline</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from '@nuxtjs/composition-api'
import { TodoStore } from '@/compositions/useTodo'
import TodoKey from '@/compositions/useTodoKey'

export default defineComponent({
  setup() {
    const { update, showCalendarDialog, eliminate } = inject(
      TodoKey
    ) as TodoStore

    // 下記の値のみコンポーネント内にて定義
    const isEdit = ref(false)
    return {
      update,
      showCalendarDialog,
      eliminate,
      isEdit,
    }
  },
  props: {
    todo: {
      type: Object,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/styles/colors.scss';
.text--cyan {
  color: $cyan;
}
input {
  outline: none;
}
</style>
