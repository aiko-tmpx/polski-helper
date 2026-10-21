export function speakPolish(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.debug('Speech synthesis error', e);
    return false;
  }
}
