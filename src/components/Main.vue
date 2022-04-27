<template>
  <div class="flex-1 scrollbar">
    <div class="wrap">
      <h1 class="maintitle">Director</h1>
      <h2 class="subtitle">一个前端自动化控制库</h2>

      <div>
        <a
          href="https://github.com/cutting-mat/director/blob/main/README_CN.md"
          target="_blank"
          class="myBtn"
        >
          <i class="el-icon-magic-stick"></i>
          快速开始
        </a>
      </div>

      <h3 class="channeltitle">演示</h3>
      demo
    </div>
  </div>
</template>

<script>
import Store from "../../lib/store.js";
const $store = Store({
  state: {
    inject: 0,
  },
});

export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {},
  created() {
    // setInterval(() => {
    //   $store.state.inject++;
    // }, 1000);
  },
};
</script>

<style scoped>
.wrap {
  width: 1200px;
  text-align: center;
}
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
.myBtn {
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
</style>
