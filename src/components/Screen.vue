<template>
  <div class="screen">
    <div class="screen__header">
      <slot name="header"></slot>
    </div>
    <div class="screen__content">
      <slot name="library"></slot>
      <slot name="editor">
        <Editor />
      </slot>
      <slot name="setting"></slot>
    </div>
  </div>
</template>
<script>

import NP from 'number-precision'
import Editor from './editor'
export default {
  name: 'ioc-screen',
  components: {
    Editor
  },
  model: {
    prop: 'frame',
    event: 'change'
  },
  props: {
    mode: {
      type: String,
      default: () => 'mobile'
    },
    frame: {
      type: Object,
      default: () => ({})
    },
  },
  provide () {
    return {
      iocFrame: this,
      mode: this.mode,
      updateLayer: this.updateLayer
    }
  },
  data () {
    return {
      active: undefined,
      // 图层
      past: [], // 上一步
      future: [], // 下一步
      scale: 1, // 缩放比例
      layers: [],

      keyCode: undefined,
      layoutLayers: [],
      layoutLayersInfo: {}
    }
  },
  mounted () {
    const { layers } = this.frame
    this.layers = layers
    this.emitChange(layers)
    this.adaptScreen()
  },
  watch: {
    layoutLayers(layoutLayers) {
      if (this.mode === 'screen') {
        this.layoutLayersInfo = layoutLayers.reduce((result, id) => {
          const layer = this.layers.find(item => id === item.id)
          if (layer) {
            const { id, position: { x, y }, size: { width, height } } = layer
            result[id] = {
              id,
              position: { x, y },
              size: { width, height }
            }
          }
          return result
        }, {})
      }
    },
    frame (newFrame) {
      this.layers = newFrame.layers
      if (this.active) {
        this.active =  newFrame.layers.find(item => item.id === this.active.id)
      }
    }
  },
  computed: {
    hasPrev () {
      return this.past.length > 0
    },
    hasNext () {
      return this.future.length > 0
    }
  },
  methods: {
    emitChange (layers) {
      this.layers = layers
      this.$emit('change', {
        layers,
        iocFrame: this
      })
    },
    // 适配屏幕
    adaptScreen (screenWidth = 1920, screenHeight = 1200) {
      const clientWidth = document.body.clientWidth
      const clientHeight = document.body.clientHeight
      const widthScale = NP.divide(clientWidth, screenWidth)
      const heightScale = NP.divide(clientHeight, screenHeight)
      const scale = NP.round(widthScale > heightScale ? heightScale : widthScale, 1)
      this.setScale(scale)
    },
    setKeyCode (keyCode) {
      this.keyCode = keyCode
    },
    setScale (scale) {
      this.scale = scale
      this.emitChange(this.layers)
    },
    setActive (active) {
      this.active = active
    },
    setLayout (layoutLayers = []) {
      this.layoutLayers = layoutLayers
    },
    addToLayout (id) {
      this.layoutLayers.push(id)
    },
    removeFromLayout (id) {
      this.layoutLayers = this.layoutLayers.filter(d => d !== id)
    },
    setLayoutLayersInfo (layoutLayersInfo) {
      this.layoutLayersInfo = layoutLayersInfo
    },
    updateLayoutToLayers () {
      this.setPrev()
      this.layers.map(layer => {
        const info = this.layoutLayersInfo[layer.id]
        if (info) {
          const { position } = info
          layer.position = position
        }
      })
      // 清空数据
      this.layoutLayers = []
      this.layoutLayersInfo = {}
    },
    // 添加图层
    addLayer (layer, source) {
      this.setPrev() // 备份数据
      const backupLayers = this.layers.slice()
      if (source) {
        const index = backupLayers.findIndex(item => item.id === source.id)
        if (index > -1) {
          backupLayers.splice(index, 0, layer)
        }
      } else {
        backupLayers.push(layer)
      }
      this.emitChange(backupLayers)
      this.active = layer
    },
    // 删除图层
    removeLayer (layer) {
      this.setPrev() // 备份数据
      const { id, pid } = layer
      const index = this.layers.findIndex(item => (item.id === id && item.pid === pid))
      if (index > -1) {
        if (this.active && this.active.id === id) {
          this.active = undefined
        }
        const backupLayers = this.layers.slice()
        backupLayers.splice(index, 1)
        this.emitChange(backupLayers.sort((a, b) => a.zIndex - b.zIndex).map((layer, index) => {
          layer.zIndex = index
          return layer
        }))
      }
    },
    clearLayers () {
      this.setPrev() // 备份数据
      this.emitChange([])
      this.active = undefined
    },
    // 交换图层位置
    swapLayer (source, target) {
      this.setPrev() // 备份数据
      const sourceIndex = this.layers.findIndex(item => item.id === source.id)
      const targetIndex = this.layers.findIndex(item => item.id === target.id)
      if (sourceIndex > -1 && targetIndex > -1) {
        const backupLayers = this.layers.slice()
        backupLayers[sourceIndex] = target
        backupLayers[targetIndex] = source
        this.emitChange(backupLayers)
      }
    },
    // 更新图层
    updateLayer (layer) {
      const { id } = layer
      const index = this.layers.findIndex(item => item.id === id)
      if (index > -1) {
        const backupLayers = this.layers.slice()
        backupLayers[index] = layer
        this.emitChange(backupLayers)
      }
    },
    moveLayer (id, position) {
      const index = this.layers.findIndex(item => item.id === id)
      if (index > -1) {
        const backupLayers = this.layers.slice()
        backupLayers[index].position.x = position.x
        backupLayers[index].position.y = position.y
        this.emitChange(backupLayers)
      }
    },
    resizeLayer (id, position, size) {
      const index = this.layers.findIndex(item => item.id === id)
      if (index > -1) {
        const backupLayers = this.layers.slice()
        backupLayers[index].position.x = position.x
        backupLayers[index].position.y = position.y
        backupLayers[index].size.width = size.width
        backupLayers[index].size.height = size.height
        this.emitChange(backupLayers)
      }
    },
    // 层级
    setLayersLevel (levels) {
      const backupLayers = this.layers.slice()
      this.emitChange(backupLayers.map(item => {
        item.zIndex = levels[item.id]
        return item
      }))
    },
    // 保存上一步
    setPrev () {
      if (this.past.length === 20) {
        this.past.shift()
      }
      this.past.push(JSON.stringify(this.layers))
    },
    // 获取上一步
    getPrev () {
      if (this.past.length > 0) {
        this.emitChange(JSON.parse(this.past.pop()))
      }
    },
    // 保存下一步
    setNext () {
      this.future.unshift(JSON.stringify(this.layers))
    },
    // 获取下一步
    getNext () {
      if (this.future.length > 0) {
        this.emitChange(JSON.parse(this.future.shift()))
      }
    },
    // 上一步
    prev  () {
      this.setNext()
      this.getPrev()
    },
    // 下一步
    next () {
      this.setPrev()
      this.getNext()
    },
    clear () {
      this.$contextMenu && this.$contextMenu().close()
    }
  }
}
</script>

<style>
.screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.screen__header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px #0000001A;
}
.screen__content {
  width: 100%;
  flex: 1;
  position: relative;
}

</style>
