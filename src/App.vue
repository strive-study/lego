<template>
  <!-- <input type="file" @change="handleFileChange" />
  <button>提交</button> -->
  <Uploader action="http://182.92.168.192:8081/api/utils/upload-img"></Uploader>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import Uploader from './components/Uploader.vue'
const Authorization =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiIxNTk2NjYzNTAxNSIsInBhc3N3b3JkIjoiM2Q5MjdmMDVkYmQzNzg5YjA5ZDUyMGM1ZDMzZjM0Y2UiLCJwaG9uZU51bWJlciI6IjE1OTY2NjM1MDE1Iiwibmlja05hbWUiOiLkuZDpq5g1MDE1IiwiZ2VuZGVyIjowLCJwaWN0dXJlIjpudWxsLCJjaXR5IjpudWxsLCJsYXRlc3RMb2dpbkF0IjoiMjAyMy0wNS0yNlQxMzowMjoyMS4wMDBaIiwiaXNGcm96ZW4iOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDIwLTA5LTIzVDA1OjU5OjQyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA1LTI2VDEzOjAyOjIxLjAwMFoiLCJpYXQiOjE2ODUxMDYzODAsImV4cCI6MTY4NTE5Mjc4MH0.il6L3eBu3TRsDtn6MjUfIbPCPVadciRVNMeC3wArnHA'
const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    const uploadedFile = files[0]
    const formData = new FormData()
    formData.append(uploadedFile.name, uploadedFile)
    console.log(formData.get(uploadedFile.name))
    const res = await axios.post(
      'http://182.92.168.192:8081/api/utils/upload-img',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization
        }
      }
    )
  }
}

// const handleSubmit = () => {}
</script>

<style></style>
