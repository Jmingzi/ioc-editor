import Vue from 'vue'
import Index from './index.vue'

const ContextMenuConstructor = Vue.extend(Index)

let instance
const ContextMenu = (options) => {
  if (!instance) {
    instance = new ContextMenuConstructor({
      el: document.createElement('div')
    })
    document.body.appendChild(instance.$mount().$el)
  }
  instance.options = options
  return instance
}

ContextMenu.install = (Vue) => {
  Vue.prototype.$contextMenu = ContextMenu
}

export default ContextMenu
