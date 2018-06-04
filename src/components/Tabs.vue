<template>
  <div class='tab-container'>
    <VueTabs :list='list' :slider-w='80'>
      <div class="red content-item">
        <text class='content-text'>111111</text>
        <text class='content-text'>111111</text>
        <text class='content-text'>111111</text>
        <text class='content-text'>111111</text>
        <text class='content-text'>111111</text>
        <text class='content-text'>111111</text>
        <text class='content-text'>111111</text>
        <text class='content-text'>111111</text>
      </div>
      <div class="green content-item">
        <text class='content-text'>222222</text>
        <text class='content-text'>222222</text>
        <text class='content-text'>222222</text>
        <text class='content-text'>222222</text>
        <text class='content-text'>222222</text>
        <text class='content-text'>222222</text>
        <text class='content-text'>222222</text>
        <text class='content-text'>222222</text>
      </div>
      <div class="blue content-item">
        <text class='content-text'>333333</text>
        <text class='content-text'>333333</text>
        <text class='content-text'>333333</text>
        <text class='content-text'>333333</text>
        <text class='content-text'>333333</text>
        <text class='content-text'>333333</text>
        <text class='content-text'>333333</text>
        <text class='content-text'>333333</text>
      </div>
    </VueTabs>
  </div>
</template>

<script>
import VueTabs from './VueTabs.vue'

export default {
  name: 'app',
  data () {
    return {
      list: ['全部', '收入', '支出']
    }
  },
  components: {
    VueTabs
  }
}
</script>

<style>
.content-text{
  text-align: center;
}
.content-item{
  width: 750px;
}
.red {
  background-color: #ff0000;
}
.green {
  background-color: #00ff2b;
}
.blue {
  background-color: #004df9;
}
</style>
