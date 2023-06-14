<template>
  <Draggable
    :list="list"
    item-key="1"
    class="ant-list-items ant-list-bordered"
    ghost-class="ghost"
    handle=".handle"
  >
    <template #item="{ element }">
      <li
        class="ant-list-item"
        :class="{
          active: element.id === selectedId
        }"
        :key="element.id"
        @click="handleClick(element.id)"
      >
        <a-tooltip :title="element.isHidden ? '显示' : '隐藏'">
          <a-button
            shape="circle"
            @click.stop="
              handleChange(element.id, 'isHidden', !element.isHidden)
            "
          >
            <template v-slot:icon v-if="element.isHidden"
              ><EyeOutlined />
            </template>
            <template v-slot:icon v-else><EyeInvisibleOutlined /> </template>
          </a-button>
        </a-tooltip>
        <a-tooltip :title="element.isLocked ? '解锁' : '锁定'">
          <a-button
            shape="circle"
            @click.stop="
              handleChange(element.id, 'isLocked', !element.isLocked)
            "
          >
            <template v-slot:icon v-if="element.isLocked"
              ><UnlockOutlined />
            </template>
            <template v-slot:icon v-else><LockOutlined /> </template>
          </a-button>
        </a-tooltip>
        <inline-edit
          class="edit-area"
          :value="element.layerName!"
          @change="value => handleChange(element.id, 'layerName', value)"
        ></inline-edit>
        <a-tooltip title="拖动排序">
          <a-button shape="circle" class="handle">
            <template v-slot:icon>
              <DragOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </li>
    </template>
  </Draggable>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  UnlockOutlined,
  DragOutlined
} from '@ant-design/icons-vue'
import InlineEdit from './InlineEdit.vue'
import { ComponentData } from 'strive-lego-bricks'
import Draggable from 'vuedraggable'
export default defineComponent({
  props: {
    list: {
      type: Array as PropType<ComponentData[]>,
      required: true
    },
    selectedId: {
      type: String,
      required: true
    }
  },
  emits: ['select', 'change'],
  components: {
    EyeOutlined,
    EyeInvisibleOutlined,
    LockOutlined,
    UnlockOutlined,
    DragOutlined,
    InlineEdit,
    Draggable
  },
  setup(_props, { emit }) {
    const handleClick = (id: string) => {
      emit('select', id)
    }
    const handleChange = (id: string, key: string, value: boolean) => {
      const data = {
        id,
        key,
        value,
        isRoot: true // 修改根属性or修改props
      }
      emit('change', data)
    }
    return {
      handleChange,
      handleClick
    }
  }
})
</script>

<style scoped lang="scss">
.ant-list-item {
  padding: 10px 15px;
  transition: all 0.5s ease-out;
  cursor: pointer;
  justify-content: normal;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
  &.ghost {
    opacity: 0.5;
  }
}
.ant-list-item.active {
  border: 1px solid #1890ff;
}
.ant-list-item:hover {
  background: #e6f7ff;
}
.ant-list-item > * {
  margin-right: 10px;
}
.ant-list-item button {
  font-size: 12px;
}
.ant-list-item .handle {
  cursor: move;
  margin-left: auto;
}
.ant-list-item .edit-area {
  width: 100%;
}
</style>
