<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
	
	<!-- 地图组件 -->
	<view class="map-container">
		<map 
			id="myMap"
			style="width: 100%; height: 600rpx;"
			:latitude="latitude"
			:longitude="longitude"
			:markers="markers"
			:polyline="polyline"
			:scale="17"
			:show-location="true"
			@tap="getLocationInfo"
		></map>
	</view>
	
	<!-- 路线规划输入框 -->
	<view class="route-planner">
		<view class="input-group">
			<text class="label">起点：</text>
			<input type="text" v-model="startLocationName" placeholder="当前位置" readonly />
		</view>
		<view class="input-group">
			<text class="label">终点：</text>
			<input type="text" v-model="endLocationName" placeholder="请输入目的地" />
		</view>
		<button type="primary" @click="planRoute">规划路线</button>
		<button type="default" @click="saveLocation">保存当前位置</button>
		<button type="default" @click="showSavedLocations">查看历史位置</button>
	</view>
	
	<!-- 历史位置列表 -->
	<view class="history-list" v-if="showHistory">
		<view class="history-title">历史位置</view>
		<view class="history-item" v-for="(item, index) in savedLocations" :key="index">
			<text>{{item.name || '未命名位置'}}</text>
			<text>{{item.latitude}}, {{item.longitude}}</text>
			<text>{{item.time}}</text>
			<button size="mini" @click="setAsEndLocation(item)">设为终点</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '地图定位与路线规划',
				latitude: 39.909,
				longitude: 116.39742,
				markers: [],
				polyline: [],
				startLocation: null,
				endLocation: null,
				startLocationName: '当前位置',
				endLocationName: '',
				savedLocations: [],
				showHistory: false,
				// MongoDB 连接配置（实际项目中应放在后端）
				dbConfig: {
					// 注意：在实际项目中，不要在前端直接连接MongoDB
					// 这里只是为了演示目的，实际应通过后端API进行操作
					apiBaseUrl: 'https://your-backend-api.com'
				}
			}
		},
		async onLoad() {
			this.title = '地图定位与路线规划';
			// 获取用户位置权限并定位
			await this.getUserLocation();
			// 加载保存的位置信息
			this.loadSavedLocations();
		},
		methods: {
			// 获取用户位置
			async getUserLocation() {
				try {
					// 检查位置权限
					const authSetting = await uni.getSetting();
					if (!authSetting.authSetting['scope.userLocation']) {
						// 请求位置权限
						const res = await uni.authorize({
							scope: 'scope.userLocation'
						});
					}
					
					// 获取当前位置
					const locationRes = await uni.getLocation({
						type: 'gcj02',
						altitude: true
					});
					
					// 更新位置信息
					this.latitude = locationRes.latitude;
					this.longitude = locationRes.longitude;
					this.startLocation = {
						latitude: locationRes.latitude,
						longitude: locationRes.longitude
					};
					
					// 更新地图标记
					this.updateMarkers();
					console.log('定位成功:', locationRes);
				}
				catch (error) {
					console.error('获取位置失败:', error);
					uni.showToast({
						title: '获取位置失败，请检查权限设置',
						icon: 'none'
					});
				}
			},
			
			// 更新地图标记
			updateMarkers() {
				this.markers = [];
				
				// 添加起点标记
				if (this.startLocation) {
					this.markers.push({
						id: 1,
						latitude: this.startLocation.latitude,
						longitude: this.startLocation.longitude,
						iconPath: '/static/location.svg',
						width: 30,
						height: 30,
						title: '起点'
					});
				}
				
				// 添加终点标记
				if (this.endLocation) {
					this.markers.push({
						id: 2,
						latitude: this.endLocation.latitude,
						longitude: this.endLocation.longitude,
						iconPath: '/static/location.svg',
						width: 30,
						height: 30,
						title: '终点'
					});
				}
			},
			
			// 规划路线
			async planRoute() {
				if (!this.endLocationName) {
					uni.showToast({
						title: '请输入目的地',
						icon: 'none'
					});
					return;
				}
				
				try {
					// 这里使用微信小程序的地图接口进行路线规划
					// 实际项目中可能需要调用地图服务商的API（如腾讯地图、高德地图等）
					
					// 模拟地址解析（实际应调用地图API）
					// 这里为了演示，使用固定的终点坐标
					this.endLocation = {
						latitude: 39.9042,
						longitude: 116.4074
					};
					
					// 更新地图标记
					this.updateMarkers();
					
					// 绘制路线
					this.drawRoute();
					
					uni.showToast({
						title: '路线规划成功',
						icon: 'success'
					});
				}
				catch (error) {
					console.error('路线规划失败:', error);
					uni.showToast({
						title: '路线规划失败',
						icon: 'none'
					});
				}
			},
			
			// 绘制路线
			drawRoute() {
				if (!this.startLocation || !this.endLocation) return;
				
				// 简单的两点之间的直线（实际应使用地图API获取真实路线）
				this.polyline = [{
					points: [
						{latitude: this.startLocation.latitude, longitude: this.startLocation.longitude},
						{latitude: this.endLocation.latitude, longitude: this.endLocation.longitude}
					],
					color: '#007AFF',
					width: 4,
					dottedLine: false
				}];
			},
			
			// 保存当前位置（模拟MongoDB存储）
			saveLocation() {
				// 在实际项目中，这里应该调用后端API将位置信息存储到MongoDB
				const location = {
					id: Date.now(),
					name: `位置_${new Date().toLocaleString()}`,
					latitude: this.latitude,
					longitude: this.longitude,
					time: new Date().toLocaleString()
				};
				
				// 模拟API调用
				console.log('保存位置到MongoDB:', location);
				
				// 保存到本地存储（实际项目中由后端返回）
				this.savedLocations.push(location);
				this.saveToStorage();
				
				uni.showToast({
					title: '位置保存成功',
					icon: 'success'
				});
			},
			
			// 加载保存的位置
			loadSavedLocations() {
				const saved = uni.getStorageSync('savedLocations');
				if (saved) {
					this.savedLocations = JSON.parse(saved);
				}
			},
			
			// 保存到本地存储
			saveToStorage() {
				uni.setStorageSync('savedLocations', JSON.stringify(this.savedLocations));
			},
			
			// 显示保存的位置
			showSavedLocations() {
				this.showHistory = !this.showHistory;
			},
			
			// 将历史位置设为终点
			setAsEndLocation(location) {
				this.endLocation = {
					latitude: location.latitude,
					longitude: location.longitude
				};
				this.endLocationName = location.name;
				this.showHistory = false;
				this.updateMarkers();
				this.drawRoute();
			},
			
			// 获取点击位置信息
			getLocationInfo(e) {
				const { latitude, longitude } = e.detail;
				console.log('点击位置:', latitude, longitude);
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 20rpx 0;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.map-container {
		width: 100%;
		height: 600rpx;
		margin-bottom: 20rpx;
	}
	
	.route-planner {
		padding: 20rpx;
		background-color: #fff;
	}
	
	.input-group {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.label {
		width: 100rpx;
		font-size: 28rpx;
	}
	
	input {
		flex: 1;
		height: 80rpx;
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
		padding: 0 20rpx;
	}
	
	button {
		margin: 10rpx 0;
	}
	
	.history-list {
		padding: 20rpx;
		background-color: #fff;
		margin-top: 20rpx;
	}
	
	.history-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.history-item {
		display: flex;
		flex-direction: column;
		padding: 10rpx 0;
		border-bottom: 1rpx solid #eee;
	}
	
	.history-item text {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 5rpx;
	}
</style>