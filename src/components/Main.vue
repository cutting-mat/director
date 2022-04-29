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

      <h3 class="channeltitle">演示</h3>
      <div class="demoBlock">
        <el-button
          type="success"
          @click="activated ? director.pause() : director.play()"
        >
          {{ activated ? "暂停" : "开始" }}
        </el-button>
        <el-button type="warning" @click="director.stop()">停止</el-button>
        <el-button type="danger" @click="director.destroy()">销毁</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      loading: false,
      activated: false,
      directorIns: null,
    };
  },
  methods: {
    init() {
      this.director.loadAction([
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

      this.director.on("update", (activated, stepIndex, length) => {
        console.log(activated, stepIndex, length);
        this.activated = activated;
      });
    },
  },
  created() {
    this.directorIns = this.director;
    console.log("stepIndex=", this.director.stepIndex);
    if (!this.director.stepIndex) {
      this.init();
    }
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
