<script lang="ts">
import GameBoard from "../components/game-board/GameBoard.svelte";
import { wsStore, type WSMessage } from "../stores/websocket";
import { onMount, onDestroy } from "svelte";
import { initClerk } from "../stores/clerk";
import WaitingRoom from "../components/waiting-room/WaitingRoom.svelte";
import { updateThemeColor } from "../utils/theme";
import { Link } from "svelte-routing";
// Get gameId from URL parameters
export let gameId: string;

// Using auto-subscription syntax for cleaner code
$: ({ connected, gameState } = $wsStore);

onMount(async () => {
	updateThemeColor("#166534"); // Using green-800 for a darker, richer felt color
	await initClerk();
	await wsStore.connect();

	// Wait a bit before sending the join message
	setTimeout(() => {
		if (connected) {
			wsStore.sendMessage("join", { game_id: gameId });
		}
	}, 500); // Small delay to ensure the WebSocket is ready
});

onDestroy(() => {
	// Clean up subscription and connection
	wsStore.disconnect();
});
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

<!-- Add a status indicator and test button -->
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