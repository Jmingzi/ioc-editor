<template>
  <div class="render">
    <div class="render__header">
      我的组件渲染 啦啦啦 {{layer.title}}
    </div>
    <div class="render__content">
      内容区域
    </div>
  </div>
</template>
<script>

export default {
  name: 'Render',
  inject: [
    'layers'
  ],
  props: {
    layer: {
      type: Object,
      require: true
    }
  },
  computed: {
    currentLayer () {
      return this.layers.filter(d => d.pid === this.layer.id)
    },
  }
}
</script>

<style lang="less">
.render {
  width: 100%;
  height: 100%;
  display: flex;
  align-self: center;
  justify-content: flex-start;
  flex-direction: column;
  cursor: pointer;

  &__header {
    width: 100%;
    height: 39px;
    line-height: 39px;
  }

  &__content {
    width: 100%;
    height: 80px;
  }
}
</style>
