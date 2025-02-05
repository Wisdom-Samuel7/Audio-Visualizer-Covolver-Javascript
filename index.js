const audioFile = document.getElementById("audioFile");
const canvas = document.getElementById("visualizer");
const canvasCtx = canvas.getContext("2d");

let audioContext;
let audioSource;
let analyser;

// Handle audio file input
audioFile.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    playAudio(fileURL);
  }
});

// Play the audio and set up the visualizer
function playAudio(audioURL) {
  if (audioContext) {
    audioContext.close(); // Close previous audio context if any
  }

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audio = new Audio(audioURL);
  audioSource = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();

  // Connect nodes
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);

  // Configure the analyser
  analyser.fftSize = 256; // Number of frequency bins (higher = more detail)
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Start audio playback
  audio.play();

  // Visualize the audio
  function draw() {
    requestAnimationFrame(draw);

    // Get the frequency data
    analyser.getByteFrequencyData(dataArray);

    // Clear the canvas
    canvasCtx.fillStyle = "#000";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bars
    const barWidth = (canvas.width / bufferLength) * 1.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      const color = `rgb(${barHeight + 100}, ${50 + i * 2}, ${200 - i * 2})`;

      canvasCtx.fillStyle = color;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  draw();
}
