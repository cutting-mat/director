<template>
  <div class="flex-1 scrollbar">
    <h1>Step3: 欢迎来到Page1</h1>
    <p>本页将演示通过 inertAction 插入动作</p>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";

export default {
  methods: {
    play() {
      this.director.inertAction([
        {
          action: () => {
            ElMessage({
              message: "Step4: 接下来的步骤由Page1接管, 5s后进入下一步",
              type: "success",
              duration: 5000,
            });
          },
          delay: 5000,
        },
        {
          action: () => {
            ElMessageBox.alert("这一步不会自动播放，必须手动触发", "Step5", {
              confirmButtonText: "下一步",
              callback: () => {
                this.director.moveNext();
              },
            });
          },
          delay: null,
        },
        {
          action: () => {
            ElNotification({
              title: "Step6",
              message: "Good，下面将跳转 Page2",
              type: "success",
            });
          },
        },
        {
          action: () => {
            this.$router.push("/Page2");
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

<style scoped></style>
