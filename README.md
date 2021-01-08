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
    - container-drag.vue
    - container-render.vue
    - index.vue
  - mode-position
    - container-drag.vue
    - container-render.vue
    - index.vue
    - container-multi-select.vue
    - container-operator.vue
  - index.vue
  - container-drag.vue
  - container-render.vue
```

## Usage

### canvas

```vue
<template>
  <canvas>
    <container-drag 
      v-for="item in data"
      :layer="item"
    >
      <container-render>
        
      </container-render>
    </container-drag>
  </canvas>
</template>

<script>
import { Canvas, ContainerDrag, ContainerRender } from 'ioc-editor'
</script>
```
