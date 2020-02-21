import {
  getReplyListApi,
} from '../../../../../api/reply'
import router from '../../../../../router'

const init = async function () {
  const _this = this
  const res = await getReplyListApi({id: _this.id})
  console.log(res)
  if(res.length >= 1) {
    _this.list = res
  } else {
    _this.list = []
  }
}

//编辑快捷回复
const goEditor = function () {
  router.push({name: 'chat_reply'})
}

export default {
  init,
  goEditor,
}