<template>
  <div
    class="layer-container"
    :class="{ 'empty': layers.length === 0 }"
    @drop="drop"
    @dragover="dragOver"
    :group-name="groupName"
  >
    <template v-if="layers.length > 0">
      <Shape
        :layer="layer"
        :key="layer.id"
        v-for="layer in layers"
      >
        <Layer :layer="layer" />
      </Shape>
    </template>
    <template v-else>
      <div class="empty">
        <i class="icon icon-editor-empty" />
        <label>请从左侧拖入控件来创建图层</label>
      </div>
    </template>
  </div>
</template>
<script>
import Shape from './shape'
import Layer from '../layer'
export default {
  name: 'ioc-layer-container',
  components: {
    Shape,
    Layer
  },
  inject: [
    'iocFrame',
    'canvasPosition'
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
  methods: {
    drop (event) {
      event.preventDefault()
      event.stopPropagation()
      // TODO 容器组件的额外处理
      const { pageX, pageY } = event
      const material = JSON.parse(event.dataTransfer.getData('material'))
      this.iocFrame.addLayer({
        ...material,
        pid: this.pid,
        zIndex: this.iocFrame.layers.length,
        position: {
          x: pageX - this.canvasPosition.x,
          y: pageY - this.canvasPosition.y - 54
        }
      })
    },
    dragOver (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>

<style scoped lang="less">
.empty {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .icon {
    width: 156px;
    height: 100px;

    background-image: url('../../../assets/image/icon-editor-empty.png');
    background-position: center;
    background-size: cover;
  }

  label {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>
