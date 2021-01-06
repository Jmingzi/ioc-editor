<template>
  <div class="setting">
    <slot :active="iocFrame.active"></slot>
  </div>
</template>

<script>
export default {
  name: 'ioc-setting',
  inject: ['iocFrame'],
}
</script>

<style>
.setting {
  width: 300px;
  height: 100%;
  background-color: white;
  border: 1px solid #e8e8e8;

  position: absolute;
  right: 0;
  top: 0;
  z-index: 999;
}
</style>
