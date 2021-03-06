import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//缓存处理
import MinCache from './common/api/unit.js'
Vue.use(MinCache,{timeout: 0});//默认永久缓存

//api集中处理
import MinHttp from './common/api/http'
import api  from './common/api/api'
Vue.use(MinHttp)

// uview
import uView from "uview-ui";
Vue.use(uView);

App.mpType = 'app'

const app = new Vue({
	api,
    ...App,
})
app.$mount()
