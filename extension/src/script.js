/* eslint-disable no-undef */
// change from salmon to qtware, m17
window.qtware = {
  postMessage: message => {
    const listener = event => {
      if (event.detail.id === message.id) {
        window.removeEventListener('qtware_contentscript_message', listener);
        window.postMessage(event.detail);
      }
    };
    window.addEventListener('qtware_contentscript_message', listener);

    window.dispatchEvent(
      new CustomEvent('qtware_injected_script_message', { detail: message }),
    );
  },
};
