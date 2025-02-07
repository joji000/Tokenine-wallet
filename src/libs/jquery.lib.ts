import jQuery from 'jquery';

declare global {
  interface Window {
    $: typeof jQuery;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jQuery: any;
  }
}

if (typeof window !== 'undefined') {
  window.$ = window.jQuery = jQuery;
}

export default jQuery;
