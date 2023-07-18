<template>
  <div id="app">
    <navbar @openModal="openModal" ref="openKeyboard" />
    <aside-menu @actionKeyClose="actionKeyClose" @actionKey="actionKey" ref="helpModal" />
    <nuxt ref="pages" />
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar";
import AsideMenu from "@/components/AsideMenu";

export default {
  name: "Home",
  components: {
    AsideMenu,
    Navbar,
  },
  mounted() {
    document.documentElement.classList.add("has-aside-left");
    document.documentElement.classList.add("has-aside-mobile-transition");
    document.documentElement.classList.add("has-navbar-fixed-top");
    document.documentElement.classList.add("has-aside-expanded");
  },
  methods: {
    actionKey() {
      this.$refs.openKeyboard.openKeyboard();
    },
    actionKeyClose(){
      this.$refs.openKeyboard.openKeyboardClose();
    },
    openModal(){
      this.$refs.helpModal.routeIndex()
    },
  },
};
</script>
