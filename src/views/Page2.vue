<template>
  <div class="flex-1 scrollbar">
    <div class="wrap tc">
      <h1>Step8: 欢迎来到Page2</h1>
      <p>本页将演示通过 next / prev 手动操作进度</p>
      <div class="wrap tc demoBlock">
        <el-button @click="director.prev()">上一步</el-button>
        <el-button @click="director.next()">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";

export default {
  methods: {
    play() {
      this.director.insert([
        {
          action: () => {
            ElNotification({
              title: "Step8",
              message: "请点击“下一步”按钮",
              type: "success",
            });
          },
          autoPlay: false,
        },
        {
          action: () => {
            ElNotification({
              title: "Step9",
              message: "OK, 再试试点击“上一步”按钮，或者点“下一步”继续",
              type: "success",
            });
          },
          autoPlay: false,
        },
        {
          action: () => {
            this.$router.push("/");
          },
        },
      ]);
    },
  },
  created() {
    this.play();
  },
};
</script>
<style scoped>
.demoBlock {
  padding: 20px 0;
}
</style>
