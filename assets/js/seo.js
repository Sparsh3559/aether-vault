/* ═══════════════════════════════════════
   AETHER VAULT — SEO.JS
   Collapsible SEO sections + FAQ
   ═══════════════════════════════════════ */

function toggleSEO(id) {
  const content = document.getElementById(id);
  const btn     = content?.previousElementSibling;
  if (!content) return;
  const isOpen = content.classList.contains('open');
  content.classList.toggle('open', !isOpen);
  if (btn) btn.classList.toggle('open', !isOpen);
}

function toggleFAQ(btn) {
  const answer  = btn.nextElementSibling;
  const isOpen  = answer.classList.contains('open');
  // Close all FAQs in same block
  const block   = btn.closest('.faq-block');
  block.querySelectorAll('.faq-a').forEach(a  => a.classList.remove('open'));
  block.querySelectorAll('.faq-q span').forEach(s => s.textContent = '▼');
  // Open clicked if it was closed
  if (!isOpen) {
    answer.classList.add('open');
    btn.querySelector('span').textContent = '▲';
  }
}
