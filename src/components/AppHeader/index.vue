<template>
  <div class="header">
    <!-- 头部左侧Logo和标题 -->
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" width="25px" />
      <span class="company">VUE2.0标准管理系统</span>
    </a>
    <!-- 下拉菜单 -->
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ user.name }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="edit"
          >修改密码</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-switch-button" command="logOut"
          >退出系统</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="oldPass">
          <el-input
            type="password"
            v-model="ruleForm.oldPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import pwdApi from "@/api/password";
export default {
  data() {
    //添加自定义校验规则(不能写在return返回对象中)
    const validateOldPass = (rule, value, callback) => {
      pwdApi.checkPwd(this.user.id, value).then(response => {
        if (!response.data.flag) {
          callback(new Error(response.data.message));
        } else {
          callback();
        }
      });
    };
    const validatePass = (rule, value, callback) => {
      if (value !== this.ruleForm.pass) {
        callback(new Error("新旧密码不一致"));
      } else {
        callback();
      }
    };
    return {
      user: this.$store.state.user.user,
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
          { validator: validateOldPass, trigger: "blur" }
        ],
        pass: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
        checkPass: [
          { required: true, message: "确认新密码不能为空", trigger: "blur" },
          { validator: validatePass, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "edit":
          this.handleLogEdit();
          break;
        case "logOut":
          this.handleLogOut();
          break;
        default:
          break;
      }
    },
    handleLogOut() {
      this.$confirm("确认退出本系统吗?", "退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("Logout").then(response => {
            if (response.flag) {
              // 退出成功
              // 回到登录页面
              this.$router.push("/login");
            } else {
              this.$message({
                message: response.message,
                type: "warning",
                duration: 500 // 弹出停留时间
              });
            }
          });
        })
        .catch(() => {});
    },
    handleLogEdit() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          pwdApi.updatePwd(this.user.id, this.ruleForm.pass).then(response => {
            this.$message({
              message: response.data.message,
              type: response.data.flag ? "success" : "error"
            });
            if (response.data.flag) {
              this.handleLogOut();
              this.dialogFormVisible = false;
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
}
.company {
  position: absolute;
  color: white;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
</style>
