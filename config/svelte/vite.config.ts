export function qwikSvelte(): any {
  const OPTIMIZE_DEPS = [ "svelte" ];
  const DEDUPE = [ "svelte" ];

  return {
    resolve: {
      dedupe: DEDUPE,
    },
    optimizeDeps: {
      include: OPTIMIZE_DEPS,
    },
  };
}
