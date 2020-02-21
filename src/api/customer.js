import {request} from './common'
const PATIENT_URL = '/patient_service',
    SYSMESSAGE_URL = '/doctor_service',
    DOCTORSERVICE = '/doctor_service'
const apiList = {
  'GETUSERS': '/health_manage/query_patientinfos',
  'GETAREAS': '/health_manage/query_areas',
  'GETGROUP': '/health_manage/query_group',
  'SAVELEVEL': '/health_manage/saveuser_level',
  'SAVEUSERGROUP': '/health_manage/saveuser_grouping',
  'DELETEGROUP': '/health_manage/del_group',
  'ADDGROUP': '/health_manage/add_group',
  'EDITGROUP': '/health_manage/edit_group',
  'GROUPPEOPLE': '/health_manage/query_grouppatient',
  'DELETEPEOPLE': '/health_manage/delpatient_ingroup',
  'ADDGROUPPATIENTS': '/health_manage/query_addgrouppatients',
  'ADDTOGROUP': '/health_manage/addpatient_togroup',
  'GROUPMESSAGE': '/group_message/get_receivers_info',
  'GROUPSEND': '/group_message/send',
  'GROUPLOG': '/group_message/list',
  'MESSAGEDETAIL': '/group_message/get_group_message_record_info'
}
//获取我的列表成员列表
export const getUsersApi = ({offset = 0, pageSize = 20, groupId, name, ageStart, ageEnd, sex, province, city, sickType, patientSource, level, orderBy}) => {
  return request({
    url: `${PATIENT_URL}${apiList.GETUSERS}`,
    data: {
      offset,
      pageSize,
      groupId,
      name,
      ageStart,
      ageEnd,
      sex,
      province,
      city,
      sickType,
      patientSource,
      level,
      orderBy,
    },
  }).then((response) => {
    return response
  })
}
//获取成员区域信息
export const getAreasApi = () => {
  return request({
    url: `${PATIENT_URL}${apiList.GETAREAS}`,
  }).then((response) => {
    return response
  })
}
//获取所有分组
export const getGroupsApi = ({id}) => {
  return request({
    url: `${PATIENT_URL}${apiList.GETGROUP}`,
    data: {
      offset: 0,
      pageSize: 999,
      id,
    },
  }).then((response) => {
    return response
  })
}
//修改重要等级
export const saveLevelApi = ({id, level}) => {
  return request({
    url: `${PATIENT_URL}${apiList.SAVELEVEL}`,
    data: {
      id,
      level,
    },
  }).then((response) => {
    return response
  })
}
//修改用户分组
export const saveUserGroupApi = ({id, groupIds}) => {
  return request({
    url: `${PATIENT_URL}${apiList.SAVEUSERGROUP}`,
    data: {
      id,
      groupIds,
    },
  }).then((response) => {
    return response
  })
}

//按条件查询分组
export const searchGroupApi = ({offset = 0, pageSize = 20, orderBy, name, createdStart, createdEnd, editedStart, editedEnd}) => {
  return request({
    url: `${PATIENT_URL}${apiList.GETGROUP}`,
    data: {
      offset,
      pageSize,
      orderBy,
      name,
      createdStart,
      createdEnd,
      editedStart,
      editedEnd,
    },
  }).then((response) => {
    return response
  })
}

//批量删除分组
export const deleteGroupApi = ({ids}) => {
  return request({
    url: `${PATIENT_URL}${apiList.DELETEGROUP}`,
    data: {
      ids
    },
  }).then((response) => {
    return response
  })
}

//添加分组
export const addGroupApi = ({name, remark}) => {
  return request({
    url: `${PATIENT_URL}${apiList.ADDGROUP}`,
    data: {
      name,
      remark,
    },
  })
}

//编辑分组
export const editorGroupApi = ({name, remark, id}) => {
  return request({
    url: `${PATIENT_URL}${apiList.EDITGROUP}`,
    data: {
      name,
      remark,
      id,
    },
  }).then((response) => {
    return response
  })
}

//查询某组内成员
export const getGroupDetailApi = ({offset = 0, pageSize = 20, groupId, orderBy}) => {
  return request({
    url: `${PATIENT_URL}${apiList.GROUPPEOPLE}`,
    data: {
      offset,
      pageSize,
      groupId,
      orderBy,
    },
  }).then((response) => {
    return response
  })
}
//移出分组指定用户
export const deleteGroupPeopleApi = ({id, patientIds}) => {
  return request({
    url: `${PATIENT_URL}${apiList.DELETEPEOPLE}`,
    data: {
      id,
      patientIds,
    },
  }).then((response) => {
    return response
  })
}
//添加到指定分组的成员
export const addGroupPatiensApi = ({offset = 0, pageSize = 20, orderBy, groupId, name, ageStart, ageEnd, sex, province, city, sickType, patientSource, level, withoutGroupId}) => {
  return request({
    url: `${PATIENT_URL}${apiList.ADDGROUPPATIENTS}`,
    data: {
      offset,
      pageSize,
      orderBy,
      groupId,
      withoutGroupId,
      name,
      ageStart,
      ageEnd,
      sex,
      province,
      city,
      sickType,
      patientSource,
      level,
    },
  }).then((response) => {
    return response
  })
}

//添加用户到指定分组
export const addPatientToGroupApi = ({id, patientIds}) => {
  return request({
    url: `${PATIENT_URL}${apiList.ADDTOGROUP}`,
    data: {
      id,
      patientIds,
    },
  }).then((response) => {
    return response
  })
}

//获取群发用户列表
export const getGroupUsersApi = (ids) => {
  return request({
    url: `${SYSMESSAGE_URL}${apiList.GROUPMESSAGE}/${ids}`,
    method: 'get'
  }).then((response) => {
    return response
  })
}

//群发消息
export const groupSendApi = ({receivers, content, groupSendMessageRecordId, link,}) => {
  return request({
    url: `${SYSMESSAGE_URL}${apiList.GROUPSEND}`,
    data: {
      receivers,
      content,
      groupSendMessageRecordId,
      link,
    },
  }).then((response) => {
    return response
  })
}

//群发历史
export const getGroupLogApi = ({offset, pageSize = 20, keyWord, startTime, endTime, sendStatus}) => {
  return request({
    url: `${SYSMESSAGE_URL}${apiList.GROUPLOG}`,
    data: {
      offset,
      pageSize,
      keyWord,
      startTime,
      endTime,
      sendStatus,
    },
  }).then((response) => {
    return response
  })
}

//群发详情
export const getMessageDetailApi = ({id}) => {
  return request({
    url: `${SYSMESSAGE_URL}${apiList.MESSAGEDETAIL}/${id}`,
    method: 'get'
  }).then((response) => {
    return response
  })
}

//群发消息
export const getGroupLogSerachApi = ({page = 1, pageSize = 20, keyWord, startTime, endTime, sendStatus}) => {
  return request({
    url: `${SYSMESSAGE_URL}/group_message/search`,
    data: {
      offset: (page-1)*pageSize,
      pageSize,
      keyWord,
      startTime,
      endTime,
      sendStatus,
    },
  })
}

//获取当前管理员机构下的没有与患者关联的医生列表
export const getDoctorsListApi = ({organId, patientId}) => {
  return request({
    url: `${DOCTORSERVICE}/doctor_admin/allocation/doctors_unassociated_the_patient`,
    method: 'get',
    params: {
      organId,
      patientId,
    },
  })
}

//分配医生
export const allocateDoctorsApi = ({organId, patientId, doctorIds}) => {
  return request({
    url: `${DOCTORSERVICE}/doctor_admin/allocation/allocate_doctors_for_the_patient`,
    data: {
      organId,
      patientId,
      doctorIds,
    },
  })
}
