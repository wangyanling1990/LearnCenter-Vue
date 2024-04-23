<!-- 商品列表 -->
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
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品状态" prop="status">
        <el-select v-model="queryParams.status" clearable>
          <el-option
            v-for="item in dict.type.product_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
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
          @click="handleAdd"
          v-hasPermi="['product:list:add']"
        >
          添加商品
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="list" size="small">
      <el-table-column
        label="商品ID"
        align="center"
        key="id"
        prop="id"
        width="80"
      />
      <el-table-column
        label="商品名称"
        align="center"
        key="name"
        prop="name"
        width="150"
      />
      <el-table-column
        label="商品分类"
        align="center"
        key="categoryName"
        prop="categoryName"
        width="120"
      />
      <el-table-column
        label="APP来源"
        align="center"
        key="appName"
        prop="appName"
        width="120"
      />
      <el-table-column
        label="价格"
        align="center"
        key="price"
        prop="price"
        width="100"
        :formatter="priceFormatter"
      />
      <el-table-column
        label="销量"
        align="center"
        key="sale"
        prop="sale"
        width="100"
      />
      <el-table-column
        label="库存"
        align="center"
        key="stock"
        prop="stock"
        width="100"
      />
      <el-table-column
        label="创建时间"
        align="center"
        key="createTime"
        prop="createTime"
      />
      <el-table-column
        label="状态"
        align="center"
        key="status"
        prop="status"
        width="100"
        :formatter="statusFormatter"
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
            v-hasPermi="['product:list:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['product:list:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑窗口 -->
    <el-dialog :title="title" :visible.sync="open" width="450px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryId">
          <treeselect
            v-model="form.categoryId"
            :options="categoryList"
            :normalizer="normalizer"
            :disableBranchNodes="true"
            @select="selectCategory"
            @input="changeCategory"
            placeholder="请选择商品分类"
          />
        </el-form-item>
        <el-form-item label="APP来源" prop="appId">
          <el-select
            v-model="form.appId"
            :disabled="true"
            placeholder="请选择商品分类"
          >
            <el-option
              v-for="item in appList"
              :key="item.appId"
              :label="item.appName"
              :value="item.appId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入商品价格" />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input v-model.number="form.stock" placeholder="请输入商品库存" />
        </el-form-item>
        <el-form-item label="商品状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="item in dict.type.product_status"
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
  listProduct,
  getProduct,
  addProduct,
  updateProduct,
  delProduct,
} from "@/api/app/product/list";
import { listCategory } from "@/api/app/product/category";
import { listApp } from "@/api/app/app";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ProductList",
  dicts: ["product_status"], // TODO 使用数据字典，须在字典管理配置
  components: { Treeselect },
  data() {
    // 校验数字
    let validateNum = (rule, value, callback) => {
      let isInt = rule.isInt; // 是否是整数
      let reg;
      let message = "请输入数字";
      if (isInt) {
        reg = /^(0|([1-9]\d*))?$/g;
      } else {
        reg = /^(0|([1-9]\d*))(\.\d)?$/g;
        message += "，保留一位小数";
      }
      if (value && !reg.test(value)) {
        callback(new Error(message));
      } else {
        callback();
      }
    };
    return {
      // 遮罩层
      loading: false,
      // 表格数据
      list: [],
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        name: undefined,
        status: undefined,
        appId: undefined,
      },
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 弹窗层表单数据
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "商品分类不能为空", trigger: "blur" },
        ],
        price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" },
          { validator: validateNum },
        ],
        stock: [{ validator: validateNum, isInt: true }],
      },
      appList: [],
      categoryList: [],
      showParent: false,
    };
  },
  created() {
    this.getList();
    this.getAppList();
    this.getCategoryList();
  },
  methods: {
    /** 获取列表 */
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then((response) => {
        this.list = response.data;
        this.loading = false;
      });
    },
    /** 获取APP列表 */
    getAppList() {
      listApp().then((response) => {
        this.appList = response.data;
      });
    },
    /** 获取商品分类 */
    getCategoryList() {
      listCategory().then((response) => {
        this.categoryList = this.handleTree(response.data);
      });
    },
    /** 转换商品分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        appId: node.appId,
        children: node.children,
      };
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
    /** 添加商品 */
    handleAdd() {
      this.title = "添加商品";
      this.reset();
      this.open = true;
    },
    /** 修改 */
    handleUpdate(row) {
      this.title = "修改分类";
      this.reset();
      getProduct(row.id).then((response) => {
        this.form = response.data;
        this.open = true;
      });
    },
    /** 删除 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除"' + row.name + "[" + row.appName + ']"？')
        .then(function () {
          return delProduct(row.id);
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
            updateProduct(this.form).then(() => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then(() => {
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
        categoryId: undefined,
        appId: undefined,
        price: undefined,
        stock: undefined,
        status: "1",
      };
      this.resetForm("form");
    },
    /** 价格格式化 保留1位小数 */
    priceFormatter(row) {
      return row.price.toFixed(1);
    },
    /** 状态格式化 */
    statusFormatter(row) {
      return row.status == "1" ? "上架" : "下架";
    },
    /** 监听商品分类选择事件，动态更新APP来源 */
    selectCategory(node) {
      this.form.appId = node.appId;
    },
    /** 清空商品分类选择的同时，清空APP来源 */
    changeCategory(value) {
      if (!value) this.form.appId = undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
