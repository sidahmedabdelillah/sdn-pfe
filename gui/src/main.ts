import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css";

import PrimeVue from "primevue/config";

const app = createApp(App);
app.use(PrimeVue);

app.use(createPinia());
app.use(router);

app.use(VNetworkGraph);

app.mount("#app");
