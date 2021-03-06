import Vue from 'vue';
import App from './App.vue';
import VueFormulate from '@braid/vue-formulate';
import VueI18n from 'vue-i18n';
import { de, it, fr } from '@braid/vue-formulate-i18n'

Vue.config.productionTip = false;
Vue.use(VueFormulate,  {
  plugins: [ de, it, fr ]
})
Vue.use(VueI18n);

var translations = require('./translations.json');

const i18n = new VueI18n({
  locale: 'fr',
  messages: translations
});

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app');
