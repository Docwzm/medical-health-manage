const shortcutMenus = [
  {
    text: '用户管理',
    link: {path: '/home/customer/list'},
    route: {path: '/home/customer/list'},
    icon: require('!raw-loader!!../../../static/header/icon-patient-normal.svg'),
    subMenus: [
      {
        text: '用户列表',
        link: {path: '/home/customer/list'},
        route: {path: '/home/customer/list'},
      },
      {
        text: '用户分组',
        link: {path: '/home/customer/group'},
        route: {path: '/home/customer/group'},
      },
    ]
  },
  {
    text: '数据分析',
    icon: require('!raw-loader!!../../../static/admin/icon_sidetbarleft_dataanalysis.svg'),
    subMenus: [
      {
        text: '用户属性',
        link: {path: '/home/data/attribute'},
        route: {path: '/home/data/attribute'},
      },
      {
        text: '用户健康',
        link: {path: '/home/data/health'},
        route: {path: '/home/data/health'},
      },
    ]
  },
]

const shortcutMenus2 = [
  {
    text: '医护管理',
    icon: require('!raw-loader!!../../../static/admin/icon_sidetbarleft_doctorlist.svg'),
    subMenus: [
      {
        text: '医生列表',
        link: {path: '/admin/doctor'},
        route: {path: '/admin/doctor/list'},
      },
    ]
  },
  {
    text: '用户管理',
    icon: require('!raw-loader!!../../../static/admin/icon_sidetbarleft_patientlist.svg'),
    subMenus: [
      {
        text: '用户列表',
        link: {path: '/admin/user/list'},
        route: {path: '/admin/user/list'},
      },
    ]
  },
  {
    text: '数据分析',
    icon: require('!raw-loader!!../../../static/admin/icon_sidetbarleft_dataanalysis.svg'),
    subMenus: [
      {
        text: '用户属性',
        link: {path: '/admin/data/attribute'},
        route: {path: '/admin/data/attribute'},
      },
      {
        text: '用户健康',
        link: {path: '/admin/data/health'},
        route: {path: '/admin/data/health'},
      },
    ]
  },
  {
    text: '营销管理',
    icon: require('!raw-loader!!../../../static/admin/icon_sidetbarleft_management.svg'),
    subMenus: [
      {
        text: '品牌定制',
        link: {path: '/admin/business/custom'},
        route: {path: '/admin/business/custom'},
      },
      {
        text: '微信图文',
        link: {path: '/admin/business/wchat'},
        route: {path: '/admin/business/wchat'},
      },
    ]
  },
]


export default {
  // 默认值
  state: {
    shortcutMenus: [
      ...shortcutMenus,
      ...(() => {
        // if (process.env.NODE_ENV !== 'production') {
        //   return [{
        //     text: 'Tests',
        //     subMenus: [
        //       {
        //         text: 'Test',
        //         route: {path: '/home/test'}
        //       }
        //     ]
        //   }]
        // }
        return []
      })()],
    shortcutMenus2: [
        ...shortcutMenus2
    ]
  },
  mutations: {}
}
