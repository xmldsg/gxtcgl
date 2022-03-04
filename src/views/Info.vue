<template>
	<div style="margin-left: 180px; margin-top: 50px;">
		<el-card class="box-card" style="width: 400px;" v-if="infof">
			<div slot="header" class="clearfix">
				<span>{{infof.username}}</span>
			</div>
			<div>
				<div style="display: flex; justify-content: center;">
					<img :src="infof.userFace" style="height: 100px;width: 100px; border-radius: 50px;" />
				</div>
				<div>
					<el-tag>姓名:&nbsp&nbsp{{infof.name}}</el-tag>
				</div>
				<div>
					<el-tag>手机号:&nbsp&nbsp{{infof.phone}}</el-tag>
				</div>
				<div>
					<el-tag>邮箱:&nbsp&nbsp{{infof.mailbox}}</el-tag>
				</div>
				<div>
					<!-- <el-tag>标签:&nbsp&nbsp{{infof.role.roleName}}</el-tag> -->
				</div>
			</div>
			<div style="display: flex;justify-content: space-around; margin-top: 10px;">
				<el-button type="primary" @click="toUpdateInfo">修改信息</el-button>
				<el-button type="danger" @click="showUpdatePasswordView">修改密码</el-button>
			</div>
		</el-card>
		<!-- 编辑本人信息 -->
		<el-dialog title="编辑本人信息" :visible.sync="dialogVisible" width="30%">
			<div>
				<el-form :model="infof2" :rules="rules" ref="infof2" label-width="70px" size="small">
					<el-form-item label="修改头像">

						<img @click="touXiang()" title="点击修改" v-model="infof2.userFace" :src="infof2.userFace" style="height: 100px;width: 100px; border-radius: 50px; border:1px solid #3E9EF5;" />
					</el-form-item>

					<el-form-item label="姓名:" prop="name">
						<el-input v-model="infof2.name"></el-input>
					</el-form-item>

					<el-form-item label="手机号:" prop="phone">
						<el-input v-model="infof2.phone"></el-input>
					</el-form-item>

					<el-form-item label="邮箱:" prop="mailbox">
						<el-input v-model="infof2.mailbox"></el-input>
					</el-form-item>

				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button @click="doUpdateInfo" type="primary">保 存</el-button>
			</span>
		</el-dialog>
		<!--修改密码 -->
		<el-dialog
		title="更新密码"
		    :visible.sync="passwordDialogVisible"
		    width="30%">
		  <div>
		    <!-- 2-8 调整修改密码表单 -->
		    <el-form :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="100px" class="demo-ruleForm">
		      <el-form-item label="请输入旧密码" prop="oldPass">
		        <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
		      </el-form-item>
		      <el-form-item label="请输入新密码" prop="pass">
		        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
		      </el-form-item>
		      <el-form-item label="确认新密码" prop="checkPass">
		        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
		      </el-form-item>
		      <el-form-item>
		        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
		        <el-button @click="resetForm('ruleForm')">重置</el-button>
		      </el-form-item>
		    </el-form>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'Info',
		data() {
			//  修改密码校验规则 一定要放最前面
			var validatePass = (rule, value, callback) => {
			  if (value === '') {
			    callback(new Error('请输入密码'));
			  } else {
			    if (this.ruleForm.checkPass !== '') {
			      this.$refs.ruleForm.validateField('checkPass');
			    }
			    callback();
			  }
			}
			var validatePass2 = (rule, value, callback) => {
			  if (value === '') {
			    callback(new Error('请再次输入密码'));
			  } else if (value !== this.ruleForm.pass) {
			    callback(new Error('两次输入密码不一致!'));
			  } else {
			    callback();
			  }
			}
			return {
				infof: {},
				infof2: {},
				dialogVisible: false,
				passwordDialogVisible:false,
				ruleForm: { // 2-6 校验对象 规则
				  id:null,
				  pass: '',
				  checkPass: '',
				  oldPass: '', // 2-9
				},
				rules2: {
				  pass: [
				    {validator: validatePass, trigger: 'blur'}
				  ],
				  checkPass: [
				    {validator: validatePass2, trigger: 'blur'}
				  ],
				  oldPass: [
				    {validator: validatePass, trigger: 'blur'}
				  ]
				},
				rules: {
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
				},
				
			}
		},
		mounted() {
			this.initInfo();
		},
		computed:{
			
		},
		methods: {
			// 2-7 预校验 提交表单
			submitForm(formName) {
			  this.$refs[formName].validate((valid) => {
			    if (valid) {
			      // alert('submit!');
			      this.ruleForm.id = this.infof.id;
			      this.putRequest('/admin/pass', this.ruleForm).then(resp => {
			        if (resp) {
			          // 更新密码成功后 退出登录
			          this.postRequest('/logout') // 退出登录
			          window.sessionStorage.removeItem('user')
			          window.sessionStorage.removeItem('tokenStr')
			          this.$store.commit('initRoutes', []) // 初始化路由 菜单 置空
			          this.$router.replace('/') // 跳到登录页面
			        }
			      })
			    } else {
			      console.log('error submit!!');
			      return false;
			    }
			  });
			},
			// 2-7 重围修改密码表单
			resetForm(formName) {
			  this.$refs[formName].resetFields();
			},
			// 2-4 修改密码
			showUpdatePasswordView() {
			  this.passwordDialogVisible = true
			},
			doUpdateInfo() {
				this.putRequest('/update/info', this.infof2).then(resp => {
					if (resp) {
						this.initInfo();
						this.dialogVisible = false;
					}
				})
			},
			toUpdateInfo() {
				this.dialogVisible = true;
			},
			touXiang() {
				if(true){
					let uf2 = 'http://xueml.top:8089/logo/logo.jpeg';
					let uf = uf2.substr(0, 31) + (Math.floor(Math.random() * (16)) + 1) + '.jpeg';
					this.infof2.userFace = uf;
				}
			},
			initInfo() {
				this.getRequest('/user/info').then(resp => {
					if (resp) {
						this.infof = resp;
						this.infof2 = Object.assign({}, this.infof);
						window.sessionStorage.setItem('user', JSON.stringify(resp));
						this.$store.commit('INIT_ADMIN', resp);
					}
				});


			}
		}
	}
</script>

<style>
</style>
