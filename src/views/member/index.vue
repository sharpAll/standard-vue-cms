<template>
  <div>
    <!-- 查询表单 :inline="true"行内-->
    <el-form
      :inline="true"
      ref="searchMap"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <el-option
            v-for="item in payTypeOptions"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <!-- 使用format指定输入框的格式；使用value-format指定绑定值的格式。 -->
        <el-date-picker
          v-model="searchMap.birthday"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <!-- 重置方法，以el-form的ref属性为参数 重置含prop的项-->
        <el-button @click="resetForm('searchMap')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="500" border style="width: 100%">
      <!-- type="index"添加从一开始序号 -->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="会员姓名"></el-table-column>
      <el-table-column prop="birthday" label="会员生日"></el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
        width="110"
      ></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <!-- 使用过滤器更改显示 -->
        <template slot-scope="scope">{{
          scope.row.payType | payTypeName
        }}</template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="会员地址"
        width="180"
      ></el-table-column>
      <el-table-column label="操作" width="150">
        <!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据 -->
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="handleDele(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- @size-change与@current-change事件执行时需要对相应参数赋值 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框组件dialog -->
    <!-- :visible.sync控制显示隐藏 -->
    <!-- rules与prop搭配用于表单校验 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :rules="rules"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum" />
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            v-model="pojo.birthday"
            type="date"
            placeholder="请点击选择"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone" />
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money" />
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select
            v-model="pojo.payType"
            class="filter-item"
            placeholder="请点击选择"
          >
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <!-- textarea多行文本 -->
          <el-input
            v-model="pojo.address"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入地址"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- 加入ref属性值用于表单校验 -->
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
import { search, add, getById, update, deleteById } from "@/api/member";
// 支付类型
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页, 默认第1页
      pageSize: 10, // 每页显示条数， 10条
      searchMap: {
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      }, // 条件查询绑定条件值
      payTypeOptions,
      dialogFormVisible: false,
      pojo: {
        id: null, //用于判断更新和新增事件
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: 0,
        integral: 0,
        payType: "",
        address: ""
      }, // 校验规则
      rules: {
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "请选择支付类型", trigger: "change" }
        ]
      },
      dialogTitle: ""
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        console.log(response.data);
        this.list = response.data.data.rows;
        this.total = response.data.data.total;
      });
    },
    handleEdit(id) {
      // 显示表单和数据清理
      this.handleAdd();
      this.dialogTitle = "会员编辑";
      getById(id).then(res => {
        if (res.data.flag) {
          this.pojo = res.data.data;
          console.log(this.pojo);
        } else {
          this.$message({
            message: res.data.message,
            type: "warning"
          });
        }
      });
    },
    handleDele(id) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteById(id).then(response => {
            this.$message({
              type: response.data.flag ? "success" : "error",
              message: response.data.message
            });
            if (response.data.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {
          console.log("取消");
        });
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
      //重置函数
      this.$refs[formName].resetFields();
    },
    addData(formName) {
      //表单校验函数
      this.$refs[formName].validate(valid => {
        if (valid) {
          add(this.pojo).then(response => {
            console.log(response.data);
            if (response.data.flag) {
              this.fetchData();
              this.dialogFormVisible = false; //关闭窗口
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
          update(this.pojo).then(response => {
            console.log(response.data);
            if (response.data.flag) {
              this.fetchData();
              this.dialogFormVisible = false; //关闭窗口
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
    // 打开新增窗口
    //重新打开后会有上次输入痕迹 需要对表单数据和校验进行重置
    //重置方法需要搭配ref和prop
    handleAdd() {
      this.dialogTitle = "会员新增";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
        // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
        this.$refs["pojoForm"].resetFields();
      });
    }
  },
  filters: {
    // 支付类型过滤器
    payTypeName(type) {
      const cur = payTypeOptions.find(obj => obj.type == type);
      return cur ? cur.name : null;
    }
  }
};
</script>

<style scoped></style>
