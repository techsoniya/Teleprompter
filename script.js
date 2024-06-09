document.addEventListener('DOMContentLoaded', () => {
    const videoFeed = document.getElementById('videoFeed');
    const scrollText = document.getElementById('scrollText');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const speedRange = document.getElementById('speedRange');
    const recordButton = document.getElementById('recordButton');

    let scrolling;
    let speed = 5;
    let recorder;
    let chunks = [];

    startButton.addEventListener('click', startScrolling);
    stopButton.addEventListener('click', stopScrolling);
    speedRange.addEventListener('input', updateSpeed);
    recordButton.addEventListener('click', toggleRecording);

    // Function to start scrolling the text
    function startScrolling() {
        scrollText.textContent = 'Your teleprompter text here';
        scrolling = setInterval(() => {
            scrollText.style.transform = `translateY(-${speed}px)`;
        }, 100);
    }

    // Function to stop scrolling the text
    function stopScrolling() {
        clearInterval(scrolling);
        scrollText.textContent = '';
        scrollText.style.transform = 'translateY(0)';
    }

    // Function to update the scrolling speed
    function updateSpeed() {
        speed = parseInt(speedRange.value);
    }

    // Function to start/stop recording
    function toggleRecording() {
        if (!recorder) {
            startRecording();
        } else {
            stopRecording();
        }
    }

    // Function to start video recording
    function startRecording() {
        chunks = [];
        recorder = new MediaRecorder(videoFeed.srcObject);
        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'teleprompter_video.webm';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        };
        recorder.start();
    }

    // Function to stop video recording
    function stopRecording() {
        if (recorder.state === 'recording') {
            recorder.stop();
            recorder = null;
        }
    }

    // Access the camera and start the video feed
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            videoFeed.srcObject = stream;
        })
        .catch((error) => {
            console.error('Error accessing the camera:', error);
        });
});
