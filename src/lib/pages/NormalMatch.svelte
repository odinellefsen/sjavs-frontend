<script lang="ts">
import GameBoard from "../components/game-board/GameBoard.svelte";
import { wsStore, type WSMessage } from "../stores/websocket";
import { onMount, onDestroy } from "svelte";
import { initClerk } from "../stores/clerk";
import { updateThemeColor } from "../utils/theme";

// Subscribe to WebSocket store
let connected = false;
let messages: WSMessage[] = [];

const unsubscribe = wsStore.subscribe((state) => {
	connected = state.connected;
	messages = state.messages;
});

onMount(async () => {
	updateThemeColor("#166534"); // Using green-800 for a darker, richer felt color
	await initClerk();
	await wsStore.connect();

	// Wait a bit before sending the join message
	setTimeout(() => {
		if (connected) {
			wsStore.sendMessage("join");
		}
	}, 500); // Small delay to ensure the WebSocket is ready
});

onDestroy(() => {
	// Clean up subscription and connection
	unsubscribe();
	wsStore.disconnect();
});

// Example function to send a message
function sendTestMessage() {
	wsStore.sendMessage("test", { message: "Hello from client!" });
}
</script>

<GameBoard />

<!-- Add a status indicator and test button -->
<div class="fixed top-4 right-4 z-10 flex gap-2">
    <div class={`px-3 py-1 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      {connected ? 'Connected' : 'Disconnected'}
    </div>
</div>