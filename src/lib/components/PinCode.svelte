<script lang="ts">
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();
const pin = ["", "", "", ""];
const inputs: HTMLInputElement[] = [];

function handleInput(index: number, event: Event) {
	const input = event.target as HTMLInputElement;
	const value = input.value;

	// Only allow numbers
	if (!/^\d*$/.test(value)) {
		input.value = "";
		return;
	}

	// Update pin array
	pin[index] = value.slice(-1);

	// Auto-focus next input
	if (value && index < 3) {
		inputs[index + 1].focus();
	}

	// Check if PIN is complete
	if (pin.every((digit) => digit !== "")) {
		dispatch("complete", { pin: pin.join("") });
	}
}

function handleKeydown(index: number, event: KeyboardEvent) {
	// Handle backspace
	if (event.key === "Backspace" && !pin[index] && index > 0) {
		inputs[index - 1].focus();
	}
}
</script>

<div class="flex justify-center space-x-4">
  {#each pin as digit, i}
    <input
      type="text"
      inputmode="numeric"
      maxlength="1"
      bind:this={inputs[i]}
      value={digit}
      on:input={(e) => handleInput(i, e)}
      on:keydown={(e) => handleKeydown(i, e)}
      class="w-12 h-16 text-center text-2xl font-bold border-2 border-white/30 
             rounded-lg bg-white/10 text-white focus:border-white/50 focus:outline-none
             backdrop-blur-sm"
    />
  {/each}
</div> 