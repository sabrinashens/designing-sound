var button = document.getElementById("button");
var babblingBrook = false;

document.addEventListener("DOMContentLoaded", function (event) {

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var babbling = {};

    button.addEventListener("click", function () {
        if (babblingBrook == false) {
          	var Brown = BrownNoise();
            
            var LPF1 = audioCtx.createBiquadFilter();
            LPF1.type = "lowpass";
            LPF1.frequency.value = 400;
            
            var RHPF = audioCtx.createBiquadFilter();
            RHPF.type = "highpass";
            RHPF.Q.value = 1/0.03;
            RHPF.frequency.value = 500;
            
            var RHPFgain = audioCtx.createGain();
            RHPFgain.gain.value = 0.1;
          
            var LPF2 = audioCtx.createBiquadFilter();
            LPF2.type = "lowpass";
            LPF2.frequency.value = 14;
            
            var LPF2gain = audioCtx.createGain();
            LPF2gain.gain.value = 1000;

            Brown.connect(LPF1).connect(RHPF).connect(RHPFgain).connect(audioCtx.destination);
            Brown.connect(LPF2).connect(LPF2gain).connect(RHPF.frequency);

            babbling = RHPFgain;
            babblingBrook = true;
				}
        
        else if (babblingBrook == true) {
            babbling.gain.linearRampToValueAtTime(babbling.gain.value, audioCtx.currentTime);
            babbling.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
            babblingBrook = false;
        }

    });
    
   
    function BrownNoise() {
        var bufferSize = 10 * audioCtx.sampleRate,
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
        output = noiseBuffer.getChannelData(0);

        var lastOut = 0;
        for (var i = 0; i < bufferSize; i++) {
            var brown = Math.random() * 2 - 1;

            output[i] = (lastOut + (0.02 * brown)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }

        brownNoise = audioCtx.createBufferSource();
        brownNoise.buffer = noiseBuffer;
        brownNoise.loop = true;
        brownNoise.start(0);

        return brownNoise;
    }
})
