class CountDownTimer extends HTMLElement {
  connectedCallback() {
    this.targetDate = new Date(this.getAttribute("data-end-time")).getTime();
    this.#initTimer();
  }
  #initTimer() {
    // Update the timer every second
    setInterval(() => {
      this.currentDate = new Date().getTime();
      this.timeDifference = this.targetDate - this.currentDate;
      // convert Milliseconds to days, hours, minutes, and seconds
      this.days = Math.floor(this.timeDifference / (24 * 60 * 60 * 1000));
      this.hours = Math.floor(
        (this.timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
      );
      this.minutes = Math.floor(
        (this.timeDifference % (60 * 60 * 1000)) / (60 * 1000),
      );
      this.seconds = Math.floor((this.timeDifference % (60 * 1000)) / 1000);
      this.countDownBannerTimer = this.querySelector(
        ".count-down-banner__timer",
      );
      this.displayDays = this.countDownBannerTimer.querySelector(".days");
      this.displayHours = this.countDownBannerTimer.querySelector(".hours");
      this.displayMinutes = this.countDownBannerTimer.querySelector(".minutes");
      this.displaySeconds = this.countDownBannerTimer.querySelector(".seconds");

      this.displayDays.textContent = String(this.days).padStart(2, "0");
      this.displayHours.textContent = String(this.hours).padStart(2, "0");
      this.displayMinutes.textContent = String(this.minutes).padStart(2, "0");
      this.displaySeconds.textContent = String(this.seconds).padStart(2, "0");
    }, 1000);
  }
}

customElements.define("count-down-timer", CountDownTimer);
