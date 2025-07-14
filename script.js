// Portfolio JavaScript - Enhanced Vanilla Implementation

class Portfolio {
  constructor() {
    this.scrollY = 0;
    this.roles = [
      "Full Stack Developer",
      "Game Designer",
      "Game Developer",
      "Minecraft Developer",
    ];
    this.currentRoleIndex = 0;
    this.isTyping = true;
    this.charIndex = 0;
    this.typewriterTimeout = null;
    this.carousels = [];
    this.isLoading = true;

    this.init();
  }

  init() {
    this.showLoadingScreen();
    setTimeout(() => {
      this.hideLoadingScreen();
      this.setupEventListeners();
      this.startTypewriter();
      this.setupIntersectionObserver();
      this.setupContactForm();
      this.setupCarousels();
      this.animatePageLoad();
    }, 2000);
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "flex";
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
        this.isLoading = false;
      }, 500);
    }
  }

  animatePageLoad() {
    document.body.classList.add("page-load");

    // Animate sections with stagger
    const sections = document.querySelectorAll("section");
    sections.forEach((section, index) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(30px)";
      setTimeout(() => {
        section.style.transition = "all 0.8s ease-out";
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }, index * 200);
    });
  }

  setupEventListeners() {
    // Parallax scroll effect with throttling
    const throttledParallax = this.throttle(() => {
      this.scrollY = window.scrollY;
      this.updateParallax();
    }, 16); // ~60fps

    window.addEventListener("scroll", throttledParallax, { passive: true });

    // Smooth scroll for navigation
    document.getElementById("scroll-down").addEventListener("click", () => {
      document
        .getElementById("experience")
        .scrollIntoView({ behavior: "smooth" });
    });

    // Resize handler
    window.addEventListener("resize", () => {
      this.updateParallax();
    });
  }

  setupCarousels() {
    const carouselContainers = document.querySelectorAll(".carousel-container");
    carouselContainers.forEach((container) => {
      const slides = Array.from(container.querySelectorAll(".carousel-slide"));
      const dots = Array.from(container.querySelectorAll(".carousel-dot"));
      const prevBtn = container.querySelector(".carousel-prev");
      const nextBtn = container.querySelector(".carousel-next");
      let currentSlide = 0;
      let autoSlideInterval = null;
      const autoSlideDelay = parseInt(container.dataset.autoSlide, 10) || 3000;

      function goToSlide(index) {
        slides.forEach((slide, i) => {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === index);
          // Atur warna dot
          if (i === index) {
            dot.classList.add("bg-white/80");
            dot.classList.remove("bg-white/40");
          } else {
            dot.classList.remove("bg-white/80");
            dot.classList.add("bg-white/40");
          }
        });
        currentSlide = index;
      }

      function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
        resetAutoSlide();
      }

      function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
        resetAutoSlide();
      }

      function dotClickHandler(i) {
        goToSlide(i);
        resetAutoSlide();
      }

      function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
          goToSlide((currentSlide + 1) % slides.length);
        }, autoSlideDelay);
      }

      function stopAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
      }

      function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
      }

      // Attach event listeners if buttons exist
      if (nextBtn) {
        nextBtn.addEventListener("click", nextSlide);
      }
      if (prevBtn) {
        prevBtn.addEventListener("click", prevSlide);
      }
      dots.forEach((dot, i) => {
        dot.addEventListener("click", () => dotClickHandler(i));
      });

      // Pause auto-slide on hover, resume on mouseleave
      container.addEventListener("mouseenter", stopAutoSlide);
      container.addEventListener("mouseleave", startAutoSlide);

      // Init
      goToSlide(0);
      startAutoSlide();
    });
  }

  nextSlide(carousel) {
    const nextIndex = (carousel.currentSlide + 1) % carousel.totalSlides;
    this.goToSlide(carousel, nextIndex);
  }

  prevSlide(carousel) {
    const nextIndex =
      (carousel.currentSlide - 1 + carousel.totalSlides) % carousel.totalSlides;
    this.goToSlide(carousel, nextIndex);
  }

  goToSlide(carousel, index) {
    // Remove active class from current slide and dot
    if (carousel.slides[carousel.currentSlide]) {
      carousel.slides[carousel.currentSlide].classList.remove("active");
    }
    if (carousel.dots[carousel.currentSlide]) {
      carousel.dots[carousel.currentSlide].classList.remove("active");
    }

    // Add active class to new slide and dot
    carousel.currentSlide = index;
    if (carousel.slides[carousel.currentSlide]) {
      carousel.slides[carousel.currentSlide].classList.add("active");
    }
    if (carousel.dots[carousel.currentSlide]) {
      carousel.dots[carousel.currentSlide].classList.add("active");
    }

    // Reset auto-slide timer
    this.resetAutoSlide(carousel);
  }

  startAutoSlide(carousel) {
    carousel.intervalId = setInterval(() => {
      if (!carousel.isPaused) {
        this.nextSlide(carousel);
      }
    }, carousel.autoSlideInterval);
  }

  pauseCarousel(carousel) {
    carousel.isPaused = true;
  }

  resumeCarousel(carousel) {
    carousel.isPaused = false;
  }

  resetAutoSlide(carousel) {
    clearInterval(carousel.intervalId);
    this.startAutoSlide(carousel);
  }

  updateParallax() {
    const heroSection = document.getElementById("hero");
    const experienceSection = document.getElementById("experience");
    const projectsSection = document.getElementById("projects");
    const contactSection = document.getElementById("contact");

    // Hero parallax
    const heroBg = document.getElementById("hero-bg");
    const heroContent = document.getElementById("hero-content");

    if (heroBg && heroContent && heroSection) {
      const heroHeight = heroSection.offsetHeight;
      const heroOpacity = Math.max(
        0,
        Math.min(1, 1 - (this.scrollY / heroHeight) * 1.2)
      );

      heroBg.style.transform = `translateY(${this.scrollY * 0.3}px)`;
      heroContent.style.opacity = heroOpacity;
      heroContent.style.transform = `translateY(${-this.scrollY * 0.1}px)`;
    }

    // Experience parallax - reduced movement to prevent overlap
    const experienceBg = document.getElementById("experience-bg");
    if (experienceBg && experienceSection) {
      const experienceOffset = experienceSection.offsetTop;
      const relativeScroll = this.scrollY - experienceOffset;
      experienceBg.style.transform = `translateY(${relativeScroll * 0.05}px)`;
    }

    // Projects parallax - reduced movement to prevent overlap
    const projectsBg = document.getElementById("projects-bg");
    if (projectsBg && projectsSection) {
      const projectsOffset = projectsSection.offsetTop;
      const relativeScroll = this.scrollY - projectsOffset;
      projectsBg.style.transform = `translateY(${relativeScroll * 0.1}px)`;
    }

    // Contact parallax - reduced movement
    const contactBg = document.getElementById("contact-bg");
    if (contactBg && contactSection) {
      const contactOffset = contactSection.offsetTop;
      const relativeScroll = this.scrollY - contactOffset;
      contactBg.style.transform = `translateY(${relativeScroll * 0.05}px)`;
    }
  }

  startTypewriter() {
    const roleText = document.getElementById("role-text");
    if (!roleText) return;

    const currentRole = this.roles[this.currentRoleIndex];

    if (this.isTyping) {
      if (this.charIndex < currentRole.length) {
        roleText.innerHTML =
          currentRole.substring(0, this.charIndex + 1) +
          '<span id="cursor" class="absolute right-[-4px] top-0 h-full w-[2px] bg-purple-400 animate-blink"></span>';
        this.charIndex++;
        this.typewriterTimeout = setTimeout(() => this.startTypewriter(), 100);
      } else {
        this.typewriterTimeout = setTimeout(() => {
          this.isTyping = false;
          this.startTypewriter();
        }, 2000);
      }
    } else {
      if (this.charIndex > 0) {
        roleText.innerHTML =
          currentRole.substring(0, this.charIndex - 1) +
          '<span id="cursor" class="absolute right-[-4px] top-0 h-full w-[2px] bg-purple-400 animate-blink"></span>';
        this.charIndex--;
        this.typewriterTimeout = setTimeout(() => this.startTypewriter(), 50);
      } else {
        this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
        this.isTyping = true;
        this.typewriterTimeout = setTimeout(() => this.startTypewriter(), 500);
      }
    }
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("experience-item")) {
            this.animateExperienceItems();
          } else if (
            entry.target.classList.contains("experience-item-mobile")
          ) {
            this.animateExperienceItemsMobile();
          } else if (entry.target.classList.contains("project-item")) {
            this.animateProjectItems();
          }
        }
      });
    }, observerOptions);

    // Observe experience items
    document.querySelectorAll(".experience-item").forEach((item) => {
      observer.observe(item);
    });

    // Observe mobile experience items
    document.querySelectorAll(".experience-item-mobile").forEach((item) => {
      observer.observe(item);
    });

    // Observe project items
    document.querySelectorAll(".project-item").forEach((item) => {
      observer.observe(item);
    });
  }

  animateExperienceItems() {
    const items = document.querySelectorAll(".experience-item");
    items.forEach((item, index) => {
      setTimeout(() => {
        if (index % 2 === 0) {
          // Right side items
          item.classList.remove("opacity-0", "translate-x-12");
          item.classList.add("opacity-100", "translate-x-0", "animate-line");
        } else {
          // Left side items
          item.classList.remove("opacity-0", "-translate-x-12");
          item.classList.add("opacity-100", "translate-x-0", "animate-line");
        }
      }, index * 300);
    });
  }

  animateExperienceItemsMobile() {
    const items = document.querySelectorAll(".experience-item-mobile");
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.remove("opacity-0", "-translate-x-12");
        item.classList.add("opacity-100", "translate-x-0");
      }, index * 200);
    });
  }

  animateProjectItems() {
    const items = document.querySelectorAll(".project-item");
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.remove("opacity-0", "translate-y-12");
        item.classList.add("opacity-100", "translate-y-0");
      }, index * 150);
    });
  }

  setupContactForm() {
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const formStatus = document.getElementById("form-status");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
                <div class="spinner"></div>
                Sending...
            `;

      // Get form data
      const formData = new FormData(form);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      };

      try {
        // Simulate form submission (replace with actual API call)
        await this.simulateFormSubmission(data);

        // Show success message
        this.showFormStatus(
          "success",
          "Your message has been sent successfully! I will get back to you soon."
        );

        // Reset form
        form.reset();
      } catch (error) {
        // Show error message
        this.showFormStatus(
          "error",
          "There was an error sending your message. Please try again."
        );
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m22 2-7 20-4-9-9-4Z"/>
                        <path d="M22 2 11 13"/>
                    </svg>
                    Send Message
                `;
      }
    });
  }

  async simulateFormSubmission(data) {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Form submitted:", data);
        resolve();
      }, 1500);
    });
  }

  showFormStatus(type, message) {
    const formStatus = document.getElementById("form-status");
    formStatus.className = `p-4 mb-6 rounded-md ${
      type === "success"
        ? "bg-green-500/20 text-green-200"
        : "bg-red-500/20 text-red-200"
    }`;
    formStatus.textContent = message;
    formStatus.classList.remove("hidden");

    // Hide status after 5 seconds
    setTimeout(() => {
      formStatus.classList.add("hidden");
    }, 5000);
  }

  // Utility function for throttling
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;

      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Additional utility functions
class Utils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;

      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  static isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

// Enhanced scroll animations
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll("[data-animate]");
    this.init();
  }

  init() {
    this.setupObserver();
  }

  setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const animation = element.dataset.animate;
            this.animateElement(element, animation);
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    this.elements.forEach((element) => {
      observer.observe(element);
    });
  }

  animateElement(element, animation) {
    switch (animation) {
      case "fadeInUp":
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
        break;
      case "fadeInLeft":
        element.style.opacity = "1";
        element.style.transform = "translateX(0)";
        break;
      case "fadeInRight":
        element.style.opacity = "1";
        element.style.transform = "translateX(0)";
        break;
      case "fadeIn":
        element.style.opacity = "1";
        break;
      case "scaleIn":
        element.style.opacity = "1";
        element.style.transform = "scale(1)";
        break;
    }
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      scrollEvents: 0,
      animationFrames: 0,
    };
    this.init();
  }

  init() {
    this.monitorScrollPerformance();
    this.monitorAnimationPerformance();
  }

  monitorScrollPerformance() {
    let scrollCount = 0;
    const throttledScroll = Utils.throttle(() => {
      scrollCount++;
      if (scrollCount % 100 === 0) {
        console.log(`Scroll events processed: ${scrollCount}`);
      }
    }, 16); // ~60fps

    window.addEventListener("scroll", throttledScroll, { passive: true });
  }

  monitorAnimationPerformance() {
    let frameCount = 0;
    const countFrames = () => {
      frameCount++;
      if (frameCount % 60 === 0) {
        console.log(`Animation frames: ${frameCount}`);
      }
      requestAnimationFrame(countFrames);
    };
    requestAnimationFrame(countFrames);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize main portfolio functionality
  const portfolio = new Portfolio();

  // Initialize scroll animations
  const scrollAnimations = new ScrollAnimations();

  // Initialize performance monitoring (optional, for development)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    const performanceMonitor = new PerformanceMonitor();
  }

  // Add loading animation
  const body = document.body;
  body.style.opacity = "0";
  body.style.transition = "opacity 0.5s ease-in-out";

  setTimeout(() => {
    body.style.opacity = "1";
  }, 100);

  console.log("Portfolio initialized successfully!");
});

// Handle page visibility changes for performance optimization
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause animations when page is not visible
    console.log("Page hidden - pausing animations");
  } else {
    // Resume animations when page becomes visible
    console.log("Page visible - resuming animations");
  }
});

// Error handling
window.addEventListener("error", (e) => {
  console.error("Portfolio error:", e.error);
});

// Unhandled promise rejection handling
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
});
