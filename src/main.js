// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'

import vueHeadful from 'vue-headful'

import VueClipboard from 'vue-clipboard2'

//import lodash globally
import _ from 'lodash'  
Object.defineProperty(Vue.prototype, '$_', { value: _ })

Vue.config.productionTip = false
Vue.config.performance = true

//import axios globally
import axios from 'axios'
axios.defaults.baseURL = "https://api.learntrueislam.com/quran/v1"
//axios.defaults.baseURL = "http://localhost:8888/api-quran/quran/v1"
Vue.prototype.$http = axios

//import surah json globally
import SurahList from './json/surah.json';
Vue.prototype.surahsJson = SurahList

Vue.use(BootstrapVue)

Vue.component('vue-headful', vueHeadful)

Vue.use(VueClipboard)

import Default from "./layouts/Default.vue";
import NoSidebar from "./layouts/NoSidebar.vue";

Vue.component("default-layout", Default);
Vue.component("no-sidebar-layout", NoSidebar);

//use vue event bus to pass data
export const bus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
