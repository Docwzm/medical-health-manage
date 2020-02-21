/**
 * 通常我们建议使用常量去命名一个 mutation, 并且把这些常量放在单独的地方。这样做可以让你的代码合作者对整个 app 包含的 mutations 一目了然
 *
 * 用不用常量取决于你 —— 在需要多人协作的大型项目中，这会很有帮助
 **/
// 城市信息
export const GET_COMMON = 'common/GET_COMMON_SUCCESS'

// 登录账号信息
export const USERINFO = 'login/USERINFO'

// loadding
export const LOADING_ADD = 'loadding/LOADING_ADD'
export const LOADING_MIN = 'loadding/LOADING_MIN'

// customer 用户
export const CUSTOMER_INFO = 'customer/VIEWS_CUSTOMER_INFO'
export const CUSTOMER_DEF = 'customer/VIEWS_CUSTOMER_DEF'
export const CUSTOMER_LIST = 'customer/VIEWS_CUSTOMER_LIST'
// 编辑 查看 用户
export const CUSTOMER_LIST_QUERYPARAMS = 'customer/CUSTOMER_LIST_QUERYPARAMS'
export const GET_CUSTOMER_COMMON = 'customer/GET_CUSTOMER_COMMON'
// ---------------------------- 患者 --------------------------------
//
export const CUSTOMER_EDIT = 'customer/VIEWS_CUSTOMER_EDIT' // 编辑
export const DEVICE_INFO = 'device/VIEWS_DEVICE_INFO' // device 设备
export const LEFT_DEVICE_INFO = 'device/VIEWS_LEFT_DEVICE_INFO' // device 设备
export const PATIENT_ABNORMAL = 'abnormal/VIEWS_PATIENT_ABNORMAL' // 异常
export const PATIENT_BP_MOST = 'bp_most/VIEWS_PATIENT_BP_MOST' // 血压最值
export const PATIENT_CHAT = 'bp_most/VIEWS_PATIENT_CHAT' // 对话
// ---------------------------- 对话 --------------------------------
export const PATIENT_CHAT_RECORD = 'bp_most/VIEWS_PATIENT_CHAT_RECORD' // 群组聊天记录
export const PATIENT_CHAT_MONTH_TIP = 'bp_most/VIEWS_PATIENT_CHAT_MONTH_TIP' // 群组聊天记录

// root constants
export const INIT_ROOT_STATE = 'initRootState'
export const SET_ROOT_STATE_PROP = 'setRootState'
export const DOCTOR = 'doctor'

//doctor
export const DOCTORINFO = 'doctorInfo' //医生账号信息
export const DOCTOR_MESSAGE_LIST_TALK = 'doctor_message/LIST_TALK'//医生消息--对话消息
export const DOCTOR_MESSAGE_LIST_ABNORMAL = 'doctor_message/LIST_ABNORMAL'//医生消息--异常数据
export const DOCTOR_MESSAGE_LIST_APPLY = 'doctor_message/LIST_APPLY'//医生消息--关联申请
export const DOCTOR_MESSAGE_LIST_SENDED = 'doctor_message/LIST_SENDED'//医生消息--消息发送
export const DOCTOR_MESSAGE_NEW_TALK = "doctor_message/NEW_TALK"//医生新消息--对话消息
export const DOCTOR_MESSAGE_NEW_ABNORMAL = "doctor_message/NEW_ABNORMAL"//医生新消息--异常数据
export const DOCTOR_MESSAGE_NEW_APPLY = "doctor_message/NEW_APPLY"//医生新消息--关联申请
//roleType
export const ROLETYPE = 'roleType'
//admin
export const ADMININFO = 'adminInfo' //管理员信息
export const DOCTORLIST = 'doctorlist' //医生列表
export const ADMININDEX = 'adminIndex' //管理员首页
export const ADMINUSERLIST = 'adminUserList' //管理员账号用户列表
export const ADMINMESSAGE = 'adminMessage' //管理员消息
export const DOCTORDETAIL = 'doctorDetail' //医生详情
export const DOCTORORDERLIST = 'doctorOrderList' //医生订单列表
export const DOCTORGAINS = 'doctorGains' //医生订单收益信息
export const DOCTORDEVICELIST = 'doctorDeviceList' //医生设备列表
export const DEVICEDETAIL = 'deviceDetail' //设备详情
