<template>
  <IocMobileLayer v-if="mode === 'mobile'" :layer="layer">
    <component
      :layer="layer"
      :is="render"
    />
  </IocMobileLayer>
  <IocScreenLayer v-else :layer="layer">
    <component
      :layer="layer"
      :is="render"
    />
  </IocScreenLayer>
</template>
<script>
import IocMobileLayer from './mobile/layer'
import IocScreenLayer from './screen/layer'
export default {
  name: 'ioc-layer',
  components: {
    IocMobileLayer,
    IocScreenLayer
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
  }
}
</script>
