<template>
<div class="j-ui-horizon-scroll">
  <div class="j-ui-horizon-scroll-wrapper" ref="wrapper">
    <div class="j-ui-horizon-scroll-content" ref="list">
      <component class="j-ui-horizon-scroll-cell"
        v-for="(item, index) in list"
        :key="_getKey(item, index)"
        :is="_getCell(item)"
        :value="item"
        :props="cellProps"
        :selected="selectedIndex === index"
        @click.native="onSelect(item, item)">
      </component>
    </div>
  </div>
</div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  components: {
  },
  props: {
    autoLoad: {
      type: Boolean,
      default: true
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
    cell: Object,
    dynamicCell: Function,
    cellProps: {
      type: Object,
      default: null
    },
    threshold: {
      type: Number,
      default: 0
    },
    load: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      scroll: null,
      noMoreData: false,
      isLoading: false,
      selectedIndex: null
    }
  },
  computed: {
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
    onSelect (item, index) {
      this.selectedIndex = index
      this.$emit('on-select', item, this._getCell(item))
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
    _initScroll () {
      let vm = this
      if (this.$refs.list && this.$refs.wrapper) {
        this.$refs.list.style.minWidth = this.$refs.wrapper.offsetWidth + 'px'
      }
      let options = {
        scrollX: true,
        scrollY: false,
        click: true,
        probeType: 3,
        eventPassthrough: 'vertical'
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)
      if (this.autoLoad) {
        this._load(true)
      }
      this.scroll.on('scroll', (pos) => {
        if (!vm.noMoreData && !vm.isLoading && vm.scroll.movingDirectionX === 1 && pos.x <= (vm.scroll.maxScrollX + vm.threshold)) {
          vm._load(false)
        }
      })
    },
    _load (reset) {
      this.isLoading = true
      this.load(reset, this.limit, this._loadSuccess, this._loadFinished)
    },
    _loadSuccess (response) {
      let vm = this
      let list
      if (Array.isArray(response)) {
        list = response
      } else {
        list = response.data.data
      }
      this.noMoreData = list.length < this.limit
      this._loadFinished()
      setTimeout(function () {
        vm.scroll.refresh()
      })
    },
    _loadFinished () {
      this.isLoading = false
    }
  }
}
</script>

<style lang="less">
.j-ui-horizon-scroll {
  .j-ui-horizon-scroll-wrapper {
    width: 100%;
    .j-ui-horizon-scroll-content {
      display: inline-flex;
      flex-wrap: nowrap;
      .j-ui-horizon-scroll-cell {
        flex: 0 0 auto;
      }
    }
  }
}

</style>
