<template>
  <div class="layout" :style="style">
    <div class="layout__operation">
      <div class="cancel" @click="handleCancel">
        取消
      </div>
      <div class="align">
        <Tooltip v-for="option in alignOptions" :key="option.value" :title="option.label">
          <div class="item">
            <i :class="`iconfont icon-align-${option.value}`" @click="handleAlign($event, option.value)"/>
          </div>
        </Tooltip>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { Tooltip } from 'ant-design-vue'
const minAndMax = (values = []) => {
  return values.reduce((result, item) => {
    if (item < result[0]) {
      result[0] = item
    }
    if (item > result[1]) {
      result[1] = item
    }
    return result
  }, [values[0], values[1]])
}
const calcAlignPosition = (align, position, layoutLayers, layoutLayersInfo) => {
  const [first, ...rest] = layoutLayers
  const {id, position: { x }, size: { width }} = layoutLayersInfo[first]

  // 重新计算位置位置关系
  let newPositions = []
  switch (align) {
    case 'left': {
      // 左对齐
      const targetLeft = x
      newPositions = rest.map(d => {
        const { id, position, size } = layoutLayersInfo[d]
        return {
          id,
          position: {
            x: targetLeft,
            y: position.y
          },
          size
        }
      })
      break
    }
    case 'right': {
      // 右对齐
      const targetRight = x + width
      newPositions = rest.map(d => {
        const { id, position, size } = layoutLayersInfo[d]
        return {
          id,
          position: {
            x: targetRight - size.width,
            y: position.y
          },
          size
        }
      })
      break
    }
    case 'vertical-center': {
      // 垂直居中对齐：X坐标不变，纵坐标：YCenter - height / 2
      const { y, height } = position
      const targetVerticalCenter = y + height / 2
      newPositions = layoutLayers.map(d => {
        const { id, position, size } = layoutLayersInfo[d]
        return {
          id,
          position: {
            x: position.x,
            y: targetVerticalCenter - size.height / 2
          },
          size
        }
      })
      break
    }
    case 'vertical-split': {
      // 纵向均分：X坐标不变
      const { y, height } = position
      const sortLayers = Object.keys(layoutLayersInfo).map(key => layoutLayersInfo[key]).sort((a, b) => a.position.y - b.position.y)
      console.log('sortLayers:', sortLayers)
      const splitHeight = height / (layoutLayers.length - 1)
      newPositions = layoutLayers.map((d, index) => {
        const { id, position, size } = layoutLayersInfo[d]
        if (index === 0) {
          return {
            id,
            position: {
              x: position.x,
              y: y
            },
            size
          }
        }
        if (index === layoutLayers.length - 1) {
          return {
            id,
            position: {
              x: position.x,
              y: y + height - size.height
            },
            size
          }
        }
        return {
          id,
          position: {
            x: position.x,
            y: y + splitHeight * index - size.height / 2
          },
          size
        }
      })
      break
    }
    case 'horizontal-center': {
      // 水平居中：Y坐标不变，XCenter - width / 2
      const { x, width } = position
      const targetHorizontalCenter = x + width / 2
      newPositions = layoutLayers.map(d => {
        const { id, position, size } = layoutLayersInfo[d]
        return {
          id,
          position: {
            x: targetHorizontalCenter - size.width / 2,
            y: position.y
          },
          size
        }
      })
      break
    }
    case 'horizontal-split': {
      // 横向均分：Y坐标不变
      const { x, width } = position
      const splitWidth = width / (layoutLayers.length - 1)
      newPositions = layoutLayers.map((d, index) => {
        const { id, position, size } = layoutLayersInfo[d]
        if (index === 0) {
          return {
            id,
            position: {
              x: x,
              y: position.y
            },
            size
          }
        }
        if (index === layoutLayers.length - 1) {
          return {
            id,
            position: {
              x: x + width - size.width,
              y: position.y
            },
            size
          }
        }
        if (![0, layoutLayers.length - 1].includes(index)) {
          return {
            id,
            position: {
              x: x + splitWidth * index - size.width  / 2,
              y: position.y
            },
            size
          }
        }
        return layoutLayersInfo[d]
      })
      break
    }
    case 'top': {
      // 顶部对齐
      const { y } = position
      const targetY = y
      newPositions = layoutLayers.map(d => {
        const { id, position, size } = layoutLayersInfo[d]
        return {
          id,
          position: {
            x: position.x,
            y: targetY
          },
          size
        }
      })
      break
    }
    case 'bottom': {
      // 底部对齐
      const { y, height } = position
      const targetY = y + height
      newPositions = layoutLayers.map(d => {
        const { id, position, size } = layoutLayersInfo[d]
        return {
          id,
          position: {
            x: position.x,
            y: targetY - size.height
          },
          size
        }
      })
      break
    }
  }
  return newPositions.reduce((result, layoutLayer) => {
    result[layoutLayer.id] = layoutLayer
    return result
  }, {
    [id]: layoutLayersInfo[id]
  })
}

export default {
  name: 'ioc-layout',
  inject: ['iocFrame'],
  components: {
    Tooltip
  },
  data () {
    return {
      align: 'none',
      alignOptions: [
        { label: '左对齐', value: 'left' },
        { label: '右对齐', value: 'right' },
        { label: '垂直居中', value: 'vertical-center' },
        { label: '水平居中', value: 'horizontal-center' },
        { label: '顶对齐', value: 'top' },
        { label: '底对齐', value: 'bottom' }
        // { label: '纵向均分', value: 'vertical-split' },
        // { label: '横向均分', value: 'horizontal-split' }
      ]
    }
  },
  mounted () {
    window.addEventListener('keydown', this.handleWindowKeydown)
    window.addEventListener('keyup', this.handleWindowKeyUp)
    document.addEventListener('click', this.handleClick)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleWindowKeydown)
    window.removeEventListener('keyup', this.handleWindowKeyUp)
    document.removeEventListener('click', this.handleClick)
  },
  computed: {
    layoutPosition () {
      const { layers, layoutLayers } = this.iocFrame
      if (layoutLayers.length > 1) {
        const { x, y } = layers.filter(layer => layoutLayers.includes(layer.id))
          .map(layer => {
            const { position: { x, y }, size: { width, height } } = layer
            return [{ x, y }, { x: x + width, y: y + height }]
          })
          .reduce(({ x, y }, [lt, rb]) => {
            return {
              x: x.concat([lt.x, rb.x]),
              y: y.concat([lt.y, rb.y])
            }
          }, { x: [], y: [] })
        const [minX, maxX] = minAndMax(x)
        const [minY, maxY] = minAndMax(y)
        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        }
      }
      return {}
    },
    style () {
      const { layoutLayers } = this.iocFrame
      if (layoutLayers.length > 1) {
        const { x, y, width, height } = this.layoutPosition
        return {
          visibility: 'visible',
          top: `${y}px`,
          left: `${x}px`,
          width: `${width + 4}px`,
          height: `${height}px`
        }
      }
      return {
        visibility: 'hidden'
      }
    },
    visible () {
      return this.iocFrame.layoutLayers.length > 1
    }
    // sequenceLayers () {
    //   return this.iocFrame.layers.sort((a, b) => a.zIndex - b.zIndex)
    // }
  },
  methods: {
    handleWindowKeydown (event) {
      this.iocFrame.setKeyCode(event.keyCode)
    },
    handleWindowKeyUp () {
      this.iocFrame.setKeyCode()
    },
    handleClick () {
      this.visible && this.iocFrame.updateLayoutToLayers()
    },
    handleCancel () {
      this.iocFrame.setLayout()
    },
    handleAlign (event, align) {
      event.stopPropagation()
      const { layoutLayers, layoutLayersInfo } = this.iocFrame
      this.iocFrame.setLayoutLayersInfo(
        calcAlignPosition(align, this.layoutPosition, layoutLayers, layoutLayersInfo)
      )
    }
  },

}
</script>

<style scoped lang="less">
@activeColor: #2266FF;
.layout {
  position: absolute;
  border-radius: 2px;
  background-color: transparent;
  border: 1px solid @activeColor;

  &__operation {
    position: absolute;
    z-index: 998;
    top: -32px;
    left: 0;
    width: 100%;
    height: 32px;
    display: flex;
    padding: 0 4px;
    align-items: center;
    justify-content: space-between;
    border: 1px solid @activeColor;
    pointer-events: auto !important;
    color: currentColor;
    .cancel {
      cursor: pointer;
    }
    .align {
      display: flex;
      align-items: center;
      .item {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
