<template>
  <div class="overview-container">
    <div id="cesiumContainer" class="fullSize"></div>
  </div>
</template>
  
<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { Viewer } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import fn from './cesiumDemo'
onMounted(() => {
  const viewer = new Viewer("cesiumContainer");
})

//
const name = ref('qqq')

const clickName = () => {
  name.value = 'xxaaa'
}
</script>
  @import 'https://sandcastle.cesium.com/templates/bucket.css';
<style>

</style>
<style lang="scss" scoped>
.overview-container {
  width: 100%;
  height: 100vh;

  .cesiumContainer {
    width: 100%;
    height: 100%;
  }
}
</style>