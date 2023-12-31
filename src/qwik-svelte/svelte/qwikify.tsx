import {
  component$,
  implicit$FirstArg,
  RenderOnce,
  SkipRender,
  useSignal,
  useTask$,
  type ValueOrPromise,
} from "@builder.io/qwik";

import { isBrowser, isServer } from "@builder.io/qwik/build";
import { getHostProps, getSvelteProps } from "./props";
import { renderFromServer } from "./server";
import { createSlots, getSlotContentWithoutComments } from "./slots";
import { useWakeupSignal } from "./signals";

import type { QRL } from "@builder.io/qwik";
import type { Slots } from "./slots";
import type { QwikifyOptions, QwikifyProps } from "./types";
import type { ComponentConstructorOptions } from 'svelte';

type SvelteComp<PROPS extends {}> = {
  new(options: ComponentConstructorOptions): any;
}


export function qwikifyQrl<PROPS extends Record<string, any>>(
  svelteCmp$: QRL<SvelteComp<PROPS>>,
  opts?: QwikifyOptions
) {
  return component$((props: QwikifyProps<PROPS>) => {

    const hostRef = useSignal<Element>();
    const slotRef = useSignal<Element>();

    const [ wakeUp, isClientOnly ] = useWakeupSignal(props);

    const TagName = opts?.tagName ?? ("qwik-svelte" as any);

    useTask$(async ({ track }) => {
      track(wakeUp);
      track(() => ({ ...props }));

      if (!isBrowser) {
        return;
      }

      // Mount / hydrate Svelte 💦
      const target = hostRef.value;
      const svelteCmp = await svelteCmp$.resolve();

      if (target) {
        let slots: Slots = {};

        if (slotRef.value) {
          let slotHTMLWithoutComments = getSlotContentWithoutComments(
            slotRef.value
          );

          // if slot content has been passed, we should render it
          // we do this by assigning the value to the default slot
          if (slotHTMLWithoutComments.length) {
            slots.default = [ slotRef.value, {} ];
          }
        }

        // compile the svelte component with hydrate: true
        // and return it
        return new svelteCmp({
          hydrate: true,
          target,
          props: {
            ...getSvelteProps(props),
            $$slots: createSlots(slots) as Slots,
            $$scope: {} as {},
          },
        });
      }
    });

    // SSR
    if (isServer && !isClientOnly) {
      const jsx = renderFromServer(
        TagName,
        svelteCmp$,
        props,
        hostRef,
        slotRef
      );
      return <RenderOnce>{jsx}</RenderOnce>;
    }

    return (
      <RenderOnce>
        <TagName {...getHostProps(props)}>{SkipRender}</TagName>
      </RenderOnce>
    );
  });
}

export const qwikify$ = /*#__PURE__*/ implicit$FirstArg(qwikifyQrl);
