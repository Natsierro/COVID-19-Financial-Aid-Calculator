<template>
  <div
    id="app"
    class="main"
  >
    <TopBar />
    <HeaderView msg="Welcome to Your Vue.js App" />
    <MainForm :algo="algo" />
    <FooterView msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import HeaderView from './components/HeaderView.vue'
import MainForm from './components/MainForm.vue'
import FooterView from './components/FooterView.vue'

const algo = require('./alg.js');
console.log(algo);

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
