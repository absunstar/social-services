const tl = gsap.timeline({ repeat: Infinity, repeatDelay: 1, yoyo: true });
tl.to('.animate-text', {
  duration: 2,
  text: 'إدارة منصات التواصل الاجتماعي',
  ease: 'power1.out',
});

const t2 = gsap.timeline({ repeat: Infinity, repeatDelay: 1, yoyo: false });
t2.to('.breakingTitle', {
  duration: 1,
  text: 'تحديثات الموقع',
  ease: 'power1.out',
});

