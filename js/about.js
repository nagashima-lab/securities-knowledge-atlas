(function () {
  function bindFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      const button = item.querySelector('button');
      if (!button) return;

      button.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function (faq) {
          faq.classList.remove('open');
          const faqButton = faq.querySelector('button');
          if (faqButton) faqButton.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindFaq();
  });
})();
