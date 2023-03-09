import playList from "./playList.js";

console.log(playList);
let globalTimesOfDay;
let randomNum;
// greeting
const name = document.querySelector(".name");
const city = document.querySelector(".city");

city.addEventListener("change", getWeather);
// slider
const btnNext = document.querySelector(".slide-next");
const btnPrev = document.querySelector(".slide-prev");

btnNext.addEventListener("click", getSlideNext);
btnPrev.addEventListener("click", getSlidePrev);
// quotes
let arrQuotes;
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const btnChange = document.querySelector(".change-quote");
btnChange.addEventListener("click", changeQuote);
// player
let isPlay = false;
const audio = new Audio();
const btnPlay = document.querySelector(".play");
const btnAudioNext = document.querySelector(".play-next");
const btnAudioPrev = document.querySelector(".play-prev");
const playListContainer = document.querySelector(".play-list");

btnPlay.addEventListener("click", playAudio);
btnAudioNext.addEventListener("click", playNext);
btnAudioPrev.addEventListener("click", playPrev);
let playNum = 0;

// Show time in span
function showTime() {
  const time = document.querySelector(".time");
  const date = new Date();
  time.textContent = date.toLocaleTimeString();

  showDate(date);
  showGreeting(date);

  setTimeout(showTime, 1000);
}
showTime();

// Show weekday and date in span
function showDate(date) {
  const elDate = document.querySelector(".date");
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  elDate.textContent = date.toLocaleDateString("en-US", options);
}

// Show greeting into maindivs span
function showGreeting(date) {
  const elGreeting = document.querySelector(".greeting");
  const hours = date.getHours();
  const arrGreetings = ["night", "morning", "afternoon", "evening"];
  globalTimesOfDay = arrGreetings[Math.trunc(hours / 6)];
  elGreeting.textContent = `Good ${globalTimesOfDay} `;
}

// Save name in LocalStorage
function setLocalStorage() {
  localStorage.setItem("name", name.value);
  localStorage.setItem("city", city.value);
}
window.addEventListener("beforeunload", setLocalStorage);

// Get name for LocalStorage
function getLocalStorage() {
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
  }
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
  } else {
    city.value = "Minsk";
  }
  getWeather();
}
window.addEventListener("load", getLocalStorage);

// Slider
function getRandomNum() {
  randomNum = Math.floor(Math.random() * 20) + 1;
  setBg();
}
getRandomNum();
function setBg() {
  const strNum = ("0" + randomNum).slice(-2);
  const img = new Image();

  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${globalTimesOfDay}/${strNum}.jpg`;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${img.src})`;
  };
}

function getSlideNext() {
  randomNum < 20 ? randomNum++ : (randomNum = 1);
  setBg();
}
function getSlidePrev() {
  randomNum > 1 ? randomNum-- : (randomNum = 20);
  setBg();
}

// Weather
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=35b72209c27622a115e57004c14b759b&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  weatherIcon.className = "weather-icon owf";
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp}°C`;
  weatherDescription.textContent = data.weather[0].description;
}
// Quotes
function getQuotes() {
  const quotes = "/momentum/assets/data.json";
  fetch(quotes)
    .then((res) => res.json())
    .then((data) => {
      arrQuotes = data;
      changeQuote();
    });
}

function changeQuote() {
  const rnd = Math.floor(Math.random() * 14);
  quote.textContent = arrQuotes[rnd].text;
  author.textContent = arrQuotes[rnd].author;
}
getQuotes();

// Audio player
function playAudio() {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  if (!isPlay) {
    audio.play();
  } else {
    audio.pause();
  }
  isPlay = !isPlay;
  toggleBtn();
}

function toggleBtn() {
  if (!isPlay) {
    btnPlay.classList.remove("pause");
  } else {
    btnPlay.classList.add("pause");
  }
}

function createAudioTrack() {
  playList.forEach((el, i) => {
    const li = document.createElement("li");
    li.classList.add("play-item");
    li.textContent = el.title;
    li.addEventListener("click", () => {
      playNum = i;
      isPlay = false;
      
      li.classList.add("item-active");
      toggleActive(li)
      playAudio();
    });
    playListContainer.append(li);
  });
}
createAudioTrack();

function toggleActive(){
// Добавить переключение активного элемента
}

function playNext() {
  if (playNum < playList.length - 1) playNum++;
  else playNum = 0;
  isPlay = false;
  playAudio();
}

function playPrev() {
  if (playNum > 0) playNum--;
  else playNum = playList.length - 1;
  isPlay = false;
  playAudio();
}
