import request from '@/utils/request'

export function queryByKeyWords(req) {
  return request({
    url: '/questionnaire/query',
    method: 'get',
    params: {
      accurate: req.accurate,
      name: req.name,
      modifier: req.modifier,
      beginTime: req.beginTime,
      afterTime: req.afterTime,
      queryAll: req.queryAll
    }
  })
}

export function queryOneQuestionnaire(id) {
  return request({
    url: '/questionnaire/queryOne',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function generateQuestionnaireRecord(taskId, templateId, templateName, allItems) {
  return request({
    url: '/questionnaire/generateRecord',
    method: 'post',
    data: {
      taskId: taskId,
      templateId: templateId,
      templateName: templateName,
      recordTitles: allItems
    }
  })
}

export function queryQuestionnaireRecords(req) {
  return request({
    url: '/questionnaire/queryQuestionnaireRecords',
    method: 'get',
    params: {
      taskId: req.taskId,
      angentId: req.angentId,
      staffName: req.staffName,
      templateName: req.templateName,
      beginTime: req.beginTime,
      afterTime: req.afterTime,
      pageNo: req.pageNo,
      pageSize: req.pageSize
    }
  })
}

export function queryRecordsByTaskId(taskId) {
  return request({
    url: `/questionnaire/queryRecordsByTaskId`,
    params: { taskId: taskId }
  })
}

export function deleteOneRecord(id) {
  return request({
    url: '/questionnaire/deleteOneRecord',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function batchDeleteRecords(ids) {
  return request({
    url: '/questionnaire/batchDeleteRecords',
    method: 'post',
    data: {
      ids: ids
    }
  })
}
