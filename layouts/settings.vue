<template>
  <div id="app">
   <navbar @openModal="openModal" ref="openKeyboard" />
    <aside-menu-settings @actionKeyClose="actionKeyClose" @actionKey="actionKey" ref="helpModal" />
    <nuxt />
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar'
import AsideMenuSettings from '@/components/AsideMenuSettings'

export default {
  name: 'Home',
  components: {
    Navbar,
    AsideMenuSettings
  },
  
  created() {
    this.$store.commit('user', {
      name: 'George Martin',
      email: 'john@example.com',
      avatar: 'https://images.ctfassets.net/1wryd5vd9xez/4DxzhQY7WFsbtTkoYntq23/a4a04701649e92a929010a6a860b66bf/https___cdn-images-1.medium.com_max_2000_1_Y6l_FDhxOI1AhjL56dHh8g.jpeg',
    })
  },
  mounted() {
    document.documentElement.classList.add('has-aside-left')
    document.documentElement.classList.add('has-aside-mobile-transition')
    document.documentElement.classList.add('has-navbar-fixed-top')
    document.documentElement.classList.add('has-aside-expanded')
  },
  methods: {
    actionKey() {
      this.$refs.openKeyboard.openKeyboard();
    },
    actionKeyClose(){
      this.$refs.openKeyboard.openKeyboardClose();
    },
    openModal(){
      this.$refs.helpModal.openMessage()
    },
  },
}
</script>
