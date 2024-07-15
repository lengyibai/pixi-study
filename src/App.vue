<script setup lang="ts">
import * as PIXI from "pixi.js";
import { ref } from "vue";
import { useC, useD, useE } from "./hooks/usePixi";
import { useDemo } from "./hooks/usePlayground";

const appRef = ref<HTMLElement>();

const app = new PIXI.Application();
app
  .init({
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    width: window.innerWidth / 2,
    height: window.innerHeight / 2,
  })
  .then(async () => {
    appRef.value?.appendChild(app.canvas);
    useDemo(app);
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
