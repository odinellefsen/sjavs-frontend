<script lang="ts">
  import { Route } from "svelte-routing";
  import Home from "../App.svelte";
  import Match from "./pages/Match.svelte";
</script>

<main>
  <Route path="/" component={Home} />
  <Route path="/match" component={Match} />
</main>

<style>
  main {
    height: 100%;
    width: 100%;
  }
</style>
