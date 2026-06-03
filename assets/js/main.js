(() => {
  "use strict";

  /* ======================================================
       HELPERS
    ====================================================== */
  const qs = (selector, parent = document) => parent.querySelector(selector);

  const qsa = (selector, parent = document) =>
    parent.querySelectorAll(selector);

  const params = new URLSearchParams(window.location.search);
  const timeline = params.get("timeline");

  /* ======================================================
       SWIPER
    ====================================================== */

  function initSwiper() {
    const thumbSwiper = new Swiper(".thumb-swiper", {
      spaceBetween: 10,
      slidesPerView: 5,
      freeMode: true,
      watchSlidesProgress: true,
    });
  
    const mainSwiper = new Swiper(".main-swiper", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: thumbSwiper,
      },
      autoplay: {
        delay: 3000, // thời gian giữa các lần chuyển (ms)
        disableOnInteraction: false, // không tắt khi người dùng bấm
      },
      loop: true, // lặp lại ảnh
      effect: "fade", // hiệu ứng chuyển mượt
      fadeEffect: { crossFade: true },
      speed: 1000 // tốc độ chuyển (ms)
    });
  }

  function initGuestFields() {
    const select = document.querySelector('select[name="guest_number"]');
    const container = document.getElementById("guest-fields");
    const lang = select.dataset.lang;
  
    select.addEventListener("change", function () {
      container.innerHTML = "";
  
      const value = this.value;
  
      if (!value || value === "0") return;
  
      const number = parseInt(value);
  
      for (let i = 1; i <= number; i++) {
        const group = document.createElement("div");
        group.className = "guest-group fade-in";
  
        group.innerHTML = `
          <div class="form-group fade-in guest-name" data-animate="fade-in">
            <input
              type="text"
              id="guest-name"
              name="guest_name_${i}"
              placeholder="${lang === "vi"? "Tên khách mời đi kèm": "Name of accompanying guest"}"
              required
            />
          </div>
        `;
  
        container.appendChild(group);
      }
    });
  }

  /* ======================================================
       MUSIC
    ====================================================== */

    function initMusic() {
      const audio = qs("#audio");
      const icon = qs("#iconSvg");
      const btn = qs("#player-btn");
      const label = qs("#musicLabel");
  
      let isOpen = true
  
      if (!audio || !icon || !btn || !label) return;
  
      // 👉 GSAP timeline cho label
      const tl = gsap.timeline({ paused: true });
  
      tl.to(label, {
        x: 200,
        // opacity: 0,
        duration: 1,
        ease: "power2.inOut",
         pointerEvents: "none"
      });
  
      btn.addEventListener("click", () => {
        if (!audio.src) return;
        audio.paused ? audio.play() : audio.pause();
  
        // toggle label
        if (isOpen) {
          tl.play();
        } else {
          tl.reverse();
        }
        isOpen = !isOpen;
      });
  
      audio.addEventListener("play", () => icon.classList.add("spin"));
      audio.addEventListener("pause", () => icon.classList.remove("spin"));
    }

  /* ======================================================
       DRESSCODE ANIMATION
    ====================================================== */

  function initDresscodeAnimation() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".colors-grid",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(".color1", { x: -100, opacity: 0, duration: 0.8 })
      .from(".color2", { x: -100, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".color3", { x: -100, opacity: 0, duration: 0.8 }, "-=0.45")
      .from(".color4", { x: -100, opacity: 0, duration: 0.8 }, "-=0.5")
      .from(".color5", { x: -100, opacity: 0, duration: 0.8 }, "-=0.55")
      .from(".color6", { x: -100, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(".color7", { x: -100, opacity: 0, duration: 0.8 }, "-=0.5");
  }

  function initPage() {
    const tl = gsap.timeline({ paused: true});
    // const audio = document.querySelector("#audio");
    tl.fromTo(
      ".flap",
      {
        rotateX: 0,
        transformOrigin: "top center"
      },
      {
        y: -30,
        rotateX: 20,
        duration: 1.5,
        ease: "power2.inOut",
      }
    )
    .to(".flap-shadow",{
      x:-100,
      y: 20,
      opacity:0.4,
      scaleX:1.3,
      filter: "blur(40px)",
      duration:1.5
    },"<")
    .to(".seal-shadow",{
      x:-100,
      y: 20,
      opacity:0.4,
      scaleX:1.3,
      filter: "blur(40px)",
      duration:1.5
    },"<")
    .to(".letter-section", {
      opacity: 0,
      duration: 0.8
    })
    .set(".letter-section", { display: "none" })
    .set(".container .content", { opacity: 0 })
    .set(".container", { display: "block" })
    .to(".container", {
      opacity: 1,
      onComplete: () => {

        // 💥 Reset ScrollTrigger
        // ScrollTrigger.refresh();

        // 💥 Nếu cần reset toàn bộ animation
        // gsap.globalTimeline.clear();

        // 💥 Re-init animation cho container
        initAnimations();
        // initDresscodeAnimation();
        // initTimeline();
        initCircleText();

        ScrollTrigger.refresh();
        
      }
    });

    document.getElementById("open-card").addEventListener("click", (e) => {
      // if (audio && audio.paused) {
      //   audio.play().catch(err => {
      //     console.log("Autoplay blocked:", err);
      //   });
      // }
      tl.play();
    }); 
  }

  function initLetterAnimation() {
    const section = qs(".letter-section");
    if (!section) return;

    const content = section.querySelector(".content");
    const logo = section.querySelector(".logo-img");
    const husband = section.querySelector(".husband");
    const ampersand = section.querySelector(".ampersand");
    const wife = section.querySelector(".wife");
    const divider = section.querySelector(".divider-img");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 95%",
        toggleActions: "play none none none",
      }
    });

    // =========================
    // Section intro
    // =========================


    tl.fromTo(
      content,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        clearProps: "filter"
      }
    );

    // tl.from(
    //   logo,
    //   {
    //     rotateY: -180,
    //     scale: 0.8,
    //     opacity: 0,
    //     duration: 1.5,
    //     ease: "back.out(1.2)",
    //     transformOrigin: "center center"
    //   },
    //   "-=0.5"
    // );

    // tl.fromTo(
    //   husband,
    //   { opacity: 0, x: -30 },
    //   {
    //     opacity: 1,
    //     x: 0,
    //     duration: 1,
    //     ease: "power2.out",
    //   },
    //   "-=1"
    // );

    // tl.fromTo(
    //   ampersand,
    //   { opacity: 0, y: 50, filter: "blur(10px)" },
    //   {
    //     opacity: 1,
    //     y: 0,
    //     filter: "blur(0px)",
    //     duration: 1,
    //     ease: "power2.out",
    //     clearProps: "filter"
    //   },
    //   "-=1"
    // );

    // tl.fromTo(
    //   wife,
    //   { opacity: 0, x: 30 },
    //   {
    //     opacity: 1,
    //     x: 0,
    //     duration: 1,
    //     ease: "power2.out",
    //   },
    //   "-=1"
    // );

    // tl.fromTo(
    //   divider,
    //   {
    //     rotation: -120,
    //     scale: 0,
    //     opacity: 0
    //   },
    //   {
    //     rotation: 0,
    //     scale: 1,
    //     opacity: 1,
    //     duration: 1.2,
    //     ease: "back.out(1.6)",
    //     transformOrigin: "50% 50%"
    //   },
    //   "-=0.4"
    // );

    tl.fromTo(
      ".welcome",
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        clearProps: "filter"
      },
      "-=0.8"
    );


    // tl.fromTo(
    //   ".subtext",
    //   { opacity: 0, y: 50, filter: "blur(10px)" },
    //   {
    //     opacity: 1,
    //     y: 0,
    //     filter: "blur(0px)",
    //     duration: 1,
    //     ease: "power2.out",
    //     clearProps: "filter"
    //   },
    //   "-=0.8"
    // );

    // tl.fromTo(
    //   ".open-card",
    //   { opacity: 0, y: 50, filter: "blur(10px)" },
    //   {
    //     opacity: 1,
    //     y: 0,
    //     filter: "blur(0px)",
    //     duration: 1,
    //     ease: "power2.out",
    //     clearProps: "filter"
    //   },
    //   "-=0.8"
    // );
    // tl.from(date, { y: 100, opacity: 0 }, "-=0.4");
  }

  /* ======================================================
       TIMELINE ANIMATION
    ====================================================== */

  function initTimeline() {
    const section = document.querySelector(".timeline");
    if (!section) return;

    const content = section.querySelector(".timeline-content");
    const items = section.querySelectorAll(".timeline-item");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none reverse",
      }
    });

    // =========================
    // Section intro
    // =========================
    tl.fromTo(
      content,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        clearProps: "filter"
      }
    );

    // =========================
    // Animate từng item theo thứ tự
    // =========================
    items.forEach((item, index) => {
      if (timeline === "v2") {
        if (item.classList.contains("hide-v2")) return;
      }

      const icon = item.querySelector(".icon-animate");
      const time = item.querySelector(".time");
      // const overlap = index === 0 ? 0 : 0.2 + index * 0.1;

      // Item fade
      tl.from(
        item,
        {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "power2.out"
        },
        `-=1.2`
      );

      // Icon pop
      if (icon) {
        tl.from(
          icon,
          {
            scale: 0,
            rotation: -120,
            opacity: 0,
            duration: 1.5,
            ease: "back.out(1.6)"
          },
          "<0.2"
        );
      }

      // Time fade
      if (time) {
        tl.from(
          time,
          {
            opacity: 0,
            x: -80,
            duration: 1.5,
            ease: "power2.out"
          },
          "<0.4"
        );
      }
    });
  }

  /* ======================================================
       FAQ
    ====================================================== */

  function initFAQ() {
    const items = qsa(".faq-item");

    function openItem(el) {
      const content = qs(".faq-content", el);
      const icon = qs(".icon", el);
      if (!content || !icon) return;

      el.classList.add("active");

      gsap.to(content, { height: "auto", duration: 0.4, ease: "power2.out" });
      gsap.to(icon, {
        rotate: 180,
        duration: 0.3,
        onComplete: () => (icon.textContent = "−"),
      });
    }

    function closeItem(el) {
      const content = qs(".faq-content", el);
      const icon = qs(".icon", el);
      if (!content || !icon) return;

      el.classList.remove("active");

      gsap.to(content, { height: 0, duration: 0.3, ease: "power2.inOut" });
      gsap.to(icon, {
        rotate: 0,
        duration: 0.3,
        onComplete: () => (icon.textContent = "+"),
      });
    }

    items.forEach((item) => {
      const header = qs(".faq-header", item);
      const content = qs(".faq-content", item);
      if (!header) return;

      if (item.classList.contains("active")) {
        gsap.set(content, { height: "auto" });
      }

      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        items.forEach((el) => {
          if (el !== item) closeItem(el);
        });

        isOpen ? closeItem(item) : openItem(item);
      });
    });
  }

  /* ======================================================
       COUNTDOWN
    ====================================================== */

  function startCountdown(targetDate) {
    const daysEl = qs("#days");
    const hoursEl = qs("#hours");
    const minsEl = qs("#mins");
    const secsEl = qs("#secs");

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    const timer = setInterval(update, 1000);
    update();

    function update() {
      const distance = targetDate - Date.now();

      if (distance <= 0) {
        clearInterval(timer);
        daysEl.textContent =
          hoursEl.textContent =
          minsEl.textContent =
          secsEl.textContent =
          "00";
        return;
      }

      const days = Math.floor(distance / 86400000);
      const hours = Math.floor((distance % 86400000) / 3600000);
      const mins = Math.floor((distance % 3600000) / 60000);
      const secs = Math.floor((distance % 60000) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minsEl.textContent = String(mins).padStart(2, "0");
      secsEl.textContent = String(secs).padStart(2, "0");
    }
  }

  /* ======================================================
       RSVP
    ====================================================== */
  async function handleFormSubmit(e, lang = "vi") {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {
      ...Object.fromEntries(formData.entries()),
      dietary: formData.getAll("dietary")
    }

    
    // if (data.dietary.length) {
    //   data.dietary = data.dietary.join(", ");
    // } else {
    //   data.dietary = "";
    // }
    
    const {
      name,
      confirm,
      guest_number,
      dietary,
      guest_diatery_number,
      wish,
    } = data;

    // =========================
    // i18n Messages
    // =========================
    const messages = {
      vi: {
        sendingTitle: "Đang gửi...",
        sendingText: "Vui lòng chờ trong giây lát",
        successTitle: "Thành công!",
        successText:
          "Cảm ơn quý Ông bà, Cô chú, Anh chị và Bạn bè đã xác nhận. Thông tin đã được chuyển đến cô dâu và chú rể.",
        errorTitle: "Lỗi!",
        errorServer: "OPPS! Không tìm thấy server",
        errorRetry: "Thử lại",
      },
      en: {
        sendingTitle: "Sending...",
        sendingText: "Please wait a moment",
        successTitle: "Success!",
        successText:
          "Thank you for your confirmation. Your information has been forwarded to the bride and groom.",
        errorTitle: "Error!",
        errorServer: "OPPS! Server not found",
        errorRetry: "Try again",
      },
    };

    const t = messages[lang] || messages.vi;

    // =========================
    // Loading popup
    // =========================
    Swal.fire({
      title: t.sendingTitle,
      text: t.sendingText,
      icon: "info",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // const SHEET_ENDPOINTS = {
    //   vow: "?sheet=vow",
    //   not_vow: "?sheet=not-vow",
    // };

    // let sheetURL = SHEET_ENDPOINTS.vow;
    // if (timeline === "v2") {
    //   sheetURL = SHEET_ENDPOINTS.not_vow
    // }
    const sheetURL = 'https://script.google.com/macros/s/AKfycby68akClaB4Tpvh8kaSTHwnZIKK5n5hJj5KLom1pBjEHyjJynfMVyf1ubrpm29PpE0n/exec?sheet=confirm';

    try {
      const res = await fetch(sheetURL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name,
          confirm,
          guest_number,
          dietary,
          guest_diatery_number,
          wish,
        }),
      });

      // Nếu server lỗi HTTP
      if (!res.ok) {
        throw new Error("Server response not OK");
      }

      const result = await res.json().catch(() => null);

      if (!result) {
        Swal.fire({
          title: t.errorTitle,
          text: t.errorServer,
          icon: "error",
          confirmButtonText: t.errorRetry,
          confirmButtonColor: "#3c7fc2",
        });
        return;
      }

      form.reset();

      Swal.fire({
        title: t.successTitle,
        text: t.successText,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#806331ff",
      });
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        title: t.errorTitle,
        text: error.message || t.errorServer,
        icon: "error",
        confirmButtonText: t.errorRetry,
        confirmButtonColor: "#3c7fc2",
      });
    }
  }

  function initRSVP() {
    const form = document.forms["rsvpForm"];
    if (form) {
      form.addEventListener("submit", (e) => handleFormSubmit(e, "vi"));
    }
  }

  function initAnimations() {
    const animationMap = {
      "flip": gsapFlipIn,
      "flip-yoyo": gsapFlipInThenYoyo,

      "fade-in": gsapFadeIn,
      "fade-in-end": gsapFadeInForEnd,
      "fade-in-yoyo": gsapFadeInThenYoyo,
      "fade-in-pulse": gsapFadeInThenPulse,

      "fade-right": gsapFadeRight,
      "fade-left": gsapFadeLeft,
      "fade-up": gsapFadeUp,
      "fade-down": gsapFadeDown,

      "rotate-bl": gsapRotateBottomLeft,
      "rotate-br": gsapRotateBottomRight,
      "rotate-bl-yoyo": gsapRotateBottomLeftThenYoyo,
      "rotate-br-yoyo": gsapRotateBottomRightThenYoyo,

      "flip-vertical-left": gsapFlipVerticalLeft,
      "flip-vertical-bottom": gsapFlipVerticalBottom,

      "roll-in-left": gsapRollInLeft,
      "rotate-bl--float": gsap_rotate_bl__float,
    };

    document.querySelectorAll("[data-animate]").forEach((el) => {
      const type = el.dataset.animate;
      const fn = animationMap[type];

      if (!fn) {
        console.warn(`Animation "${type}" not found.`);
        return;
      }

      const options = {
        delay: parseFloat(el.dataset.animateDelay) || 0,
        duration: parseFloat(el.dataset.animateDuration) || 2,
        scrollStart: el.dataset.animateScrollStart || "top 85%",
      };

      fn(el, options);
    });
  }

  function initCircleText() {
    const textNgaychungdoi = new CircleType(document.getElementById('ngaychungdoi'));
    textNgaychungdoi.radius(480);

    const textInviteCountdown1 = new CircleType(document.getElementById('invite_countdown_text_1'));
    textInviteCountdown1.radius(880)

    const textInviteCountdown2 = new CircleType(document.getElementById('invite_countdown_text_2'));
    textInviteCountdown2.radius(880)
  }

  function initTimelineContent() {
    const params = new URLSearchParams(window.location.search);
    const timeline = params.get("timeline");
    const hour = qs('#hours-bold');
    const welcomeTime = qs('#welcome-time');

    if (timeline === "v2") {
      qsa(".hide-v2").forEach(el => {
        el.style.display = "none";
      });
      if (hour) {
        hour.textContent = "18:00"
      }
      if(welcomeTime) {
        welcomeTime.textContent = "18:00"
      }
    }
  }

  /* ======================================================
       BOOTSTRAP
    ====================================================== */

  function init() {
    gsap.registerPlugin(ScrollTrigger);
    // initPage();
    // initLetterAnimation();
    // initTimelineContent();
    initAnimations();
    initSwiper();
    initMusic();
    initDresscodeAnimation();
    // initGuestFields();
    initTimeline();
    // initFAQ();
    initRSVP();
    // startCountdown(new Date("2026-04-14T16:00:00"));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
