<template>
  <ioc-screen
    :key="mode"
    :mode="mode"
    v-model="screen"
    :groups="groups"
    @change="handleChange"
  >
    <template #header>
      <a @click="triggerMode">
        {{mode === 'mobile' ? '小屏模式' : '中屏模式'}}
      </a>
    </template>

    <template #library>
      <ioc-library>
        <ioc-group title="容器组件">
          <ioc-material :material="groups[0].materials[0]"/>
        </ioc-group>
        <ioc-material :material="groups[0].materials[0]"/>
      </ioc-library>
    </template>

    <template #editor>
      <ioc-editor render="render">
<!--        <div class="editor">-->
<!--          <div class="editor__header">-->
<!--            编辑头部-->
<!--          </div>-->
<!--          <div class="editor__content">-->
<!--            <ioc-container />-->
<!--          </div>-->
<!--        </div>-->
      </ioc-editor>
    </template>

    <template #setting>
      <ioc-setting #default="{active}">
        <Config :active="active"/>
      </ioc-setting>
    </template>
  </ioc-screen>
</template>
<script>
import Vue from 'vue'
import Render from './Render'
import Config from './Config'

// 全局注册渲染组件
Vue.component(Render.name, Render)
export default {
  name: 'Demo',
  components: {
    Config
  },
  data () {
    return {
      screen: {
        layers: [],
        iocFrame: {}
      },
      mode: 'mobile',

      // 物料分组
      groups: [
        {
          title: '基础容器',
          materials: [
            {
              title: '组件1',
              init: () => ({
                id: Date.now(),
                title: `组件1${Date.now()}`
              }),
              component: 'render'
            }
          ]
        }
      ]
    }
  },
  methods: {
    triggerMode () {
      if (this.mode === 'screen') {
        this.mode = 'mobile'
      } else {
        this.mode = 'screen'
      }
    },
    handleChange (layers) {
      console.log('handleChange:', JSON.stringify(layers, 0, 2))
    }
  }
}
</script>

<style lang="less">
.demo {
  width: 100%;
  height: 100%;
}

.editor {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  &__header {
    height: 39px;
    line-height: 39px;
  }

  &__content {
    flex: 1;
  }
}

</style>
