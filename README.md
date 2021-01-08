todo 

- [ ] 加上 eslint-standard
- [ ] template 里都是 a-b 的格式
- [ ] 目录结构应该都是 a-b 格式
- [ ] editor 改为画布 canvas
- [ ] editor/mobile 改为 canvas/mode-flow
- [ ] editor/screen 改为 canvas/mode-position

```
- canvas
  - mode-flow
    - container-drop.vue
    - container-render.vue
    - index.vue
  - mode-position
    - container-drop.vue
    - container-render.vue
    - index.vue
    - container-multi-select.vue
    - container-operator.vue
  - index.vue
  - container-drop.vue
  - container-render.vue
```

## Usage

### canvas

```vue
<template>
  <canvas>
    <container-drop
      v-for="item in data"
      :layer="item"
    >
    </container-drop>
  </canvas>
</template>

<script>
import { Canvas, ContainerDrop } from 'ioc-editor'
</script>
```
