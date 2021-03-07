const WIDTH = 740, HEIGHT = 740;
const n = 20;
const alphas = new Array(n).fill(1);
const rMax = 600, rMin = 0.5*(rMax/n);
let cs;
const activeNotes = new Set();
function setup() { 
  createCanvas(WIDTH, HEIGHT);

	  WebMidi.enable(function (err) { //check if WebMidi.js is enabled

    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");
    }

    inputSoftware = WebMidi.inputs[0];
    inputSoftware.addListener('noteon', "all",
      function (e) {
        //Show what we are receiving
        console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ") "+ e.note.number +".");
        const note = (e.note.number - 36)%n;
        activeNotes.add(note);
        alphas[note] = 1;
      }
    );
    inputSoftware.addListener('noteoff', "all",
  	function (e) {
      console.log("Received 'noteoff' message (" + e.note.name + e.note.octave + ") "+ e.note.number +".");
      activeNotes.delete((e.note.number - 36)%n);

  	}
  );
	});
  // cs = rangeColors(color('#E7C85A'), color('#E95959'), n);
  // cs = rangeMoarColors([color('#E7C85A'), color('#E95959'), color('#75D278')], n);
  cs = rangeMoarColors(
    ['#fff100', '#ff8c00', '#e81123', '#ec008c', '#68217a', '#00188f', '#00bcf2', '#00b294', '#009e49', '#bad80a'].map(x => color(x))
    , n);
} 

function rangeColors(c1, c2, n){
  const cs = [];

  for (let i = 0; i < n; i++){
    
    const r = int(red(c1) * (i / n) + red(c2) * ((n-i)/n));
    const g = int(green(c1) * (i / n) + green(c2) * ((n-i)/n));
    const b = int(blue(c1) * (i / n) + blue(c2) * ((n-i)/n));

    cs.push(color(r,g,b));
  }
  return cs;
}

function rangeMoarColors(c, n){
  const cs = [];

  for (let i = 0; i < n; i++){
    const x = ((c.length-1) / n) * i;
    const c1 = c[int(x)], c2 = c[int(x) + 1];

    const f = x - int(x);

    const r = int(red(c1) * (1-f) + red(c2) * f);
    const g = int(green(c1) * (1-f) + green(c2) * f);
    const b = int(blue(c1) * (1-f) + blue(c2) * f);

    cs.push(color(r,g,b));
  }
  return cs;
}

let t = 0;

function draw() { 
  clear();
  background('#000000');
  noStroke();

  translate(WIDTH/2, HEIGHT/2);

  for (let i = 0; i < n; i++){
    let r = rMin + (rMax - rMin) * ((n-i)/n);
    // fill(cs[(i + t) % n]);
    const col = cs[(i + t) % n];
    if (activeNotes.has(i))
      r *= 1.1;

    for (let th = 0; th < TWO_PI; th += PI /16){
      push()
      rotate(th);
      translate(0, r);
      fill(`rgba(${red(col)},${green(col)},${blue(col)}, ${max(0, alphas[i])})`);
      circle(0, 0, 20);
  
      pop();
    }

    alphas[i] -= 0.01;
  }

  t += 1;
}