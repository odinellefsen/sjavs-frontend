<script lang="ts">
  const cards = [
    { id: 'clubs_02', alt: 'Two of Clubs' },
    { id: 'diamonds_02', alt: 'Two of Diamonds' },
    { id: 'hearts_02', alt: 'Two of Hearts' },
    { id: 'spades_02', alt: 'Two of Spades' },
    { id: 'clubs_03', alt: 'Three of Clubs' },
    { id: 'spades_queen', alt: 'Queen of Spades' },
    { id: 'hearts_ace', alt: 'Ace of Hearts' }
  ];
</script>

<div class="fixed bottom-0 left-0 right-0 flex justify-center pb-4 px-2">
  <div class="flex space-x-[-1rem] items-end">
    {#each cards as card, i}
      <div 
        class="transition-transform hover:translate-y-[-1rem] border-2 border-gray-400 rounded-lg"
        style="z-index: {i};"
      >
        <img
          src="/cards/big-cards/{card.id}.png" 
          alt={card.alt}
          class="w-[4rem] h-auto"
        />
      </div>
    {/each}
  </div>
</div>