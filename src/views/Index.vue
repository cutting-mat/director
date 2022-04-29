<template>
  <div class="flex-col main">
    <myHeader />
    <Main v-if="routePath == '/'" class="flex-1" />
    <router-view v-else class="flex-1" />
    <myFooter />
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
import Director from "../../lib/index.js";
import { ElNotification } from "element-plus";

import myHeader from "../components/header.vue";
import myFooter from "../components/footer.vue";
import Main from "../components/Main.vue";

export default {
  components: {
    myHeader,
    myFooter,
    Main,
  },
  data() {
    return {
      routePath: null,
    };
  },
  watch: {
    $route: {
      handler() {
        this.routePath = this.$route.path;
      },
      immediate: true,
    },
  },
  created() {
    // 将Director实例注册为Vue实例属性，便于全局共享
    const internalInstance = getCurrentInstance();

    internalInstance.appContext.config.globalProperties.director = new Director(
      {
        delay: 2000,
      }
    );
  },
};
</script>

<style scoped>
.main {
  position: relative;
  height: 100%;
}
</style>
