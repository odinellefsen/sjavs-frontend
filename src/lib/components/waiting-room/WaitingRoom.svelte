<script lang="ts">
import { wsStore } from "../../stores/websocket";

// Subscribe to websocket store
$: ({ connected } = $wsStore);

function handleFindMatch() {
	wsStore.sendMessage("find_match");
}
</script>

<div class="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
    <h1 class="text-3xl font-bold">Waiting Room</h1>
    
    {#if connected}
        <div class="flex flex-col items-center gap-4">
            <p class="text-lg">Looking for other players...</p>
            <!-- <div class="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div> -->
            <button 
                class="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                on:click={() => wsStore.sendMessage('cancel_match')}
            >
                Cancel Search
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

    {#if !connected}
        <button 
            class="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            on:click={handleFindMatch}
            disabled={!connected}
        >
            Find Match
        </button>
    {/if}
</div>