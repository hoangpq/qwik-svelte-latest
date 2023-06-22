import { component$, useSignal } from "@builder.io/qwik";

import { qwikify$ } from "~/qwik-svelte";
import Button from "~/components/counter/svelte/Button.svelte";
import NumberDisplay from "~/components/counter/svelte/NumberDisplay.svelte";
import Clock from "~/components/counter/svelte/Clock.svelte";

export const SvelteButton = qwikify$(Button, { eagerness: 'visible' });
export const SvelteNumberDisplay = qwikify$(NumberDisplay, { eagerness: 'visible' });
export const SvelteClock = qwikify$(Clock, { eagerness: 'visible' });

export default component$(() => {
  const count = useSignal(0);

  return (
    <>
      <div>
        <SvelteNumberDisplay count={count.value} client:visible/>
        <br/>
        <div style="display:flex; gap: 12px;">
          <SvelteButton client:hover host:onClick$={() => {
            count.value++
          }}>
            +
          </SvelteButton>
          <SvelteButton client:hover host:onClick$={() => {
            count.value--
          }}>
            -
          </SvelteButton>

          <div style="margin-top:200vh;">
            <SvelteClock client:visible/>
          </div>
        </div>
      </div>
      <br/>
    </>
  );
});
