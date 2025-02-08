<script lang="ts">
import { Link } from "svelte-routing";
import { initClerk, user, clerk } from "./lib/stores/clerk";
import { onMount } from "svelte";
import { updateThemeColor } from "./lib/utils/theme";
import PinCode from "./lib/components/PinCode.svelte";

let showPinDialog = false;

onMount(async () => {
	updateThemeColor("#5c3a1e");
	await initClerk();
});

function handlePinComplete(event: CustomEvent<{ pin: string }>) {
	console.log("PIN entered:", event.detail.pin);
	// Handle the PIN verification here
	showPinDialog = false;
}
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

    <button 
      class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xl font-semibold mb-4 w-full"
      on:click={() => showPinDialog = true}
    >
      Join Match
    </button>
    
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

{#if showPinDialog}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-[#5c3a1e] p-8 rounded-lg shadow-xl">
      <h2 class="text-white text-xl mb-4">Enter PIN Code</h2>
      <PinCode on:complete={handlePinComplete} />
      <button 
        class="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
        on:click={() => showPinDialog = false}
      >
        Cancel
      </button>
    </div>
  </div>
{/if}
