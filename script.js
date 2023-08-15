const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [
  "asdasdf",
  "asdfsdaf",
  "asdfasdf",
  "asdfsadf",
  "sadfsdf",
];

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "./images/bot.jpg";
const PERSON_IMG = "./images/user.jpeg";
const BOT_NAME = "BOT";
const PERSON_NAME = "Abhishek";

msgerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  botResponse();
});

x = {
  aInternal: 10,
  aListener: function (val) {},
  set a(val) {
    this.aInternal = val;
    this.aListener(val);
  },
  get a() {
    return this.aInternal;
  },
  registerListener: function (listener) {
    this.aListener = listener;
  },
};

function appendMessage(name, img, side, text) {
  var id = new Date().getTime();
  if (side.localeCompare("left") == 0) {
    x.a = id;
  }
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>
        <div class="msg-text">${text}</div>

        <div id=${id}>
        </div>

      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}
function botResponse() {
  const r = random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  const delay = msgText.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  }, delay);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  x.registerListener(async function (val) {
    const om = new Map();
    om["happy"] = 0;
    om["sad"] = 0;
    om["angry"] = 0;
    om["fearful"] = 0;
    om["disgusted"] = 0;
    om["surprised"] = 0;
    for (let i = 0; i < 20; i++) {
      try {
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
        const m = new Map(Object.entries(detections.expressions));
        const l = [...m.entries()].reduce((a, e) => (e[1] > a[1] ? e : a));
        if (l[0] != "neutral") om[l[0]] = om[l[0]] + 1;

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      } catch (err) {}
    }
    let oom = new Map(Object.entries(om))
    const ol = [...oom.entries()].reduce((a, e) => (e[1] > a[1] ? e : a));
    console.log(ol);
    switch(ol[0]) {
      case "happy":
        document.getElementById(val).innerHTML='<div class="reaction">&#128512;</div>'
        break;
      case "sad":
        document.getElementById(val).innerHTML='<div class="reaction">&#128542;</div>'
        break;
      case "angry":
        document.getElementById(val).innerHTML='<div class="reaction">&#128545;</div>'
        break;
      case "fearful":
        document.getElementById(val).innerHTML='<div class="reaction">&#128561;</div>'
        break;
      case "disgusted":
        document.getElementById(val).innerHTML='<div class="reaction">&#129326;</div>'
        break;
      case "surprised":
        document.getElementById(val).innerHTML='<div class="reaction">&#128562;</div>'
        break;
    }
  });
});

msgerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  botResponse();
});
