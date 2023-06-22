<template>
  <div class="container">
    <a-layout-header class="header">
      <router-link to="/">
        <header class="header-title">Strive乐高</header>
      </router-link>
      <user-profile :user="user"></user-profile>
    </a-layout-header>
    <router-view></router-view>
    <a-layout-footer> Strive乐高 </a-layout-footer>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import UserProfile from '@/components/UserProfile.vue'
import { GlobalDataProps } from '@/store'
import { computed } from 'vue'
const store = useStore<GlobalDataProps>()
const user = computed(() => store.state.user)
</script>

<style>
.header {
  color: #1c82ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
