export const VOICE_CHARACTER_STORE = 'VOICE_CHARACTER_NICK_SITE';
export const VOICE_VOLUME_STORE = 'VOICE_VOLUME_NICK_SITE';

const synth = window.speechSynthesis;
let stopping = true;

const sleep = (ms, output = null) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(output);
    }, ms);
  });

export const getVoices = () => {
  return new Promise((resolve, reject) => {
    const bb = async () => {
      for (let n = 0; n < 10000; n++) {
        const voices = synth.getVoices();

        if (voices.length > 0) {
          resolve(voices);
          return;
        }

        await sleep(10);
      }
      reject('Could not get voices');
    };
    if (speechSynthesis.hasOwnProperty('onvoiceschanged')) {
      speechSynthesis.onvoiceschanged = bb;
    } else {
      bb();
    }
  });
};

export const sayWithVoice = (phrase, voiceURI, { volume = 0.3, rate = 1 }) => {
  if (volume <= 0) {
    return;
  }
  const voice = synth.getVoices().find((voice) => voice.voiceURI === voiceURI);
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.volume = volume;
  utterance.rate = rate;
  if (voice) {
    utterance.voice = voice;
    synth.speak(utterance);
  }
};

export const sayWithVoice2 = async (
  phrase,
  voiceURI,
  { volume = 0.3, rate = 1 }
) => {
  await getVoices();
  sayWithVoice(phrase, voiceURI, { volume, rate });
};

export const sayMultiplePhrases = async (
  phrases,
  voiceURI,
  options,
  callback
) => {
  const { start } = options;
  stopping = false;
  for (let i = start; i < phrases.length; i++) {
    const phrase = phrases[i];
    while (synth.speaking) {
      await sleep(20);
    }
    if (stopping) {
      return;
    }
    if (typeof callback === 'function') {
      callback(i);
    }
    sayWithVoice(phrase, voiceURI, options);
    await sleep(20);
  }
};

export const stopTalking = () => {
  stopping = true;
  synth.cancel();
};

export const pauseTalking = () => {
  synth.pause();
};

export const resumeTalking = () => {
  synth.resume();
};
