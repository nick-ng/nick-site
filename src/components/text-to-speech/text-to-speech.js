const synth = window.speechSynthesis;

const sleep = (ms, output = null) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(output);
    }, ms);
  });

export const getVoices = async () => {
  for (let n = 0; n < 10000; n++) {
    if (typeof synth.getVoices === 'function') {
      return synth.getVoices();
    }
    await sleep(50);
  }
};

export const sayWithVoice = (phrase, voiceURI, { volume = 0.3, rate = 1 }) => {
  if (volume <= 0) {
    return;
  }
  console.log('voiceURI', voiceURI);
  const voice = synth.getVoices().find((voice) => voice.voiceURI === voiceURI);
  console.log('voices', synth.getVoices());
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.volume = volume;
  utterance.rate = rate;
  if (voice) {
    utterance.voice = voice;
    synth.speak(utterance);
  }
};

export const stopTalking = () => {
  synth.cancel();
};

export const pauseTalking = () => {
  synth.pause();
};

export const resumeTalking = () => {
  synth.resume();
};
