import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css";

import Vuesax from 'vuesax3';
import 'vuesax3/dist/vuesax.css'; //Vuesax styles



const app = createApp(App);

app.use(Vuesax);

app.use(createPinia());
app.use(router);

app.use(VNetworkGraph);

app.mount("#app");
