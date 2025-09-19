"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      title: "地图定位与路线规划",
      latitude: 39.909,
      longitude: 116.39742,
      markers: [],
      polyline: [],
      startLocation: null,
      endLocation: null,
      startLocationName: "当前位置",
      endLocationName: "",
      savedLocations: [],
      showHistory: false,
      // MongoDB 连接配置（实际项目中应放在后端）
      dbConfig: {
        // 注意：在实际项目中，不要在前端直接连接MongoDB
        // 这里只是为了演示目的，实际应通过后端API进行操作
        apiBaseUrl: "https://your-backend-api.com"
      }
    };
  },
  async onLoad() {
    this.title = "地图定位与路线规划";
    await this.getUserLocation();
    this.loadSavedLocations();
  },
  methods: {
    // 获取用户位置
    async getUserLocation() {
      try {
        const authSetting = await common_vendor.index.getSetting();
        if (!authSetting.authSetting["scope.userLocation"]) {
          const res = await common_vendor.index.authorize({
            scope: "scope.userLocation"
          });
        }
        const locationRes = await common_vendor.index.getLocation({
          type: "gcj02",
          altitude: true
        });
        this.latitude = locationRes.latitude;
        this.longitude = locationRes.longitude;
        this.startLocation = {
          latitude: locationRes.latitude,
          longitude: locationRes.longitude
        };
        this.updateMarkers();
        common_vendor.index.__f__("log", "at pages/index/index.vue:109", "定位成功:", locationRes);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:112", "获取位置失败:", error);
        common_vendor.index.showToast({
          title: "获取位置失败，请检查权限设置",
          icon: "none"
        });
      }
    },
    // 更新地图标记
    updateMarkers() {
      this.markers = [];
      if (this.startLocation) {
        this.markers.push({
          id: 1,
          latitude: this.startLocation.latitude,
          longitude: this.startLocation.longitude,
          iconPath: "/static/location.svg",
          width: 30,
          height: 30,
          title: "起点"
        });
      }
      if (this.endLocation) {
        this.markers.push({
          id: 2,
          latitude: this.endLocation.latitude,
          longitude: this.endLocation.longitude,
          iconPath: "/static/location.svg",
          width: 30,
          height: 30,
          title: "终点"
        });
      }
    },
    // 规划路线
    async planRoute() {
      if (!this.endLocationName) {
        common_vendor.index.showToast({
          title: "请输入目的地",
          icon: "none"
        });
        return;
      }
      try {
        this.endLocation = {
          latitude: 39.9042,
          longitude: 116.4074
        };
        this.updateMarkers();
        this.drawRoute();
        common_vendor.index.showToast({
          title: "路线规划成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:184", "路线规划失败:", error);
        common_vendor.index.showToast({
          title: "路线规划失败",
          icon: "none"
        });
      }
    },
    // 绘制路线
    drawRoute() {
      if (!this.startLocation || !this.endLocation)
        return;
      this.polyline = [{
        points: [
          { latitude: this.startLocation.latitude, longitude: this.startLocation.longitude },
          { latitude: this.endLocation.latitude, longitude: this.endLocation.longitude }
        ],
        color: "#007AFF",
        width: 4,
        dottedLine: false
      }];
    },
    // 保存当前位置（模拟MongoDB存储）
    saveLocation() {
      const location = {
        id: Date.now(),
        name: `位置_${(/* @__PURE__ */ new Date()).toLocaleString()}`,
        latitude: this.latitude,
        longitude: this.longitude,
        time: (/* @__PURE__ */ new Date()).toLocaleString()
      };
      common_vendor.index.__f__("log", "at pages/index/index.vue:220", "保存位置到MongoDB:", location);
      this.savedLocations.push(location);
      this.saveToStorage();
      common_vendor.index.showToast({
        title: "位置保存成功",
        icon: "success"
      });
    },
    // 加载保存的位置
    loadSavedLocations() {
      const saved = common_vendor.index.getStorageSync("savedLocations");
      if (saved) {
        this.savedLocations = JSON.parse(saved);
      }
    },
    // 保存到本地存储
    saveToStorage() {
      common_vendor.index.setStorageSync("savedLocations", JSON.stringify(this.savedLocations));
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
      common_vendor.index.__f__("log", "at pages/index/index.vue:265", "点击位置:", latitude, longitude);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.title),
    b: $data.latitude,
    c: $data.longitude,
    d: $data.markers,
    e: $data.polyline,
    f: common_vendor.o((...args) => $options.getLocationInfo && $options.getLocationInfo(...args)),
    g: $data.startLocationName,
    h: common_vendor.o(($event) => $data.startLocationName = $event.detail.value),
    i: $data.endLocationName,
    j: common_vendor.o(($event) => $data.endLocationName = $event.detail.value),
    k: common_vendor.o((...args) => $options.planRoute && $options.planRoute(...args)),
    l: common_vendor.o((...args) => $options.saveLocation && $options.saveLocation(...args)),
    m: common_vendor.o((...args) => $options.showSavedLocations && $options.showSavedLocations(...args)),
    n: $data.showHistory
  }, $data.showHistory ? {
    o: common_vendor.f($data.savedLocations, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name || "未命名位置"),
        b: common_vendor.t(item.latitude),
        c: common_vendor.t(item.longitude),
        d: common_vendor.t(item.time),
        e: common_vendor.o(($event) => $options.setAsEndLocation(item), index),
        f: index
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
