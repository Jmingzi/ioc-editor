import Vue from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'

import ContextMenu from '@/components/context-menu'
import IocEditor from '@/components'

Vue.use(ContextMenu)
Vue.use(IocEditor)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
