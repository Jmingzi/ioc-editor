<template>
  <div
    class="draggable"
    draggable="true"
    @mousedown="onMouseDown"
    @dragstart="onDragStart"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ioc-screen-material',
  props: {
    material: {
      type: Object,
      require: true
    }
  },
  methods: {
    /******* 中屏 *******/
    onMouseDown (event) {
      event.stopPropagation()
    },
    onDragStart (event) {
      event.stopPropagation()
      const { init, ...rest } = this.material
      if (typeof init === 'function') {
        event.dataTransfer.setData('material', JSON.stringify(init()))
      } else {
        event.dataTransfer.setData('material', JSON.stringify({
          ...rest,
          id: Date.now(),
          title: `${rest.title}${Date.now()}`,
        }))
      }
    }
  }
}
</script>

<style>
.draggable {
  width: max-content;
  height: max-content;
}
</style>
