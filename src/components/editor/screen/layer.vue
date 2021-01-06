<template>
  <div
    class="layer"
    :style="style"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ioc-screen-layer',
  inject: [
    'mode',
    'render',
    'iocFrame',
  ],
  props: {
    layer: {
      type: Object,
      require: true
    }
  },
  computed: {
    isActive () {
      if (this.iocFrame.active) {
        return this.iocFrame.active.id === this.layer.id
      }
      return false
    },
    style () {
      const { zIndex, size: { width, height } } = this.layer
      return {
        width: width + 'px',
        height: height + 'px',
        zIndex,
      }
    }
  }
}
</script>

<style scoped lang="less">
.layer {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-height: 80px;
}
</style>
