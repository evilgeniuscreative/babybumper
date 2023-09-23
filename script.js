/*
 *
 * BABY BUMPER
 * The game where you're the baby -- for real this time ;)
 *
 */
const babyContainer = document.getElementById('baby');
const babyName = document.getElementById('babyName'); // where baby's name is rendered
const endModal = document.getElementById('endModal');
const info = document.getElementById('info');
const instructions = document.getElementById('instructionsLink');
const inputBabyName = document.getElementById('inputBabyName'); // input for baby name
const items = document.querySelectorAll('.item'); // items.length = total number of breakable items
const modalBG = document.getElementById('modalBG');
const runningScoreDisplay = document.getElementById('runningScoreDisplay');
const startButton = document.getElementById('start');
const startModal = document.getElementById('startModal');
const startRegex = /enter|return/i;
const volumeControl = document.getElementById('volumeControl');

const centerpoint = {
  horiz: window.innerWidth / 2,
  vert: window.innerHeight / 2,
};

let babyInstance;
let endDamages = 0;
let gameIsRunning = false;
let lastCollision = Date.now();
let runningScore = parseInt(runningScoreDisplay.textContent);

// set baby starting position
// baby image is 244 x 192
babyContainer.style.top = window.innerHeight - 325 + 'px';
babyContainer.style.left = window.innerWidth / 2 - 150 + 'px';

const itemPositionReference = {};

// SOUNDS -- some commented out are more for future use
const fart = [];
const laugh = [];

const s_boing = new Audio('sounds/boing.mp3');
const s_collision = new Audio('sounds/collision.mp3');
const s_crash = new Audio('sounds/crash-loud-short.mp3');
const s_crying = new Audio('sounds/crying.mp3');
const s_ding = new Audio('sounds/ding.mp3');
// const s_drumroll = new Audio('sounds/drumroll.mp3');
// const s_end = new Audio('sounds/endgame.mp3');
const s_giggle = new Audio('sounds/laugh_0.mp3');
// const s_glass_break = new Audio('sounds/glass-break-short.mp3');
const s_glass_deeper = new Audio('sounds/glass-break-deeper.mp3');
// const s_mouth_harp = new Audio('sounds/mouth-harp.mp3');
// const s_moving_chair = new Audio('sounds/moving-chair.mp3');
// const s_moving_furn = new Audio('sounds/moving-furniture.mp3');
// const s_wah = new Audio('sounds/wah.mp3');
fart.push(new Audio('sounds/fart_0.mp3'));
fart.push(new Audio('sounds/fart_1.mp3'));
fart.push(new Audio('sounds/fart_2.mp3'));
for (let l = 0; l < 12; l++) {
  laugh.push(new Audio('sounds/laugh_' + l + '.mp3'));
}

const allSounds = [s_boing, s_collision, s_crash, s_crying, s_ding, s_giggle, s_glass_deeper];
console.log('all sounds', allSounds);

items.forEach((item, i) => {
  itemPositionReference[item.dataset.name] = {
    top: Math.round(item.getBoundingClientRect().top),
    bottom: Math.round(item.getBoundingClientRect().bottom),
    left: Math.round(item.getBoundingClientRect().left),
    right: Math.round(item.getBoundingClientRect().right),
    width: Math.round(item.getBoundingClientRect().width),
    height: Math.round(item.getBoundingClientRect().height),
  };
});

//--------------  MAIN BABY CLASS  ----------------//

class baby {
  constructor(name) {
    this.name = name;
    this.babyPos = { top: babyContainer.offsetTop, left: babyContainer.offsetLeft };
  }

  //-------------- SCORING  ----------------//

  addToScore(item) {
    let startDamages = runningScore;

    //
    const pause = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    endDamages += parseInt(item.dataset.cost);

    // iterate up to totalDamages by 1 for visual engagement
    // Looping time delay promise script below by https://javascript.plainenglish.io/javascript-slow-down-for-loop-9d1caaeeeeed
    let scoreLoop = async () => {
      let incr = 1;

      if (endDamages - startDamages > 1000) {
        incr = 5;
      }

      for (let d = startDamages; d <= endDamages; d += incr) {
        await pause(1);
        runningScoreDisplay.textContent = d > item.dataset.cost ? endDamages - incr : d;
      }
    };
    scoreLoop().then(() => {
      runningScoreDisplay.classList.add('mischief-managed');
      setTimeout(() => {}, 300);
      setTimeout(() => {
        runningScoreDisplay.classList.remove('mischief-managed');
        s_ding.play();
      }, 600);
    });

    runningScore = parseInt(runningScoreDisplay.textContent);
  }

  //--------------  SOUND ACTIONS  ----------------//

  collisionNoise() {
    s_collision.play();
    s_crash.play();
    s_glass_deeper.play();
    setTimeout(() => {
      document.getElementById('babyImg').src = 'img/baby-cry.webp';
      s_crying.play();
    }, 100);
    setTimeout(() => {
      document.getElementById('babyImg').src = 'img/baby.webp';
      laugh[1].play();
    }, 4300);
  }

  giggle() {
    laugh[0].play();
  }

  //--------------  MOVEMENT AND COLLISSIONS  ----------------//

  currentDirection() {
    return babyContainer.className.slice(babyContainer.className.indexOf('-') + 1);
  }

  bounceBabyBack(item, bounceAmount = 40) {
    if (item.collisions === 1) {
      return;
    }

    // get the word for current direction, i., right, left, etc.
    // since we're only operating on x and y, treat up and down as one direction, and left and right as the other.
    let currentDirection = babyContainer.className.slice(babyContainer.className.indexOf('-') + 1);

    if (item.collisions === 1) {
      return;
    }

    function collisionActions() {
      s_collision.play();
      if (item.classList.contains('touched')) {
        babyInstance.giggle();
      } else {
        babyInstance.collisionNoise();
      }
    }

    // reset tipping for new collision
    item.classList.remove('tilt-left');
    item.classList.remove('tilt-right');

    // bounce in opposite direction
    switch (currentDirection) {
      case 'left':
        this.tipIt('left', item);
        collisionActions();
        this.babyPos.left = Math.round(this.babyPos.left + bounceAmount);
        babyContainer.style.left = this.babyPos.left + 'px';
        break;
      case 'right':
        this.tipIt('right', item);
        collisionActions();
        this.babyPos.right = Math.round(this.babyPos.left - bounceAmount);
        break;
      case 'up':
        this.tipIt('up', item);
        collisionActions();
        this.babyPos.top = Math.round(this.babyPos.top + bounceAmount);
        break;
      case 'down':
        this.tipIt('down', item);
        collisionActions();
        this.babyPos.top = Math.round(this.babyPos.top - bounceAmount);
        break;
      default:
        throw new Error("Oops, there's a bounceback issue. Can't tell where he's coming from.");
        break;
    }
    this.babyPos.right = babyContainer.getBoundingClientRect().right;
    this.babyPos.bottom = babyContainer.getBoundingClientRect().bottom;
  }

  collisionTest(item) {
    const babyRect = babyContainer.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const horizontalOverlap = babyRect.left <= itemRect.right && babyRect.right >= itemRect.left;
    const verticalOverlap = babyRect.top <= itemRect.bottom && babyRect.bottom >= itemRect.top;
    return horizontalOverlap && verticalOverlap;
  }

  // not yet used
  collisionActions(item) {
    s_collision.play();
    if (item.classList.contains('touched')) {
      babyInstance.giggle();
    } else {
      babyInstance.collisionNoise();
    }
  }

  isOffScreen() {
    const babyRect = babyContainer.getBoundingClientRect();
    if (babyRect.bottom >= window.innerHeight) {
      this.babyPos.top -= 40;
      s_boing.play();
    }
    if (babyRect.top <= 0) {
      this.babyPos.top += 40;
      s_boing.play();
    }
    if (babyRect.left <= 0) {
      this.babyPos.left += 40;
      s_boing.play();
    }
    if (babyRect.right >= window.innerWidth) {
      this.babyPos.left -= 40;
      s_boing.play();
    }
  }

  isTouching(originalPosition) {
    const babyRect = babyContainer.getBoundingClientRect();
    let isColliding = false;

    items.forEach((item) => {
      if (this.collisionTest(item)) {
        // if it's colliding, add touched, set isColliding, bounceBabyBack, and addToScore
        item.classList.add('touched');
        isColliding = true;

        function collisionActions() {
          s_collision.play();
          if (item.classList.contains('touched')) {
            babyInstance.giggle();
          } else {
            babyInstance.collisionNoise();
          }
        }

        if (item.collisions === undefined) {
          item.collisions = 1;
          this.addToScore(item);
          this.bounceBabyBack(item);
        } else {
          item.collisions++;

          this.bounceBabyBack(item);
        }

        if (items.length === document.getElementsByClassName('touched').length) {
          this.endGame();
        }
      }
    });
  }

  move(e) {
    e = e || window.Event;
    // Store the current position as a backup in case of collision
    const originalPosition = {
      top: this.babyPos.top,
      left: this.babyPos.left,
    };

    switch (e.key) {
      // up arrow
      case 'ArrowUp':
        // Check if moving up would stay within the window boundaries
        this.babyPos.top -= 10;
        this.setDirectionClass('up');
        this.isOffScreen();
        break;
      // down arrow
      case 'ArrowDown':
        // Check if moving down would stay within the window boundaries
        this.babyPos.top += 10;
        this.setDirectionClass('down');
        this.isOffScreen();
        break;
      // left arrow
      case 'ArrowLeft':
        // Check if moving left would stay within the window boundaries
        this.babyPos.left -= 10;
        this.setDirectionClass('left');
        this.isOffScreen();
        break;
      // right arrow
      case 'ArrowRight':
        // Check if moving right would stay within the window boundaries
        this.babyPos.left += 10;
        this.setDirectionClass('right');
        this.isOffScreen();
        break;
      default:
        break;
    }

    // Check for collisions after moving
    this.isTouching(originalPosition);
  }

  //--------------  ORIENTATION  ----------------//

  setDirectionClass(direction) {
    babyContainer.className = '';
    babyContainer.classList.add('going-' + direction);
    if (direction === 'up' || direction === 'down') {
      babyContainer.style.top = this.babyPos.top + 'px';
    } else if (direction === 'left' || direction === 'right') {
      babyContainer.style.left = this.babyPos.left + 'px';
    }
  }

  tipIt(dir, item) {
    if (dir === 'left' || dir === 'up') {
      item.classList.add('tip-left');
    } else if (dir === 'right' || dir === 'down') {
      item.classList.add('tip-right');
    }
    // Future feature
    // else {
    //   let rand = Math.floor(Math.random() * 2);
    //   rand = 0 ? item.classList.add('tip-left') : item.classList.add('tip-right');
    // }
    //make sure baby isn't still colliding by moving baby out of item bounds towards center
  }

  //--------------  GAME ACTIONS  ----------------//

  startGame() {
    babyName.textContent = inputBabyName.value.toUpperCase() + "'S";
    gameIsRunning = true;

    modalBG.classList.add('hide');
    startModal.classList.add('hide', 'gone');

    // place it behind everything else
    setTimeout(() => {
      modalBG.style.zIndex = -10;
    }, 505);
  }

  endGame() {
    modalBG.classList.remove('hide');
    setTimeout(() => {
      modalBG.style.zIndex = 100;
    }, 300);
    endModal.style.zIndex = 101;
    endModal.classList.remove('hide');
    endModal.classList.add('show');
    document.querySelector('.win').classList.remove('hide');
  }
}

function liftOff() {
  babyInstance = new baby(inputBabyName.value);
  babyInstance.startGame();
}

//--------------  EVENT LISTENERS  ----------------//

window.addEventListener('keydown', (e) => {
  if (gameIsRunning) {
    babyInstance.move(e);
  }
});

inputBabyName.addEventListener('keyup', () => {
  if (inputBabyName.value.length > 1) {
    startButton.disabled = false;
  }
});

inputBabyName.addEventListener('keypress', (e) => {
  if (e.key.match(startRegex) !== null) {
    liftOff();
  }
});

startButton.addEventListener('click', () => {
  liftOff();
});

babyContainer.addEventListener('click', () => {
  babyInstance.endGame();
});

volumeControl.addEventListener('change', () => {
  setVolume();
});

instructions.addEventListener('click', () => {
  info.classList.remove('gone');
  setTimeout(() => {
    info.classList.add('show');
  }, 100);
});

info.addEventListener('click', () => {
  info.classList.remove('show');
  setTimeout(() => {
    info.classList.add('hide');
    info.classList.add('gone');
  }, 500);
});

document.addEventListener('DOMContentLoaded', () => {
  startModal.classList.remove('hide');
  startModal.classList.add('show');
});

//--------------  RANDOM NOISES & FUNCTIONS  ----------------//

// set a random timeout
// then play a random sound

function soundPause() {
  let delayTime = Math.floor(Math.random() * 5000 + 2500);
  return delayTime;
}

// with a little help from Leith
function setVolume() {
  const vol = volumeControl.value;
  allSounds.forEach((s) => {
    s.volume = vol / 100;
  });
  fart.forEach((f) => {
    f.volume = vol / 100;
  });
  laugh.forEach((l) => {
    l.volume = vol / 100;
  });
}

function makeNoises() {
  let laughOrFart = Math.floor(Math.random() * 10);
  if (laughOrFart === 0) {
    // fart
    let fartNum = Math.floor(Math.random() * 3);
    fart[fartNum].play();
  } else {
    let laughNum = Math.floor(Math.random() * 10);
    laugh[laughNum].play();
  }
}

(function noiseLoop() {
  setTimeout(() => {
    makeNoises();
    noiseLoop();
  }, soundPause());
})();

setVolume();
