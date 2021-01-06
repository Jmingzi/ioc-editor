<template>
  <div
    class="shape"
    :style="style"
    :class="{'active': isActive}"
    @click="handleClick"
    @mousedown="handleMouseDown"
    @contextmenu="handleContextMenu"
  >
    <div
      :key="index"
      :class="point"
      class="shape__point"
      v-for="(point, index) in shapePoints"
      @mousedown="handleMouseDownOnPoint($event, point)"
      :style="{ cursor: `${point.split('').reverse().map(m => direction[m]).join('')}-resize`}"
    >
    </div>
    <div class="shape__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import IocContextMenu from '../../context-menu'
Vue.use(IocContextMenu)
export default {
  name: 'ioc-shape',
  props: {
    layer: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['iocFrame', 'moveLayer', 'resizeLayer'],
  data () {
    return {
      shapePoints: ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb'],
      direction: { // 光标显示样式
        t: 'n',
        b: 's',
        l: 'w',
        r: 'e',
      },
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
      const { id, zIndex, position: { x, y }, size: { width, height }, fullscreen = false } = this.layer
      const { layoutLayers, layoutLayersInfo } = this.iocFrame
      const isLayout = layoutLayers.length > 1 && layoutLayers.includes(id)
      if (isLayout) {
        const { position } = layoutLayersInfo[id]
        return {
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: width + 'px',
          height: height + 'px',
          zIndex,
        }
      }

      if (fullscreen) {
        return {
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex,
        }
      }

      return {
        left: x + 'px',
        top: y + 'px',
        width: width + 'px',
        height: height + 'px',
        zIndex,
      }
    },
    menuOptions () {
      let options = []
      const length = this.iocFrame.layers.length
      const zIndex = this.layer.zIndex
      if (zIndex < length -1) {
        options = [
          {
            value: 'top',
            label: '置顶',
          },
          {
            value: 'up',
            label: '上移',
          }
        ]
      }
      if (zIndex > 0) {
        options = options.concat([
          {
            value: 'bottom',
            label: '置底',
          },
          {
            value: 'down',
            label: '下移',
          }
        ])
      }
      options.push({
        value: 'delete',
        label: '删除',
      })
      return options
    }
  },
  methods: {
    handleClick (event) {
      event.stopPropagation()
      this.iocFrame.clear()
      const { id } = this.layer
      if (this.iocFrame.keyCode === 91) {
        // 多选
        if (this.iocFrame.layoutLayers.includes(id)) {
          this.iocFrame.removeFromLayout(id)
        } else {
          this.iocFrame.addToLayout(id)
        }
      } else {
        this.iocFrame.setLayout([id])
      }
    },
    handleContextMenu (event) {
      event.preventDefault()
      event.stopPropagation()
      this.$contextMenu && this.$contextMenu(this.menuOptions).register(this.handleOption).show(event)
    },
    handleOption (key) {
      const { id } = this.layer
      const levels = this.iocFrame.layers.map(({ id, zIndex }) => ({ id, zIndex })).sort((a, b) => a.zIndex - b.zIndex)
      const sourceIndex = levels.findIndex(item => id === item.id)
      const source = levels[sourceIndex]
      let needUpdate = false
      switch (key) {
        case 'top': {
          if (sourceIndex < levels.length - 1) {
            needUpdate = true
            levels.splice(sourceIndex, 1)
            levels.push(source)
          }
          // 置顶
          break
        }
        case 'bottom': {
          // 置底
          if (sourceIndex > 0) {
            needUpdate = true
            levels.splice(sourceIndex, 1)
            levels.unshift(source)
          }
          break
        }
        case 'up': {
          // 上移一层
          if (sourceIndex < levels.length - 1) {
            needUpdate = true
            levels[sourceIndex] = levels[sourceIndex + 1]
            levels[sourceIndex + 1] = source
          }
          break
        }
        case 'down': {
          // 下移一层
          if (sourceIndex > 0) {
            needUpdate = true
            levels[sourceIndex] = levels[sourceIndex - 1]
            levels[sourceIndex - 1] = source
          }
          break
        }
        case 'delete': {
          // 删除
          this.iocFrame.removeLayer(this.layer)
          break
        }
      }
      if (needUpdate) {
        const newLevel = levels.map((item, zIndex) => ({ ...item, zIndex }))
          .reduce((result, { id, zIndex }) => {
            result[id] = zIndex
            return result
          }, {})
        // 重新这只图层层级
        this.iocFrame.setPrev()
        this.iocFrame.setLayersLevel(newLevel)
      }
    },
    handleMouseDown (event) {
      event.stopPropagation()
      event.preventDefault()
      this.iocFrame.clear()
      this.iocFrame.setActive(this.layer)
      const { id, position: { x, y } } = this.layer

      const move = (moveEvent) => {
        const offsetX = moveEvent.pageX - event.pageX
        const offsetY = moveEvent.pageY - event.pageY
        this.iocFrame.moveLayer(id, { x: x + offsetX, y: y + offsetY})
      }
      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', this.iocFrame.setPrev, { once: true })
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    handleMouseDownOnPoint (event, point) {
      event.stopPropagation()
      event.preventDefault()
      this.iocFrame.clear()
      const { id, position: { x, y }, size: { width, height } } = this.layer
      const move = (moveEvent) => {
        const movementX = moveEvent.pageX - event.pageX
        const movementY = moveEvent.pageY - event.pageY
        switch (point) {
          case 't': {
            this.iocFrame.resizeLayer(id, { x, y: y + movementY }, { width, height: height - movementY })
            break
          }
          case 'r': {
            this.iocFrame.resizeLayer(id, { x, y }, { width: width + movementX, height })
            break
          }
          case 'b': {
            this.iocFrame.resizeLayer(id, { x, y }, { width, height: height + movementY })
            break
          }
          case 'l': {
            this.iocFrame.resizeLayer(id, { x: x + movementX, y }, { width: width - movementX, height })
            break
          }
          case 'lt': {
            this.iocFrame.resizeLayer(id, { x: x + movementX, y: y + movementY }, { width: width - movementX, height: height - movementY })
            break
          }
          case 'rt': {
            this.iocFrame.resizeLayer(id, { x, y: y + movementY }, { width: width + movementX, height: height - movementY })
            break
          }
          case 'lb': {
            this.iocFrame.resizeLayer(id, { x: x + movementX, y }, { width: width - movementX, height: height + movementY })
            break
          }
          case 'rb': {
            this.iocFrame.resizeLayer(id, { x, y }, { width: width + movementX, height: height + movementY })
            break
          }
        }
      }
      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', () => {
        this.iocFrame.setPrev() // 备份数据
      }, { once: true })
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    getPointStyle(point) {
      const { width, height } = this.layer
      const hasT = /t/.test(point)
      const hasB = /b/.test(point)
      const hasL = /l/.test(point)
      const hasR = /r/.test(point)
      let newLeft = 0
      let newTop = 0

      // 四个角的点
      if (point.length === 2) {
        newLeft = hasL? 0 : width
        newTop = hasT? 0 : height
      } else {
        // 上下两点的点，宽度居中
        if (hasT || hasB) {
          newLeft = width / 2
          newTop = hasT? 0 : height
        }
        // 左右两边的点，高度居中
        if (hasL || hasR) {
          newLeft = hasL? 0 : width
          newTop = Math.floor(height / 2)
        }
      }

      const style = {
        marginLeft: hasR? '-4px' : '-3px',
        marginTop: '-3px',
        left: `${newLeft}px`,
        top: `${newTop}px`,
        cursor: point.split('').reverse().map(m => this.directionKey[m]).join('') + '-resize',
      }
      return style
    },
  }
}
</script>

<style lang="less">
@pointSize: 6px;
.shape {
  position: absolute;
  z-index: 900;
  width: 100%;
  height: 100%;
  border: 1px solid currentColor;

  &__point {
    position: absolute;
    background: currentColor;
    width: @pointSize;
    height: @pointSize;
    border-radius: 50%;
    z-index: 9999;
    display: none;

    &.l {
      top: calc(50% - @pointSize/2);
      left: calc(-@pointSize/2);
    }
    &.r {
      top: calc(50% - @pointSize/2);
      right: calc(-@pointSize/2);
    }
    &.t {
      top: calc(-@pointSize/2);
      left: calc(50% - @pointSize/2);
    }
    &.b {
      bottom: calc(-@pointSize/2);
      left: calc(50% - @pointSize/2);
    }
    &.lt {
      top: calc(-@pointSize/2);
      left: calc(-@pointSize/2);
    }
    &.rt {
      top: calc(-@pointSize/2);
      right: calc(-@pointSize/2);
    }
    &.lb {
      left: calc(-@pointSize/2);
      bottom: calc(-@pointSize/2);
    }
    &.rb {
      right: calc(-@pointSize/2);
      bottom: calc(-@pointSize/2);
    }
  }

  &:hover,
  &.active {
    z-index: 999 !important;
    border: 1px solid #2266FF;
  }

  &.active {
    .shape__point {
      display: flex;
    }
  }

  &__content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
