<template>
  <scroller>
    <div class="group" v-for="(value, key) in object">
      <text class="text key">{{key}}</text>
      <text class="text type">{{typeof value}}</text>
      <text class="text value">{{value}}</text>
    </div>
  </scroller>
</template>

<script>
  export default {
    data () {
      return {
        object: WXEnvironment
      }
    }
  }
</script>

<style scoped>
  .group {
    flex-direction: row;
    justify-content: space-around;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .text {
    font-size: 38px;
  }
  .key {
    width: 280px;
    text-align: right;
    color: #00B4FF;
  }
  .type {
    width: 120px;
    text-align: center;
    color: #A0A0A0;
  }
  .value {
    width: 320px;
    color: #525252;
  }
</style>
