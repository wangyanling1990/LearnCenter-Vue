<!-- app管理 -->
<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="small"
          @click="handleAdd"
          v-hasPermi="['app:app:add']"
        >
          添加
        </el-button>
      </el-col>
      <right-toolbar :search="false" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="list" size="small">
      <el-table-column
        label="APPID"
        align="center"
        key="appId"
        prop="appId"
        width="150"
      />
      <el-table-column
        label="APP名称"
        align="center"
        key="appName"
        prop="appName"
        width="250"
      />
      <el-table-column
        label="APPSecret"
        align="center"
        key="appSecret"
        prop="appSecret"
      />
      <el-table-column
        label="创建时间"
        align="center"
        key="createTime"
        prop="createTime"
        width="200"
      />
      <el-table-column label="状态" align="center" key="status" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['app:app:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['app:app:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑窗口 -->
    <el-dialog :title="title" :visible.sync="open" width="450px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="APP名称" prop="appName">
          <el-input v-model="form.appName" placeholder="请输入APP名称" />
        </el-form-item>
        <el-form-item label="APPSecret" prop="appSecret">
          <el-input v-model="form.appSecret" placeholder="请输入APPSecret" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="item in dict.type.sys_normal_disable"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listApp,
  getApp,
  addApp,
  updateApp,
  delApp,
  changeAppStatus,
} from "@/api/app/app";

export default {
  name: "App",
  dicts: ["sys_normal_disable"],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 表格数据
      list: null,
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 弹窗层表单数据
      form: {},
      // 表单校验
      rules: {
        appName: [
          { required: true, message: "APP名称不能为空", trigger: "blur" },
        ],
        appSecret: [
          { required: true, message: "APPSecret不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 获取列表 */
    getList() {
      this.loading = true;
      listApp().then((response) => {
        this.list = response.data;
        this.loading = false;
      });
    },
    /** 添加 */
    handleAdd() {
      this.reset();
      this.title = "添加APP";
      this.open = true;
    },
    /** 修改 */
    handleUpdate(row) {
      this.reset();
      this.title = "修改APP";
      getApp(row.appId).then((response) => {
        this.form = response.data;
        this.open = true;
      });
    },
    /** 删除 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除"' + row.appName + '"？')
        .then(function () {
          return delApp(row.appId);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 修改状态 */
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.appName + '"APP吗？')
        .then(function () {
          return changeAppStatus(row.id, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 提交表单 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.appId != undefined) {
            updateApp(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addApp(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        appId: undefined,
        appName: undefined,
        appSecret: undefined,
        status: "0",
      };
      this.resetForm("form");
    },
  },
};
</script>

<style lang="scss" scoped></style>
