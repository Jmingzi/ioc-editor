<template>
  <div class="tabs">
    <div class="tabs__header">
      <div
        class="tab"
        :key="item.key"
        v-for="item in tabs"
        :class="{ active: current === item.key }"
        @click="onChange(item.key)"
      >
        {{item.tab}}
      </div>
    </div>
    <div class="tabs__content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ioc-tabs',
  data () {
    return {
      current: undefined,
      tabs: []
    }
  },
  props: {
    defaultActiveKey: [String, Number]
  },
  created () {
    if (this.defaultActiveKey) {
      this.onChange(this.defaultActiveKey)
    }
  },
  methods: {
    addTab (tab) {
      this.tabs.push(tab)
    },
    onChange (tab) {
      if (this.current !== tab) {
        this.current = tab
        this.$emit('change', tab)
      }
    }
  }
}
</script>
<style scoped lang="less">
.tabs {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    height: 39px;
    line-height: 39px;
    .tab {
      width: 100%;
      text-align: center;
      white-space: nowrap;
      border-radius: 6px 6px 0 0;
      color: #5C626B;
      background-color: rgb(245, 246, 247);
      cursor: pointer;

      &.active {
        color: #488FF9;
        background-color: #FFFFFF;
      }
    }
  }

  &__content {
    flex: 1;
    margin-top: 8px;
    width: 100%;
    padding: 4px;
    overflow: auto;
  }
}
</style>
