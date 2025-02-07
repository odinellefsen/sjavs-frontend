<script lang="ts">
import { Link } from "svelte-routing";
import { initClerk, user, clerk } from "./lib/stores/clerk";
import { onMount } from "svelte";

onMount(async () => {
	await initClerk();
});
</script>

<div class="fixed inset-0 bg-[#5c3a1e] flex items-center justify-center">
  <div class="bg-white/10 p-8 rounded-lg backdrop-blur-sm text-center">
    <h1 class="text-4xl font-bold text-white mb-8">Sjavs Lobby</h1>
    <Link 
      to="/match"
      class="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xl font-semibold mb-4 w-full"
    >
      Start Match
    </Link>
    
    {#if $user}
      <button 
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        on:click={() => $clerk?.signOut()}
      >
        Sign Out
      </button>
    {:else}
      <button 
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        on:click={() => $clerk?.openSignIn()}
      >
        Sign In
      </button>
    {/if}
  </div>
</div>
