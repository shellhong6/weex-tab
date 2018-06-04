<template>
  <div class="tabs-wrap">
    <div class='tab-wrap'>
      <div v-for='(item, index) in list' class='tab-item' v-on:click='handleClick' :data-index='index'>
        <text class='tab-text' :class='[cur==index ? "active":""]'>{{item}}</text>
      </div>
    </div>
    <div class="slider" ref='slider' :style='{transform:`translateX(${sliderX}px)`,width:`${sliderW}px`}'></div>
    <div class='content-wrap' ref='contentWrap' :style='{transform:`translateX(${contentX}px)`, width:`${list.length * containerW}px`}' v-on:touchstart='handleTouchStart' v-on:touchmove='handleTouchMove' v-on:touchend='handleTouchEnd'>
      <slot></slot>
    </div>
  </div>
</template>

<script>
const animation = weex.requireModule('animation')
const EFFECT_DISTANCE = 30
const END_TIME = 400
const SCALE = 0.3

var startX = 0
var startY = 0
var moveX = 0
var moveY = 0
var moveOffsetX = 0
var moveOffsetY = 0
var totalOffsetX = 0
var isStarted = false
var isMoving = false
var clientX = 0
var clientY = 0
var isEndAnimating = false
var contentX = 0
var sliderX = 0

export default {
  name: 'Vue-Tabs',
  props: {
    list: {
      type: Array,
      required: true,
      default: ['全部', '收入', '支出']
    },
    sliderW: {
      type: Number,
      default: 100
    },
    callback: {
      type: Function,
      default: function () {}
    }
  },
  data () {
    return {
      containerW: 750,
      cur: 0,
      sliderCls: '',
      animateTime: 0,
      transition: '',
      sliderX: 0,
      contentX: 0,
      sliderScale: 1
    }
  },
  computed: {
    tabItemW () {
      return this.containerW / this.list.length
    },
    wRate () {
      return 1 / this.list.length
    },
    sliderInitX () {
      return (this.tabItemW - this.sliderW) / 2
    },
    contentMaxX () {
      return -this.containerW * (this.list.length - 1)
    },
    sliderMaxX () {
      return this.sliderInitX + this.tabItemW * (this.list.length - 1)
    }
  },
  methods: {
    doStepAnimate(el, opt) {
      return new Promise(function(resolve){
        animation.transition(el, {
          styles: opt.styles,
          duration: opt.dur,
          timingFunction: opt.timingFn || 'linear' ,
          needLayout: opt.needLayout || false,
          delay: opt.delay || 0
        }, function () {
          resolve();
        })
      });
    },
    doContentStepAnimate (x, dur) {
      return this.doStepAnimate(this.$refs.contentWrap, {
        styles: {
          transform: `translateX(${x})`
        },
        dur: dur
      })
    },
    doSliderStepAnimate (x, dur) {
      return this.doStepAnimate(this.$refs.slider, {
        styles: {
          transform: `translateX(${x})`
        },
        dur: dur
      })
    },
    handleClick (e) {
      var index = parseInt(e.target.attr.dataIndex)
      if (isNaN(index) || index === this.cur) {
        return
      }
      var range = this.cur - index
      this.cur = index
      // this.toIndexScale(range)
      this.toIndexPos()
    },
    // async toIndexScale (range) {
    //   var direction = range > 0 ? -1 : 1
    //   var maxW = (1 + SCALE) * this.sliderW
    //   var w = maxW
    //   var sliderStep = direction * this.tabItemW / 2
    //   range = Math.abs(range)
    //   var _sliderX = sliderX
    //   for(var i = 0, dur = END_TIME / 2 / range, scale = 1; i < range * 2; i++){
    //     if(i % 2 == 0){
    //       w = maxW
    //     }else{
    //       w = this.sliderW
    //     }
    //     _sliderX += sliderStep
    //     await this.doStepAnimate(this.$refs.slider, {
    //       styles: {
    //         width: w,
    //         transform: `translateX(${_sliderX})`
    //       },
    //       dur: dur
    //     })
    //   }
    // },
    toIndexPos () {
      this.callback(this.cur)
      isEndAnimating = true
      contentX = -this.containerW * this.cur
      this.doContentStepAnimate(contentX, END_TIME).then(() => {
        isEndAnimating = false;
      })
      sliderX = this.tabItemW * this.cur + this.sliderInitX
      this.doSliderStepAnimate(sliderX, END_TIME)
    },
    setSliderX (moveOffsetX) {
      // this.doSliderStepAnimate(moveOffsetX, 0)
      this.sliderX = moveOffsetX
    },
    setContentX (moveOffsetX) {
      // this.doContentStepAnimate(moveOffsetX, 0)
      this.contentX = moveOffsetX
    },
    reset () {
      isStarted = false
      isMoving = false
      moveOffsetX = 0
      moveOffsetY = 0
      totalOffsetX = 0
    },
    addEndAnimation (contentMoveOffsetX) {
      this.toIndexPos()
    },
    doEndAnimate (offset) {
      if (offset === 0) {
        return
      }
      this.callback(this.cur)
      if (Math.abs(offset) > EFFECT_DISTANCE) {
        if (offset > 0) { // 右移
          this.cur--
          this.addEndAnimation(this.containerW - offset)
        } else { // 左移
          this.cur++
          this.addEndAnimation(-this.containerW - offset)
        }
      } else { // 回滚
        this.addEndAnimation(-offset)
      }
    },
    doEnd () {
      this.doEndAnimate(totalOffsetX)
    },
    handleTouchStart (event) {
      this.reset()
      isStarted = true
      startX = event.changedTouches[0].screenX
      startY = event.changedTouches[0].screenY
    },
    handleTouchMove (event) {
      if (!isStarted || isEndAnimating) {
        return
      }
      var isFirst = (moveOffsetX === 0 && moveOffsetY === 0 && !isMoving)
      clientX = event.changedTouches[0].screenX
      clientY = event.changedTouches[0].screenY
      moveOffsetX = clientX - (moveX || startX)
      moveOffsetY = clientY - (moveY || startY)
      moveX = clientX
      moveY = clientY
      if (isFirst) { // 第一次move,仅做方向判断，不移动
        if (Math.abs(moveOffsetX) < Math.abs(moveOffsetY)) { // 上下优先
          this.reset()
          return
        }
      } else {
        if ((contentX >= 0 && moveOffsetX > 0) || (contentX <= this.contentMaxX && moveOffsetX < 0)) {
          return
        }
        isMoving = true
        totalOffsetX += moveOffsetX
        contentX += + moveOffsetX
        sliderX += - moveOffsetX * this.wRate
        if(contentX <= this.contentMaxX){
          contentX = this.contentMaxX
        }
        if(contentX >= 0){
          contentX = 0
        }
        if(sliderX <= this.sliderInitX){
          sliderX = this.sliderInitX
        }
        if(sliderX >= this.sliderMaxX){
          sliderX = this.sliderMaxX
        }
        this.setContentX(contentX)
        this.setSliderX(sliderX)
      }
    },
    handleTouchEnd () {
      if (!isStarted) {
        return
      }
      this.doEnd()
      this.reset()
    }
  },
  mounted () {
    sliderX = this.sliderInitX
    this.doStepAnimate(this.$refs.slider, {
      styles: {
        transform: `translateX(${sliderX})`
      },
      dur: 0
    })
  }
}
</script>

<style scoped>
  .tab-wrap{
    flex-direction: row;
    width: 750px;
    height: 40px;
  }
  .tab-item{
    flex: 1;
    text-align: center;
    justify-content: center;
  }
  .tab-text{
    text-align: center;
  }
  .content-wrap{
    flex-direction: row;
    will-change: transform;
    margin-top: 5px;
  }
  .slider{
    height: 2px;
    background-color: #03A9F4;
    will-change: transform;
  }
  .active{
    color: #03a9f4;
  }
  .tabs-wrap{
    width: 750px;
  }
</style>
