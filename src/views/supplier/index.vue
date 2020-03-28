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
          v-model="searchMap.name"
          placeholder="供应商名称"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="linkname" v-if="!isDialog">
        <el-input
          v-model="searchMap.linkname"
          placeholder="联系人"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input
          v-model="searchMap.mobile"
          placeholder="联系电话"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchDate"
          >查询</el-button
        >
        <el-button type="primary" @click="handleAdd" v-if="!isDialog"
          >新增</el-button
        >
        <el-button @click="resetForm('searchForm')" v-if="!isDialog"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <!-- @current-change表格单行选中触发事件 -->
    <!-- highlight-current-row表格单行选中高亮 -->
    <el-table
      :highlight-current-row="isDialog"
      @current-change="handleCurrentColChange"
      :data="list"
      height="380"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column
        prop="linkman"
        label="联系人"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="mobile"
        label="联系电话"
        v-if="!isDialog"
      ></el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        v-if="!isDialog"
      ></el-table-column>
      <el-table-column label="操作" width="150" v-if="!isDialog">
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
      :layout="
        isDialog == true
          ? 'prev, pager, next'
          : 'total, sizes, prev, pager, next, jumper'
      "
      :total="total"
    ></el-pagination>
    <!-- 新增编辑弹窗 -->
    <el-dialog
      title="供应商编辑"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form
        :rules="rules"
        status-icon
        ref="pojoForm"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="pojo.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入地址"
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
import supplierApi from "@/api/supplier";
export default {
  //子组件使用props接收父组件传递的数据
  props: {
    isDialog: Boolean
  },
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页, 默认第1页
      pageSize: 10, // 每页显示条数， 10条
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      }, // 条件查询的绑定字段值

      pojo: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      },
      dialogFormVisible: false,
      rules: {
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchDate();
  },
  methods: {
    fetchDate() {
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const res = response.data;
          this.list = res.data.rows;
          this.total = res.data.total;
        });
    },
    handleEdit(id) {
      supplierApi.getById(id).then(response => {
        const res = response.data;
        console.log(res);
        if (res.flag) {
          this.handleAdd();
          this.pojo = res.data;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
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
          supplierApi.deleteById(id).then(response => {
            if (response.data.flag) {
              this.fetchDate();
              this.$message({
                message: response.data.message,
                type: "success"
              });
            } else {
              this.$message({
                message: response.data.message,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchDate();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchDate();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.add(this.pojo).then(response => {
            if (response.data.flag) {
              this.dialogFormVisible = false;
              this.fetchDate();
            } else {
              this.$message({
                message: response.data.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.update(this.pojo).then(response => {
            if (response.data.flag) {
              this.dialogFormVisible = false;
              this.fetchDate();
              this.$message({
                message: response.data.message,
                type: "success"
              });
            } else {
              this.$message({
                message: response.data.message,
                type: "fail"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    handleCurrentColChange(currentRow) {
      // 子组件通过.$emit向父组件的自定义事件传递数据
      this.$emit("option-supplier", currentRow);
    }
  }
};
</script>
<style scoped></style>
