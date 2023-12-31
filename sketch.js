var song
var fft
var img
var particles = []

function preload() {
    song = loadSound('music.mp3')
    img =  loadImage('background.jpeg')
}
//Setup function
function setup() {
    //Creates the Canas of the sketch
    createCanvas(windowWidth, windowHeight)
    angleMode(DEGREES)
    imageMode(CENTER)
    rectMode(CENTER)
    fft = new p5.FFT(0.3)

    img.filter(BLUR, 12)

    // image(img, 0, 0);

    noLoop()
}

//The draw function is looping to make the animation
function draw() {
    background(0)

    if (mouseIsPressed && touches.length == 0) {
        handlePlayPause();
    }

    translate(width / 2, height / 2)

    fft.analyze()
    amp = fft.getEnergy(20, 210)

    push()
    if(amp > 210) {
        rotate(random(-0.6, 0.6))
    }
    image(img, 0, 0, width + 100 , height + 100)
    pop()

    var alpha = map(amp, 0, 255, 50, 50)
    fill(0, alpha)
    noStroke()
    rect(0, 0, width, height)

    stroke(225)
    strokeWeight(3)
    noFill()

    var wave = fft.waveform()

    for (var t = -1; t<= 1; t+=2){
    beginShape()
    for (var i = 0; i <= 180; i++) {
        var index = floor(map(i, 0, width, 0, wave.length - 1))

        var r = map(wave[index], -1, 1, 150, 350)

        var x = r * sin(i) * t
        var y = r * cos(i)
        vertex(x, y)
    }
    endShape()
}

var p = new Particle()
particles.push(p)

for (var i = particles.length - 1 ; i >= 0; i--) {
    if (!particles[i].edges()){
    particles[i].update(amp > 210)
    particles[i].show()
} else {
    particles.splice(i, 1)
}
}
}

function mouseClicked() {
    if (song.isPlaying()) {
        song.pause()
        noLoop()
    } else {
        song.play()
        loop()
    }
}

// function touchStarted() {
//     if (song.isPlaying()) {
//         song.pause();
//         noLoop();
//     } else {
//         song.play();
//         loop();
//     }
//     // prevent default
//     return false;
// }

function touchStarted() {
    if (touches.length > 0) {
        handlePlayPause();
    }
    return false
}

function handlePlayPause() {
    if (song.isPlaying()) {
        song.pause();
        noLoop();
    } else {
        song.play();
        loop();
    }
}


class Particle {
    constructor() {
        this.pos = p5.Vector.random2D().mult(250)
        this.vel = createVector(0, 0)
        this.acc = this.pos.copy().mult(random(0.0001, 0.0001))

        this.w = random(3, 5)
    }
    update(cond) {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        if (cond) {
            this.pos.add(this.vel)
            this.pos.add(this.vel)
            this.pos.add(this.vel)

        }
    }
    edges() {
        if (this.pos.x < -width / 2 || this.pos.x > width / 2 ||
        this.pos.y < -height / 2 || this.pos.y > width /  2) {
            return true
        } else return false
    }
    show() {
        noStroke()
        fill(255)
        ellipse(this.pos.x, this.pos.y, this.w)
    }
}