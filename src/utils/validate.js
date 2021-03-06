/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export const rule = {
  customerName: [
    { required: true, message: '请输入客户名称', trigger: 'change' }
  ],
  campaignId: [
    { required: true, message: '请选择活动', trigger: 'change' }
  ],
  sex: [
    { required: true, message: '请输入客户性别', trigger: 'change' }
  ],
  mobile: [
    { required: true, message: '请输入手机号码', trigger: 'change' },
    { pattern: /^([1][3,4,5,6,7,8][0-9]{9}|0\d{2,3}-\d{7,8}|\d{1,20})$/, message: '请输入正确的电话号码' }
  ],
  idNumber: [
    { required: true, message: '请输入身份证号码', trigger: 'change' },
    { pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, message: '请输入正确的身份证号码' }
  ],
  batchName: [
    { required: true, message: '请输入批次名称', trigger: 'change' }
  ],
  source: [
    { required: true, message: '请输入数据来源', trigger: 'change' }
  ],
  ascriptionId: [
    { required: true, message: '请选择客户归属', trigger: 'change' }
  ],
  validityTime: [
    { required: true, message: '请输入有效时间', trigger: 'change' }
  ],
  listName: [
    { required: true, message: '请输入名单名称', trigger: 'change' }
  ],
  visible: [
    { required: true, message: '请选择可见状态', trigger: 'change' }
  ],
  taskName: [
    { required: true, message: '请输入质检任务名称', trigger: 'change' }
  ]
}

export function validSpace(rule, value, callback) {
  if (value.trim().length === 0) {
    callback(new Error('输入不能为空'))
  } else {
    callback()
  }
}

