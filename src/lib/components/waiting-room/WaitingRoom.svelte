<script lang="ts">
import { initClerk, clerk } from "../../stores/clerk";
import { wsStore } from "../../stores/websocket";
import { onMount } from "svelte";
import axios from "axios";
import { navigate } from "svelte-routing";

// Subscribe to websocket store
$: ({ connected } = $wsStore);

let isLeavingMatch = false;
let errorMessage = "";
let currentRequest: AbortController | null = null;

onMount(async () => {
	await initClerk();
	await wsStore.connect();
	const gameId = window.location.pathname.split("/")[1]; // Extract gameId from URL

	setTimeout(() => {
		if (connected) {
			wsStore.sendMessage("join", { game_id: gameId });
		}
	}, 500); // Small delay to ensure the WebSocket is ready
});

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
			`http://192.168.1.185:3000/normal-match/leave?token=${token}`,
			{
				signal: currentRequest.signal,
				timeout: 5000,
			},
		);

		const data = response.data;
		console.log("Left match:", data);
		navigate("/");
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
</script>

<div class="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
    <h1 class="text-3xl font-bold">Waiting Room</h1>
    
    {#if connected}
        <div class="flex flex-col items-center gap-4">
            <p class="text-lg">Looking for other players...</p>
            
            <button 
                class="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                on:click={() => wsStore.sendMessage('cancel_match')}
            >
                Cancel Search
            </button>
            
            <!-- Add Leave Match button -->
            <button 
                class="px-6 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={leaveMatch}
                disabled={isLeavingMatch}
            >
                {#if isLeavingMatch}
                    Leaving Match...
                {:else}
                    Leave Match
                {/if}
            </button>
        </div>
    {:else}
        <div class="flex flex-col items-center gap-4">
            <p class="text-lg text-red-500">Disconnected from server</p>
            <button 
                class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                on:click={() => wsStore.connect()}
            >
                Reconnect
            </button>
        </div>
    {/if}
    
    {#if errorMessage}
        <div class="bg-red-500/20 border border-red-500 rounded-lg text-red-100 p-4 mt-4 w-full max-w-md">
            {errorMessage}
        </div>
    {/if}
</div>