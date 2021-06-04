import { computed, reactive, onMounted, ref } from '@nuxtjs/composition-api'
import { Todo } from './types/todoTypes'

import { API } from 'aws-amplify'
import { createTodo, deleteTodo, updateTodo } from '~/src/graphql/mutations'
import { listTodos } from '~/src/graphql/queries'
import {
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
} from '~/src/graphql/subscriptions'

export default function useTodo() {
  /**
   * 出力用のtodos
   */
  const outputTodos = ref<Todo[]>([])

  /**
   * 入力用のtodo
   */
  const inputTodo = reactive<Todo>({
    body: '',
    status: false,
    deadline: new Date().toISOString().substr(0, 10),
  })

  /**
   * calendarDialogで扱うtodo
   */
  const dialogTodo = reactive<Todo>({
    id: '',
    body: '',
    status: false,
    deadline: new Date().toISOString().substr(0, 10),
  })

  /**
   * 昇順/降順
   */
  const descending = ref(true)

  /**
   * calendarDialog表示/非表示
   */
  const calendarDialog = ref(false)

  /**
   * 並び替えたtodos
   * @returns Array<Todo>
   */
  const sortedTodos = computed(() => {
    if (descending.value) {
      return outputTodos.value.sort((a: Todo, b: Todo) => {
        return Date.parse(a.deadline) - Date.parse(b.deadline)
      })
    } else {
      return outputTodos.value.sort((a: Todo, b: Todo) => {
        return Date.parse(b.deadline) - Date.parse(a.deadline)
      })
    }
  })

  /**
   * 進捗率
   * @returns number
   */
  const progress = computed(() => {
    const doneTodos = outputTodos.value.filter((todo) => todo.status == true)
    return (doneTodos.length / outputTodos.value.length) * 100
  })

  /**
   * todo追加
   * @returns
   */
  const addTodo = async () => {
    // 空の場合はreturn
    if (!inputTodo.body) return

    await API.graphql({
      query: createTodo,
      variables: { input: inputTodo },
    })

    // todoをリセット
    inputTodo.body = ''
    inputTodo.status = false
    inputTodo.deadline = new Date().toISOString().substr(0, 10)
  }

  /**
   * todo一覧取得
   */
  const getTodos = async () => {
    const response = await API.graphql({ query: listTodos })
    outputTodos.value = response.data.listTodos.items
  }

  /**
   * todo削除
   * @param todoId: string
   */
  const eliminate = async (todoId: string) => {
    if (confirm('削除してもいいですか？')) {
      await API.graphql({
        query: deleteTodo,
        variables: { input: { id: todoId } },
      })
    } else {
      alert('キャンセルしました')
    }
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
        if (outputTodos.value.some((item) => item.id == todo.id)) return
        outputTodos.value = [...outputTodos.value, todo]
      },
    })

    await API.graphql({
      query: onUpdateTodo,
    }).subscribe({
      next: (eventData: object) => {
        const todo = eventData.value.data.onUpdateTodo

        outputTodos.value = outputTodos.value.map((item) => {
          if (item.id == todo.id) {
            item = todo
          }
          return item
        })
      },
    })

    await API.graphql({
      query: onDeleteTodo,
    }).subscribe({
      next: (eventData: object) => {
        const todo = eventData.value.data.onDeleteTodo
        outputTodos.value = outputTodos.value.filter(
          (item) => item.id !== todo.id
        )
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
   * calendarDialogを表示
   * @param todo: Todo
   */
  const showCalendarDialog = (todo: Todo) => {
    dialogTodo.id = todo.id
    dialogTodo.body = todo.body
    dialogTodo.status = todo.status
    dialogTodo.deadline = todo.deadline

    calendarDialog.value = true
  }

  onMounted(() => {
    getTodos()
    subscribe()
  })

  return {
    inputTodo,
    descending,
    progress,
    sortedTodos,
    dialogTodo,
    calendarDialog,
    addTodo,
    eliminate,
    onMounted,
    update,
    showCalendarDialog,
  }
}

export type TodoStore = ReturnType<typeof useTodo>
