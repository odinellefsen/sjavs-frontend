<script lang="ts">
import { initClerk, user, clerk } from "./lib/stores/clerk";
import { onMount, onDestroy } from "svelte";
import { updateThemeColor } from "./lib/utils/theme";
import PinCode from "./lib/components/PinCode.svelte";
import { navigate } from "svelte-routing";
import axios from "axios";

let showPinDialog = false;
let isCreatingMatch = false;
let errorMessage = "";
let isLeavingMatch = false;
let currentRequest: AbortController | null = null;

onMount(async () => {
	updateThemeColor("#5c3a1e");
	await initClerk();
});

async function createMatch() {
	if (currentRequest) {
		currentRequest.abort();
	}
	currentRequest = new AbortController();

	try {
		isCreatingMatch = true;
		errorMessage = "";

		const token = await $clerk?.session?.getToken();
		if (!token) {
			throw new Error("No authentication token available");
		}

		const response = await axios.post(
			`http://192.168.1.176:3000/normal-match?token=${token}`,
			{},
			{
				signal: currentRequest.signal,
				timeout: 5000,
			},
		);

		const data = response.data;
		console.log("Match created:", data);
		navigate(`/${data.game_id}`);
	} catch (error) {
		if (axios.isCancel(error)) {
			console.log("Request cancelled");
			return;
		}
		console.error("Error creating match:", error);
		errorMessage = error instanceof Error ? error.message : String(error);
	} finally {
		isCreatingMatch = false;
		currentRequest = null;
	}
}

async function leaveMatch() {
	if (currentRequest) {
		currentRequest.abort();
	}
	currentRequest = new AbortController();

	try {
		isLeavingMatch = true;
		errorMessage = "";

		const token = await $clerk?.session?.getToken();
		if (!token) {
			throw new Error("No authentication token available");
		}

		const response = await axios.delete(
			`http://192.168.1.176:3000/normal-match/leave?token=${token}`,
			{
				signal: currentRequest.signal,
				timeout: 5000,
			},
		);

		const data = response.data;
		console.log("Left match:", data);
	} catch (error) {
		if (axios.isCancel(error)) {
			console.log("Request cancelled");
			return;
		}
		console.error("Error leaving match:", error);
		errorMessage = error instanceof Error ? error.message : String(error);
	} finally {
		isLeavingMatch = false;
		currentRequest = null;
	}
}

async function handlePinComplete(event: CustomEvent<{ pin: string }>) {
	if (currentRequest) {
		currentRequest.abort();
	}
	currentRequest = new AbortController();

	try {
		const token = await $clerk?.session?.getToken();
		if (!token) {
			throw new Error("No authentication token available");
		}
		const response = await axios.post(
			`http://192.168.1.176:3000/normal-match/join?token=${token}`,
			{ pin_code: event.detail.pin },
			{
				signal: currentRequest.signal,
				timeout: 5000,
			},
		);
		const data = response.data;
		console.log("join match response", data);

		if (data.game_id) {
			navigate(`/${data.game_id}`);
		}
		showPinDialog = false;
	} catch (error) {
		if (axios.isCancel(error)) {
			console.log("Request cancelled");
			return;
		}
		console.error("Error joining match:", error);
		errorMessage = error instanceof Error ? error.message : String(error);
	} finally {
		currentRequest = null;
	}
}

onDestroy(() => {
	if (currentRequest) {
		currentRequest.abort();
	}
});
</script>

<div class="fixed inset-0 bg-[#5c3a1e] flex items-center justify-center">
  <div class="bg-white/10 p-8 rounded-lg backdrop-blur-sm text-center relative">
    <h1 class="text-4xl font-bold text-white mb-8">Sjavs Lobby</h1>
    
    <button 
      class="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xl font-semibold mb-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={createMatch}
      disabled={isCreatingMatch}
    >
      {#if isCreatingMatch}
        Creating Match...
      {:else}
        Create Match
      {/if}
    </button>

    <button 
      class="inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xl font-semibold mb-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={leaveMatch}
      disabled={isLeavingMatch}
    >
      {#if isLeavingMatch}
        Leaving Match...
      {:else}
        Leave Match
      {/if}
    </button>

    {#if errorMessage}
      <div class="absolute -bottom-20 left-0 right-0 mx-auto w-full p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-100">
        {errorMessage}
      </div>
    {/if}

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

