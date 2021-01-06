<template>
  <div class="editor-mask">
    <div class="editor">
      <slot>
        <Container />
      </slot>
    </div>
  </div>
</template>
<script>
import Container from '../container'
export default {
  name: 'ioc-mobile-editor',
  components: {
    Container
  },
  inject: ['layers'],
  provide () {
    return {
      mode: 'mobile'
    }
  },
  pageConfig: {
    type: Object,
    default: () => ({})
  }
}
</script>
<style scoped lang="less">
@navigationBarHeight: 64px;
.editor-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 900;
  background-color: rgb(229, 233, 237);
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  .editor {
    position: relative;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 375px;
    height: 100%;
    max-height: 680px;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 2px;
      height: 2px;
    }

    &__header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 14px;
      text-align: center;
      background-color: transparent;

      .navigation-bar {
        width: 100%;
        height: @navigationBarHeight;
        background-size: cover;
        padding: 30px 0 7px 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .title {
          font-size: 18px;
          color: currentColor;
        }
      }
    }

    &__content {
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: auto;
      padding-top: @navigationBarHeight;
    }
  }
}
</style>
