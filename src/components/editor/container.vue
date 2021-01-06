<template>
  <MobileLayerContainer
    :pid="pid"
    :layers="currentLayer"
    :group-name="groupName"
    v-if="mode === 'mobile'"
  />
  <ScreenLayerContainer
    v-else
    :pid="pid"
    :layers="currentLayer"
    :group-name="groupName"
  />
</template>
<script>
import MobileLayerContainer from './mobile/layer-container'
import ScreenLayerContainer from './screen/layer-container'
export default {
  name: 'ioc-container',
  components: {
    MobileLayerContainer,
    ScreenLayerContainer
  },
  inject: ['mode', 'iocFrame'],
  props: {
    pid: {
      type: [Number, String],
      default: () => undefined
    },
    groupName: {
      type: String,
      default: () => 'container'
    },
    page: {
      type: Array,
      default: () => ({})
    }
  },
  computed: {
    currentLayer () {
      return this.iocFrame.layers.filter(d => d.pid === this.pid)
    },
  }
}
</script>

<style>
.layer-container {
  width: 100%;
  height: 100%;
  min-height: 120px;
}
.drop-placeholder {
  border: 1px dotted blue;
  box-sizing: border-box;
  background-color: grey;
  opacity: .6;
  border-radius: 2px;
  padding-bottom: 20px;
}
</style>
