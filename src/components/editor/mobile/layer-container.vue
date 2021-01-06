<template>
  <Container
    @drop="drop"
    class="layer-container"
    :group-name="groupName"
    :drop-placeholder="dropPlaceholder"
    :get-child-payload="getChildPayload"
    :should-accept-drop="shouldAcceptDrop"
  >
    <template v-if="layers.length > 0">
      <Draggable
        :key="layer.id"
        v-for="layer in layers"
      >
        <Layer :layer="layer"/>
      </Draggable>
    </template>

    <template v-else>
      <div class="empty">
        请拖入组件
      </div>
    </template>
  </Container>
</template>
<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import Layer from '../layer'
export default {
  name: 'ioc-layer-container',
  components: {
    Container,
    Draggable,
    Layer
  },
  inject: [
    'iocFrame'
  ],
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    pid: {
      type: Number,
      default: () => undefined
    },
    groupName: {
      type: String,
      default: () => 'container'
    }
  },
  data () {
    return {
      dropPlaceholder: {
        showOnTop: false,
        className: 'drop-placeholder',
      },
    }
  },
  methods: {
    getChildPayload (index) {
      return this.layers[index]
    },
    shouldAcceptDrop(srcOptions, payload) {
      if (this.groupName === 'tab-pane') {
        return ![17, 19].includes(payload.componentType)
      }
      return true
    },
    drop (dropResult) {
      const { addedIndex, removedIndex, payload } = dropResult
      const isAdd = addedIndex !== null
      const isRemove = removedIndex !== null
      if (addedIndex !== removedIndex) {
        if (isAdd && isRemove) {
          // Tips 交换组件位置
          this.iocFrame.swapLayer(
            this.layers[addedIndex],
            this.layers[removedIndex]
          )
        } else if (isAdd) {
          // Tips 拖入组件
          this.iocFrame.addLayer({
            ...payload,
            pid: this.pid,
          }, this.layers[addedIndex])
        } else if (isRemove) {
          // Tips 拖出组件
          this.iocFrame.removeLayer(this.layers[removedIndex])
        }
      }
    }
  }
}
</script>

<style lang="less">
.layer-container {
  position: relative;
  .empty {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    align-items: center;
    justify-content: center;
    display: none;
  }
}
</style>
