<!-- 商品分类 -->
<template>
  <div class="app-container">
    <!-- 搜索栏-->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入分类名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="small"
          @click="handleAddFirst"
          v-hasPermi="['product:category:addFirst']"
        >
          添加一级分类
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="small"
          @click="handleAddSecond"
          v-hasPermi="['product:category:addSecond']"
        >
          添加二级分类
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
      size="small"
      row-key="id"
      :default-expand-all="isExpandAll"
    >
      <el-table-column
        label="名称"
        align="center"
        key="name"
        prop="name"
        width="200"
      />
      <el-table-column
        label="类型"
        align="center"
        key="typeName"
        prop="typeName"
        width="200"
      />
      <el-table-column
        label="APP来源"
        align="center"
        key="appName"
        prop="appName"
        width="200"
      />
      <el-table-column
        label="创建时间"
        align="center"
        key="createTime"
        prop="createTime"
      />
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
            v-hasPermi="['product:category:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['product:category:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑窗口 -->
    <el-dialog :title="title" :visible.sync="open" width="450px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="一级分类" prop="parentId" v-if="showParent">
          <el-select v-model="form.parentId">
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio
              v-for="item in dict.type.product_category_type"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="APP来源" prop="appId">
          <el-select v-model="form.appId">
            <el-option
              v-for="item in appList"
              :key="item.appId"
              :label="item.appName"
              :value="item.appId"
            />
          </el-select>
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
  listCategory,
  getCategory,
  addCategory,
  updateCategory,
  delCategory,
} from "@/api/app/product/category";
import { listApp } from "@/api/app/app";

export default {
  name: "ProductCategory",
  dicts: ["product_category_type"], // TODO 使用数据字典，须在字典管理配置
  data() {
    return {
      // 遮罩层
      loading: false,
      // 表格数据
      list: [],
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        name: undefined,
      },
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 弹窗层表单数据
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        parentId: [
          { required: true, message: "一级分类不能为空", trigger: "blur" },
        ],
        appId: [
          { required: true, message: "APP来源不能为空", trigger: "blur" },
        ],
      },
      appList: [],
      showParent: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 获取列表 */
    getList() {
      this.loading = true;
      listCategory(this.queryParams).then((response) => {
        this.list = this.handleTree(response.data);
        this.loading = false;
      });
    },
    /** 获取APP列表 */
    getAppList() {
      if (!this.appList || this.appList.length == 0) {
        listApp().then((response) => {
          this.appList = response.data;
        });
      }
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
    /** 添加一级分类 */
    handleAddFirst() {
      this.handleEdit();
      this.title = "添加一级分类";
      this.showParent = false;
    },
    /** 添加二级分类 */
    handleAddSecond() {
      this.handleEdit();
      this.showParent = true;
      this.title = "添加二级分类";
    },
    /** 修改 */
    handleUpdate(row) {
      this.handleEdit();
      this.title = "修改分类";
      getCategory(row.id).then((response) => {
        this.form = response.data;
        this.showParent = this.form.parentId;
      });
    },
    /** 编辑 */
    handleEdit() {
      this.getAppList();
      this.reset();
      this.open = true;
    },
    /** 删除 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除"' + row.name + "[" + row.appName + ']"？')
        .then(function () {
          return delCategory(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 提交表单 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateCategory(this.form).then(() => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCategory(this.form).then(() => {
              this.$modal.msgSuccess("添加成功");
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
        id: undefined,
        name: undefined,
        type: undefined,
        appId: undefined,
        parentId: undefined,
      };
      this.resetForm("form");
    },
  },
};
</script>

<style lang="scss" scoped></style>
