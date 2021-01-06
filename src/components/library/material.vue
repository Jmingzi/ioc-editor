<template>
  <MobileMaterial :material="material" v-if="mode === 'mobile'">
    <slot>
      {{material.title}}
    </slot>
  </MobileMaterial>
  <ScreenMaterial :material="material" v-else>
    <slot>
      {{material.title}}
    </slot>
  </ScreenMaterial>
</template>

<script>
import MobileMaterial from './mobile/material'
import ScreenMaterial from './screen/material'
export default {
  name: 'ioc-material',
  components: {
    MobileMaterial,
    ScreenMaterial
  },
  inject: ['mode'],
  props: {
    material: {
      type: Object,
      require: true
    },
  }
}
</script>
