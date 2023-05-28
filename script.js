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
  
      draw();
      requestAnimationFrame(update);
    }
  
    function animate() {
      canvas.width = canvasSize;
      canvas.height = canvasSize;
  
      draw();
      requestAnimationFrame(animate);
    }
  
    function playAudio() {
      const audio = new Audio('cancion.mp3');
      audio.loop = true;
      audio.play();
    }
  
    function stopAudio() {
      const audio = document.querySelector('audio');
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
      draw();
    }
  
    function updatePointCounter() {
      const pointCounter = document.getElementById('point-counter');
      pointCounter.textContent = `Puntos en pantalla: ${points.length}`;
    }
  
    const playButton = document.getElementById('play-button');
    const audio = new Audio('cancion.mp3');
    audio.loop = true;
  
    playButton.addEventListener('click', function() {
      if (audio.paused) {
        audio.play();
        playButton.textContent = 'Pause';
      } else {
        audio.pause();
        playButton.textContent = 'Play';
      }
    });
  
    setInterval(generatePoint, 500);
    setInterval(removePoint, 5000);
    startAnimation();
  });