import 'https://unpkg.com/@popperjs/core@2';
import 'https://unpkg.com/tippy.js@6';
window.addEventListener('load', set);

function set(){
  if (window.tippySet) return;
  window.tippySet = tippy('[data-tippy-content]', {
    theme: 'light', allowHTML: true, animation: 'perspective-subtle'
  });
}