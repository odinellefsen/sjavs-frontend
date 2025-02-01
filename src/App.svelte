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
      padding: 0;
      margin: 0;
      overflow: hidden;
      height: 100%;
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
  bg-[#5c3a1e]
  before:fixed
  before:inset-0
  before:bg-[url('/table-edge/retina-wood.png')]
  before:bg-repeat
  before:bg-[size:300px_300px]
  before:opacity-90
">
  <main class="fixed inset-0 flex items-center justify-center p-0 m-0">
    <!-- A responsive poker table container. 
         On the smallest screens, it's sized for mobile and 
         expands on larger breakpoints. -->
    <section
      class="
        relative
        w-[100vw]
        h-[100vh]
        overflow-hidden
      "
    >
      <!-- Just the felt surface -->
      <div class="
        absolute 
        inset-[24px]
        bg-green-700 
        rounded-[30px]
        box-shadow-[0_0_200px_80px_rgba(0,0,0,0.95),0_0_400px_160px_rgba(0,0,0,0.8)]
        before:absolute
        before:inset-[-8px]
        before:rounded-[38px]
        before:bg-[url('/table/45-degree-fabric-light.png')]
        before:bg-repeat
        before:bg-[size:500px_500px]
        before:opacity-40
        before:shadow-[inset_0_0_20px_12px_rgba(0,0,0,0.8)]
        after:absolute
        after:inset-0
        after:bg-[radial-gradient(circle_at_center_center,transparent,transparent_40%,#00440055_110%)]
        after:rounded-[30px]
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
    <!-- <CardHand /> -->
  </main>
</div>
