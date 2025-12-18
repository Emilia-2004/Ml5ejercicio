let isOn = false;

let handPose;
let video;
let hands = [];

let canciones = {};
let cancionActual = null;

function preload() {
  handPose = ml5.handPose();

  canciones.indice   = loadSound("canciones/indice.mp3");
  canciones.pulgar   = loadSound("canciones/pulgar.mp3");
  canciones.medio    = loadSound("canciones/medio.mp3");
  canciones.anular   = loadSound("canciones/anular.mp3");
  canciones.menique  = loadSound("canciones/menique.mp3");
}

function setup() {
  createCanvas(640, 480);
  userStartAudio(); 

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);
}

function dedoArriba(tip, base) {
  return tip.y < base.y;
}

function draw() {
  image(video, 0, 0, width, height);

  if (hands.length > 0) {
    let mano = hands[0];

    let dedos = [
      { nombre: "indice",  tip: mano.index_finger_tip,  base: mano.index_finger_mcp },
      { nombre: "pulgar",  tip: mano.thumb_tip,         base: mano.thumb_mcp },
      { nombre: "medio",   tip: mano.middle_finger_tip, base: mano.middle_finger_mcp },
      { nombre: "anular",  tip: mano.ring_finger_tip,   base: mano.ring_finger_mcp },
      { nombre: "menique", tip: mano.pinky_tip,         base: mano.pinky_mcp }
    ];

    let dedoDetectado = null;
    let yMasAlta = height;

    // Detecta el dedo más levantado
    for (let d of dedos) {
      if (dedoArriba(d.tip, d.base) && d.tip.y < yMasAlta) {
        yMasAlta = d.tip.y;
        dedoDetectado = d.nombre;
      }
    }

    // 🎵 Reproducir canción
    if (dedoDetectado) {
      let nuevaCancion = canciones[dedoDetectado];

      if (cancionActual !== nuevaCancion) {
        if (cancionActual) cancionActual.stop();
        cancionActual = nuevaCancion;
        cancionActual.loop();
        isOn = true;
      }
    }

  } else {
    // ✋ Sin mano → parar música
    if (isOn && cancionActual) {
      cancionActual.stop();
      cancionActual = null;
      isOn = false;
    }
  }
}

function gotHands(results) {
  hands = results;
}