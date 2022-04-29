const firebaseConfig = {
  apiKey: "AIzaSyBl6uLF_Sh7S7FbBiaj7jEbn5GWsbFzws4",
  authDomain: "puddinglnt.firebaseapp.com",
  databaseURL:
    "https://puddinglnt-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "puddinglnt",
  storageBucket: "puddinglnt.appspot.com",
  messagingSenderId: "510990046997",
  appId: "1:510990046997:web:2819f252cc9c6e81423b1c",
};

const inputForm = document.querySelector(".form");
const inputName = document.querySelector(".form-control--name");
const inputEmail = document.querySelector(".form-control--email");
const inputPhone = document.querySelector(".form-control--phone");
const inputEvent = document.querySelector(".form-control--event");

// init firebase
firebase.initializeApp(firebaseConfig);

// reference for database
const contactFormDB = firebase.database().ref("contactForm");

// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// local app storage
class App {
  #datas = [];

  constructor() {
    this._getLocalStorage();
    inputForm.addEventListener("submit", this._newData.bind(this));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("datas"));
    if (!data) {
      return;
    }
    this.#datas = data;
    this.#datas.forEach((data) => console.log(data));
  }

  _newData(e) {
    e.preventDefault();
    const name = inputName.value;
    const email = inputEmail.value;
    const phoneNumber = inputPhone.value;
    const event = inputEvent.value;
    let customerData;
    // validate nama
    if (name.length < 3) return alert("Name must be more than 3 characters");
    // validate email
    if (!email.includes("@")) return alert("Invalid email address");
    // validate phoneNumber
    if (!phoneNumber.startsWith("08") || !phoneNumber.length > 14)
      return alert("Invalid phone number");

    alert(`Succesfully Registered for ${event}!`);
    customerData = new CustomerData(name, email, phoneNumber, event);
    this.#datas.push(customerData);
    this._setLocalStorage();

    // push to FireBase
    var newContactForm = contactFormDB.push();
    newContactForm.set({
      name: name,
      email: email,
      phone: phoneNumber,
      event: event,
    });
  }
  _setLocalStorage() {
    localStorage.setItem("datas", JSON.stringify(this.#datas));
  }
  _clearForm() {
    inputEmail.value = inputName.value = inputPhone.value = "";
  }
}

class CustomerData {
  id = (Date.now() + "").slice(-10);

  constructor(name, email, phone, event) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.event = event;
  }
}

const appLocal = new App();
