import "./app.css";
import Root from "./Root.svelte";

const target = document.getElementById("app");
if (!target) throw new Error("Missing #app element");

const app = new Root({
	target,
	props: {
		url: window.location.pathname,
	},
});

export default app;
