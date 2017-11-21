<template>
	<li class="j-ui-timeline-item">
		<div :class="['j-ui-timeline-item-color', {'j-ui-timeline-item-head': !isFirst,'j-ui-timeline-item-head-first': isFirst }]" :style="headStyle">
			<i class="iconfont" :class="icon"></i>
		</div>
		<div class="j-ui-timeline-item-tail" :style="tailStyle"></div>
		<div class="j-ui-timeline-item-content">
			<slot></slot>
		</div>
	</li>
</template>

<script>
export default {
  props: {
    icon: String
  },
  data () {
    return {
      isLast: true,
      isFirst: true,
      headStyle: { backgroundColor: this.$parent.color }
    }
  },
  mounted () {
    this.$parent.setChildProps()
  },
  beforeDestroy () {
    // this will be null
    const $parent = this.$parent
    this.$nextTick(() => {
      $parent.setChildProps()
    })
  },
  components: {
  },
  computed: {
    tailStyle () {
      return this.isLast ? { display: 'none', backgroundColor: this.$parent.color } : { display: 'block', backgroundColor: this.$parent.color }
    }
  }
}
</script>

