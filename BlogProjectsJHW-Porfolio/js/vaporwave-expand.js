/**
 * Lets the vaporwave background expand to fill the viewport.
 * The easter egg hint is only revealed while expanded.
 */
window.createVaporwaveExpander = function (container, { onToggle, onEscape }) {
  const expandButton = container.querySelector('.vaporwave-expand');
  const closeButton = container.querySelector('.vaporwave-close');
  const hint = container.querySelector('.vaporwave-hint');
  let expanded = false;

  function setExpanded(next) {
    if (next === expanded) return;
    expanded = next;

    container.classList.toggle('is-expanded', expanded);
    expandButton.hidden = expanded;
    expandButton.setAttribute('aria-expanded', String(expanded));
    closeButton.hidden = !expanded;
    hint.hidden = !expanded;

    onToggle(expanded);
    (expanded ? closeButton : expandButton).focus({ preventScroll: true });
  }

  expandButton.addEventListener('click', () => setExpanded(true));
  closeButton.addEventListener('click', () => setExpanded(false));

  // The whole collapsed scene acts as an expand target, not just the button.
  container.addEventListener('click', (e) => {
    if (!expanded && !e.target.closest('button')) setExpanded(true);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && expanded) onEscape();
  });

  return {
    isExpanded: () => expanded,
    collapse: () => setExpanded(false)
  };
};
