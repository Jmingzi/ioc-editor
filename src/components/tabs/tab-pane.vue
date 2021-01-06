<template>
  <div class="tab-pane" v-if="active">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ioc-tabpane',
  props: {
    tabKey: [String, Number],
    tab: String
  },
  created () {
    this.$parent && this.$parent.addTab({
      key: this.tabKey,
      tab: this.tab
    })
  },
  computed: {
    active () {
      if (this.$parent) {
        return this.$parent.current === this.tabKey
      }
      return true
    }
  }
}
</script>
<style scoped lang="less">
.tab-pane {
  width: 100%;
  height: 100%;
  overflow: auto;
  &.hidden {
    display: none !important;
  }
}
</style>
