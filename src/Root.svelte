<script lang="ts">
  import { Router } from "svelte-routing";
  import Layout from "./lib/Layout.svelte";
  
  export let url: string;
</script>

<Router {url}>
  <Layout />
</Router> 