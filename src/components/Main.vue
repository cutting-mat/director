<template>
  <div class="flex-1 scrollbar">
    <div class="wrap tc">
      <h1 class="maintitle">Director</h1>
      <h2 class="subtitle">
        前端自动化脚本执行，灵活实现各种自动播放、演示场景
      </h2>

      <div>
        <a
          href="https://github.com/cutting-mat/director/blob/main/README.md"
          target="_blank"
          class="bigBtn"
        >
          <el-icon><magic-stick /></el-icon>
          快速开始
        </a>
      </div>

      <h3 class="channeltitle">自动示例</h3>
      <div class="demoBlock">
        <!-- 自动示例 -->
        <el-button type="success" @click="handlePlay">
          {{ activated ? "暂停" : "开始" }}
          <span v-if="actionsLength > 0"
            >({{ stepIndex + 1 }}/{{ actionsLength }})</span
          >
        </el-button>
      </div>
      <h3 class="channeltitle">手动示例</h3>
      <div class="demoBlock">
        <!-- 手动示例 -->
        <el-button type="warning" @click="ManualIns.prev()"> 上一步 </el-button>
        <el-button type="warning" @click="ManualIns.play()"> 下一步 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Director from "../../lib/index.js";
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      loading: false,
      activated: false,
      stepIndex: 0,
      actionsLength: 0,
      ManualIns: null,
    };
  },
  methods: {
    handlePlay() {
      if (!this.director.actions) {
        this.init();
      }
      this.activated ? this.director.pause() : this.director.play();
    },
    init() {
      this.director.load([
        {
          action: () => {
            ElNotification({
              title: "Step1",
              message: "成功注册了一个Director实例",
              type: "success",
            });
          },
        },
        {
          action: () => {
            ElNotification({
              title: "Step2",
              message: "接下来即将跳转路由",
              type: "success",
            });
          },
        },
        {
          action: () => {
            this.$router.push("/Page1");
          },
        },
        {
          action: () => {
            ElNotification({
              title: "Step11",
              message: "Welcom，你回来了",
              type: "success",
            });
          },
        },
      ]);
    },
  },
  created() {
    // 自动实例
    if (this.director.actions) {
      this.activated = this.director.activated;
      this.stepIndex = this.director.stepIndex;
      this.actionsLength = this.director.actions.length;
    }
    // change事件
    this.director.off("change");
    this.director.on("change", (activated, stepIndex) => {
      console.log("change", stepIndex);
      this.activated = activated;
      this.stepIndex = stepIndex;
      this.actionsLength = this.director.actions.length;
    });
    // ended 事件
    this.director.off("ended");
    this.director.on("ended", () => {
      this.director.destroy();
      this.stepIndex = 0;
      this.actionsLength = 0;
    });

    // 手动实例
    this.ManualIns = new Director({
      loop: true,
    });
    this.ManualIns.load([
      {
        action: () => {
          ElNotification({
            title: "手动模式3-1",
            message: "可以在步骤间任意穿梭",
            type: "success",
          });
        },
      },
      {
        action: () => {
          ElNotification({
            title: "手动模式3-2",
            message: "可以在步骤间任意穿梭",
            type: "success",
          });
        },
      },
      {
        action: () => {
          ElNotification({
            title: "手动模式3-3",
            message: "可以在步骤间任意穿梭",
            type: "success",
          });
        },
      },
    ]);
  },
};
</script>

<style scoped>
.maintitle {
  color: #000;
  font-size: 2.5em;
}
.subtitle {
  color: rgb(71, 101, 130);
  font-size: 1.6em;
  font-weight: normal;
  margin-bottom: 20px;
}
.channeltitle {
  font-size: 1.5em;
  color: #000;
  margin: 40px 0 20px;
  font-weight: normal;
}
.bigBtn {
  display: inline-block;
  border-radius: 6px;
  padding: 0 24px;
  line-height: 52px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #f8f8f8;
  background-color: #4abf8a;
  border: 2px solid #3eaf7c;
  transition: background-color 0.1s ease;
  margin: 0 10px;
}

.demoBlock {
  padding: 20px 0;
}
</style>
