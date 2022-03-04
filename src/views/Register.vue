<template>
	<div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
		<el-container>
			<el-header>
				<h1>高校停车注册页面</h1>
				
					<el-link type="warning" @click="toLogin()" >返回</el-link>
				
			</el-header>
			<el-container style="margin-top: 50px;">
				<el-aside width="200px">
					<div>
						<el-timeline>
							<el-timeline-item v-for="(activity, index) in activities" :key="index" :icon="activity.icon" :type="activity.type"
							 :color="activity.color" :size="activity.size">
								{{activity.content}}
							</el-timeline-item>
						</el-timeline>
					</div>

				</el-aside>
				<el-main>
					<el-carousel indicator-position="none" arrow="never" trigger="click" height="450px" ref="carousel" :autoplay="false">
						<!-- 注册用户信息 -->
						<el-carousel-item>
							<h5>注册用户信息</h5>
							<div style="display: flex;justify-content: center;width: 95%;">
								<el-form ref="userForm" :rules="rules" :model="user" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); width: 600px; ">
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
												<img title="点击随机生成头像" @click="touXiang" :src="user.userFace" v-model="user.userFace" style="width: 100px;height: 100px;border-radius: 50px;" />
											</el-form-item>
										</el-col>
										<el-col :span="3"></el-col>
										
									</el-row>
									<el-form-item style="display: flex; justify-content: center;">
										<el-button :disabled="car.userId!=null" size="small" type="primary" @click="doRegister">保存</el-button>
										<el-button size="small" type="primary" @click="toCart()">下一步</el-button>
									</el-form-item>
								</el-form>
								
							</div>

						</el-carousel-item>
						<!-- 注册车辆信息 -->
						<el-carousel-item>
							<h5>注册车辆信息</h5>
							<el-form ref="carForm" :model="car" :rules="carRules"  label-width="100px" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); width: 600px; margin-bottom: 5px; ">

								<el-form-item label="车辆类型" prop="carType">
									<el-select v-model="car.carType" placeholder="请选择车辆类型">
										<el-option label="自行车" value="自行车"></el-option>
										<el-option label="电动车" value="电动车"></el-option>
										<el-option label="轿车" value="轿车"></el-option>
										<el-option label="大型车" value="大型车"></el-option>
										<el-option label="其他" value="其他"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="车牌号" prop="plateNum">
									<el-input v-model="car.plateNum" style="width: 220px;"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="submitForm()">立即创建</el-button>
								</el-form-item>
							</el-form>
						</el-carousel-item>
					</el-carousel>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		name: 'Register',
		data() {
			return {
				car: {
					carId:null,
					carType: '',
					plateNum: '',
					userId: null
				},
				carRules: {
					carType: [{
						required: true,
						message: '请选择车辆类型',
						trigger: 'blur'
					}],
					plateNum: [{
						required: true,
						message: '请输入车牌号或者编号',
						trigger: 'blur'
					}]
				},
				activities: [{
					content: '第一步添加用户信息',
					size: 'large',
					type: 'primary',
					icon: 'el-icon-more'
				}, {
					content: '第二步添加车辆信息',
					size: 'large',
					type: 'primary',
					icon: 'el-icon-more'
				}, ],
				allRoles: [],
				user: {
					name: '',
					username: '',
					password: '',
					userFace: '',
					phone: '',
					roleId: null,
					mailbox: ''
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
					userFace: [{
						required: true,
						message: '请选择头像',
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
		},
		methods: {
			toCart() {
				if (this.car.userId != null) {
					this.$refs.carousel.next();
				}else{
					this.$message.warning("请先保存用户信息")
				}
			},
			submitForm() {
				if (this.car.userId == null) {
					this.$refs.carousel.prev();
				}else{
					this.$refs.carForm.validate((valid) => {
						if (valid) {
							this.postRequest('/register/cart', this.car).then(resp => {
								if (resp) {
									this.car.carId=resp.obj;
									this.$router.replace('/');
								}
							});
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				}
			},
			toLogin() {
				if (this.car.userId != null) {
					this.deleteRequest('/register/'+this.car.userId).then(resp=>{
						if(resp){
							this.$router.replace('/');
						}
					});
				}else{
					this.$router.replace('/');
				}
			},
			doRegister() {
				this.$refs['userForm'].validate(valid => {
					if (valid) {
						this.postRequest('/register/add', this.user).then(resp => {
							if (resp) {
								this.car.userId = resp.obj;
							}
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			touXiang() {
				let uf2 = 'http://xueml.top:8089/logo/logo.jpeg';
				let uf = uf2.substr(0, 31) + (Math.floor(Math.random() * (16)) + 1) + '.jpeg';
				this.user.userFace = uf;
			},
			initAllRoles() {
				if (window.sessionStorage.getItem('allRoles')) {
					this.allRoles = JSON.parse(window.sessionStorage.getItem('allRoles'));
				}else{
					this.getRequest('/register/role').then(resp => {
						if (resp) {
							this.allRoles = resp;
							window.sessionStorage.setItem('allRoles', JSON.stringify(resp));
						}
					});
				}
			},
		}
	}
</script>

<style scoped="scoped">

</style>
