

// ambient();
// scoredAmbient();
// song();
// interactive();
// physics();
piano();


////////////
// sounds
////////////

/*
  tone types:
  "sine",
  "square",
  "sawtooth",
  "triangle",
  "custom"
*/



function interactive() {
    var types = ["sine", "square", "sawtooth", "triangle"];
    var typeLabel = document.createElement("h3");
    typeLabel.textContent = "type: " + tones.type;
    document.body.appendChild(typeLabel);

    var typeSlider = document.createElement("input");
    typeSlider.type = "range";
    typeSlider.min = 0;
    typeSlider.max = 3;
    typeSlider.value = types.indexOf(tones.type);
    typeSlider.style.width = "500px";
    typeSlider.addEventListener("input", function() {
        tones.type = types[typeSlider.value];
        typeLabel.textContent = "type: " + tones.type;
    })
    document.body.appendChild(typeSlider);

    var attackLabel = document.createElement("h3");
    attackLabel.textContent = "attack: " + tones.attack;
    document.body.appendChild(attackLabel);

    var attackSlider = document.createElement("input");
    attackSlider.type = "range";
    attackSlider.min = 1;
    attackSlider.max = 300;
    attackSlider.value = tones.attack;
    attackSlider.style.width = "500px";
    attackSlider.addEventListener("input", function() {
        tones.attack = attackSlider.value;
        attackLabel.textContent = "attack: " + tones.attack;
    })
    document.body.appendChild(attackSlider);

    var releaseLabel = document.createElement("h3");
    releaseLabel.textContent = "release: " + tones.release;
    document.body.appendChild(releaseLabel);

    var releaseSlider = document.createElement("input");
    releaseSlider.type = "range";
    releaseSlider.min = 1;
    releaseSlider.max = 300;
    releaseSlider.value = tones.release;
    releaseSlider.style.width = "500px";
    releaseSlider.addEventListener("input", function() {
        tones.release = releaseSlider.value;
        releaseLabel.textContent = "release: " + tones.release;
    })
    document.body.appendChild(releaseSlider);

    ambient();
}


function ambient() {

    var timing = 250;
    var notes = [ "C#", "D#", "F#", "D#"];
    var prevTime = tones.getTimeMS();
    var elapsed = 0;

    play();


    function play() {
        var now = tones.getTimeMS();
        elapsed += now - prevTime;
        if(elapsed > timing) {
            while(elapsed > timing) elapsed -= timing;
            var note = notes[Math.floor(Math.random() * notes.length)];
            var octave = Math.floor(Math.random() * 10);
            tones.play(note, octave);
        }
        prevTime = now;
        requestAnimationFrame(play);
    }

}


function scoredAmbient() {
    tones.type = "triangle";
    tones.release = 300;

    var timing = 250;
    var notes = [ "C#", "D#", "F#", "D#"];

    score = [];
    for(var i = 0; i < 16; i++) {
        var note = notes[Math.floor(Math.random() * notes.length)];
        var octave = Math.floor(Math.random() * 10);
        console.log(i, ":", note, octave);
        score.push({
            note: note,
            octave: octave
        });
    }
    var index = 0;



    var prevTime = tones.getTimeMS();
    var elapsed = 0
    play();



    function play() {
        var now = tones.getTimeMS();
        elapsed += now - prevTime;
        if(elapsed > timing) {
            elapsed -= timing;
            var t = score[index];
            tones.play(t.note, t.octave);
            index++;
            index %= score.length;
        }
        prevTime = now;
        requestAnimationFrame(play);

    }

}

function song() {
    tones.type = "square";
    tones.attack = 20;
    tones.release = 200;

    var notes = "ccggaag-ffeeddc-ggffeed-ggffeed-ccggaag-ffeeddc-----",
        timing = 300,
        index = 0;

    var prevTime = tones.getTimeMS();
    var elapsed = 0
    play();



    function play() {
        var now = tones.getTimeMS();
        elapsed += now - prevTime;
        if(elapsed > timing) {
            elapsed -= timing;
            var note = notes.charAt(index);
            if(note !== "-") {
                tones.play(note);
            }
            index++;
            index %= notes.length;
        }
        prevTime = now;
        requestAnimationFrame(play);

    }
}

function physics() {
    var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    canvas.style.display = "block";
    document.body.style.margin = 0;
    document.body.appendChild(canvas);


    var balls = [],
        num = 8,
        gravity = 0.5;

    for(var i = 0; i < num; i++) {
        var size = Math.random();
        balls.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.random() * 10 - 5,
            vy: Math.random() * 10 - 5,
            radius: 10 + size * 50,
            freq: 350 - size * 300
        })
    }

    play();

    function play() {
        context.clearRect(0, 0, width, height);
        for(var i = 0; i < num; i++) {
            var ball = balls[i];
            ball.x += ball.vx;
            ball.y += ball.vy;
            if(ball.x + ball.radius > width) {
                ball.x = width - ball.radius;
                ball.vx *= -1;
                tones.play(ball.freq);
            }
            else if(ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx *= -1;
                tones.play(ball.freq);
            }
            if(ball.y + ball.radius > height) {
                ball.y = height - ball.radius;
                ball.vy *= -1;
                if(Math.abs(ball.vy) > 2) 
                    tones.play(ball.freq);
            }
            else if(ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.vy *= -1;
                tones.play(ball.freq);
            }
            ball.vy += gravity;
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
            context.fill();
        }



        requestAnimationFrame(play);
    }
}

pianono = (real, imag) => {
    tones.attack = 0;
    tones.release = 300;
    tones.type = "sawtooth";

    var wave = ac.createPeriodicWave(real, imag);

    // var real = new Float32Array(127);
    // var imag = new Float32Array(127);
    // var ac = new AudioContext();
    // var osc = ac.createOscillator();

    // real[0] = 4.728776454925537;
    // imag[0] = 0;
    // real[1] = -2.7134130001068115;
    // imag[1] = 0.8876177072525024;
    // real[2] = 0.7725372910499573;
    // imag[2] = 0.4630410671234131;
    // real[3] = -0.11285589635372162;
    // imag[3] = -0.6005726456642151;
    // real[4] = -0.3976425230503082;
    // imag[4] = 0.21254433691501617;
    // real[5] = 0.2589355707168579;
    // imag[5] = 0.19315128028392792;
    // real[6] = 0.014778830111026764;
    // imag[6] = -0.30083009600639343;
    // real[7] = -0.2545270323753357;
    // imag[7] = 0.11622590571641922;
    // real[8] = 0.18835434317588806;
    // imag[8] = 0.12585435807704926;
    // real[9] = 0.00045395514462143183;
    // imag[9] = -0.20116008818149567;
    // real[10] = -0.16442106664180756;
    // imag[10] = 0.07776538282632828;
    // real[11] = 0.12576612830162048;
    // imag[11] = 0.09541113674640656;
    // real[12] = 0.014922546222805977;
    // imag[12] = -0.15151114761829376;
    // real[13] = -0.13581959903240204;
    // imag[13] = 0.05709386616945267;
    // real[14] = 0.10536706447601318;
    // imag[14] = 0.07814553380012512;
    // real[15] = 0.00970040075480938;
    // imag[15] = -0.1218739002943039;
    // real[16] = -0.10669417679309845;
    // imag[16] = 0.04419417306780815;
    // real[17] = 0.08176930993795395;
    // imag[17] = 0.06709495931863785;
    // real[18] = 0.015166772529482841;
    // imag[18] = -0.10224609076976776;
    // real[19] = -0.09512370079755783;
    // imag[19] = 0.035375580191612244;
    // real[20] = 0.07247092574834824;
    // imag[20] = 0.059475354850292206;
    // real[21] = 0.012486455962061882;
    // imag[21] = -0.08834183216094971;
    // real[22] = -0.08093861490488052;
    // imag[22] = 0.028960300609469414;
    // real[23] = 0.06013764441013336;
    // imag[23] = 0.053956177085638046;
    // real[24] = 0.015518988482654095;
    // imag[24] = -0.07801889628171921;
    // real[25] = -0.07496041804552078;
    // imag[25] = 0.024075578898191452;
    // real[26] = 0;
    // imag[26] = 0;
    // real[27] = 0;
    // imag[27] = 0;
    // real[28] = 0;
    // imag[28] = 0;
    // real[29] = 0;
    // imag[29] = 0;
    // real[30] = 0;
    // imag[30] = 0;
    // real[31] = 0;
    // imag[31] = 0;
    // real[32] = 0;
    // imag[32] = 0;
    // real[33] = 0;
    // imag[33] = 0;
    // real[34] = 0;
    // imag[34] = 0;
    // real[35] = 0;
    // imag[35] = 0;
    // real[36] = 0;
    // imag[36] = 0;
    // real[37] = 0;
    // imag[37] = 0;
    // real[38] = 0;
    // imag[38] = 0;
    // real[39] = 0;
    // imag[39] = 0;
    // real[40] = 0;
    // imag[40] = 0;
    // real[41] = 0;
    // imag[41] = 0;
    // real[42] = 0;
    // imag[42] = 0;
    // real[43] = 0;
    // imag[43] = 0;
    // real[44] = 0;
    // imag[44] = 0;
    // real[45] = 0;
    // imag[45] = 0;
    // real[46] = 0;
    // imag[46] = 0;
    // real[47] = 0;
    // imag[47] = 0;
    // real[48] = 0;
    // imag[48] = 0;
    // real[49] = 0;
    // imag[49] = 0;
    // real[50] = 0;
    // imag[50] = 0;
    // real[51] = 0;
    // imag[51] = 0;
    // real[52] = 0;
    // imag[52] = 0;
    // real[53] = 0;
    // imag[53] = 0;
    // real[54] = 0;
    // imag[54] = 0;
    // real[55] = 0;
    // imag[55] = 0;
    // real[56] = 0;
    // imag[56] = 0;
    // real[57] = 0;
    // imag[57] = 0;
    // real[58] = 0;
    // imag[58] = 0;
    // real[59] = 0;
    // imag[59] = 0;
    // real[60] = 0;
    // imag[60] = 0;
    // real[61] = 0;
    // imag[61] = 0;
    // real[62] = 0;
    // imag[62] = 0;
    // real[63] = 0;
    // imag[63] = 0;
    // real[64] = 0;
    // imag[64] = 0;
    // real[65] = 0;
    // imag[65] = 0;
    // real[66] = 0;
    // imag[66] = 0;
    // real[67] = 0;
    // imag[67] = 0;
    // real[68] = 0;
    // imag[68] = 0;
    // real[69] = 0;
    // imag[69] = 0;
    // real[70] = 0;
    // imag[70] = 0;
    // real[71] = 0;
    // imag[71] = 0;
    // real[72] = 0;
    // imag[72] = 0;
    // real[73] = 0;
    // imag[73] = 0;
    // real[74] = 0;
    // imag[74] = 0;
    // real[75] = 0;
    // imag[75] = 0;
    // real[76] = 0;
    // imag[76] = 0;
    // real[77] = 0;
    // imag[77] = 0;
    // real[78] = 0;
    // imag[78] = 0;
    // real[79] = 0;
    // imag[79] = 0;
    // real[80] = 0;
    // imag[80] = 0;
    // real[81] = 0;
    // imag[81] = 0;
    // real[82] = 0;
    // imag[82] = 0;
    // real[83] = 0;
    // imag[83] = 0;
    // real[84] = 0;
    // imag[84] = 0;
    // real[85] = 0;
    // imag[85] = 0;
    // real[86] = 0;
    // imag[86] = 0;
    // real[87] = 0;
    // imag[87] = 0;
    // real[88] = 0;
    // imag[88] = 0;
    // real[89] = 0;
    // imag[89] = 0;
    // real[90] = 0;
    // imag[90] = 0;
    // real[91] = 0;
    // imag[91] = 0;
    // real[92] = 0;
    // imag[92] = 0;
    // real[93] = 0;
    // imag[93] = 0;
    // real[94] = 0;
    // imag[94] = 0;
    // real[95] = 0;
    // imag[95] = 0;
    // real[96] = 0;
    // imag[96] = 0;
    // real[97] = 0;
    // imag[97] = 0;
    // real[98] = 0;
    // imag[98] = 0;
    // real[99] = 0;
    // imag[99] = 0;
    // real[100] = 0;
    // imag[100] = 0;
    // real[101] = 0;
    // imag[101] = 0;
    // real[102] = 0;
    // imag[102] = 0;
    // real[103] = -0.07496041804552078;
    // imag[103] = -0.024075578898191452;
    // real[104] = 0.015518988482654095;
    // imag[104] = 0.07801889628171921;
    // real[105] = 0.06013764441013336;
    // imag[105] = -0.053956177085638046;
    // real[106] = -0.08093861490488052;
    // imag[106] = -0.028960300609469414;
    // real[107] = 0.012486455962061882;
    // imag[107] = 0.08834183216094971;
    // real[108] = 0.07247092574834824;
    // imag[108] = -0.059475354850292206;
    // real[109] = -0.09512370079755783;
    // imag[109] = -0.035375580191612244;
    // real[110] = 0.015166772529482841;
    // imag[110] = 0.10224609076976776;
    // real[111] = 0.08176930993795395;
    // imag[111] = -0.06709495931863785;
    // real[112] = -0.10669417679309845;
    // imag[112] = -0.04419417306780815;
    // real[113] = 0.00970040075480938;
    // imag[113] = 0.1218739002943039;
    // real[114] = 0.10536706447601318;
    // imag[114] = -0.07814553380012512;
    // real[115] = -0.13581959903240204;
    // imag[115] = -0.05709386616945267;
    // real[116] = 0.014922546222805977;
    // imag[116] = 0.15151114761829376;
    // real[117] = 0.12576612830162048;
    // imag[117] = -0.09541113674640656;
    // real[118] = -0.16442106664180756;
    // imag[118] = -0.07776538282632828;
    // real[119] = 0.00045395514462143183;
    // imag[119] = 0.20116008818149567;
    // real[120] = 0.18835434317588806;
    // imag[120] = -0.12585435807704926;
    // real[121] = -0.2545270323753357;
    // imag[121] = -0.11622590571641922;
    // real[122] = 0.014778830111026764;
    // imag[122] = 0.30083009600639343;
    // real[123] = 0.2589355707168579;
    // imag[123] = -0.19315128028392792;
    // real[124] = -0.3976425230503082;
    // imag[124] = -0.21254433691501617;
    // real[125] = -0.11285589635372162;
    // imag[125] = 0.6005726456642151;
    // real[126] = 0.7725372910499573;
    // imag[126] = -0.4630410671234131;
    // real[127] = -2.7134130001068115;
    // imag[127] = -0.8876177072525024;


    tones.wave = wave;
    // white
    var notes = ["c", "d", "e", "f", "g", "a", "b"];
    for(var i = 0; i < 7; i++) {
        makeKey(800 + i * 100, 100, 100, 500, "white", notes[i]);
    }
    // black
    makeKey(870, 100, 60, 275, "black", "c#");
    makeKey(970, 100, 60, 275, "black", "d#");
    makeKey(1170, 100, 60, 275, "black", "f#");
    makeKey(1270, 100, 60, 275, "black", "g#");
    makeKey(1370, 100, 60, 275, "black", "a#");


    function makeKey(x, y, width, height, color, note) {
        var key = document.createElement("div");
        key.style.width = width + "px";
        key.style.height = height + "px";
        key.style.position = "absolute";
        key.style.left = x + "px";
        key.style.top = y + "px";
        key.style.backgroundColor = color;
        key.style.border = "solid 1px black";
        key.note = note;
        key.addEventListener("mousedown", function(event) {
            tones.play(event.target.note);
        });
        document.body.appendChild(key);

    }
}
