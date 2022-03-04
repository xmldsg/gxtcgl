<template>
	<div>
		<div style="display: flex;justify-content: center;margin-top: 10px;">
			<el-input v-model="keywords" placeholder="通过姓名搜索管理员..." prefix-icon="el-icon-search" style="width: 400px;margin-right: 10px;"></el-input>
			<el-button type="primary" icon="el-icon-search" @click="doQuery()">搜索</el-button>
		</div>
		<div>
			<el-button type="primary" icon="el-icon-plus" @click="toAddUser">添加管理员</el-button>
		</div>
		<div class="admin-conteiner">
			<el-card class="admin-card" v-for="(admin,index) in admins" :key="index">
				<div slot="header" class="clearfix">
					<span>{{admin.name}}</span>
					<el-button style="float: right; padding: 3px 0;color: red;" type="text" icon="el-icon-delete" @click="delteAdmin(admin)"></el-button>
				</div>
				<div class="img-container">
					<img :src="admin.userFace" :alt="admin.name" class="userFace-img" />
				</div>
				<div class="userinfo-container">
					<div>用户名：{{admin.username}}</div>
					<div>姓名：{{admin.name}}</div>
					<div>手机号：{{admin.phone}}</div>
					<div>邮箱：{{admin.mailbox}}</div>
					<div>
						用户角色：{{admin.role.roleName}}
						<el-popover placement="bottom" title="角色列表" width="200" trigger="click" @show="showPop"
							@hide="hidePop(admin)">
							<el-select v-model="roleValue" placeholder="请选择">
								<el-option v-for="(role,index) in allRoles" 
								:key="index" :label="role.roleName" :value="role.roleId">
								</el-option>
							</el-select>
							<el-button slot="reference" type="text" icon="el-icon-more"></el-button>
						</el-popover>
					</div>
				</div>
			</el-card>
		</div>
		<!-- 新增弹出框 -->
		<el-dialog title="添加管理员" :visible.sync="dialogVisible" width="70%">
			<div>
				<el-form ref="userForm" :rules="rules" :model="user">
					<el-row>
						<el-col :span="7">
							<el-form-item label="用户账号:" prop="username">
								<el-input size="mini" style="width: 130px;" v-model="user.username" placeholder="请输入用户账号" prefix-icon="el-icon-edit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="密码:" prop="password">
								<el-input size="mini" style="width: 130px;" v-model="user.password" placeholder="请输入用户密码" prefix-icon="el-icon-edit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="手机号:" prop="phone">
								<el-input size="mini" style="width: 130px;" v-model="user.phone" placeholder="请输入手机号" prefix-icon="el-icon-edit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2">
							
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="7">
							<el-form-item label="姓名:" prop="name">
								<el-input size="mini" style="width: 130px;" v-model="user.name" placeholder="请输入姓名" prefix-icon="el-icon-edit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="电子邮箱:" prop="mailbox">
							  <el-input v-model="user.mailbox" placeholder="请输入电子邮箱" prefix-icon="el-icon-message" size="mini"
							            style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item style="display: flex; flex-direction: column; align-items: center;" label="头像" prop="mailbox">
								<img :src="userFace" v-model="user.userFace" style="width: 100px;height: 100px;border-radius: 50px;"/>
							</el-form-item>
						</el-col>
						<el-col :span="3"></el-col>
					</el-row>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="doAddUser">保 存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'CfgAdmin',
		data() {
			return {
				keywords: '',
				admins: [],
				allRoles:[],
				roleValue:null,
				dialogVisible:false,
				user: {
					name: '',
					username: '',
					password: '',
					userFace: 'http://xueml.top:8089/logo/logo.jpeg',
					phone: '',
					roleId: 3,
					mailbox: ''
				},
				rules:{
					username: [{required: true,message: '请输入用户账号',trigger: 'blur'}],
					password: [{required: true,message: '请输入密码',trigger: 'blur'}],
					name: [{required: true,message: '请输入姓名',trigger: 'blur'}],
					roleId: [{required: true,message: '请选择身份',trigger: 'blur'}],
					phone: [{required: true,message: '请输入手机号',trigger: 'blur'},
					{
					  pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
					  message: '请输入合法手机号码', trigger: 'blur'
					}],
					mailbox: [{required: true,message: '请输入邮箱',trigger: 'blur'},
					{type: 'email', message: '邮箱地址格式不正确', trigger: 'blur'}]
				}
			}
		},
		mounted() {
			this.initAdmins();
		},
		computed:{
			userFace(){
				let uf=this.user.userFace.substr(0,31)+(Math.floor(Math.random() * (16)) + 1)+'.jpeg';
				this.user.userFace=uf;
				return uf;
			}
		},
		methods: {
			doAddUser(){
				this.postRequest('/user/basic/add',this.user).then(resp=>{
					if(resp){
						this.dialogVisible=false;
						this.initAdmins();
					}
				});
			},
			toAddUser() {
				this.dialogVisible = true;
			},
			hidePop(admin){
				let url='/update/admin?id='+admin.id+'&roleId='+this.roleValue;
				this.putRequest(url).then(resp=>{
					if(resp){
						this.initAdmins();
					}
				});
			},
			showPop(){
				this.initAllRoles();
			},
			initAllRoles(){
				this.getRequest("/role/list").then(resp=>{
					if(resp){
						this.allRoles=resp;
					}
				})
			},
			delteAdmin(admin) {
				this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRequest('/delete/' + admin.id).then(resp => {
						if (resp) {
							this.initAdmins();
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			doQuery() {
				this.initAdmins();
			},
			initAdmins() {
				this.getRequest('/admins/?keywords=' + this.keywords).then(resp => {
					if (resp) {
						this.admins = resp;
					}
				});
			},

		}
	}
</script>

<style scoped="scoped">
	.admin-conteiner {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		margin-top: 10px;
	}

	.admin-card {
		width: 350px;
		margin-bottom: 20px;
	}

	.img-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.userFace-img {
		width: 72px;
		height: 72px;
		border-radius: 72px;
	}

	.userinfo-container {
		font-size: 12px;
		color: #3e9ef5;
	}
</style>
