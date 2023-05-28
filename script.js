document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('plexus-canvas');
  const ctx = canvas.getContext('2d');
  const points = [];
  const lines = [];

  let canvasSize = 700;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  canvas.classList.add('plexus');

  const maxPoints = 30;
  const minRemainingPoints = 1;

  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 2 - 1;
      this.connections = [];
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x <= 0 || this.x >= canvas.width) {
        this.vx *= -1;
      }

      if (this.y <= 0 || this.y >= canvas.height) {
        this.vy *= -1;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#000000';
      ctx.fill();
    }
  }

  class Line {
    constructor(start, end) {
      this.start = start;
      this.end = end;
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.start.x, this.start.y);
      ctx.lineTo(this.end.x, this.end.y);
      ctx.strokeStyle = '#00ff00';
      ctx.stroke();
    }
  }








  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function generatePoint() {
    if (points.length < maxPoints) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const point = new Point(x, y);
      points.push(point);

      for (let i = 0; i < points.length - 1; i++) {
        const line = new Line(points[i], point);
        lines.push(line);
        points[i].connections.push(point);
      }
    }

    updatePointCounter();
  }

  function removePoint() {
    if (points.length > minRemainingPoints) {
      const removeCount = Math.floor(Math.random() * (maxPoints - minRemainingPoints)) + 1;

      for (let i = 0; i < removeCount; i++) {
        const pointIndex = Math.floor(Math.random() * points.length);
        const point = points[pointIndex];

        // Eliminar líneas conectadas al punto
        for (let j = lines.length - 1; j >= 0; j--) {
          const line = lines[j];
          if (line.start === point || line.end === point) {
            lines.splice(j, 1);
          }
        }

        points.splice(pointIndex, 1);

        // Eliminar referencias a este punto en las conexiones de otros puntos
        points.forEach((p) => {
          p.connections = p.connections.filter((c) => c !== point);
        });
      }
    }

    updatePointCounter();
  }

  function draw() {
    clearCanvas();

    points.forEach((point) => {
      point.draw();
    });

    lines.forEach((line) => {
      line.draw();
    });
  }

  function update() {
    points.forEach((point) => {
      point.update();
    });

    //draw();///////////////pppppppppppp
    syncLyrics(audio.currentTime); // Llama a syncLyrics() con el tiempo actual de reproducción del audio
    requestAnimationFrame(update);
    updateLyrics();


  }














/////////////////////////////
let audio = null; // Variable global para almacenar el objeto de audio

function animate() {
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  draw();
  requestAnimationFrame(animate);
}

function playAudio() {
  if (!audio) { // Verificar si el audio no existe
    audio = new Audio('cancion.mp3'); // Crear y asignar el objeto de audio a la variable global
  }
  audio.loop = true;
  audio.play();
}

function stopAudio() {
  audio.pause();
}

function startAnimation() {
  playAudio();
  animate();
  update();
}

function stopAnimation() {
  stopAudio();
  points.length = 0;
  lines.length = 0;
  clearCanvas();
  updatePointCounter();
}

function updatePointCounter() {
  const pointCounter = document.getElementById('point-counter');
  pointCounter.textContent = `Puntos en pantalla: ${points.length}`;
}

const lyricsSpan = document.getElementById('lyrics-span');///agregadoo
/////////////////////
const lyrics = [
  { time: '00:06', line: ' I´m Mr. King Dice, I´m the gamest in the land' },
  { time: '00:12', line: 'I never play nice, I´m the Devil´s right hand man' },
  { time: '00:18', line: 'I can´t let you pass ´cause you ain´t done everything' },
  { time: '00:23', line: 'Bring me those contracts, come on, bring ´em to the king' },
  { time: '00:29', line: 'If you haven´t finished your task, haven´t worked assiduously' },
  { time: '00:35', line: 'No, I cannot let you pass, don´t you mess with me' },
  { time: '00:41', line: 'Don´t mess with King Dice (Don´t mess with King Dice)' },
  { time: '00:43', line: 'Don´t mess with me (Don´t mess with him)' },
  { time: '00:46', line: 'Don´t mess with King Dice (Don´t mess with King Dice)' },
  { time: '00:49', line: 'Don´t mess with me!' },
  { time: '00:57', line: 'I´m Mr. King Dice, heed just what I say' },
  { time: '01:03', line: 'The Devil has his price and I´ll make sure you pay' },
  { time: '01:09', line: 'I don´t have time to mess ´round and I hope you will agree' },
  { time: '01:14', line: 'Bring me those contracts, pronto, don´t you mess with me' },
  { time: '01:20', line: 'Don´t mess with King Dice (Don´t mess with King Dice)' },
  { time: '01:23', line: 'Don´t mess with me (Don´t mess with him)' },
  { time: '01:26', line: 'Don´t mess with King Dice (Don´t mess with King Dice)' },
  { time: '01:28', line: 'Don´t mess with me!' },
  // Agrega el resto de las líneas con sus tiempos correspondientes
];













let currentLine = 0;

function updateLyrics() {
  const currentTime = audio.currentTime;
  for (let i = 0; i < lyrics.length; i++) {
    if (
      currentTime >= convertTimeToSeconds(lyrics[i].time) &&
      currentTime < convertTimeToSeconds(lyrics[i + 1].time)
    ) {
      lyricsSpan.textContent = lyrics[i].line;
      break;
    }
  }
}


function convertTimeToSeconds(time) {
  const parts = time.split(':');
  const minutes = parseInt(parts[0]);
  const seconds = parseInt(parts[1]);
  return minutes * 60 + seconds;
}
function syncLyrics(currentTime) {
  const currentLineTime = lyrics[currentLine].time;
  if (currentTime >= currentLineTime && currentLine < lyrics.length - 1) {
    currentLine++;
    updateLyrics();
  }
}
//////////////////////

const playButton = document.getElementById('play-button');

playButton.addEventListener('click', function() {
  if (!audio) { // Verificar si el audio no existe
    playAudio(); // Crear y reproducir el objeto de audio
    playButton.textContent = 'Pause';
    startAnimation();
  } else if (audio.paused) { // Verificar si el audio está pausado
    audio.play(); // Reproducir el objeto de audio existente
    playButton.textContent = 'Pause';
    startAnimation();
  } else {
    audio.pause(); // Pausar el objeto de audio existente
    playButton.textContent = 'Play';
    stopAnimation();
  }
});

///////////////////////



////////////////////////

// Obtener la referencia al cuerpo del documento
var body = document.querySelector('body');

// Escuchar el evento de clic en el cuerpo del documento
body.addEventListener('click', function(event) {
// Crear un elemento div para representar la chispa
var spark = document.createElement('div');

// Asignar la clase 'spark' al elemento
spark.className = 'spark';

// Establecer la posición de la chispa en el lugar donde se hizo clic
spark.style.top = event.clientY + 'px';
spark.style.left = event.clientX + 'px';

// Agregar la chispa al cuerpo del documento
body.appendChild(spark);

// Eliminar la chispa después de un tiempo para que desaparezca
setTimeout(function() {
  spark.remove();
}, 1000);
});


  setInterval(generatePoint, 500);
  setInterval(removePoint, 5000);
  //startAnimation();
});