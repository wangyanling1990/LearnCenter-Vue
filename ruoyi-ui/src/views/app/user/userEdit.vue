<!-- 用户编辑页面 -->
<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="500px"
    append-to-body
    :before-close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名称" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio-group v-model="form.type" placeholder="请选择身份">
          <el-radio
            v-for="item in dict.type.app_user_type"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所在城市" prop="city">
        <el-select v-model="form.city" placeholder="请选择城市">
          <el-option
            v-for="item in cityList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属学校" prop="school">
        <el-select v-model="form.school" placeholder="请选择学校">
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在年级" prop="grade">
        <el-select v-model="form.grade" placeholder="请选择年级">
          <el-option
            v-for="item in gradeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitForm">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUser, addUser, updateUser } from "@/api/app/user";

export default {
  name: "userEdit",
  props: ["title", "open", "id"],
  dicts: ["sys_normal_disable", "app_user_type"],
  data() {
    // 验证手机号
    var validatePhone = (rule, value, callback) => {
      const reg = /^1[3-9]\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      cityList: [],
      schoolList: [],
      gradeList: [],
      // 弹窗层表单数据
      form: {},
      // 表单校验
      rules: {
        username: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          { validator: validatePhone },
        ],
      },
    };
  },
  created() {
    this.reset();
  },
  watch: {
    open(value) {
      if (value) {
        if (this.id) {
          getUser(this.id).then((response) => {
            this.form = response.data;
          });
        }
      } else {
        this.reset();
      }
    },
  },
  methods: {
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        phone: undefined,
        type: "1",
        city: undefined,
        school: undefined,
        grade: undefined,
        status: "0",
      };
      this.resetForm("form");
    },
    /** 提交表单 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUser(this.form).then(() => {
              this.$modal.msgSuccess("修改成功");
              this.$emit("callBackSubmit");
              this.close();
            });
          } else {
            addUser(this.form).then(() => {
              this.$modal.msgSuccess("添加成功");
              this.$emit("callBackSubmit");
              this.close();
            });
          }
        }
      });
    },
    /** 关闭弹窗 submit是否提交 提交则重新加载列表 */
    close() {
      this.reset();
      this.$emit("callBackClose");
    },
  },
};
</script>

<style lang="scss" scoped></style>
