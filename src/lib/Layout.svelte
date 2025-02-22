<script lang="ts">
import { Route } from "svelte-routing";
import Home from "../App.svelte";
import NormalMatch from "./pages/NormalMatch.svelte";
</script>

<main>
  <Route path="/" component={Home} />
  <Route path="/:gameId" component={NormalMatch} />
</main>

<style>
  main {
    height: 100%;
    width: 100%;
  }
</style>
