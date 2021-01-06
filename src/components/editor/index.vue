<template>
  <MobileLayerEditor v-if="mode === 'mobile'" :page="page">
    <slot></slot>
  </MobileLayerEditor>
  <ScreenLayerEditor v-else :page="page">
    <slot></slot>
  </ScreenLayerEditor>
</template>
<script>
import MobileLayerEditor from './mobile'
import ScreenLayerEditor from './screen'
export default {
  name: 'ioc-editor',
  components: {
    MobileLayerEditor,
    ScreenLayerEditor
  },
  inject: ['mode'],
  provide() {
    return {
      render: this.render
    }
  },
  props: {
    page: {
      type: Object,
      default: () => ({})
    },
    render: {
      type: String,
      default: () => 'render'
    }
  }
}
</script>
