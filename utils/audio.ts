
// A simple audio synthesizer for retro game sounds

let audioCtx: AudioContext | null = null;
let musicGain: GainNode | null = null;
let isMuted = false;
let isPlayingMusic = false;

// Sequencer state
let nextNoteTime = 0.0;
let currentNote = 0;
let timerID: number | null = null;
const TEMPO = 140; 
const LOOKAHEAD = 25.0; // ms
const SCHEDULE_AHEAD_TIME = 0.1; // s

// Simple driving bassline loop (Techno-ish)
const BASE_FREQ = 110.0; // A2
const BASS_SEQUENCE = [
  1, 0, 1, 0,  1, 1, 0, 1, // 1 = Play, 0 = Rest
  1, 0, 1, 0,  1, 1, 1, 1
];
const HIGH_SEQUENCE = [
  0, 0, 1, 0,  0, 0, 1, 0,
  0, 0, 1, 0,  0, 0, 1, 1
];

export const AudioController = {
  init: () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  },

  setMuted: (muted: boolean) => {
    isMuted = muted;
    if (musicGain) {
      musicGain.gain.setTargetAtTime(muted ? 0 : 0.2, audioCtx?.currentTime || 0, 0.1);
    }
  },

  playCoin: () => {
    if (isMuted || !audioCtx) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.1);
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(t + 0.1);
  },

  playDeath: () => {
    if (isMuted || !audioCtx) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.3);
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(t + 0.3);
  },

  playWin: () => {
    if (isMuted || !audioCtx) return;
    const t = audioCtx.currentTime;
    
    // Major Arpeggio
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0.1, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.2);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.2);
    });
  },

  startMusic: () => {
    AudioController.init();
    if (isPlayingMusic || !audioCtx) return;
    
    if (!musicGain) {
      musicGain = audioCtx.createGain();
      musicGain.gain.value = isMuted ? 0 : 0.2;
      musicGain.connect(audioCtx.destination);
    }
    
    isPlayingMusic = true;
    currentNote = 0;
    nextNoteTime = audioCtx.currentTime + 0.1;
    scheduler();
  },

  stopMusic: () => {
    isPlayingMusic = false;
    if (timerID !== null) window.clearTimeout(timerID);
  }
};

function scheduleNote(beatNumber: number, time: number) {
  if (!audioCtx || !musicGain) return;

  const sixteenthNote = beatNumber % 16;
  
  // Bass kick/pluck
  if (BASS_SEQUENCE[sixteenthNote]) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(musicGain);
    
    // Punchy bass
    osc.frequency.setValueAtTime(BASE_FREQ, time);
    osc.frequency.exponentialRampToValueAtTime(BASE_FREQ / 2, time + 0.1);
    
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
    
    osc.start(time);
    osc.stop(time + 0.15);
  }

  // Hi-hat / High pluck
  if (HIGH_SEQUENCE[sixteenthNote]) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(musicGain);
    
    osc.frequency.setValueAtTime(880, time); // A5
    
    gain.gain.setValueAtTime(0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    
    osc.start(time);
    osc.stop(time + 0.05);
  }
}

function scheduler() {
  if (!audioCtx) return;
  // While there are notes that will need to play before the next interval, 
  // schedule them and advance the pointer.
  while (nextNoteTime < audioCtx.currentTime + SCHEDULE_AHEAD_TIME) {
    scheduleNote(currentNote, nextNoteTime);
    nextNoteTime += 60.0 / TEMPO / 4; // 16th notes
    currentNote++;
  }
  if (isPlayingMusic) {
    timerID = window.setTimeout(scheduler, LOOKAHEAD);
  }
}
