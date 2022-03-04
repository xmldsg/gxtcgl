<template>
  <div>
    <!-- 头部信息 -->
    <div style="display: flex;justify-content: space-between; margin-top: 10px;">
      <div>
        <el-autocomplete
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入区域名称"
          @select="handleSelect"
          v-model="state1"
          clearable
          @clear="initArea"
      ></el-autocomplete>
        &nbsp;
        &nbsp;
        <el-button type="primary" icon="el-icon-search" @click="initAreaName">搜索</el-button>
      </div>
      <!-- 筛选信息 -->
      <el-drawer title="区域信息" :visible.sync="table" direction="rtl" size="50%">
        <el-table :data="areaList" height="500px">
          <el-table-column property="areaName" label="区域名称"></el-table-column>
          <el-table-column property="areaNum" label="区域编号" width="100px"></el-table-column>
          <el-table-column property="address" label="地址"></el-table-column>
          <el-table-column property="stallCount" label="最多停车位" width="90px"></el-table-column>

          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <el-button @click="chakanStall(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
      <!-- 个按钮 -->
      <div>
        <el-button type="success" size="small" @click="table = true"><i title="筛选" class="fa fa-filter"></i></el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAddArea">新增区域</el-button>
      </div>
    </div>
    <!-- 区域信息 -->
    <div style="margin-top: 5px;">
      <el-carousel indicator-position="none" arrow="never" trigger="click" height="160px" ref="carousel"
                   :autoplay="false">
        <el-carousel-item v-for="(item,index) in areaList" :name="item.areaName">
          <el-descriptions title="区域信息" border class="margin-top">
            <template slot="extra">
              <el-button title="编辑" type="primary" size="small" @click="toUpdateArea(item)"><i class="el-icon-edit"></i>
              </el-button>
              <el-button title="删除" :disabled="item.count!==0"  type="danger" size="small" @click="doDeleteArea(item.areaId)">
                <i class="el-icon-delete"></i></el-button>
              &nbsp;
              <el-switch
                  :disabled="item.count!==0"
                  v-model="area.enable"
                  title="是否启用"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeEnanle(item)">
              </el-switch>
            </template>
            <el-descriptions-item label="区域名称">{{ item.areaName }}</el-descriptions-item>
            <el-descriptions-item label="区域编号">{{ item.areaNum }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{ item.address }}</el-descriptions-item>
            <el-descriptions-item label="允许设置最多车位数量">
              <el-tag size="small">{{ item.stallCount }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="已设置车位数量">
              <el-tag size="small">{{ count }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="设置车位">
              <el-tag size="small" @click="toAddStall"><i title="添加车位" class="el-icon-plus"></i></el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-carousel-item>
      </el-carousel>

      <div style="height: 30px; display: flex; justify-content: right;">

        <div>
          <el-tag type="info" style="margin-right: 5px;">小写字母</el-tag>
          <span class="el-icon-bicycle"></span></div>
        <div>
          <el-tag type="info" style="margin-right: 5px;">大写字母</el-tag>
          <span class="fa fa-automobile"></span></div>

      </div>
    </div>
    <!-- 车位信息 -->
    <div>

      <div class="stall-container">
        <el-card class="stall-card" v-for="item in stallList">
          <div slot="header" class="clearfix">
            <span>{{ item.stallNature + item.stallNum }}</span>
            <el-button @click="deleteStall(item.stallId)" size="small" style="float: right; padding: 3px 0"
                       type="danger" v-if="item.stallState==='空位'">
              <i title="删除" class="el-icon-delete"></i>
            </el-button>
            <el-button @click="toUpdateStall(item)" size="small" style="float: right; padding: 3px 0" type="success">
              <i title="编辑" class="el-icon-edit"></i>
            </el-button>
          </div>
          <div class="text">

          </div>
        </el-card>
      </div>
    </div>
    <!-- 分页 -->
    <div v-if="stallList.length!==0" style=" margin-top: 10px; display: flex;justify-content: center;">
      <el-pagination :page-sizes="pageSizes" :page-size="18"
                     background @current-change="currentChange" @size-change="sizeChange"
                     layout="sizes, prev, pager, next, jumper, ->, total, slot"
                     :total="total">
      </el-pagination>
    </div>


    <!--新增修改车位 -->
    <el-dialog :show-close="false" :title="stallTitle" :visible.sync="dialogVisibleTo" width="50%">
      <div>
        <el-form ref="stallForm" :rules="rulesTo" :model="stall">
          <el-form-item label="车位类型:" prop="stallNature">
            <el-input v-model="stall.stallNature" style="width: 220px;" placeholder="请输入车位类型"></el-input>
          </el-form-item>
          <el-form-item label="车位编号:" prop="stallNum">
            <el-input v-model.number="stall.stallNum" style="width: 220px;" placeholder="请输入车位编号"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
				<el-button @click="doQxTo()">取 消</el-button>
				<el-button type="primary" @click="doSaveTo">保 存</el-button>
			</span>
    </el-dialog>

    <!-- 新增修改区域 -->
    <el-dialog :show-close="false" :title="areaTitle" :visible.sync="dialogVisible" width="50%">
      <div>
        <el-form ref="areaForm" :rules="rules" :model="area">
          <el-form-item label="区域名称:" prop="areaName">
            <el-input v-model="area.areaName" style="width: 220px;" placeholder="请输入区域名称"></el-input>
          </el-form-item>
          <el-form-item label="区域编号:" prop="areaNum">
            <el-input v-model="area.areaNum" style="width: 220px;" placeholder="请输入区域编号"></el-input>
          </el-form-item>
          <el-form-item label="区域地址:" prop="address">
            <el-input v-model="area.address" style="width: 220px;" placeholder="请输入区域地址"></el-input>
          </el-form-item>
          <el-form-item label="最多设置停车位:" prop="stallCount">
            <el-input v-model="area.stallCount" style="width: 220px;" placeholder="请输入最多设置停车位"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
				<el-button @click="doQx()">取 消</el-button>
				<el-button type="primary" @click="doSave">保 存</el-button>
			</span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'AreaBasic',
  data() {
    return {

      state1:'',
      restaurants:[],
      stall: {
        stallId: null,
        stallNum: null,
        stallNature: '',
        stallState: '',
        userId: null,
        areaId: null,
        carId: null
      },
      dialogVisibleTo: false,
      stallTitle: '',
      areaId: null,
      stallCount: null,
      count: null,
      maxStallNum: null,
      dialogVisible: false,
      table: false,
      areaList: [],
      stallList: [],
      currentPage: 1,
      size: 18,
      total: 0,
      pageSizes: [18, 24, 36, 48, 60, 72],
      areaTitle: '',
      area: {
        areaId: null,
        address: '',
        areaName: '',
        stallCount: null,
        areaNum: '',
        enable:''
      },
      rules: {
        address: [{
          required: true,
          message: '请输入区域地址',
          trigger: 'blur'
        }],
        areaName: [{
          required: true,
          message: '请输入区域名称',
          trigger: 'blur'
        }],
        areaNum: [{
          required: true,
          message: '请输入区域编号',
          trigger: 'blur'
        }],
        stallCount: [{
          required: true,
          message: '请输入最多设置停车位',
          trigger: 'blur'
        }]
      },
      rulesTo: {
        stallNature: [{
          required: true,
          message: '请输入车位类型',
          trigger: 'blur'
        }],
        stallNum: [{
          required: true,
          message: '请输入车位编号',
          trigger: 'blur'
        }],
      }
    }
  },
  mounted() {
    this.initArea();
  },
  methods: {
    changeEnanle(item){
      this.putRequest('/area/updateArea',item).then(resp => {
        if (resp) {
          this.initArea();
        }
      });
    },
    initAreaName(){
      if (this.state1){
        for (let i=0;i<this.areaList.length&&this.areaList.length!=null;i++) {
          if (this.state1 === this.areaList[i].areaName) {
            this.areaId = this.areaList[i].areaId;
            this.stallCount = this.areaList[i].stallCount;
            this.count = this.areaList[i].count;
            this.initStall(this.areaList[i].areaId);
            this.getCount(this.areaList[i].areaId);
            this.$refs.carousel.setActiveItem(this.areaList[i].areaName);
            break;
          }
        }
      }else {
        this.initArea();
      }
    },
    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      restaurants=[];
      for (let i=0;i<this.areaList.length&&this.areaList.length!=null;i++){
        restaurants.push({'value': this.areaList[i].areaName});
      }
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    getCount(areaId) {
      this.getRequest('/stall/count?areaId=' + areaId).then(resp => {
        if (resp) {
          this.count = resp.obj;
        }
      })
    },
    getMaxStallNum(areaId) {
      this.getRequest('/stall/maxNum?areaId=' + areaId).then(resp => {
        if (resp) {
          this.maxStallNum = resp.obj;
        }
      })
    },
    doSaveTo() {
      // 更新车位
      if (this.stall.stallId) {
        this.$refs['stallForm'].validate(valid => {
          if (valid) {
            this.putRequest('/stall/updateStall', this.stall).then(resp => {
              if (resp) {
                this.initStall(this.areaId);
                this.dialogVisibleTo = false;
              }
            });
          }
        });
      } else { // 添加车位
        this.$refs['stallForm'].validate(valid => {
          if (valid) {
            this.postRequest('/stall/addStall', this.stall).then(resp => {
              if (resp) {
                this.getCount(this.areaId);
                this.initStall(this.areaId);
                this.dialogVisibleTo = false;
              }
            });
          }
        });
      }
    },
    doQxTo() {
      this.initStall(this.areaId);
      this.dialogVisibleTo = false;
    },
    toUpdateStall(item) {
      this.stall = item;
      this.stallTitle = "修改车位";
      this.dialogVisibleTo = true;
    },
    toAddStall() {
      if (this.stallCount == null) {
        this.$message.error("请设置该区域的最大停车位数量！");
        return;
      }
      if (this.stallCount <= this.count) {
        this.$message.warning("超出该区域的最大停车位数量！");
        return;
      }
      this.stall = {
        stallId: null,
        stallNum: this.maxStallNum,
        stallNature: '',
        stallState: '',
        userId: null,
        areaId: this.areaId,
        carId: null
      }
      this.getMaxStallNum(this.areaId);
      this.stallTitle = "增加车位";
      this.dialogVisibleTo = true;
    },
    deleteStall(stallId) {
      this.$confirm('此操作将永久删除该车位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/stall/delete/' + stallId).then(resp => {
          if (resp) {
            this.getCount(this.areaId);
            this.initStall(this.areaId);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doQx() {
      this.initArea();
      this.dialogVisible = false;
    },
    doSave() {
      // 更新区域
      if (this.area.areaId) {
        this.$refs['areaForm'].validate(valid => {
          if (valid) {
            this.putRequest('/area/updateArea', this.area).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initArea();
              }
            });
          }
        });
      } else { // 添加区域
        this.$refs['areaForm'].validate(valid => {
          if (valid) {
            this.postRequest('/area/addArea', this.area).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initArea();
              }
            });
          }
        });
      }
    },
    toUpdateArea(areaXg) {
      this.area = areaXg;
      this.areaTitle = "修改区域"
      this.dialogVisible = true;
    },
    toAddArea() {
      this.area = {
        areaId: null,
        address: '',
        areaName: '',
        stallCount: null,
        areaNum: ''
      };
      this.areaTitle = "增加区域";
      this.dialogVisible = true;
    },
    doDeleteArea(areaId) {
      this.$confirm('此操作将永久删除该区域, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/area/deleteArea/' + areaId).then(resp => {
          if (resp) {
            this.initArea();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    sizeChange(size) {
      this.size = size;
      this.initStall(this.areaId);
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initStall(this.areaId);
    },
    initStall(areaId) {
      this.getRequest('/stall/getStall?areaId=' + areaId + '&currentPage=' + this.currentPage + '&size=' + this.size).then(
          resp => {
            if (resp) {
              this.stallList = resp.data;
              this.total = resp.total;
            }
          })
    },
    chakanStall(data) {
      this.areaId = data.areaId;
      this.stallCount = data.stallCount;
      this.count = data.count;
      this.table = false;
      this.initStall(data.areaId);
      this.getCount(data.areaId);
      this.$refs.carousel.setActiveItem(data.areaName);
    },
    initArea() {
      this.getRequest('/area/list').then(resp => {
        if (resp) {
          this.areaList = resp;
          this.areaId = this.areaList[0].areaId;
          this.stallCount = this.areaList[0].stallCount;
          this.count = this.areaList[0].count;
          this.initStall(this.areaList[0].areaId);
          this.getMaxStallNum(this.areaList[0].areaId);
          this.getCount(this.areaList[0].areaId)
        }
      });
    }
  }
}
</script>

<style scoped="scoped">
.stall-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 10px;
}

.stall-card {
  width: 200px;
  margin-bottom: 20px;
}
</style>
