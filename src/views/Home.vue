<template>
	<div>
		<el-container>
			<el-header class="homeHeader">
				<div class="title">高校停车系统 &nbsp;&nbsp;<i :class="icon" @click="iconChange"></i></div>

				<div>
					<el-button v-if="user.roleId==3" type="text" icon="el-icon-bell" size="normal"
					           style="margin-right: 8px;color: black;" @click="goChar"></el-button>
					<el-dropdown class="userInfo" @command="commandHandler">
						<span class="el-dropdown-link">
							{{user.username}}
							<i>
								<img :src="user.userFace" />
							</i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
							<el-dropdown-item command="logout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				
			</el-header>
			<el-container>
				<el-aside :width="width">
					<el-menu class="el-menu-vertical-demo" :collapse-transition = "false"
 :collapse="isCollapse" background-color="#646262" text-color="#fff" active-text-color="#ffd04b" router="router" unique-opened>
						
						<el-submenu :index="index+''" v-for="(item,index) in routes" :key="index" v-if="!item.hidden">
							<template slot="title">
								<i :class="item.iconCls">&nbsp;&nbsp;&nbsp;</i>
								<span>{{item.name}}</span>
							</template>
							<el-menu-item-group>
								<el-menu-item :index="children.path" v-for="(children,i) in item.children">{{children.name}}
								</el-menu-item>
							</el-menu-item-group>
						</el-submenu>
					</el-menu>
				</el-aside>

				<el-main>
					<el-breadcrumb v-if="this.$router.currentRoute.path!='/home'">
						<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
						欢迎来到高校停车系统
					</div>
					<div v-if="this.$router.currentRoute.path=='/home'">
						<el-calendar>
						  <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
						  <template
						    slot="dateCell"
						    slot-scope="{date, data}">
						    <p :class="data.isSelected ? 'is-selected' : ''">
						      {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
						    </p>
						  </template>
						</el-calendar>
					</div>
					<router-view class="homeRouterView" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)" />
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		name: 'Home',
		data() {
			return {
				isCollapse: false,
				icon:'el-icon-s-fold',
				width:'200px'
				// user: JSON.parse(window.sessionStorage.getItem('user'))
			}
		},
		computed: {
			routes() {
				return this.$store.state.routes;
			},
			user(){
				return this.$store.state.currentAdmin;
			}
		},
		methods: {
			iconChange(){
				if(this.isCollapse){
					this.width="200px";
					this.isCollapse=false;
					this.icon='el-icon-s-fold';
				}else{
					this.width="56px";
					this.isCollapse=true;
					this.icon='el-icon-s-unfold';
				}
			},
			goChar(){
				this.$router.push('/chat');
			},
			commandHandler(command) {
				if (command == 'logout') {
					this.$confirm('是否退出登录?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						//注销登录
						this.postRequest('/logout');
						//清空用户信息
						window.sessionStorage.clear();
						// window.sessionStorage.removeItem('tokenStr');
						// window.sessionStorage.removeItem('user');
						//清空菜单信息
						this.$store.commit('initRoutes', []);
						this.$router.replace('/');
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});
					});
				}
				if (command == "userInfo") {
					this.$router.push('/info');
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.homeHeader {
		background-color: #909399;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 15px;
		box-sizing: border-box;

	}

	.homeHeader .title {
		font-size: 40px;
		font-family: 华文楷体;
		color: white;
	}

	.homeHeader .userInfo {
		cursor: pointer;
	}

	.el-dropdown-link img {
		width: 46px;
		height: 46px;
		border-radius: 23px;
		margin-left: 8px;
    margin-top: 10px;
	}

	.homeWelcome {
		text-align: center;
		font-size: 30px;
		font-family: 华文楷体;
		color: #409EFF;
		padding-top: 20px;
	}
  /* 加过渡给侧边导航*/
  .el-aside {
    transition: width 0.25s;
    -webkit-transition: width 0.25s;
    -moz-transition: width 0.25s;
    -webkit-transition: width 0.25s;
    -o-transition: width 0.25s;
  }

  .homeRouterView {
    margin-top: 10px;
  }

</style>
