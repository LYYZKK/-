<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="req" ref="searchForm">
          <el-form-item prop="name" label="模板组名称:">
            <el-input v-model="req.name" placeholder="模板组名称（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="上级模板组:">
            <el-select v-model="req.upId" placeholder="上级模板组">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in messageOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  prop="modifier" label="操作人:">
            <el-input v-model="req.modifier" placeholder="操作人（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
              <el-date-picker
                v-model="timeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;paginationReq=cloneData(req);getTemplateList(req);">查询</el-button>
            <el-button @click="reset();">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- 表格 -->
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">短信模板组表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(addMessageTemplateDetail,'addMessageForm');">新建</el-button>
        <!-- <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button> -->
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="模板组编号"
            :show-overflow-tooltip="true"
            prop="id">
          </el-table-column>
          <el-table-column
            align="center"
            label="模板组名称"
            :show-overflow-tooltip="true"
            prop="name">
          </el-table-column>
          <el-table-column
            align="center"
            label="上级模板组"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
                {{formatData(scope.row.upId)}}
            </template>
          </el-table-column>
           <el-table-column
            align="center"
            label="操作人"
            prop="modifier"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            prop="id"
            width="155">
            <template slot-scope="scope">
                <div>{{formatDateTime(scope.row.modifyTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.id=scope.row.id;resetEdit();getTemplateListById(scope.row.id);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.id=scope.row.id" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='pageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 新建模板组 -->
    <el-dialog
      align:left
      width="30%"
      title="新建模板组"
      :visible.sync="addVisible"
      append-to-body>
      <el-form size="small" :rules="rule" :model="addMessageTemplateDetail" ref="addMessageForm" label-width="120px">
        <el-form-item label="模板组标题：" prop="name">
          <el-input v-model="addMessageTemplateDetail.name" size="small" placeholder="模板组标题（限长45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="上级模板组：" prop="upId">
          <el-select style="width:100%" v-model="addMessageTemplateDetail.upId" placeholder="上级模板组">
            <el-option label="无" value=""></el-option>
            <el-option v-for="item in messageOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="submitForm('addMessageForm',addMessageTemplateDetail);addTemplateGroup(addMessageTemplateDetail);">确定</el-button>
        <el-button @click="resetForm('addMessageForm')">重置</el-button>
        <el-button type="primary" plain @click="addVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 批量删除 -->
    <!-- <el-dialog
      width="30%"
      title="批量删除"
      :visible.sync="batchDelVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" plain @click="batchDelVisible = false">取消</el-button>
        <el-button type="primary" @click="batchDelVisible = false;batchdel(batchDelReq);">确定</el-button>
      </div>
    </el-dialog> -->
    <!-- 删除 -->
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除吗？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="delVisible = false;delTemplateGroup(delReq.id);">确定</el-button>
        <el-button type="primary" plain @click="delVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改模板组 -->
    <el-dialog
      align:left
      width="30%"
      title="修改模板组"
      :visible.sync="editVisible"
      append-to-body>
      <el-form size="small" :rules="rule" :model="editTemplateGroupDetail" ref="editTemplateGroupDeForm" label-width="120px">
        <el-form-item label="模板组标题：" prop="name">
          <el-input v-model="editTemplateGroupDetail.name" size="small" placeholder="模板组标题（限长45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="上级模板组：" prop="upId">
          <el-select style="width:100%" v-model="editTemplateGroupDetail.upId" placeholder="上级模板组">
            <el-option label="无" value=""></el-option>
            <el-option v-for="item in messageOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="submitForm('editTemplateGroupDeForm',editTemplateGroupDetail);editTemplateGroup(editTemplateGroupDetail);">确定</el-button>
        <el-button @click="getTemplateListById(delReq.id)">重置</el-button>
        <el-button type="primary" plain @click="editVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getTemplateList, getAllTemplateGroup, addTemplateGroup, editTemplateGroup, getTemplateListById, delTemplateGroup } from '@/api/message_template_list'
import { formatDateTime } from '@/utils/tools'
export default {
  name: 'message_template_list',
  data() {
    var validateLength = (eule, value, callback) => {
      if (value.length > 250) {
        return callback(new Error('标题太长！'))
      } else {
        callback()
      }
    }
    return {
      visibleClass: '',
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      validate: true, // 验证不通过阻止发请求
      addVisible: false, // 新建对话框显示隐藏
      pageShow: false, // 分页显示隐藏
      timeValue: [], // 操作时间
      messageMap: {}, // 存所有的模板
      rule: {
        name: [
          { required: true, message: '模板组标题不能为空', trigger: 'blur' },
          { validator: validateLength, trigger: 'blur' }
        ]
      },
      // 查询 发送请求参数
      req: {
        name: '', // 模板名称
        upId: '', // 上级模板Id
        modifier: '', // 操作人
        afterTime: '', // 操作时间
        beginTime: '', // 操作时间
        pageNo: 1,
        pageSize: 10
      },
      paginationReq: {
        name: '', // 模板名称
        upId: '', // 上级模板Id
        modifier: '', // 操作人
        afterTime: '', // 操作时间
        beginTime: '', // 操作时间
        pageNo: 1,
        pageSize: 10
      }, // 记录上次查询条件
      addMessageTemplateDetail: {
        name: '', // 开始号段
        upId: '' // 结束号段
      },
      delReq: {
        id: ''
      },
      // 删除ids
      batchDelReq: {
        ids: []
      },
      pageInfo: {}, // 分页数据
      messageOptions: [], // 选择活动数据
      tableData: [], // 表格数据
      editTemplateGroupDetail: {}, // 修改
      noVisitCustomerDetail: {
        campaignIds: [],
        customerPhone: '',
        effectiveDate: '',
        expiryDate: ''

      }
    }
  },
  created() {
    this.getAllTemplateGroup(this.req)
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // 重置查询框内容
    reset() {
      this.req = {
        startNumber: '', // 号段
        endNumber: '', // 号段
        modifier: '', // 操作人
        afterTime: '', // 操作时间
        beginTime: '', // 操作时间
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.timeValue = []
    },
    resetAdd() {
      this.addMessageTemplateDetail = {
        name: '', // 开始号段
        upId: '' // 结束号段
      }
    },
    resetEdit() {
      this.editNoDisturbPhonesDetail = {
        startNumber: '', // 开始号段
        endNumber: '' // 结束号段
      }
    },
    getAllTemplateGroup() {
      getAllTemplateGroup().then(response => {
        this.messageOptions = response.data.data
        this.getTemplateList(this.req)
        this.messageOptions.forEach(element => {
          this.messageMap[(element.id).toString()] = (element.name)
        })
        console.log(this.messageMap)
      })
    },
    // 查询表格数据
    getTemplateList(req) {
      this.req.beginTime = this.timeValue ? this.timeValue[0] : null
      this.req.afterTime = this.timeValue ? this.timeValue[1] : null
      getTemplateList(req).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          console.log(this.tableData)
          if (response.data.pageInfo) {
            this.pageInfo = response.data.pageInfo
            this.pageShow = true
          } else {
            this.pageShow = false
          }
        } else {
          this.$message.error(response.data.messages)
          this.tableData = response.data.data
          this.pageShow = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 通过Id查询
    getTemplateListById(id) {
      getTemplateListById(id).then(response => {
        if (response.data.code === 0) {
          this.editTemplateGroupDetail = response.data.data
        } else {
          this.$message.success(response.data.message)
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // 新建
    addTemplateGroup(obj) {
      if (!this.validate) {
        return
      }
      addTemplateGroup(obj).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.addVisible = false
          this.reset()
          this.resetAdd()
          this.getAllTemplateGroup()
          this.getTemplateList(this.req)
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // // 批量删除
    // batchdel(batchDelReq) {
    //   if (batchDelReq.ids.length === 0) {
    //     this.$message.error('请选择需要删除的内容')
    //   } else {
    //     batchdel(batchDelReq.ids).then(response => {
    //       if (response.data.code === 0) {
    //         this.$message.success(response.data.message)
    //         this.querynodisturbphones(this.paginationReq)
    //       } else {
    //         this.$message('删除失败')
    //       }
    //     }).catch(error => {
    //       console.log(error)
    //     })
    //   }
    // },
    // 修改
    editTemplateGroup(params) {
      if (!this.validate) {
        return
      }
      editTemplateGroup(params).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.editVisible = false
          this.getTemplateList(this.paginationReq)
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // 删除
    delTemplateGroup(id) {
      delTemplateGroup(id).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.delVisible = false
          this.paginationReq.pageNo = 1
          this.pageInfo.pageNo = 1
          this.getTemplateList(this.paginationReq)
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        console.error(error)
      })
    },
    formatDateTime: formatDateTime, // 时间格式化
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.ids.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.ids.push(val[i].id)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.paginationReq.pageNo = 1
      this.paginationReq.pageSize = val
      this.req.pageNo = 1
      this.req.pageSize = val
      this.pageInfo.pageNo = 1
      this.getTemplateList(this.paginationReq)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.paginationReq.pageNo = val
      this.req.pageNo = val
      this.getTemplateList(this.paginationReq)
    },
    // 清空重置
    clearForm(obj, formName) {
      for (const key in obj) {
        if (key !== 'pageNo') {
          obj[key] = ''
        }
      }
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 校验检测
    submitForm(formName, value) {
      console.log(value)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.$message.error('请检查是否填写正确')
          this.validate = false
        }
        console.log(this.validate)
        if (this.validate) {
          if (value.upId !== '' && value.name === this.messageMap[(value.upId).toString()]) {
            this.$message.error('模板组不能与上级模板组同名！')
            this.validate = false
          }
        }
      })
    },
    formatData(id) {
      if (id == null) {
        return ''
      } else {
        return this.messageMap[id.toString()] == null ? '' : this.messageMap[id.toString()]
      }
    },
    // 克隆数据
    cloneData(obj) {
      var data = {}
      data = JSON.parse(JSON.stringify(obj))
      return data
    }
  }
}
</script>

