import { mount } from "svelte";
import "./app.css";
import Layout from "./lib/Layout.svelte";

const target = document.getElementById("app");
if (!target) throw new Error("Missing #app element");

const app = mount(Layout, {
	target,
});

export default app;
