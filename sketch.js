let canciones = [];
let cancionActual = null;
let isOn= false;

let handPose;
let video;
let hands = [];

// Controla la variable y posicion del circulo
let pinch = 0;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose(); // Carga el modelo Hand pose, se puede cambiar por otros modelos de ml
  canciones.push(loadSound("canciones/indice.mp3"));
  canciones.push(loadSound("canciones/pulgar.mp3"));
  canciones.push(loadSound("canciones/medio.mp3"));
  canciones.push(loadSound("canciones/anular.mp3"));
  canciones.push(loadSound("canciones/menique.mp3"));
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
  userStartAudio();
  
}



function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // If there is at least one hand, se ejecuta cuando hay una mano en escena
  if (hands.length > 0) {
    if(!isOn){
    let indiceRandom = floor(random(canciones.length));
    cancionActual = canciones[indiceRandom];
    cancionActual.loop();
    isOn= true;
      
      
      }
    
    // Find the index finger tip and thumb tip
    let finger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;

    // Draw circles at finger positions, dibuuja el circulo
    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;
    // Calculate the pinch "distance" between finger and thumb
    let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);//es la distancia entre dos puntos (entre los dedos)

    // This circle's size is controlled by a "pinch" gesture
    fill(0, 255, 0, 200);
    stroke(0);
    strokeWeight(2);
    circle(centerX, centerY, pinch/2);//distancia entre la pelota y los dedos
    
    //Controlar el volumen
    let volumen= map(pinch, 20, 200, 0, 1);
    volumen = constrain(volumen, 0, 1);
    cancionActual.setVolume(volumen);
    
    
  }else{
    if(isOn){
      cancionActual.stop();
    cancionActual = null;
      isOn= false;
    }
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}
