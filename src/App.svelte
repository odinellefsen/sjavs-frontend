<script lang="ts">
  import CardHand from './lib/CardHand.svelte'

  // Example seat data, if you'd like to map over seats.
  // For illustrative purposes:
  const seats = [
    { name: 'Player 1', position: 'top-center' },
    { name: 'Player 2', position: 'left-center' },
    { name: 'Player 3', position: 'right-center' },
    { name: 'Player 4', position: 'bottom-center' }
  ]
</script>

<svelte:head>
  <style>
    html, body {
      overflow: hidden;
      height: 100%;
      position: fixed;
      width: 100%;
    }
  </style>
</svelte:head>

<!-- 
  TailwindCSS-based responsive (mobile-first) poker table.
  On small screens, the table is narrower, 
  and it scales up for larger screens.
-->
<main class="
  fixed 
  inset-0 
  flex 
  items-center 
  justify-center 
  bg-gradient-to-br 
  from-gray-900 
  to-gray-800
  before:absolute
  before:inset-0
  before:bg-[radial-gradient(#ffffff08_1px,transparent_1px)]
  before:bg-[size:20px_20px]
  after:absolute
  after:inset-0
  after:bg-[linear-gradient(rgba(0,0,0,0.7),transparent_8%,transparent_92%,rgba(0,0,0,0.7))]
">
  <!-- A responsive poker table container. 
       On the smallest screens, it's sized for mobile and 
       expands on larger breakpoints. -->
  <section
    class="
      relative
      w-[45vh]
      h-[65vh]
      max-w-[80vw]
      max-h-[80vh]
      rounded-[9999px]
      shadow-2xl
      overflow-hidden

      sm:w-[40vh]
      sm:h-[55vh]
      sm:max-w-[70vw]
      sm:max-h-[70vh]
      
      md:w-[350px]
      md:h-[500px]
      md:max-w-[80vw]
    "
  >
    <!-- Outer rim -->
    <div class="absolute inset-0 bg-gradient-to-b from-amber-900 to-amber-800 rounded-[9999px]"></div>
    
    <!-- Inner wooden rim -->
    <div class="absolute inset-[8px] bg-gradient-to-b from-amber-800 to-amber-700 rounded-[9999px]"></div>
    
    <!-- Padding rim -->
    <div class="
      absolute 
      inset-[16px] 
      bg-green-800 
      rounded-[9999px]
      shadow-inner
    "></div>

    <!-- Felt surface with rich texture -->
    <div class="
      absolute 
      inset-[24px] 
      bg-green-700 
      rounded-[9999px]
      shadow-inner
      bg-opacity-90
      backdrop-blur-sm
      before:absolute
      before:inset-0
      before:bg-[radial-gradient(#00000003_1px,transparent_1px)]
      before:bg-[size:4px_4px]
      before:rounded-[9999px]
      after:absolute
      after:inset-0
      after:bg-[linear-gradient(rgba(255,255,255,0.05),transparent_20%,transparent_80%,rgba(255,255,255,0.05))]
      after:rounded-[9999px]
      [background-image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]
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
        {#if seat.position === 'bottom-center'}
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
          </div>
        {/if}
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

      <!-- Center area for community cards, pot, or any other content. -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CardHand />
      </div>
    </div>
  </section>
</main>
