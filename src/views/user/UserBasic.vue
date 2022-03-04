<template>
	<div>
		<!-- 头部信息 -->
		<div style="display: flex;justify-content: space-between; margin-top: 10px;">
			<!-- 搜索框 -->
			<div>
				<el-input v-model="name" placeholder="请输入用户姓名进行搜索..." prefix-icon="el-icon-search" style="width: 300px; margin-right: 10px;"
				 @keydown.enter.native="initUsers" clearable @clear="initUsers"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="initUsers">搜索</el-button>
			</div>
			<!-- 个按钮 -->
			<div>

				<el-button type="success" @click="exportUser" icon="el-icon-download">
					导出数据
				</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="toAddUser">添加用户</el-button>
			</div>
		</div>
		<!-- 信息分类 -->
		<div style="margin:10px auto;">
			<el-select v-model="roleValue" placeholder="请选择" @change="changeRole">
				<el-option v-for="(role,index) in allRoles" :key="index" :label="role.roleName" :value="role.roleId" v-if="role.roleId!=3">
				</el-option>
			</el-select>
		</div>
		<!-- 信息列表 -->
		<div>
			<!-- 表格 -->
			<el-table :data="users" ref="multipleTable"  height="387" stripe border style="width: 100%" v-loading="loading"
			 element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
			 tooltip-effect="dark" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="username" label="用户名" align="left">
				</el-table-column>
				<el-table-column prop="name" label="姓名" align="left">
				</el-table-column>
				<el-table-column prop="phone" align="left" label="手机号">
				</el-table-column>
				<el-table-column prop="mailbox" align="left" label="邮箱">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button @click="toUpdateUser(scope.row)" style="padding: 3px;">编辑</el-button>
						<el-button v-if="scope.row.cartList!=''" @click="toChakan(scope.row)" style="padding: 3px;" type="primary">查看</el-button>
						<el-button v-if="scope.row.cartList==''" @click="deleteUser(scope.row)" style="padding: 3px;" type="danger">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<div style="display: flex;justify-content: center;">
				<el-pagination background @current-change="currentChange" @size-change="sizeChange"  layout="sizes, prev, pager, next, jumper, ->, total, slot" :total="total">
				</el-pagination>
			</div>
			<!-- 批量删除 -->
			<div style="margin-top: 10px">
				<el-button size="small" @click="deleteSelectUser()" :disabled="this.multipleSelection.length==0" type="danger">批量删除</el-button>
				<el-button size="small" @click="toggleSelection()">取消选择</el-button>
			</div>
		</div>

		<!-- 增加更新弹出框 -->
		<el-dialog :show-close="false" :title="title" :visible.sync="dialogVisible" width="70%">
			<div>
				<el-form ref="userForm" :rules="rules" :model="user">
					<el-row>
						<el-col :span="6">
							<el-form-item label="用户账号:" prop="username">
								<el-input size="mini" style="width: 130px;" v-model="user.username" placeholder="请输入用户账号" prefix-icon="el-icon-edit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="密码:" prop="password">
								<el-input size="mini" style="width: 130px;" v-model="user.password" placeholder="请输入用户密码" prefix-icon="el-icon-edit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="手机号:" prop="phone">
								<el-input size="mini" style="width: 130px;" v-model="user.phone" placeholder="请输入手机号" prefix-icon="el-icon-edit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="身份:" prop="roleId">
								<el-select clearable v-model="user.roleId" size="mini" style="width: 120px;" placeholder="请选择">
									<el-option v-for="(role,index) in allRoles" :key="index" :label="role.roleName" :value="role.roleId" v-if="role.roleId!=3">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="7">
							<el-form-item label="姓名:" prop="name">
								<el-input size="mini" style="width: 140px;" v-model="user.name" placeholder="请输入姓名" prefix-icon="el-icon-edit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="电子邮箱:" prop="mailbox">
								<el-input v-model="user.mailbox" placeholder="请输入电子邮箱" prefix-icon="el-icon-message" size="mini" style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item style="display: flex; flex-direction: column; align-items: center;" label="头像" prop="mailbox">
								<img title="点击随机生成头像" @click="touXiang" :src="suijiTouXiang" v-model="user.userFace" style="width: 100px;height: 100px;border-radius: 50px;" />
							</el-form-item>
						</el-col>
						<el-col :span="3"></el-col>
					</el-row>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="doQx">取 消</el-button>
				<el-button type="primary" @click="doSave">保 存</el-button>
			</span>
		</el-dialog>
		<!-- 车辆资料弹出框 -->
		<el-dialog title="查看用户资料" :visible.sync="dialogVisibleTow" width="70%">
			<div>
				<el-form ref="userFormTo" :model="userTo">
					<el-row>
						<el-col :span="7">
							<el-form-item label="姓名:" prop="name">
								<el-input size="mini" style="width: 140px;" disabled v-model="userTo.name" placeholder="请输入姓名" prefix-icon="el-icon-edit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7"></el-col>
						<el-col :span="7"></el-col>
						<el-col :span="3"></el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-table :data="userTo.cartList" style="width: 100%" :row-class-name="tableRowClassName">
								<el-table-column prop="carType" label="车辆类型" width="180">
								</el-table-column>
								<el-table-column prop="plateNum" label="车牌号" width="180">
								</el-table-column>
								<el-table-column prop="carState" label="车辆状态">
								</el-table-column>
							</el-table>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleTow = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "UserBasic",
		data() {
			return {
				disabledBtn: true,
				multipleSelection: [],
				users: [],
				suijiTouXiang:'',
				roleValue: 1,
				allRoles: [],
				name: '',
				loading: false,
				total: 0,
				currentPage: 1,
				size: 10,
				dialogVisible: false,
				dialogVisibleTow: false,
				title: '',
				user: {
					id: null,
					name: '',
					username: '',
					password: '',
					userFace: '',
					phone: '',
					roleId: null,
					mailbox: ''
				},
				userTo: {
					name: '',
					cartList: []
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户账号',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					roleId: [{
						required: true,
						message: '请选择身份',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
							message: '请输入合法手机号码',
							trigger: 'blur'
						}
					],
					mailbox: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							type: 'email',
							message: '邮箱地址格式不正确',
							trigger: 'blur'
						}
					]
				}
			}
		},
		mounted() {
			this.initAllRoles();
			this.initUsers();
			this.touXiang();
		},
		methods: {
			touXiang(){
				this.user.userFace='http://xueml.top:8089/logo/logo.jpeg';
				let uf=this.user.userFace.substr(0, 31) + (Math.floor(Math.random() * (16)) + 1) + '.jpeg';
				this.suijiTouXiang=uf;
				this.user.userFace=uf;
			},
			deleteSelectUser() {
				if (this.multipleSelection.length == 0) {
					this.$message.error("您还未选中用户！");

				} else {
					this.$confirm('删除选中用户, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let ids='?';
						this.multipleSelection.forEach(item => {
							ids+='ids='+item.id+'&';
						});
						this.deleteRequest('/user/basic/' +ids).then(resp => {
							if (resp) {
								this.initUsers();
								this.multipleSelection=[];
								this.ids=[];
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
			exportUser() {
				this.downloadRequest('/user/basic/export')
			},
			tableRowClassName(row, rowIndex) {
				console.log(row.row.carState);
				if (row.row.carState == '未停') {
					return 'warning-row';
				} else if (row.row.carState == '已停') {
					return 'success-row';
				}
				return '';
			},
			toChakan(data) {
				this.dialogVisibleTow = true;
				this.userTo.name = data.name;
				this.userTo.cartList = data.cartList;
			},
			deleteUser(data) {
				this.$confirm('此操作将永久删除该用户' + data.name + ', 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRequest('/user/basic/' + data.id).then(resp => {
						if (resp) {
							this.initUsers()
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			doQx(){
				this.dialogVisible=false;
				this.initUsers();
			},
			doSave() {
				// 更新用户
				if (this.user.id) {
					this.$refs['userForm'].validate(valid => {
						if (valid) {
							this.putRequest('/user/basic/update', this.user).then(resp => {
								if (resp) {
									this.dialogVisible = false;
									this.initUsers();
								}
							});
						}
					});
				} else { // 添加用户
					this.$refs['userForm'].validate(valid => {
						if (valid) {
							this.postRequest('/user/basic/add', this.user).then(resp => {
								if (resp) {
									this.dialogVisible = false;
									this.initUsers();
								}
							});
						}
					});
				}
			},
			toUpdateUser(data) {
				this.title = '更新用户'
				this.user = data;
				this.suijiTouXiang=data.userFace;
				this.dialogVisible = true;
			},
			toAddUser() {
				this.user = {
					id: null,
					name: '',
					username: '',
					password: '',
					userFace: '',
					phone: '',
					roleId: null,
					mailbox: ''
				};
				this.title = '添加新用户'
				this.dialogVisible = true;
			},
			sizeChange(size) {
				this.size = size;
				this.initUsers();
			},
			currentChange(currentPage) {
				this.currentPage = currentPage;
				this.initUsers();
			},
			changeRole() {
				this.initUsers();
			},
			initUsers() {
				this.loading = true;
				let url = '/user/basic/all?roleId=' + this.roleValue + '&name=' + this.name + '&currentPage=' + this.currentPage +
					'&size=' + this.size;
				this.getRequest(url).then(resp => {
					this.loading = false;
					if (resp) {
						this.users = resp.data;
						this.total = resp.total;
					}
				});
			},
			initAllRoles() {
				if(window.sessionStorage.getItem('allRoles')){
					this.allRoles=JSON.parse(window.sessionStorage.getItem('allRoles'));
				}else{
					this.getRequest("/role/list").then(resp => {
						if (resp) {
							this.allRoles = resp;
							window.sessionStorage.setItem('allRoles',resp);
						}
					});
				}
				
			},
		}
	}
</script>

<style scoped="scoped">
	.el-table .warning-row {
		background: oldlace;
	}

	.el-table .success-row {
		background: #f0f9eb;
	}
</style>
