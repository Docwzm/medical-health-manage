<template>
  <div>
    <div v-for="(tab,index) in tabs" :key="index">
      <router-view v-if="tabsActiveName === tab.name"></router-view>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'patient-details-tabs',
    data () {
      return {
        tabs: [
          {label: '医生账户', name: 'patient_doctor_info'},
          {label: '管理员账户', name: 'patient_admin_info'},
        ],
      }
    },
    computed: {
      tabsActiveName: {
        get () {
          return this.$route.name
        },
        set (name) {
          this.$router.replace({name})
        }
      },
    },
    methods: {},
    watch: {},
    components: {},
    async mounted () {
    },
    destroyed () {
    }
  }
</script>

<style lang="less" scoped>
</style>
