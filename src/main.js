import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGeolocation from 'vue-browser-geolocation'
import VueNativeNotification from 'vue-native-notification'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.config.productionTip = false

Vue.use(VueGeolocation)
Vue.use(VueNativeNotification, {
  requestOnNotify: true
})

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_KEY,
    libraries: 'places'
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
