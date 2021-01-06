<template>
  <div
    class="ioc-context-menu"
    :style="style"
    v-show="visible"
    @mousedown.stop
    @contextmenu.prevent
  >
    <div
      class="option"
      :class="{'disabled': option.disabled}"
      :key="option.value"
      v-for="option in options"
      @click="handleChange($event, option.value)"
    >
      {{option.label}}
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ioc-context-menu',
  data() {
    return {
      visible: false,
      options: [],
      position: {
        x: 0,
        y: 0,
      }
    };
  },
  computed: {
    style () {
      const { x, y } = this.position
      return {
        left: `${x + 4}px`,
        top: `${y + 10}px`
      };
    }
  },
  methods: {
    register (callback) {
      this.callback = callback
      return this
    },
    show (event) {
      event.preventDefault()
      const { pageX, pageY } = event
      this.visible = true
      this.position = {
        x: pageX,
        y: pageY
      }
    },
    close () {
      this.visible = false
    },
    handleChange (event, key) {
      event.stopPropagation()
      this.close()
      this.callback && this.callback(key)
    }
  }
};
</script>
<style lang="less">
.ioc-context-menu {
  z-index: 100000;
  position: absolute;
  border-radius: 4px;
  padding: 10px;
  background-color: #ffffff;
  width: auto;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  .option {
    text-align: center;
    width: 100%;
    padding: 0 8px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;

    &.disabled {
      color: #ffffff;
      pointer-events: none;
      background-color: gray;
      opacity: .4;
    }

    & + .option {
      margin-top: 4px;
    }

    &:hover {
      color: #ffffff;
      background-color: #2266FF;
      opacity: .6;
    }
  }
}
</style>
