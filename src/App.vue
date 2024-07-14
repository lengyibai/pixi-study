<script setup lang="ts">
import * as PIXI from "pixi.js";
import { ref } from "vue";
import { useC, useD } from "./hooks/usePixi";

const appRef = ref<HTMLElement>();

const app = new PIXI.Application();
app
  .init({
    width: window.innerWidth / 2,
    height: window.innerHeight / 2,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
  })
  .then(async () => {
    appRef.value?.appendChild(app.canvas);
    useD(app);
  });
</script>

<template>
  <div class="App" ref="appRef"></div>
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
