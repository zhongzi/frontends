<template>
<div class="j-ui-table" :style="{ height: height }">
  <div class="j-ui-table-header" v-if="hasHeader">
    <slot name="header"></slot>
  </div>
  <div class="j-ui-table-wrapper" ref="wrapper">
    <div class="j-ui-table-content">
      <div :style="{ minHeight: minHeight }">
        <slot name="scrollHeader"></slot>
        <div v-show="!hasData && !isLoading">
          <slot name="noData"></slot>
        </div>
        <slot></slot>
        <component :is="parentCell" :props="parentProps" v-on:table-click="tableClick" class="j-ui-table-parent">
          <component class="j-ui-table-cell"
            v-for="(item, index) in list"
            :key="_getKey(item, index)"
            :is="_getCell(item)"
            :index="index"
            :value="item"
            :props="cellProps"
            :selected="selectedIndex === index"
            @click.native="onSelect(item, item)">
          </component>
        </component>
        <slot name="scrollFooter"></slot>
      </div>
      <slot name="pullup"
        v-if="enablePullUp"
        :isPullingUp="isPullingUp">
        <div class="j-ui-table-pullup" v-if="enablePullUp">
          <div v-if="!isPullingUp">
            <span v-if="!isLoading">{{pullingUpText}}</span>
          </div>
          <div v-else class="j-ui-table-loading">
            <j-double-dounces />
            <label>{{loadingTip}}</label>
          </div>
        </div>
      </slot>
    </div>
    <slot name="pulldown"
      v-if="enablePullDown"
      :beforePullDown="beforePullDown"
      :isLoading="isLoading">
      <div class="j-ui-table-pulldown" :style="pullDownStyle">
        <div v-if="beforePullDown">
          {{pullDownTip}}
        </div>
        <div class="j-ui-table-after-trigger" v-else>
          <div v-if="isLoading" class="j-ui-table-loading">
            <j-double-dounces />
            <label>{{loadingTip}}</label>
          </div>
          <div v-else>{{pullDownFinishedTip}}</div>
        </div>
      </div>
    </slot>
  </div>
  <div class="j-ui-table-footer" v-if="hasFooter">
    <slot name="footer"></slot>
  </div>
  <j-loading :value="isLoading && !hasData"></j-loading>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import JLoading from '../loading'
import JDoubleDounces from '../spinner/double-bounces'

export default {
  components: {
    JDoubleDounces,
    JLoading
  },
  props: {
    autoLoad: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '100vh'
    },
    list: {
      type: Array,
      default () {
        return []
      }
    },
    keyName: {
      type: String,
      default: null
    },
    limit: {
      type: Number,
      default: 10
    },
    parentCell: {
      type: [String, Object],
      default: 'div'
    },
    parentProps: {
      type: Object,
      default: null
    },
    cell: Object,
    dynamicCell: Function,
    cellProps: {
      type: Object,
      default: null
    },
    enablePullUp: {
      type: Boolean,
      default: true
    },
    enablePullDown: {
      type: Boolean,
      default: true
    },
    pullDownHeight: {
      type: Number,
      default: 50
    },
    pullDownThreshold: {
      type: Number,
      default: 90
    },
    beforePullDownTip: {
      type: String,
      default: '下拉刷新'
    },
    willPullDownTip: {
      type: String,
      default: '释放更新'
    },
    pullDownFinishedTip: {
      type: String,
      default: '已加载'
    },
    pullUpTip: {
      type: String,
      default: '上拉加载'
    },
    noMoreDataTip: {
      type: String,
      default: '已全部加载'
    },
    loadingTip: {
      type: String,
      default: '正在加载 ...'
    },
    load: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      scroll: null,
      scrollPos: 0,
      beforePullDown: true,
      isPullingDown: false,
      isRebounding: false,
      isPullingUp: false,
      noMoreData: false,
      isLoading: false,
      selectedIndex: null,
      needInitData: false,
      minHeight: undefined
    }
  },
  computed: {
    hasHeader () {
      return !!this.$slots['header']
    },
    hasFooter () {
      return !!this.$slots['footer']
    },
    hasData () {
      return this.list && this.list.length > 0
    },
    pullingUpText () {
      return this.noMoreData ? this.noMoreDataTip : this.pullUpTip
    },
    pullDownTip () {
      if (this.scrollPos > this.pullDownThreshold) {
        return this.willPullDownTip
      }
      return this.beforePullDownTip
    },
    pullDownStyle () {
      if (this.silence) {
        if (this.isRebounding) {
          return `top: ${10 - this.pullDownHeight + this.scrollPos}px`
        }
        if (this.isPullingDown) {
          return 'top: 0'
        }
      }
      return `top: ${Math.min(this.scrollPos - this.pullDownHeight - 10, 0)}px`
    }
  },
  mounted () {
    if (this.scroll) {
      return
    }
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  methods: {
    tableClick (value) {
      this.$emit('table-click', value)
    },
    onSelect (item, index) {
      this.selectedIndex = index
      this.$emit('on-select', item, this._getCell(item))
    },
    refresh (reset = false) {
      if (reset) {
        this._resetMinHeight()
      }
      this.$nextTick(() => {
        if (this.scroll) {
          this.scroll.refresh()
        }
      })
    },
    jScrollReset (silence = false) {
      let stop = 40
      this.scrollPos = stop
      if (!this.scroll) {
        this.needInitData = true
        return
      }
      if (silence) {
        this.isLoading = true
        this._load(true)
      } else {
        if (this.enablePullDown) {
          this.scroll.pulling = true
          this.scroll.trigger('pullingDown')
          this.scroll.scrollTo(this.scroll.x, stop,
            this.scroll.options.bounceTime)
        } else {
          this.scroll.trigger('pullingUp', {
            reset: true
          })
          this.scroll.pullupWatching = false
        }
      }
    },
    _getKey (item, index) {
      if (this.keyName && this.keyName.length > 0) {
        return item[this.keyName]
      }
      return index
    },
    _getCell (item) {
      if (this.dynamicCell) {
        return this.dynamicCell(item)
      }
      return this.cell
    },
    _resetMinHeight () {
      let minHeight = 0
      if (this.$refs && this.$refs.wrapper) {
        minHeight = this.$refs.wrapper.offsetHeight
      }
      if (minHeight > 0) {
        this.minHeight = (minHeight + 'px')
      }
    },
    _initScroll () {
      this._resetMinHeight()

      let options = {
        scrollX: false,
        scrollY: true,
        pullUpLoad: this.enablePullUp,
        click: true,
        eventPassthrough: 'horizontal'
      }
      if (this.enablePullDown) {
        options['pullDownRefresh'] = {
          threshold: this.pullDownThreshold,
          stop: this.pullDownHeight
        }
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)
      if (this.enablePullDown) {
        this._initPullDown()
      }
      if (this.enablePullUp) {
        this._initPullUp()
      }

      if (this.autoLoad || this.needInitData) {
        this.jScrollReset(true)
      }
    },
    _load (reset) {
      this.load(reset, this.limit, this._loadSuccess, this._loadFinished)
    },
    _loadSuccess (response) {
      let list
      if (Array.isArray(response)) {
        list = response
      } else {
        list = response.data.data
      }
      this.noMoreData = list.length < this.limit
      this._loadFinished()
    },
    _loadFinished () {
      this.isLoading = false
      if (this.isPullingDown) {
        this._reboundPullDown().then(() => {
          this._afterPullDown()
        })
      } else {
        if (this.isPullingUp) {
          this.isPullingUp = false
          this.scroll.finishPullUp()
        }
        this.refresh()
      }
    },
    _initPullDown () {
      this.scroll.on('pullingDown', () => {
        this.beforePullDown = false
        this.isPullingDown = true
        this.isLoading = true
        this._load(true)
      })

      this.scroll.on('scroll', (pos) => {
        this.scrollPos = pos.y
      })
    },
    _reboundPullDown () {
      let {stopTime = 600} = this.enablePullDown
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isRebounding = true
          this._finishPullDown()
          resolve()
        }, stopTime)
      })
    },
    _finishPullDown () {
      this.scroll.finishPullDown()
      this.isPullingDown = false
    },
    _afterPullDown () {
      setTimeout(() => {
        this.beforePullDown = true
        this.isRebounding = false
        this.scroll.refresh()
      }, this.scroll.options.bounceTime)
    },
    _initPullUp () {
      this.scroll.on('pullingUp', (payload) => {
        let reset = false
        if (payload) {
          reset = payload.reset
        }
        if (this.noMoreData && reset !== true) {
          setTimeout(() => {
            this.scroll.finishPullUp()
          })
          return
        }
        this.isPullingUp = true
        this._load(reset)
      })
    }
  }
}
</script>

<style lang="less">
.j-ui-table {
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;

  .j-ui-table-header, .j-ui-table-footer {
    flex: 0 1 auto;
  }

  .j-ui-table-wrapper {
    position: relative;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .j-ui-table-content {
      .j-ui-table-pullup {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px 0;
        font-size: 14px;
        color: gray;
      }
    }

    .j-ui-table-pulldown {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all;
      font-size: 14px;
      color: gray;
      .j-ui-table-after-trigger {
        margin-top: 10px;
      }
    }

    .j-ui-table-loading {
      > div {
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
      > label {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        vertical-align: middle;
      }
    }
  }
}
</style>
