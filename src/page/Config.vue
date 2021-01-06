<template>
  <Tabs default-active-key="1">
    <TabPane tab-key="1" tab="样式">
      {{active && active.title}} 样式配置
    </TabPane>
    <TabPane tab-key="2" tab="数据">
      {{active && active.title}} 数据配置
    </TabPane>
    <TabPane tab-key="3" tab="交互">
      {{active && active.title}} 交互配置
    </TabPane>
  </Tabs>
</template>

<script>
import Tabs from '@/components/tabs'
const { TabPane } = Tabs
export default {
  name: 'Config',
  components: {
    Tabs,
    TabPane,
  },
  props: {
    active: {
      type: Object,
      default: () => ({})
    },
  }
}
</script>
