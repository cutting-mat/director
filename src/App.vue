<template>
  <div>
    <myHeader />
    <Main />
    <myFooter />
  </div>
</template>

<script>
import director from "../lib/store.js";
import myHeader from "./components/header.vue";
import myFooter from "./components/footer.vue";
import Main from "./components/Main.vue";

export default {
  components: {
    myHeader,
    myFooter,
    Main,
  },
  created() {
    console.log(director);
  },
};
</script>

<style></style>
