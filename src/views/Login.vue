<template>
	<div>
		<el-form :rules="rules" v-loading="loading" element-loading-text="登录中..." element-loading-spinner="el-icon-loading"
		 element-loading-background="rgba(0, 0, 0, 0.8)" :model="loginForm" ref="loginForm" class="loginContainer">
			<h3 class="loginTitle">系统登陆</h3>
			<el-form-item prop="userId">
				<el-input type="text" auto-complete="false" v-model="loginForm.userId" placeholder="请输入用户名"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
			</el-form-item>
			<el-form-item prop="code">
				<el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码" style="width: 240px; margin-right: 10px;">

				</el-input>
				<img :src="captchaUrl" @click="updateCaptcha()" />
			</el-form-item>
			<el-form-item class="loginBtn">
				<el-button type="primary" @click="doLogin()">登录</el-button>
				<el-button type="primary" @click="toRegister()">注册</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				captchaUrl: '/captcha?time=' + new Date(),
				loginForm: {
					userId: 'admin',
					password: '321',
					code: ''
				},
				loading: false,
				rules: {
					userId: [{required: true,message: '请输入用户名',trigger: 'blur'}],
					password: [{required: true,message: '请输入密码',trigger: 'blur'}],
					code: [{required: true,message: '请输入验证码',trigger: 'blur'}]
				}
			}
		},
		methods: {
			toRegister(){
				this.$router.push('/regis');
			},
			updateCaptcha() {
				this.captchaUrl = '/captcha?time=' + new Date();
			},
			doLogin(loginForm) {
				this.$refs.loginForm.validate((valid) => {
					if (valid) {
						this.loading = true;
						this.postRequest('/login', {
							username: this.loginForm.userId,
							password: this.loginForm.password,
							code: this.loginForm.code
						}).then(response => {
							if (response) {
								const tokenStr = response.obj.tokenHead + response.obj.token;
								window.sessionStorage.setItem('tokenStr', tokenStr);
								let path = this.$route.query.redirect;
								if(path == '/' || path == undefined||path=='/regis'){
									this.$router.replace('/home');
								}else{
									this.$router.replace(path);
								}
							}
							this.loading = false;
						});
					} else {
						this.$message.error('请输入所有字段！');
						return false;
					}
				});
				
			}
		}
	}
</script>

<style scoped="scoped">
	.loginContainer {
		border-radius: 15px;
		background-clip: padding-box;
		margin: 188px auto;
		width: 350px;
		padding: 15px 35px 15px 35px;
		background-color: aliceblue;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}

	.loginTitle {
		margin: 0px auto 40px auto;
		text-align: center;
	}

	.loginBtn {
		padding: 12px 100px;
	}

	.el-form-item .el-form-item__content img {
		position: absolute;
		margin-bottom: 0px;
	}
</style>
