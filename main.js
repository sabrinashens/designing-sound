var button = document.getElementById("button");
var button2 = document.getElementById("button2");
var btnState = false;
var btnState2 = false;

document.addEventListener("DOMContentLoaded", function (event) {

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var gainBubble = {};
    var gainFire = {};
    
    ////////////////////Bubbling////////////////////
    button.addEventListener("click", function () {
        if (btnState == false) {
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

            gainBubble = RHPFgain;
            btnState = true;
		}
        
        else if (btnState == true) {
            gainBubble.gain.linearRampToValueAtTime(gainBubble.gain.value, audioCtx.currentTime);
            gainBubble.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
            btnState = false;
        }

    });
    
    
    //A buffer of brown noise
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
    

		
    
    ////////////////////fire////////////////////
    button2.addEventListener("click", function () {
        if (btnState2 == false) {
           /*
            var noise = WhiteNoise();
            var hissing = Hissing();
            var crackling = Crackling();
            var lapping = Lapping();
            
            const gain1 = audioCtx.createGain();
            gain1.gain.value = 0.2;
            
            const gain2 = audioCtx.createGain();
            gain2.gain.value = 0.3;
            
            const gain3 = audioCtx.createGain();
            gain3.gain.value = 0.6;
            
            noise.connect(hissing).connect(gain1);
            noise.connect(crackling).connect(gain2);
            noise.connect(lapping).connect(gain3);
            noise.connect(audioCtx.destination);
            
            return noise;
            */
            btnState2 = true;
		}
        
        else if (btnState2 == true) {
            gainFire.gain.linearRampToValueAtTime(gainFire.gain.value, audioCtx.currentTime);
            gainFire.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
            btnState2 = false;
        }

    });

   
   // a buffer of white noise
    function WhiteNoise() {
        var bufferSize = 2 * audioCtx.sampleRate,
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
        output = noiseBuffer.getChannelData(0);

        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.start(0);

        return whiteNoise;
    }
    
    //Hissing
    function Hissing() {
        var noise = WhiteNoise();
            
        var Lop = audioCtx.createBiquadFilter();
        Lop.type = "lowpass";
        Lop.frequency.value = 1;
        noise.connect(Lop);
            
        const gain1 = audioCtx.createGain();
        gain1.gain.value = 10;
        Lop.connect(gain1);
            
        const gain2 = audioCtx.createGain();
        gain2.gain.value = 0;
        gain1.connect(gain2);
            
        const gain3 = audioCtx.createGain();
        gain3.gain.value = 0;
        gain2.connect(gain3);
            
        const gain4 = audioCtx.createGain();
        gain4.gain.value = 600;
        gain3.connect(gain4);
            
        const gain = audioCtx.createGain();
        gain3.gain.value = 0;
        gain4.connect(gain);
            
        var Hip = audioCtx.createBiquadFilter();
        Hip.type = "highpass";
        Hip.frequency.value = 1000;
            
        noise.connect(Hip).connect(gain).connect(audioCtx.destination);
            
        gainFire = gain;
    }
    
    
    
    //Crackling
    function Crackling() {
    	var noise = WhiteNoise();
        
        var Lop = audioCtx.createBiquadFilter();
        Lop.type = "lowpass";
        Lop.frequency.value = 1;
        noise.connect(Lop);

    }
    
    
    
    //Lapping
    function Lapping() {
    	var noise = WhiteNoise();
        
        const bp = audioCtx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 30;
        bp.Q.value = 5;
        
        const gain1 = audioCtx.createGain();
        gain1.gain.value = 100;
        
        var Hip1 = audioCtx.createBiquadFilter();
        Hip1.type = "highpass";
        Hip1.frequency.value = 25;
        
        const Clip = new WaveShaperNode(audioCtx);
        var level = new Float32Array(2);
        level[0] = -0.9;
        level[1] = 0.9;
        Clip.curve = level;
        
        var Hip2 = audioCtx.createBiquadFilter();
        Hip2.type = "highpass";
        Hip2.frequency.value = 25;
        
        const gain2 = audioCtx.createGain();
        gain2.gain.value = 0.6;
        
        noise.connect(bp)
        	 .connect(gain1)
        	 .connect(Hip1)
             .connect(Clip)
             .connect(Hip2)
             .connect(gain2)
             .connect(audioCtx.destination);
             
        gainFire = gain2;
    }
    
})
