export function speechToText(options = { language: 'en-US', callback: any }) {
  var started = false;
  var speech  = function() {
      var recognition = new webkitSpeechRecognition();

      function toggleRecognition() {
        if (started) {
            started = false;
            recognition.stop();
            //console.log('recognition stop');
        }
        else {
            started = true;
            recognition.start();
            //console.log('recognition start');
        }
      }

      // make sure we don't add the handler multiple times
      document.removeEventListener('toggle-record', toggleRecognition);
      document.addEventListener('toggle-record'   , toggleRecognition);

      recognition.continuous     = true;
      recognition.interimResults = false;
      recognition.lang           = options.language;

      recognition.onresult = function(event) {
          var result = event.results[event.results.length - 1][0].transcript;

          //console.log('recognition onresult', options.target);
          options.callback(result);
      }
  }

  speech();
}

export function textToSpeech(options = { sentence, language: 'en-US' }) {
  // config
  let speechSynthesis = {
      language: options.language,
      enabled : true,
  };

  speechSynthesis.msg      = new window.SpeechSynthesisUtterance(options.sentence);
  speechSynthesis.msg.lang = speechSynthesis.language;

  // speak text
  if (speechSynthesis.enabled) {
      window.speechSynthesis.speak(speechSynthesis.msg);
  }
}
