<script lang="ts">
import GameBoard from "../components/game-board/GameBoard.svelte";
import { wsStore, type WSMessage } from "../stores/websocket";
import { onMount, onDestroy } from "svelte";
import { initClerk, clerk } from "../stores/clerk";
import WaitingRoom from "../components/waiting-room/WaitingRoom.svelte";
import { updateThemeColor } from "../utils/theme";
import { Link, navigate } from "svelte-routing";
import axios from "axios";

// Using auto-subscription syntax for cleaner code
$: ({ connected, gameState } = $wsStore);

// Add state for leave match functionality
let isLeavingMatch = false;
let errorMessage = "";
let currentRequest: AbortController | null = null;
let playerMessage = "";
let showPlayerMessage = false;
let playerMessageType: "joined" | "left" = "joined";

// Watch for game_terminated events
$: {
	const terminatedEvent = $wsStore.messages.find(
		(msg) => msg.event === "game_terminated",
	);
	if (terminatedEvent) {
		console.log("Game terminated:", terminatedEvent.data.message);
		navigate("/");
	}
}

// Watch for player_joined events
$: {
	const playerJoinedEvent = $wsStore.messages.find(
		(msg) => msg.event === "player_joined",
	);
	if (playerJoinedEvent?.data?.message) {
		playerMessage = playerJoinedEvent.data.message;
		playerMessageType = "joined";
		showPlayerMessage = true;

		// Hide the message after 3 seconds
		setTimeout(() => {
			showPlayerMessage = false;
		}, 3000);
	}
}

// Watch for player_left events
$: {
	const playerLeftEvent = $wsStore.messages.find(
		(msg) => msg.event === "player_left",
	);
	if (playerLeftEvent?.data?.message) {
		playerMessage = playerLeftEvent.data.message;
		playerMessageType = "left";
		showPlayerMessage = true;

		// Hide the message after 3 seconds
		setTimeout(() => {
			showPlayerMessage = false;
		}, 3000);
	}
}

onMount(async () => {
	updateThemeColor("#166534"); // Using green-800 for a darker, richer felt color
	await initClerk();
	await wsStore.connect();

	const gameId = window.location.pathname.split("/")[1]; // Extract gameId from URL

	setTimeout(() => {
		if (connected) {
			wsStore.sendMessage("join", { game_id: gameId });
		}
	}, 500); // Small delay to ensure the WebSocket is ready
});

onDestroy(() => {
	wsStore.disconnect();
	if (currentRequest) {
		currentRequest.abort();
	}
});

// Add leaveMatch function
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
			`http://192.168.1.187:3000/normal-match/leave?token=${token}`,
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

{#if gameState === 'waiting'}
    <WaitingRoom />
{:else if gameState === 'playing'}
    <GameBoard />
{:else}
    <div class="flex items-center justify-center h-screen">
        <div class="text-xl">Loading game state...</div>
    </div>
{/if}

<!-- Add Leave Match button -->
<div class="fixed bottom-4 left-4 z-10">
    <button 
        class="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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

<!-- Add error message if needed -->
{#if errorMessage}
    <div class="fixed bottom-4 right-4 z-10 bg-red-500/20 border border-red-500 rounded-lg text-red-100 p-4 max-w-xs">
        {errorMessage}
    </div>
{/if}

<!-- Display player joined/left notification -->
{#if showPlayerMessage}
    <div class="fixed top-20 left-1/2 transform -translate-x-1/2 z-20 
        {playerMessageType === 'joined' ? 'bg-green-500/20 border-green-500' : 'bg-yellow-500/20 border-yellow-500'} 
        border rounded-lg text-white p-4 max-w-xs animate-fade-in-out">
        {playerMessage}
    </div>
{/if}

<!-- Status indicator -->
<div class="fixed top-4 right-4 z-10 flex gap-2">
    <div class={`px-3 py-1 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      {connected ? 'Connected' : 'Disconnected'}
    </div>
</div>

<Link
	class="fixed top-4 left-4 z-10 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xl font-semibold"
    to="/"
>
Back
</Link>