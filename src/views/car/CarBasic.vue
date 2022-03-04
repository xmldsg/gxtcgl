<template>
	<div>
		<!-- 头部信息 -->
		<div style="display: flex;justify-content: space-between; margin-top: 10px;">
			<!-- 搜索框 -->
			<div>
				<el-input v-model="cart.plateNum" placeholder="请输入根据车牌号进行搜索..." prefix-icon="el-icon-search" style="width: 300px; margin-right: 10px;"
				 clearable @clear="initCars"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="initCars">搜索</el-button>
				<el-button type="primary" @click="showAdvanceSearchVisible = !showAdvanceSearchVisible">
					<i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"></i>其他条件搜索
				</el-button>
			</div>
			<!-- 个按钮 -->
			<div>
				<el-button type="success" @click="exportCart" icon="el-icon-download">
					导出数据
				</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="toAddCar">添加车辆</el-button>
			</div>
		</div>
		<!-- 其他搜索框 -->
		<transition name="slide-fade">
			<div v-show="showAdvanceSearchVisible" style="border: 1px solid #379ff5;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0;">
				<el-row>
					<el-col :span="7">
						车辆类型：
						<el-select clearable v-model="cart.carType" placeholder="请选择车辆类型" size="mini">
							<el-option label="自行车" value="自行车"></el-option>
							<el-option label="电动车" value="电动车"></el-option>
							<el-option label="轿车" value="轿车"></el-option>
							<el-option label="大型车" value="大型车"></el-option>
							<el-option label="其他" value="其他"></el-option>
						</el-select>
					</el-col>
					<el-col :span="7">
						车位编号：
						<el-select v-model="cart.stall.stallNum" clearable placeholder="请选择车位编号" size="mini">
							<el-option v-for="item in allStalls" :key="item.areaId" :label="item.stallNum" :value="item.stallNum">
							</el-option>
						</el-select>
					</el-col>
					<el-col :span="7">
						区域地址：
						<el-select @clear="changeAddress" clearable @change="changeAddress(cart.stall.area.address)" v-model="cart.stall.area.address"
						 placeholder="区域地址" size="mini">
							<el-option v-for="item in allAddress" :key="item.areaId" :label="item.address" :value="item.address">
							</el-option>
						</el-select>
					</el-col>
					<el-col :span="3"></el-col>

				</el-row>
				<el-row style="margin-top: 2px;">
					<el-col :span="7">
						区域名称：
						<el-select clearable v-model="cart.stall.area.areaName" placeholder="区域名称" size="mini">
							<el-option v-for="item in allAreaName" :key="item.areaId" :label="item.areaName" :value="item.areaName">
							</el-option>
						</el-select>
					</el-col>

					<el-col :span="7">
						身份：
						<el-select clearable v-model="cart.user.role.roleId" placeholder="请选择身份" size="mini">
							<el-option v-for="item in allRoles" :key="item.roleId" :label="item.roleName" :value="item.roleId" v-if="item.roleId!=3">
							</el-option>
						</el-select>
					</el-col>
					<el-col :span="10"></el-col>
				</el-row>
			</div>
		</transition>

		<!-- 信息列表 -->
		<div>
			<!-- 表格 -->
			<el-table :data="cars" ref="multipleTable" height="387" stripe border style="width: 100%;margin-top: 10px;"
			 v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
			 element-loading-background="rgba(0, 0, 0, 0.8)" tooltip-effect="dark" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="carType" label="车辆类型" align="left">
				</el-table-column>
				<el-table-column prop="plateNum" label="车牌号" align="left">
				</el-table-column>
				<el-table-column prop="carState" label="车辆状态" align="left">
				</el-table-column>

				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button @click="toUpdateCar(scope.row)" style="padding: 2px;">编辑</el-button>
						<el-button @click="toChakanUser(scope.row)" style="padding: 2px;" type="primary">查看用户信息</el-button>
						<el-button v-if="scope.row.carState=='已停'" @click="toChakanStall(scope.row)" style="padding: 2px;" type="success">查看停放信息</el-button>
						<el-button v-if="scope.row.carState=='未停'" @click="deleteCar(scope.row)" style="padding: 2px;" type="danger">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<div style="display: flex;justify-content: center;">
				<el-pagination background @current-change="currentChange" @size-change="sizeChange" layout="sizes, prev, pager, next, jumper, ->, total, slot"
				 :total="total">
				</el-pagination>
			</div>
			<!-- 批量删除 -->
			<div style="margin-top: 10px">
				<el-button size="small" @click="deleteSelectCars()" :disabled="this.multipleSelection.length==0" type="danger">批量删除</el-button>
				<el-button size="small" @click="toggleSelection()">取消选择</el-button>
			</div>
		</div>
		<!-- 增加弹出框 -->
		<el-dialog :show-close="false" title="增加临时车辆" :visible.sync="dialogVisible" width="50%">
			<div>
				<el-form ref="carForm" :rules="rules" :model="cartTow">
					<el-form-item label="车辆类型:" prop="carType">
						<el-select v-model="cartTow.carType" placeholder="请选择车辆类型">
							<el-option label="自行车" value="自行车"></el-option>
							<el-option label="电动车" value="电动车"></el-option>
							<el-option label="轿车" value="轿车"></el-option>
							<el-option label="大型车" value="大型车"></el-option>
							<el-option label="其他" value="其他"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="车牌号:" prop="plateNum">
						<el-input v-model="cartTow.plateNum" style="width: 220px;" placeholder="请输入车牌号或者编号"></el-input>
					</el-form-item>
					<el-form-item label="临时用户:" prop="userId">
						<el-select v-model="cartTow.userId" placeholder="请选择临时用户">
							<el-option v-for="item in linshi" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="doSave">添 加</el-button>
			</span>
		</el-dialog>
		<!-- 更新车辆 -->
		<el-dialog :show-close="false" title="更新车辆" :visible.sync="dialogVisible2" width="50%">
			<div>
				<el-form ref="carForm" :rules="rules" :model="cartTow">
					<el-form-item label="车辆类型" prop="carType">
						<el-select v-model="cartTow.carType" placeholder="请选择车辆类型">
							<el-option label="自行车" value="自行车"></el-option>
							<el-option label="电动车" value="电动车"></el-option>
							<el-option label="轿车" value="轿车"></el-option>
							<el-option label="大型车" value="大型车"></el-option>
							<el-option label="其他" value="其他"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="车牌号" prop="plateNum">
						<el-input v-model="cartTow.plateNum" style="width: 220px;"></el-input>
					</el-form-item>

				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="doQx">取 消</el-button>
				<el-button type="primary" @click="doSave">更 新</el-button>
			</span>
		</el-dialog>
		<!-- 查看用户信息 -->
		<el-dialog title="查看用户信息" :visible.sync="dialogVisible3" width="50%">
			<div>
				<el-table :data="user" style="width: 100%">
					<el-table-column label="姓名" prop="name">
					</el-table-column>
					<el-table-column label="手机号" prop="phone">
					</el-table-column>
					<el-table-column label="邮箱" prop="mailbox">
					</el-table-column>
				</el-table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible3 = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 查看用户停放信息 -->
		<el-dialog title="查看用户停放信息" :visible.sync="dialogVisible4" width="50%">
			<div>
				<el-table :data="stall" style="width: 100%">
					<el-table-column label="车位类型" prop="stallNature" width="100px">
					</el-table-column>
					<el-table-column label="车位编号" prop="stallNum">
					</el-table-column>
					<el-table-column label="地址" prop="area.address">
					</el-table-column>
					<el-table-column label="地址名称" prop="area.areaName">
					</el-table-column>
					<el-table-column label="区域编号" prop="area.areaNum">
					</el-table-column>
				</el-table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible4 = false">取 消</el-button>
			</span>
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: 'CarBasic',
		data() {
			return {
				stall: [],
				user: [],
				linshi: [],
				showAdvanceSearchVisible: false, //高级搜索框 动态效果
				cars: [],
				multipleSelection: [],
				roleValue: 1,
				allRoles: [],
				allAddress: [],
				allAreaName: [],
				allStalls: [],
				loading: false,
				total: 0,
				dialogVisible: false,
				dialogVisible2: false,
				dialogVisible3: false,
				dialogVisible4: false,
				cartTow: {
					carId: null,
					carState: '',
					carType: '',
					plateNum: '',
					userId: null,
				},
				cart: { //查询条件
					carId: 0,
					carState: '',
					carType: '',
					plateNum: '',
					stall: {
						area: {
							address: '',
							areaId: 0,
							areaName: '',
							areaNum: '',
							stallCount: 0
						},
						areaId: 0,
						stallId: 0,
						stallNum: '',
						stallState: '',
						stallNature:'',
						carId:0,
						userId: 0
					},
					user: {
						id: 0,
						mailbox: '',
						name: '',
						password: '',
						phone: '',
						role: {
							roleId: null,
							roleName: '',
							rolePower: ''
						},
						roleId: 0,
						userFace: '',
						username: ''
					},
					userId: 0,
					currentPage: 1,
					size: 10
				},
				rules: {
					carType: [{
						required: true,
						message: '请选择车辆类型',
						trigger: 'blur'
					}],
					plateNum: [{
						required: true,
						message: '请输入车牌号或者编号',
						trigger: 'blur'
					}],
					userId: [{
						required: true,
						message: '请选择临时人员',
						trigger: 'blur'
					}]
				}



			}
		},

		mounted() {
			this.initData();
			this.initCars();
		},
		methods: {
			toChakanStall(data) {
				this.stall[0] = data.stall;
				this.dialogVisible4 = true;
			},
			toChakanUser(data) {
				this.user[0] = data.user;
				this.dialogVisible3 = true;
			},
			doQx(){
				this.initCars()
				this.dialogVisible2 = false;
			},
			getlinshi() {
				this.getRequest('/cart/linshi').then(resp => {
					if (resp.length != 0) {
						this.linshi = resp;
					} else {
						this.$message.warning("请先增加临时人员")
					}

				});
			},
			doSave() {
				// 更新车辆
				if (this.cartTow.carId) {
					this.$refs['carForm'].validate(valid => {
						if (valid) {
							this.putRequest('/cart/updateCart', this.cartTow).then(resp => {
								if (resp) {
									this.dialogVisible2 = false;
									this.initCars();
								}
							});
						}
					});
				} else { // 添加车辆
					this.$refs['carForm'].validate(valid => {
						if (valid) {
							this.postRequest('/cart/addCart', this.cartTow).then(resp => {
								if (resp) {
									this.dialogVisible = false;
									this.initCars();
								}
							});
						}
					});
				}
			},
			toUpdateCar(data) {
				this.cartTow = data;
				this.dialogVisible2 = true;
			},
			toAddCar() {
				this.cartTow = {
					carId: null,
					carState: '',
					carType: '',
					plateNum: '',
					userId: null,
				};
				this.getlinshi();
				this.dialogVisible = true;
			},
			changeAddress(address) {
				this.getRequest('/cart/allArea/address?address=' + address).then(resp => {
					if (resp) {
						this.allAreaName = resp;
					}
				});
			},
			deleteSelectCars() {
				if (this.multipleSelection.length == 0) {
					this.$message.error("您还未选中用户！");

				} else {
					this.$confirm('删除选中用户, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let ids = '?';
						this.multipleSelection.forEach(item => {
							ids += 'ids=' + item.carId + '&';
						});
						this.deleteRequest('/cart/deletes' + ids).then(resp => {
							if (resp) {
								this.initCars();
								this.multipleSelection = [];
								this.ids = [];
							}
						});
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				}
			},
			toggleSelection(rows) {
				if (rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();

				}
			},
			handleSelectionChange(val) {
				if (val) {
					this.multipleSelection = val;
				}
			},
			exportCart() {
				this.downloadRequest('/cart/export');
			},
			deleteCar(data) {
				this.$confirm('此操作将永久删除该车辆, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRequest('/cart/delete/' + data.carId).then(resp => {
						if (resp) {
							this.initCars()
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
				this.cart.size = size;
				this.initCars();
			},
			currentChange(currentPage) {
				this.cart.currentPage = currentPage;
				this.initCars();
			},
			changeRole() {
				this.initCars();
			},
			initCars() {
				this.loading = true;
				this.postRequest('/cart/allCar', this.cart).then(resp => {
					console.log(this.cart);
					this.loading = false;
					if (resp) {
						this.cars = resp.data;
						this.total = resp.total;
					}
				});
			},
			initData() {
				if (window.sessionStorage.getItem('allRoles')) {
					this.allRoles = JSON.parse(window.sessionStorage.getItem('allRoles'));
				} else {
					this.getRequest('/role/list').then(resp => {
						if (resp) {
							this.allRoles = resp;
							window.sessionStorage.setItem('allRoles', JSON.stringify(resp));
						}
					});
				}
				if (window.sessionStorage.getItem('allStalls')) {
					this.allStalls = JSON.parse(window.sessionStorage.getItem('allStalls'));
				} else {
					this.getRequest('/cart/allStall').then(resp => {
						if (resp) {
							console.log('resp',resp.length);
							this.allStalls.length=resp.length;
							for(let i=0;i<resp.length&&resp.length!=0;i++){
								let stallS={
									stallId:'',
									stallNum:''
								};
								stallS.stallId=resp[i].stallId;
								stallS.stallNum=resp[i].stallNature+resp[i].stallNum;
								this.allStalls[i]=stallS;
							}
							window.sessionStorage.setItem('allStalls', JSON.stringify(this.allStalls));
						}
					});
				}
				if (window.sessionStorage.getItem('allAddress')) {
					this.allAddress = JSON.parse(window.sessionStorage.getItem('allAddress'));
				} else {
					this.getRequest('/cart/allArea').then(resp => {
						if (resp) {
							this.allAddress = resp;
							window.sessionStorage.setItem('allAddress', JSON.stringify(resp));
						}
					});
				}

				this.getRequest('/cart/allArea/address?address=""').then(resp => {
					if (resp) {
						this.allAreaName = resp;
					}
				});

			}
		}
	}
</script>

<style scoped="scoped">
	.slide-fade-enter-active {
		transition: all .8s ease;
	}

	.slide-fade-leave-active {
		transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}

	.slide-fade-enter,
	.slide-fade-leave-to .slide-fade-leave-active for below version 2.1.8 {
		transform: translateX(10px);
		opacity: 0;
	}
</style>
