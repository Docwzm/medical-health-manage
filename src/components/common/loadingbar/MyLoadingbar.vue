<style lang='less' scoped>
  @import "./MyLoadingbar.less";
</style>

<template>
  <div class="my-loadingbar" :class="isLoading && 'is-loading'">
    <div class="progress" :style="styles"></div>
  </div>
</template>

<script type='text/babel'>
  import * as getters from '../../../store/getters/loading.js'
  export default {
    name: 'MyLoadingbar',
    vuex: {
      getters
    },
    data () {
      return {
        isLoading: false,
        progress: 0
      }
    },
    computed: {
      styles () {
        return [
          this.progress > 0 && {
            transition: 'width 0.4s ease 0s',
          },
          {
            width: this.progress + '%'
          }
        ]
      }
    },
    methods: {
      loading () {
        clearTimeout(this.loadedTimeoutId)
        if (this.isLoading) {
          return
        }
        clearInterval(this.intervalId)
        this.progress = 0
        setTimeout(() => {
          this.isLoading = true
          this.progress = 25

          this.lodingTimeoutId = setTimeout(() => {
            this.intervalId = setInterval(() => {
              this.progress += 4
              if (this.progress >= 85) {
                clearInterval(this.intervalId)
              }
            }, 400)
          }, 200)
        }, 0)
      },
      loaded () {
        clearTimeout(this.loadedTimeoutId)
        this.loadedTimeoutId = setTimeout(() => {
          clearInterval(this.intervalId)
          clearTimeout(this.lodingTimeoutId)
          this.progress = 100
          this.isLoading = false
        }, 200)
      }
    },
    watch: {
      loadingNum (val, oldVal) {
        if (val === oldVal) {
          return
        }
        if (val) {
          this.loading()
        } else {
          this.loaded()
        }
      }
    }
  }
</script>

