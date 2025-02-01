<script lang="ts">
  const cards = [
    { id: 'Tiles_10_white', alt: 'Ten of Tiles' },
    { id: 'Pikes_Jack_white', alt: 'Jack of Spades' },
    { id: 'Pikes_Queen_white', alt: 'Queen of Spades' },
    { id: 'Pikes_King_white', alt: 'King of Spades' }
  ];
</script>

<div class="fixed bottom-0 left-0 right-0 flex justify-center pb-4 px-2">
  <div class="flex space-x-1 items-end">
    {#each cards as card, i}
      <div 
        class="transition-transform hover:translate-y-[-1rem]"
        style="z-index: {i};"
      >
        <img
          src="/playing_cards/PNG/white/{card.id}.png" 
          alt={card.alt}
          class="w-[7rem] h-auto"
        />
      </div>
    {/each}
  </div>
</div>