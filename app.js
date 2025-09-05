// ثبت Service Worker برای فعال کردن قابلیت آفلاین
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// آرایه‌ای از فلش‌کارت‌های شما
const flashcardLinks = [
    { title: 'مجموعه لغات انگلیسی', url: 'flashcards/english.html' },
    { title: 'مجموعه لغات آلمانی', url: 'flashcards/german.html' },
    { title: 'فلش‌کارت‌های شخصی من', url: 'http://localhost:8000/my-personal-cards.html' }
];

// نمایش لیست فلش‌کارت‌ها در صفحه
document.addEventListener('DOMContentLoaded', () => {
    const listElement = document.getElementById('flashcard-list');
    flashcardLinks.forEach(card => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = card.title;
        a.href = card.url;
        li.appendChild(a);
        listElement.appendChild(li);
    });
});
