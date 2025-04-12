
// Audio context manager for the game
let audioContext: AudioContext | null = null;

export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext not supported', error);
      // Create a mock audio context as fallback
      audioContext = {
        createOscillator: () => ({ connect: () => {}, start: () => {}, stop: () => {} }),
        createGain: () => ({ connect: () => {}, gain: { value: 0 } }),
        destination: {},
      } as unknown as AudioContext;
    }
  }
  return audioContext;
};

export const playSound = (frequency: number = 440, duration: number = 0.1, volume: number = 0.5): void => {
  try {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    
    oscillator.start();
    
    setTimeout(() => {
      oscillator.stop();
    }, duration * 1000);
  } catch (error) {
    console.warn('Failed to play sound', error);
  }
};

// Play coin sound (typical 8-bit coin sound)
export const playCoinSound = (): void => {
  playSound(988, 0.1, 0.3);
  setTimeout(() => playSound(1319, 0.15, 0.3), 100);
};

// Play jump sound
export const playJumpSound = (): void => {
  playSound(330, 0.1, 0.2);
};

// Play error sound
export const playErrorSound = (): void => {
  playSound(220, 0.2, 0.2);
};

// Resume audio context on user interaction
export const resumeAudioContext = (): void => {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
};

// Initialize audio by making a user interaction required
export const initAudio = (): void => {
  const handleInteraction = () => {
    resumeAudioContext();
    document.removeEventListener('click', handleInteraction);
    document.removeEventListener('keydown', handleInteraction);
  };

  document.addEventListener('click', handleInteraction);
  document.addEventListener('keydown', handleInteraction);
};
