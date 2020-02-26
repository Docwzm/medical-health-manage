// 配置路由
const routes = [
  {
    path: '/',
    meta: {
      notLogin: true,
    },
    component: require('@/views/login/index.vue').default
  },
  {
    path: '/forget',
    meta: {
      notLogin: true,
    },
    component: require('@/views/login/forget.vue').default
  },
  {
    path: '/home',
    component: require('@/views/home/index.vue').default,
    children: [
      {
        path: '',
        name: 'home',
        component: require('@/views/home/views/welcome/index.vue').default
      },
      // 用户列表
      {
        path: 'customer/list',
        name: 'customer_list',
        component: require('@/views/home/views/customer/list/index.vue').default
      },
      // 用户分组列表
      {
        path: 'customer/group',
        name: 'customer_group',
        component: require('@/views/home/views/customer/group/index.vue').default
      },
      // 用户分组详情
      {
        path: 'customer/group/:id',
        component: require('@/views/home/views/customer/group/detail/index.vue').default
      },

      // 编辑用户
      {
        path: 'customer/edit/:id',
        name: 'customer_edit',
        component: require('@/views/home/views/customer/edit/index.vue').default,
      },
      // 血压
      {
        path: 'customer/bp/:id',
        name: 'customer_bp',
        component: require('@/views/home/views/customer/bp/index.vue').default
      },
      // 消息中心
      {
        path: 'doctor/message/list/:type',
        name: 'doctor_message_list',
        component: require('@/views/home/views/message/list/index.vue').default
      },
      // 医生详情
      {
        path: 'doctor/info',
        name: 'doctor_info',
        component: require('@/views/home/views/doctor/info/index.vue').default
      },
      //用户属性统计
      {
        path: 'data/attribute',
        name: 'data_attribute',
        component: require('@/views/home/views/data/attribute/index.vue').default
      },
      //用户健康统计
      {
        path: 'data/health',
        name: 'data_health',
        component: require('@/views/home/views/data/health/index.vue').default
      },
      // 测试
      ...(() => {
        if (process.env.NODE_ENV !== 'production'
        ) {
          return [
            {
              path: 'test',
              component: require('@/views/home/views/test/index.vue').default
            },
            {
              path: 'test/:name',
              component: require('@/views/home/views/test/index.vue').default
            }
          ]
        }
        return []
      })()
    ]
  },
  //医生账号没有左侧导航
  {
    path: '/home',
    component: require('@/views/home/index2.vue').default,
    children: [
      { // 用户详情 列表
        path: 'customer/info/:id',
        name: 'customer_info',
        component: require('@/views/home/views/customer/info/details/index.vue').default,
        children: [
          {
            path: 'doctor',
            name: 'patient_doctor_info',
            component: require('@/views/home/views/customer/info/details/doctor/index.vue').default,
          },
          {
            path: 'admin',
            name: 'patient_admin_info',
            component: require('@/views/home/views/customer/info/details/admin/index.vue').default,
          }
        ]
      },
      { // 用户详情 图表 列表
        path: 'customer/chart/:id',
        name: 'customer_chart',
        component: require('@/views/home/views/customer/info/chart/index.vue').default,
        children: [
          {
            path: 'doctor',
            name: 'patient_doctor_chart',
            component: require('@/views/home/views/customer/info/chart/doctor.vue').default,
          },
          {
            path: 'admin',
            name: 'patient_admin_chart',
            component: require('@/views/home/views/customer/info/chart/admin.vue').default,
          }
        ]
      },
      // 对话
      {
        path: 'customer/chat/:id',
        name: 'customer_chat',
        component: require('@/views/home/views/chat/index.vue').default
      },
      // 对话快捷回复编辑
      {
        path: 'customer/reply/:id',
        name: 'chat_reply',
        component: require('@/views/home/views/chat/fastReply/editor/index.vue').default
      },
      // 对话历史记录
      {
        path: 'customer/record/:id',
        name: 'customer_record',
        component: require('@/views/home/views/chat/record/index.vue').default
      },
        ]
  },
  //管理员账号
  {
    path: '/admin',
    component: require('@/views/home/index.vue').default,
    children: [
      {
        path: '',
        name: 'admin',
        component: require('@/views/admin/views/welcome/index.vue').default
      },
      //品牌定制
      {
        path: 'business/custom',
        name: 'business_custom',
        component: require('@/views/admin/views/business/custom/index.vue').default
      },
      //微信图文
      {
        path: 'business/wchat',
        name: 'business_wchat',
        component: require('@/views/admin/views/business/wchat/index.vue').default
      },
      //用户属性统计
      {
        path: 'data/attribute',
        name: 'admin_data_attribute',
        component: require('@/views/admin/views/data/attribute/index.vue').default
      },
      //用户健康统计
      {
        path: 'data/health',
        name: 'admin_data_health',
        component: require('@/views/admin/views/data/health/index.vue').default
      },
      // 医生列表
      {
        path: 'doctor/list',
        name: 'doctor_list',
        component: require('@/views/admin/views/doctor/list/index.vue').default
      },
      // 编辑医生
      {
        path: 'doctor/edit/:id',
        name: 'doctor_edit',
        component: require('@/views/admin/views/doctor/edit/index.vue').default,
      },
      // 医生详情
      {
        path: 'doctor/info/:id',
        name: 'doctor_detail',
        component: require('@/views/admin/views/doctor/info/index.vue').default,
      },
      // 医生订单
      {
        path: 'doctor/order/:id',
        name: 'doctor_order',
        component: require('@/views/admin/views/doctor/order/index.vue').default,
      },
      // 用户列表
      {
        path: 'user/list',
        name: 'user_list',
        component: require('@/views/admin/views/user/list/index.vue').default
      },
      // 消息中心
      {
        path: 'message/list',
        name: 'message_list',
        component: require('@/views/admin/views/message/list/index.vue').default
      },
    ]
  },
  //机构微信图文预览
  {
    path: '/previewwchat/:type',
    meta: {
      notLogin: true,
    },
    component: require('@/views/admin/views/business/wchat/preview.vue').default
  },
  //pdf下载
  {
    path: '/dowonloadPdf/:userId',
    meta: {
      notLogin: true,
    },
    component: require('@/views/pdf/index.vue').default
  }
]

export default routes
