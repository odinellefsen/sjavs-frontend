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
<div class="
  fixed 
  inset-0 
  bg-[#472f1f]
  before:fixed
  before:inset-0
  before:bg-[url('/floor/checkered-pattern.png')]
  before:bg-repeat
  before:bg-[size:300px_300px]
  before:opacity-90
  after:fixed
  after:inset-0
  after:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]
">
  <main class="
    fixed 
    inset-0 
    flex 
    items-center 
    justify-center 
    -translate-y-[5vh]
  ">
    <!-- A responsive poker table container. 
         On the smallest screens, it's sized for mobile and 
         expands on larger breakpoints. -->
    <section
      class="
        relative
        w-[65vh]
        h-[55vh]
        max-w-[75vw]
        max-h-[65vh]
        rounded-[30px]
        shadow-2xl
        overflow-hidden

        sm:w-[70vh]
        sm:h-[60vh]
        sm:max-w-[70vw]
        sm:max-h-[70vh]
        
        md:w-[700px]
        md:h-[600px]
        md:max-w-[80vw]
      "
    >
      <!-- Outer rim -->
      <div class="absolute inset-0 bg-gradient-to-b from-zinc-950 to-zinc-900 rounded-[30px]"></div>
      
      <!-- Inner wooden rim -->
      <div class="absolute inset-[8px] bg-gradient-to-b from-zinc-900 to-zinc-800 rounded-[25px]"></div>
      
      <!-- Padding rim -->
      <div class="absolute inset-[16px] bg-green-800 rounded-[20px] shadow-inner"></div>

      <!-- Felt surface with cloth texture -->
      <div class="
        absolute 
        inset-[24px] 
        bg-green-700 
        rounded-[15px]
        shadow-inner
        before:absolute
        before:inset-0
        before:rounded-[15px]
        before:bg-[url('/table/arabesque.png')]
        before:bg-repeat
        before:bg-[size:200px_200px]
        before:opacity-40
        after:absolute
        after:inset-0
        after:bg-[radial-gradient(circle_at_center_center,transparent,transparent_40%,#00440055_110%)]
        after:rounded-[15px]
        after:pointer-events-none
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
      </div>
    </section>

    <!-- Add this after the main table section -->
    <CardHand />
  </main>
</div>
