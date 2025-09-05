// آرایه‌ای از فلش‌کارت‌های شما
const flashcardLinks = [
    { title: 'Flash card essential word for tofel', url: 'flashcards/flash card essential word for tofel .html' },
    { title: 'flash card vocab 1- 9 fundation', url: 'flashcards/flash card vocab 1- 9 fundation.html' },
    { title: 'flashcard 400', url: 'flashcards/flashcard 400 .html' },
    { title: 'flashcard 400 phone', url: 'flashcards/flashcard 400 phone.html' },
    { title: 'flashcard essential word phone', url: 'flashcards/flashcard essential word phone.html' },
    { title: 'flashcard fundation 1-9 phone', url: 'flashcards/flashcard fundation 1-9 phone.html' },
    { title: 'flashcard mobile', url: 'flashcards/flashcard mobile.html' },
    { title: 'Flashcards_pc', url: 'flashcards/Flashcards_pc.html' }
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
