<template>
  <img
    :style="styleProps"
    :src="src"
    @click.prevent="handleClick"
    class="l-image-component"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useComponentCommon from '@/hooks/useComponentCommon'
import {
  imageDefaultProps,
  imageStylePropsName,
  transformToComponentProps
} from '@/defaultProps'
const defaultProps = transformToComponentProps(imageDefaultProps)
export default defineComponent({
  name: 'l-image',
  props: {
    ...defaultProps
  },
  setup(props) {
    const { styleProps, handleClick } = useComponentCommon(
      props,
      imageStylePropsName
    )
    return {
      styleProps,
      handleClick
    }
  }
})
</script>

<style>
.l-image-component {
  max-width: 100%;
  position: relative !important;
}
</style>
