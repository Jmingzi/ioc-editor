<template>
  <div class="group">
    <div class="group__header">
      <div class="operation">
        <Icon
          type="caret-right"
          :class="{'expand': expand.open}"
          @click="expand.trigger()"
        />
      </div>
      <label class="title">{{title}}</label>
    </div>
    <div
      class="group__content"
      :class="{'hidden' : !expand.open}"
    >
      <slot>
        <Material
          :key="index"
          :material="material"
          v-for="(material, index) in materials"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import Material from './material'
export default {
  name: 'ioc-group',
  props: {
    title: String,
    materials: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Icon,
    Material,
  },
  data () {
    return {
      expand: {
        open: true,
        trigger: () => this.expand.open = !this.expand.open
      },
    }
  }
}
</script>
<style scoped lang="less">
.group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 0 20px;

  &__header {
    height: 39px;
    line-height: 39px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .operation {
      margin-right: 4px;
      .anticon {
        transition-duration: .25s;
        &.expand {
          transform: rotateZ(90deg);
        }
      }
    }

    .title {
      color: #262A30;
      font-size: 14px;
      height: 39px;
      line-height: 39px;
      text-align: right;
    }
  }

  &__content {
    width: 100%;
    padding: 4px;

    .container {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
  }

  .hidden {
    display: none !important;
  }
}
</style>
