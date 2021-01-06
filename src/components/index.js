import {
  Container as DnDContainer,
  Draggable as DnDDraggable
} from 'vue-smooth-dnd'

import Screen from './Screen'
import Setting from './Setting'
import Editor from './editor'
import Library from './library'
import Group from './library/group'
import Material from './library/material'
import Container from './editor/container'
import ContextMenu from './context-menu'

const components = [
  Screen,
  Editor,
  Setting,
  Library,
  Group,
  Material,
  Container,
  ContextMenu
]

const install = function(Vue) {
  if (!Vue.prototype.$EventBus) {
    Vue.prototype.$EventBus = new Vue()
  }
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  Screen,
  Editor,
  Setting,
  Library,
  Group,
  Material,
  Container,
  DnDContainer,
  DnDDraggable,
  ContextMenu
}

export default {
  install
}
