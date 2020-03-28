<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px;"
    >
      <el-form-item prop="name">
        <el-input
          v-model="searchMap.username"
          placeholder="账号"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="linkname">
        <el-input
          v-model="searchMap.name"
          placeholder="姓名"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData"
          >查询</el-button
        >
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <!-- @current-change表格单行选中触发事件 -->
    <!-- highlight-current-row表格单行选中高亮 -->
    <el-table :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="username" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="salary" label="薪酬"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页，添加在div里面 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增编辑弹窗 -->
    <el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        status-icon
        ref="pojoForm"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age" />
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile" />
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary" />
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <el-date-picker
            v-model="pojo.entryDate"
            type="date"
            placeholder="请点击选择"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            pojo.id === null ? addData('pojoForm') : updateData('pojoForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import staffApi from "@/api/staff";
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页, 默认第1页
      pageSize: 10, // 每页显示条数， 10条
      searchMap: {
        username: "",
        name: ""
      }, // 条件查询的绑定字段值
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: "",
        username: "",
        age: "",
        mobile: "",
        salary: "",
        entryDate: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      staffApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const res = response.data;
          this.list = res.data.rows;
          this.total = res.data.total;
        });
    },
    handleEdit(id) {
      this.handleAdd();
      staffApi.getById(id).then(response => {
        if (response.data.flag) {
          this.pojo = response.data.data;
        } else {
          this.$message({
            message: response.data.message,
            type: "error"
          });
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          staffApi.deleteById(id).then(response => {
            if (response.data.flag) {
              this.$message({
                message: response.data.message,
                type: "success"
              });
              this.fetchData();
            } else {
              this.$message({
                message: response.data.message,
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.pojo.id = null;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.add(this.pojo).then(response => {
            if (response.data.flag) {
              this.$message({
                message: response.data.message,
                type: "success"
              });
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: response.data.message,
                type: "error"
              });
            }
          });
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.update(this.pojo).then(response => {
            if (response.data.flag) {
              this.$message({
                message: response.data.message,
                type: "success"
              });
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: response.data.message,
                type: "error"
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped></style>
