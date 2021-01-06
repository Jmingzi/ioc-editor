<template>
  <DnDContainer
    behaviour="copy"
    :get-child-payload="initMaterial"
  >
    <Draggable>
      <slot>{{material.title}}</slot>
    </Draggable>
  </DnDContainer>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
export default {
  name: 'ioc-mobile-material',
  components: {
    DnDContainer: Container,
    Draggable
  },
  props: {
    material: {
      type: Object,
      require: true
    }
  },
  methods: {
    initMaterial () {
      const { init, ...rest } = this.material
      if (typeof init === 'function') {
        return init()
      }
      return {
        ...rest,
        id: Date.now(),
        title: `${rest.title}${Date.now()}`
      }
    }
  }
}
</script>
<style>
