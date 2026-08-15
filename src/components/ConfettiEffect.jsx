import confetti from 'canvas-confetti';

export function fireConfetti(intense = true) {
  const count = intense ? 180 : 100;
  const defaults = {
    origin: { y: 0.65 },
    zIndex: 9999,
  };

  const goldColors = ['#D4AF37', '#F3E5AB', '#AA7C11', '#FFF8E7', '#E5C158', '#99751D'];

  confetti({
    ...defaults,
    particleCount: count,
    spread: 80,
    colors: goldColors,
    scalar: 1.15,
  });

  if (intense) {
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 90,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors: goldColors,
      });
      confetti({
        ...defaults,
        particleCount: 90,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors: goldColors,
      });
    }, 250);
  }
}
