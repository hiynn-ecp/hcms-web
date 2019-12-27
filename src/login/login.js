import Vue from "vue";
import myModule from "./login.vue";
import ELEMENT from "element-ui"; //message

import axios from "./ajax"
import router from "./router";
import store from "./store";
import "element-ui/lib/theme-chalk/index.css";
import 'swiper/css/swiper.min.css';
import "@/common/css/reset.css";
import "./assets/css/login.scss";
import animate from 'animate.css'
Vue.use(animate)

Vue.use(ELEMENT);
Vue.prototype.axios = axios;
Vue.config.productionTip = false;
axios
	.get(`${process.env.BASE_URL}domain.json`)
	.then(res => {
		axios.defaults.baseURL = res.data.baseUrl;
		window.baseURL = res.data.baseUrl;
		var sessionId = localStorage.getItem("sessionId");
		if (sessionId) {
			axios.defaults.headers.common["Authorization"] = sessionId;
		} else {
			router.replace({
				path: "/"
			});
		}

		new Vue({
			router,
			store,
			render: h => h(myModule)
		}).$mount("#app");
	})
	.catch(err => {
		console.log(err);
	});