import confetti from 'canvas-confetti';

export function fireConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ec4899', '#f43f5e', '#10b981', '#3b82f6', '#f59e0b'],
    });
  } catch (e) {
    console.debug('Confetti error', e);
  }
}

export function fireMegaConfetti() {
  try {
    const end = Date.now() + 800;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ec4899', '#10b981', '#3b82f6']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f43f5e', '#8b5cf6', '#eab308']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  } catch (e) {
    console.debug('Confetti error', e);
  }
}
