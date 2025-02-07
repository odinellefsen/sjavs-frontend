<script lang="ts">
import CardHand from "../CardHand.svelte";
import { wsStore, type WSMessage } from "../stores/websocket";
import { onMount, onDestroy } from "svelte";
import { initClerk } from "../stores/clerk";
import { Link } from "svelte-routing";
import { updateThemeColor } from "../utils/theme";

// Example seat data, if you'd like to map over seats.
// For illustrative purposes:
const seats = [
	{ name: "Player 1", position: "top-center" },
	{ name: "Player 2", position: "left-center" },
	{ name: "Player 3", position: "right-center" },
	{ name: "Player 4", position: "bottom-center" },
];

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
  
  <svelte:head>
    <style>
      html, body {
        padding: 0;
        margin: 0;
        overflow: hidden;
        height: 100%;
        width: 100%;
      }
    </style>
  </svelte:head>
  
  <!-- 
    TailwindCSS-based responsive (mobile-first) sjavs table.
    On small screens, the table is narrower, 
    and it scales up for larger screens.
  -->
  
        <!-- Just the felt surface -->
        <div class="
          absolute 
          inset-[0px]
          bg-green-700 
          before:absolute
          before:inset-[0px]
          before:bg-[url('/table/45-degree-fabric-light.png')]
          before:bg-[size:300px_300px]
          after:absolute
          after:inset-0
          after:bg-[radial-gradient(circle_at_center_center,transparent,transparent_40%,#00440055_110%)]
          after:pointer-events-none
          z-[-1]
        ">
          <!-- Seats: place them absolutely around the table. -->
          {#each seats as seat}
            <!-- You can use position classes or inline styles to place seats. -->
            {#if seat.position === 'top-center'}
              <div class="absolute top-4 left-1/2 -translate-x-1/2">
                <div
                  class="
                    text-white
                    bg-black/40
                    py-2
                    px-4
                    rounded-md
                    text-center
                    shadow-lg
                  "
                >
                  {seat.name}
                </div>
              </div>
            {/if}
            <!-- <!-- {#if seat.position === 'bottom-center'}
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div
                  class="
                    text-white
                    bg-black/40
                    py-2
                    px-4
                    rounded-md
                    text-center
                    shadow-lg
                  "
                >
                  {seat.name}
                </div>
              </div> -->
            <!-- {/if} -->
            {#if seat.position === 'left-center'}
              <div class="absolute left-4 top-1/2 -translate-y-1/2">
                <div
                  class="
                    text-white
                    bg-black/40
                    py-2
                    px-4
                    rounded-md
                    text-center
                    shadow-lg
                  "
                >
                  {seat.name}
                </div>
              </div>
            {/if}
            {#if seat.position === 'right-center'}
              <div class="absolute right-4 top-1/2 -translate-y-1/2">
                <div
                  class="
                    text-white
                    bg-black/40
                    py-2
                    px-4
                    rounded-md
                    text-center
                    shadow-lg
                  "
                >
                  {seat.name}
                </div>
              </div>
            {/if}
          {/each}
        </div>

  <Link
    class="fixed top-4 left-4 z-10 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xl font-semibold"
    to="/">Back</Link>
  
  <!-- Add a status indicator and test button -->
  <div class="fixed top-4 right-4 z-10 flex gap-2">
    <div class={`px-3 py-1 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      {connected ? 'Connected' : 'Disconnected'}
    </div>
    <button 
      class="px-3 py-1 bg-blue-500 text-white rounded-full"
      on:click={sendTestMessage}
    >
      Send Test Message
    </button>
  </div>

