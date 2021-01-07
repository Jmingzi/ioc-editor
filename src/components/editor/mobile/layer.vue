<template>
  <div
    class="layer"
    :class="{'active': isActive}"
    @click="handleClick"
  >
    <slot></slot>
    <div class="layer__operation">
      <Icon type="close" @click="handleDelete"/>
    </div>
  </div>
</template>
<script>
import { Icon } from 'ant-design-vue'
export default {
  name: 'ioc-mobile-layer',
  components: {
    Icon
  },
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
    }
  },
  methods: {
    handleDelete (event) {
      event.stopPropagation()
      this.iocFrame.removeLayer(this.layer)
    },
    handleClick (event) {
      event.stopPropagation()
      this.iocFrame.clear()
      this.iocFrame.setActive(this.layer)
    }
  }
}
</script>

<style scoped lang="less">
@activeColor: #2266FF;
.layer {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 2px;
  border: 1px solid #E9ECF0;
  position: relative;
  min-height: 80px;

  &:hover,
  &.active {
    z-index: 999 !important;
    border: 1px solid #2266FF;
  }

  &__operation {
    position: absolute;
    border: 1px solid @activeColor;
    top: -1px;
    right: -1px;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #ffffff;
    background: @activeColor;
    cursor: pointer;
    display: none;
  }

  &.active {
    border: 1px solid @activeColor;
    border-radius: 2px;
    & > .layer__operation {
      display: flex;
    }
  }
}
</style>
