// Check if the device is mobile
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isMobile) {
  document.body.style.touchAction = 'none'; // Disable default touch actions
}

let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // For touch event (Mobile)
    if (isMobile) {
      paper.addEventListener('touchstart', (e) => this.touchStart(e, paper));
      paper.addEventListener('touchmove', (e) => this.touchMove(e, paper));
      paper.addEventListener('touchend', () => this.touchEnd(paper));
      paper.addEventListener('gesturestart', (e) => this.gestureStart(e));
      paper.addEventListener('gestureend', () => this.gestureEnd());
    }

    // For mouse event (Laptop/Desktop)
    else {
      paper.addEventListener('mousedown', (e) => this.mouseDown(e, paper));
      paper.addEventListener('mousemove', (e) => this.mouseMove(e, paper));
      paper.addEventListener('mouseup', () => this.mouseUp(paper));
      paper.addEventListener('mouseleave', () => this.mouseUp(paper));
    }
  }

  // Touch Events (For Mobile)
  touchStart(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.prevTouchX = this.touchStartX;
    this.prevTouchY = this.touchStartY;
  }

  touchMove(e, paper) {
    e.preventDefault();

    if (!this.rotating) {
      this.touchMoveX = e.touches[0].clientX;
      this.touchMoveY = e.touches[0].clientY;

      this.velX = this.touchMoveX - this.prevTouchX;
      this.velY = this.touchMoveY - this.prevTouchY;
    }

    const dirX = e.touches[0].clientX - this.touchStartX;
    const dirY = e.touches[0].clientY - this.touchStartY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = 180 * angle / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevTouchX = this.touchMoveX;
      this.prevTouchY = this.touchMoveY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  touchEnd(paper) {
    this.holdingPaper = false;
    this.rotating = false;
  }

  gestureStart(e) {
    e.preventDefault();
    this.rotating = true;
  }

  gestureEnd() {
    this.rotating = false;
  }

  // Mouse Events (For Desktop)
  mouseDown(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    this.touchStartX = e.clientX;
    this.touchStartY = e.clientY;
    this.prevTouchX = this.touchStartX;
    this.prevTouchY = this.touchStartY;
  }

  mouseMove(e, paper) {
    if (!this.holdingPaper) return;

    this.touchMoveX = e.clientX;
    this.touchMoveY = e.clientY;

    this.velX = this.touchMoveX - this.prevTouchX;
    this.velY = this.touchMoveY - this.prevTouchY;

    const dirX = e.clientX - this.touchStartX;
    const dirY = e.clientY - this.touchStartY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = 180 * angle / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevTouchX = this.touchMoveX;
      this.prevTouchY = this.touchMoveY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  mouseUp(paper) {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
