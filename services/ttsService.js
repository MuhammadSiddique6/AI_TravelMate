const googleTTS = require('google-tts-api');

async function synthesize(text, language, voiceName) {
  void voiceName;
  const lang = language === 'ur' ? 'ur' : 'en';
  const base64 = await googleTTS.getAudioBase64(text, {
    lang,
    slow: false,
    host: 'https://translate.google.com',
  });
  return Buffer.from(base64, 'base64');
}

module.exports = { synthesize };

 

