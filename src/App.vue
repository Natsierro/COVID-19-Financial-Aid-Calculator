<template>
  <div id="app" class="main">
    <TopBar/>
    <HeaderView msg="Welcome to Your Vue.js App"/>
    <MainForm msg="Welcome to Your Vue.js App"/>
    <FooterView msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import HeaderView from './components/HeaderView.vue'
import MainForm from './components/MainForm.vue'
import FooterView from './components/FooterView.vue'

export default {
  name: 'App',
  components: {
    TopBar,
    HeaderView,
    MainForm,
    FooterView
  },
  data () {
    return {
      msg: "hi!"
    }
  }
}
</script>

<style>
</style>
