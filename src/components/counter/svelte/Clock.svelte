<script>
  import { onMount, onDestroy } from "svelte";

  let time = Date.now();
  let timer$ = null;

  onMount(() => {
    timer$ = setInterval(() => {
      console.log("time");
      time = Date.now();
    }, 1000);
  });

  onDestroy(() => {
    timer$ && clearInterval(timer$);
  });
</script>

<div>
  <span>Current time: {time}</span>
</div>
