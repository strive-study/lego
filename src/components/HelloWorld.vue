<template>
  <h1>{{ msg }}</h1>
  <button @click="setCount">{{ count }}</button>
  <input type="text" v-model="todo" />
  <button class="addTodo" @click="addTodo">add</button>
  <button class="loadUser" @click="loadUser">load</button>
  <p v-if="user.loading" class="loading">Loading</p>
  <div v-else class="username">{{ user.data && user.data.username }}</div>
  <p v-if="user.error" class="error">error!</p>
  <ul>
    <li v-for="(item, index) in todos" :key="index">{{ item }}</li>
  </ul>
  <hello msg="123"></hello>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import Hello from './Hello.vue'
import axios from 'axios'

const props = defineProps({
  msg: String
})
let count = ref(1)
const todo = ref('')
const todos = ref<string[]>([])
const user = reactive({
  data: null as any,
  loading: false,
  error: false
})
const setCount = () => {
  count.value++
}
const emits = defineEmits(['send'])

const addTodo = () => {
  todos.value.push(todo.value)
  emits('send', todo.value)
}
const loadUser = () => {
  user.loading = true
  axios
    .get('https://jsonplaceholder.typicode.com/users/1')
    .then(res => {
      console.log(res)
      user.data = res.data
    })
    .catch(() => {
      user.error = true
    })
    .finally(() => {
      user.loading = false
    })
}
</script>
