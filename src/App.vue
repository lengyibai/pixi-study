<script setup lang="ts">
import * as PIXI from "pixi.js";
import { onMounted, ref } from "vue";

import { useA, useD, useE } from "./hooks/usePixi";
import { useDemo } from "./hooks/usePlayground";

const appRef = ref<HTMLElement>();

const app = new PIXI.Application();

onMounted(() => {
  app
    .init({
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
      resizeTo: window,
    })
    .then(async () => {
      appRef.value?.appendChild(app.canvas);
      useA(app);
    });
});
</script>

<template>
  <div ref="appRef" class="App"></div>
</template>

<style lang="less">
canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: var(--pink);
  transform: translate(-50%, -50%);
}
</style>
