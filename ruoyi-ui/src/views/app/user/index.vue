<!-- app用户管理 -->
<template>
  <div class="app-container">
    <!-- 搜索栏-->
    <el-form
      class="search-container"
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="APP来源" prop="appId">
        <el-select v-model="queryParams.appId" clearable>
          <el-option
            v-for="item in appList"
            :key="item.appId"
            :label="item.appName"
            :value="item.appId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名称" prop="name">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker
          v-model="dateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" clearable>
          <el-option
            v-for="item in dict.type.sys_normal_disable"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery">搜索</el-button>
        <el-button type="primary" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <!-- 工具栏 -->
      <el-row :gutter="10" class="mb8 toolbar">
        <el-col :span="1.5">
          <el-button
            type="primary"
            @click="handleAdd"
            v-hasPermi="['app:user:add']"
          >
            添加用户
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            @click="handleDelete"
            v-hasPermi="['app:user:remove']"
          >
            批量删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            @click="handleResetPwd"
            v-hasPermi="['app:user:resetPwd']"
          >
            批量重置密码
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            @click="handleExport"
            v-hasPermi="['app:user:export']"
          >
            导出
          </el-button>
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          label="用户ID"
          align="center"
          key="id"
          prop="id"
          width="80"
        />
        <el-table-column
          label="名称"
          align="center"
          key="username"
          prop="username"
          width="100"
        />
        <el-table-column
          label="手机号"
          align="center"
          key="phone"
          prop="phone"
          width="120"
        />
        <el-table-column
          label="用户类型"
          align="center"
          key="typeName"
          prop="typeName"
          width="100"
        />
        <el-table-column
          label="学校"
          align="center"
          key="school"
          prop="school"
          width="150"
        />
        <el-table-column
          label="年级"
          align="center"
          key="grade"
          prop="grade"
          width="100"
        />
        <el-table-column
          label="注册时间"
          align="center"
          key="createTime"
          prop="createTime"
          width="160"
        />
        <el-table-column
          label="APP来源"
          align="center"
          key="appName"
          prop="appName"
          width="100"
        />
        <el-table-column
          label="会员"
          align="center"
          key="vipStatusName"
          prop="vipStatusName"
          width="100"
        />
        <el-table-column
          label="会员到期时间"
          align="center"
          key="vipTime"
          prop="vipTime"
          width="120"
          :formatter="vipTimeFormatter"
        />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-row>
              <el-col>
                <el-button
                  type="text"
                  @click="handleDetail(scope.row)"
                  v-hasPermi="['app:user:detail']"
                  >详情</el-button
                >
                <el-button
                  type="text"
                  @click="handleLoginLog(scope.row)"
                  v-hasPermi="['app:user:loginLog']"
                  >登录日志</el-button
                >
                <el-button
                  type="text"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['app:user:edit']"
                  >修改</el-button
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-button
                  v-if="scope.row.status == '1'"
                  type="text"
                  @click="handleStatusChange(scope.row)"
                  v-hasPermi="['app:user:changeStatus']"
                  >禁用</el-button
                >
                <el-button
                  v-else
                  type="text"
                  @click="handleStatusChange(scope.row)"
                  v-hasPermi="['app:user:changeStatus']"
                  >启用</el-button
                >
                <el-button
                  type="text"
                  @click="handleResetPwd(scope.row)"
                  v-hasPermi="['app:user:resetPwd']"
                  >重置密码</el-button
                >
                <el-button
                  class="danger-button"
                  type="text"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['app:user:remove']"
                  >删除</el-button
                >
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 用户编辑弹窗 -->
    <user-edit
      v-if="dialog == 'edit'"
      :title="title"
      :open="open"
      :id="id"
      @callBackClose="closeDialog"
      @callBackSubmit="getList"
    ></user-edit>
  </div>
</template>

<script>
import userEdit from "./userEdit";
import {
  listUser,
  delUser,
  resetUserPwd,
  changeUserStatus,
} from "@/api/app/user";
import { listApp } from "@/api/app/app";
export default {
  name: "User",
  dicts: ["sys_normal_disable"],
  components: { userEdit },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        phone: undefined,
        status: undefined,
        appId: undefined,
      },
      // APP来源列表
      appList: [],
      // 日期范围
      dateRange: [],
      // 弹出层类型 edit=编辑 detail=详情 log=登录日志
      dialog: "",
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 用户id
      id: undefined,
    };
  },
  created() {
    this.getList();
    this.getAppList();
  },
  watch: {
    "form.vipStatus": {
      handler(newValue, oldValue) {
        if (newValue == "1") {
          this.showVipTime = true;
        } else {
          this.showVipTime = false;
          this.form.vipTime = undefined;
        }
      },
    },
  },
  methods: {
    /** 获取列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.list = response.data;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 获取APP列表 */
    getAppList() {
      listApp().then((response) => {
        this.appList = response.data;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 关闭弹窗 */
    closeDialog() {
      this.open = false;
    },
    /** 添加商品 */
    handleAdd() {
      this.dialog = "edit";
      this.title = "添加用户";
      this.id = undefined;
      this.open = true;
    },
    /** 修改 */
    handleUpdate(row) {
      this.dialog = "edit";
      this.title = "修改用户";
      this.id = row.id;
      this.open = true;
    },
    /** 删除 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      if (!ids || ids.length == 0) {
        this.$modal.msg("请先选择用户！");
        return;
      }
      this.$modal
        .confirm('是否确认删除用户编号为"' + ids + '"的数据项？')
        .then(function () {
          return delUser(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 重置密码 */
    handleResetPwd(row) {
      const ids = row.id || this.ids;
      if (!ids || ids.length == 0) {
        this.$modal.msg("请先选择用户！");
        return;
      }
      this.$modal
        .confirm('是否确认重置用户编号为"' + ids + '"的密码？')
        .then(function () {
          return resetUserPwd(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("重置成功");
        })
        .catch(() => {});
    },
    /** 导出 */
    handleExport() {
      this.download(
        "app/user/export",
        {
          ...this.queryParams,
        },
        `app_user_${new Date().getTime()}.xlsx`
      );
    },
    /** 修改状态 */
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "禁用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.username + '"用户吗？')
        .then(function () {
          return changeUserStatus(row.id, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    vipTimeFormatter(row) {
      if (!row.vipTime) {
        return "-";
      }
      return row.vipTime;
    },
  },
};
</script>

<style lang="scss" scoped></style>
