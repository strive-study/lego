<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">{{ count }}</button>
  <hello msg="123"></hello>
</template>

<script>
import { defineComponent, ref } from 'vue'
import Hello from './Hello.vue'
export default defineComponent({
  name: 'HelloWorld',
  components: {
    hello: Hello
  },
  props: {
    msg: String
  },
  setup() {
    let count = ref(1)
    return { count }
  }
})
</script>
