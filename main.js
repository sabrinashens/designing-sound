var button = document.getElementById("button");
var button2 = document.getElementById("button2");
var btnState = false;
var btnState2 = false;

document.addEventListener("DOMContentLoaded", function (event) {

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    //babbling
    var gainBubble = {};

    //fire
    var gainHiss = {};
    var gainLap = {};
    var gainCrackle1 = {};
    var gainCrackle2 = {};
    
    ////////////////////babbling////////////////////
    button.addEventListener("click", function () {
        if (btnState == false) {
          	var Brown1 = BrownNoise();
            var Brown2 = BrownNoise();
            
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

            Brown1.connect(LPF1).connect(RHPF).connect(RHPFgain).connect(audioCtx.destination);
            Brown2.connect(LPF2).connect(LPF2gain).connect(RHPF.frequency);

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
			onefireGenerator();
            btnState2 = true;
		}
        
        else if (btnState2 == true) {
			gainHiss.gain.linearRampToValueAtTime(gainHiss.gain.value, audioCtx.currentTime);
            gainHiss.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
            
            gainLap.gain.linearRampToValueAtTime(gainLap.gain.value, audioCtx.currentTime);
            gainLap.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
            
            gainCrackle1.gain.cancelScheduledValues(audioCtx.currentTime);
            gainCrackle2.gain.cancelScheduledValues(audioCtx.currentTime);
            
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
        const lopGain = audioCtx.createGain();
        lopGain.gain.value = 10;  

        const gain1 = audioCtx.createGain();
        gain1.gain.value = 0;   
        const gain2 = audioCtx.createGain();
        gain2.gain.value = 0;   
        const makeupGain = audioCtx.createGain();
        makeupGain.gain.value = 600;

        const gain = audioCtx.createGain(); 
        gain.gain.value = 0.01;
        var Hip = audioCtx.createBiquadFilter();
        Hip.type = "highpass";
        Hip.frequency.value = 1000; 
            
        noise.connect(Hip)
        	 .connect(gain)
             .connect(audioCtx.destination);
        noise.connect(Lop)
        	 .connect(lopGain)
             .connect(gain1)
             .connect(gain2)
             .connect(makeupGain)
             .connect(gain);
        
        gainHiss = gain;
    }
    
    
    //Crackling
    function Crackling1() {
    	var noise = WhiteNoise();

		const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
       
        //create a random floating point number btw 0 and 1
        let time = Math.random(); 
   
        //repeating crackles
        for (let i = 0; i < 100; i++) {
            //a tight envelope of 20ms
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime + 4*i + time);
            gain.gain.setTargetAtTime(0.05, audioCtx.currentTime + 4*i + time, 0.02) ;
            gain.gain.setValueAtTime(0, audioCtx.currentTime + 4*i + time + 0.02);
            gain.gain.setTargetAtTime(0, audioCtx.currentTime + 4*i + time + 0.02, 4 - time - 0.02);   
        }
        
        noise.connect(gain);
        gain.connect(audioCtx.destination);
        
        gainCrackle1 = gain;
    }
    

    function Crackling2() {
    	var noise = WhiteNoise();

		const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
       
        //create a random floating point number btw 0 and 1
        let time = Math.random(); 
   
        //repeating crackles
        for (let i = 0; i < 100; i++) {
            
            //a tight envelope of 10ms
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime + 10*i + time);
            gain.gain.setTargetAtTime(0.1, audioCtx.currentTime + 10*i + time, 0.01) ;
            gain.gain.setValueAtTime(0, audioCtx.currentTime + 10*i + time + 0.01);
            gain.gain.setTargetAtTime(0, audioCtx.currentTime + 10*i + time + 0.01, 10 - time - 0.01);   
        }
        
        noise.connect(gain);
        gain.connect(audioCtx.destination);
        
        gainCrackle2 = gain;
    }
    
    
    //Lapping
    function Lapping() {
    	var noise = WhiteNoise();
        
        const bp = audioCtx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 30;
        bp.Q.value = 5; 
        
        const bpGain = audioCtx.createGain();
        bpGain.gain.value = 100; 
        
        var Hip1 = audioCtx.createBiquadFilter();
        Hip1.type = "highpass";
        Hip1.frequency.value = 25;
        
        //distortion is introduced here
        const Clip = audioCtx.createWaveShaper();
        var distortion = new Float32Array(2);
        distortion[0] = -0.9;
        distortion[1] = 0.9;
        Clip.curve = distortion;
        
        var Hip2 = audioCtx.createBiquadFilter();
        Hip2.type = "highpass";
        Hip2.frequency.value = 25;
        
        const gain = audioCtx.createGain();
        gain.gain.value = 0.08;
        
        noise.connect(bp)
        	 .connect(bpGain)
        	 .connect(Hip1)
             .connect(Clip)
             .connect(Hip2)
             .connect(gain)
             .connect(audioCtx.destination);
             
        gainLap = gain;
    }
    
    function onefireGenerator() {
         Hissing();
         Lapping();
         Crackling1();
         Crackling2();
    }
    
})