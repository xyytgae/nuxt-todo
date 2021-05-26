import { computed, reactive, onMounted } from '@nuxtjs/composition-api'
import { Todo } from './types/todoTypes'

import { API } from 'aws-amplify'
import { createTodo, deleteTodo, updateTodo } from '~/src/graphql/mutations'
import { listTodos } from '~/src/graphql/queries'
import { onCreateTodo, onDeleteTodo } from '~/src/graphql/subscriptions'

export default function useTodo() {
  /**
   * 出力用のtodos
   */
  const output = reactive<{
    todos: Array<Todo>
  }>({
    todos: [],
  })

  /**
   * 入力用のtodo
   */
  const input = reactive<{
    todo: Todo
  }>({
    todo: {
      body: '',
      status: false,
      deadline: new Date().toISOString().substr(0, 10),
    },
  })

  /**
   * checkDeleteDialog/calendarDialogで扱うtodo
   */
  const dialog = reactive<{
    todo: Todo
  }>({
    todo: {
      id: '',
      body: '',
      status: false,
      deadline: new Date().toISOString().substr(0, 10),
    },
  })

  /**
   * 昇順/降順
   */
  const sort = reactive<{
    desc: Boolean
  }>({
    desc: true,
  })

  /**
   * checkDeleteDialog表示/非表示
   */
  const checkDeleteDialog = reactive<{
    show: Boolean
  }>({
    show: false,
  })

  /**
   * calendarDialog表示/非表示
   */
  const calendarDialog = reactive<{
    show: Boolean
  }>({
    show: false,
  })

  /**
   * 並び替えたtodos
   * @returns Array<Todo>
   */
  const sortedTodos = computed(() => {
    if (sort.desc) {
      return output.todos.sort((a: Todo, b: Todo) => {
        return Date.parse(a.deadline) - Date.parse(b.deadline)
      })
    } else {
      return output.todos.sort((a: Todo, b: Todo) => {
        return Date.parse(b.deadline) - Date.parse(a.deadline)
      })
    }
  })

  /**
   * 進捗率
   * @returns number
   */
  const progress = computed(() => {
    const doneTodos = output.todos.filter((todo) => todo.status == true)
    return (doneTodos.length / output.todos.length) * 100
  })

  /**
   * todo追加
   * @returns
   */
  const addTodo = async () => {
    // 空の場合はreturn
    if (!input.todo.body) return

    await API.graphql({
      query: createTodo,
      variables: { input: input.todo },
    })

    // todoをリセット
    input.todo = {
      body: '',
      status: false,
      deadline: new Date().toISOString().substr(0, 10),
    }
  }

  /**
   * todo一覧取得
   */
  const getTodos = async () => {
    const response = await API.graphql({ query: listTodos })
    output.todos = response.data.listTodos.items
  }

  /**
   * todo削除
   * @param todoId: string
   */
  const eliminate = async (todoId: string) => {
    await API.graphql({
      query: deleteTodo,
      variables: { input: { id: todoId } },
    })
  }

  /**
   * todo一覧をリアルタイムで反映
   */
  const subscribe = async () => {
    await API.graphql({
      query: onCreateTodo,
    }).subscribe({
      next: (eventData: object) => {
        const todo = eventData.value.data.onCreateTodo
        if (output.todos.some((item) => item.id == todo.id)) return
        output.todos = [...output.todos, todo]
      },
    })

    await API.graphql({
      query: onDeleteTodo,
    }).subscribe({
      next: (eventData: object) => {
        const todo = eventData.value.data.onDeleteTodo
        output.todos = output.todos.filter((item) => item.id !== todo.id)
      },
    })
  }

  /**
   * todo更新
   * @param todo: Todo
   */
  const update = async (todo: Todo) => {
    const editingTodo = {
      id: todo.id,
      body: todo.body,
      status: todo.status,
      deadline: todo.deadline,
    }

    await API.graphql({
      query: updateTodo,
      variables: { input: editingTodo },
    })
  }

  /**
   * checkDeleteDialogを表示
   * @param todo: Todo
   */
  const showCheckDeleteDialog = (todo: Todo) => {
    dialog.todo = todo
    checkDeleteDialog.show = true
  }

  /**
   * calendarDialogを表示
   * @param todo: Todo
   */
  const showCalendarDialog = (todo: Todo) => {
    dialog.todo = todo
    calendarDialog.show = true
  }

  onMounted(() => {
    getTodos()
    subscribe()
  })

  return {
    output,
    input,
    sort,
    progress,
    sortedTodos,
    addTodo,
    eliminate,
    onMounted,
    update,

    dialog,
    checkDeleteDialog,
    calendarDialog,
    showCheckDeleteDialog,
    showCalendarDialog,
  }
}

export type TodoStore = ReturnType<typeof useTodo>
