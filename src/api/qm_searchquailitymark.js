import request from '@/utils/request'

// 查询质检活动 查询下属所有活动时传入campaignId
export function findQmCampaignByUser(campaignId) {
  return request({
    url: 'qualityTask/findQmCampaignByUser',
    params: campaignId
  })
}
// 查询质检评分表
export function findAllGradeForm(pageSize) {
  return request({
    url: 'grade/findAllGradeForm',
    params: pageSize
  })
}
// 查询质检评分
export function findQualityResultByInfo(req) {
  return request({
    url: 'quality/findQualityResultByInfo',
    method: 'post',
    data: req
  })
}
// 通过员工id查找部门
export function getDepartIdByAgentId(agentId) {
  return request({
    url: 'employee/getStaffNameByAgentId',
    params: { 'agentId': agentId }
  })
}

// 通过员工ID查找部门
export function getStaffNameByAgentId(agentId) {
  return request({
    url: 'employee/getStaffNameByAgentId',
    params: { 'agentId': agentId }
  })
}
// --------------------质检评分详情----------------------
//
