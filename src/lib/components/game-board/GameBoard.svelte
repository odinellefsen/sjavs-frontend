<script lang="ts">
import CardHand from "../../CardHand.svelte";
import { Link } from "svelte-routing";

// Example seat data, if you'd like to map over seats.
// For illustrative purposes:
const seats = [
	{ name: "Player 1", position: "top-center" },
	{ name: "Player 2", position: "left-center" },
	{ name: "Player 3", position: "right-center" },
	{ name: "Player 4", position: "bottom-center" },
];
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
                {#if seat.position === 'bottom-center'}
                <CardHand />
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
    
            <!-- <div class="absolute bottom-4 right-4 bg-black/50 p-4 text-white rounded-lg max-w-md">
              <h3 class="text-lg font-bold">Messages:</h3>
              {#each messages as message}
                <p>{message.event}: {JSON.stringify(message.data)}</p>
              {/each}
            </div> -->

    