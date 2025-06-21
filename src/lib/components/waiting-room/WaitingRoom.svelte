<script lang="ts">
import { initClerk, clerk } from "../../stores/clerk";
import { wsStore } from "../../stores/websocket";
import { onMount } from "svelte";
import axios from "axios";
import { navigate } from "svelte-routing";

// Subscribe to websocket store
$: ({ connected, players, gameData } = $wsStore);

let isLeavingMatch = false;
let errorMessage = "";
let currentRequest: AbortController | null = null;

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
			`http://192.168.1.198:3000/normal-match/leave?token=${token}`,
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

    {#if gameData && gameData.id}
    <div class="bg-blue-800/30 border border-blue-800 rounded-lg p-4 w-full max-w-md mt-4">
      <h2 class="text-xl font-semibold mb-2">Game Info</h2>
      <p>Game ID: {gameData.id}</p>
      <p>Game PIN: {gameData.pin}</p>
      <p>Status: {gameData.status}</p>
      <!-- Add more game state properties as needed -->
    </div>
  {/if}
    
    {#if connected}
        <div class="flex flex-col items-center gap-4 w-full max-w-md">
            <p class="text-lg">Looking for other players...</p>
            
            <!-- Player list -->
            <div class="w-full mt-4">
                <h2 class="text-xl font-semibold mb-2">Players ({players.length})</h2>
                <div class="bg-green-800/30 border border-green-800 rounded-lg p-4 w-full">
                    {#if players.length === 0}
                        <p class="text-center text-gray-300">Waiting for players to join...</p>
                    {:else}
                        <ul class="divide-y divide-green-800/50">
                            {#each players as player}
                                <li class="py-3 flex items-center">
                                    <div class="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold mr-3">
                                        {player.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span class="text-white">{player.username}</span>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
            </div>
            
            <button 
                class="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors mt-4 w-full"
                on:click={() => wsStore.sendMessage('cancel_match')}
            >
                Cancel Search
            </button>
            
            <!-- Add Leave Match button -->
            <button 
                class="px-6 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors mt-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
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