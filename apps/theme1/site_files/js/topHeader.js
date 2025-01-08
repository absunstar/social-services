const ticker = document.querySelector('.ticker');
const tickerContent = document.querySelector('.ticker-content');
const newsItems = tickerContent.children;

gsap.to(tickerContent, {
  x: () => tickerContent.offsetWidth,
  duration: 20,
  repeat: -1,
  ease: 'linear',
  onComplete: () => {
    tickerContent.style.transform = 'translateX(0)';
  },
});

gsap
  .timeline({
    repeat: -1,
    delay: 2,
  })
  .to(newsItems, {
    x: (item) => item.offsetWidth,
    duration: 2,
    ease: 'linear',
    stagger: 2,
  });
