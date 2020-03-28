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
          placeholder="商品名称"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="searchMap.code"
          placeholder="商品编号"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <!-- el-input 是组件，要在组件元素监听原生事件，需要使用  v-on:原生事件名.native="处理函数" -->
        <el-input
          readonly
          @click.native="handleOpenInsearch"
          v-model="searchMap.supplierName"
          placeholder="供应商"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData"
          >查询</el-button
        >
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <!-- 在模板中调用为$refs，在实例中调用为this.$refs -->
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 商品列表 -->
    <el-table :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>
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
    <!-- 供应商列表 -->
    <el-dialog
      title="选择供应商"
      width="500px"
      :visible.sync="dialogSupplierVisible"
    >
      <!-- 父组件使用属性绑定向子组件传递数据 -->
      <!-- 父组件通过自定义事件从子组件接收数据 -->
      <Supplier :isDialog="true" @option-supplier="optionSupplier"></Supplier>
    </el-dialog>
    <!-- 新增列表 -->
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        status-icon
        ref="pojoForm"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code" />
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec" />
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice" />
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice" />
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <!-- 点击调用供应商列表 -->
          <el-input
            readonly
            @click.native="dialogSupplierVisible = true"
            v-model="pojo.supplierName"
            placeholder="选择供应商"
            style="width: 200px;"
          ></el-input>
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
import goodsApi from "@/api/goods";
//将供应商列表作为组件引入
import Supplier from "@/views/supplier";
export default {
  //导入供应商组件
  components: {
    Supplier
  },
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页, 默认第1页
      pageSize: 10, // 每页显示条数， 10条
      searchMap: {
        // 条件查询的绑定字段值
        name: "",
        code: "",
        supplierName: ""
      },
      //商品列表弹窗
      dialogSupplierVisible: false,
      //新增修改弹窗
      dialogFormVisible: false,
      //新增表单数据
      pojo: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: 0.0,
        purchasePrice: 0.0,
        storageNum: 0,
        supplierName: "",
        supplierId: null
      },
      //新增修改校验
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
        ]
      },
      //供应商列表是否由新增修改进入
      isEdit: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          console.log(response);
          const res = response.data;
          if (res.flag) {
            this.list = res.data.rows;
            this.total = res.data.total;
          }
        });
    },
    handleEdit(id) {
      this.handleAdd();
      goodsApi.getById(id).then(response => {
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
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          goodsApi.deleteById(id).then(response => {
            const resp = response.data; //提示信息
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp.flag) {
              // 删除成功，刷新列表
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    //数量分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    //跳转页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    //接收子组件数据
    optionSupplier(currentRow) {
      // 判断选择结果的返回处
      if (!this.isEdit) {
        this.searchMap.supplierId = currentRow.id;
        this.searchMap.supplierName = currentRow.name;
      } else {
        this.pojo.supplierId = currentRow.id;
        this.pojo.supplierName = currentRow.name;
      }
      this.dialogSupplierVisible = false;
    },
    //新增表单
    handleAdd() {
      this.isEdit = true;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
        // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
        this.$refs["pojoForm"].resetFields();
        //pojo.id 并不属于pojoForm所属的prop里 需手动设置
        this.pojo.id = null;
      });
    },
    //搜索框打开商品列表
    handleOpenInsearch() {
      this.isEdit = false;
      this.dialogSupplierVisible = true;
    },
    //新增商品
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.add(this.pojo).then(response => {
            if (response.data.flag) {
              this.$message({
                message: response.data.message,
                type: "success"
              });
              this.dialogFormVisible = false;
              this.fetchData();
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
    //修改商品
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.update(this.pojo).then(response => {
            if (response.data.flag) {
              this.$message({
                message: response.data.message,
                type: "success"
              });
              this.dialogFormVisible = false;
              this.fetchData();
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
