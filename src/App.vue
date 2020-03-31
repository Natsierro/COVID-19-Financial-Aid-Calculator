<template>
  <div
    id="app"
    class="main"
  >
    <TopBar />
    <HeaderView />
    <MainForm :algo="algo" />
    <FooterView />
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import HeaderView from './components/HeaderView.vue'
import MainForm from './components/MainForm.vue'
import FooterView from './components/FooterView.vue'

const algo = require('./alg.js');

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
      algo: algo
    }
  }
}
</script>

<style>
</style>
