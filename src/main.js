import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'

createApp(App).use(router).mount('#app')

axios.interceptors.response.use(res => res, err => {
  if(err.response.status == 403) {
    router.push({ path: 'auth', query: { sessionExpired: true } });
  } 

  return Promise.reject(err);
})
