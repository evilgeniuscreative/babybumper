/*
 *
 * BABY BUMPER
 * The game where you're the baby for real this time ;)
 *
 */
const items = document.querySelectorAll('.item'); // items.length = total number of items
const babyContainer = document.getElementById('baby');
const inputBabyName = document.getElementById('inputBabyName');
const startButton = document.getElementById('start');
const modalBG = document.getElementById('modalBG');
const startModal = document.getElementById('startModal');
const endModal = document.getElementById('endModal');
const babyName = document.getElementById('babyName');
const runningScoreDisplay = document.getElementById('runningScoreDisplay');
let runningScore = parseInt(runningScoreDisplay.textContent);

const startRegex = /enter|return/i;

let babyInstance;
let gameIsRunning = false;
let endDamages = 0;

// set baby starting position
// baby image is 244 x 192
babyContainer.style.top = window.innerHeight - 325 + 'px';
babyContainer.style.left = window.innerWidth / 2 - 150 + 'px';

const itemPositionReference = {};

// SOUNDS
const fart = [];
const laugh = [];
const s_boing = new Audio('sounds/boing.mp3');
const s_collision = new Audio('sounds/collision.mp3');
const s_wah = new Audio('sounds/wah.mp3');
const s_crying = new Audio('sounds/crying.mp3');
const s_giggle = new Audio('sounds/laugh_0.mp3');
fart.push(new Audio('sounds/fart_0.mp3'));
fart.push(new Audio('sounds/fart_1.mp3'));
fart.push(new Audio('sounds/fart_2.mp3'));
for (let l = 0; l < 12; l++) {
  laugh.push(new Audio('sounds/laugh_' + l + '.mp3'));
}
const s_crash = new Audio('sounds/crash-loud-short.mp3');
const s_ding = new Audio('sounds/ding.mp3');
const s_end = new Audio('sounds/endgame.mp3');
const s_glass_break = new Audio('sounds/glass-break-short.mp3');
const s_glass_deeper = new Audio('sounds/glass-break-deeper.mp3');
const s_mouth_harp = new Audio('sounds/mouth-harp.mp3');
const s_moving_chair = new Audio('sounds/moving-chair.mp3');
const s_moving_furn = new Audio('sounds/moving-furniture.mp3');

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
    console.log('enter addToScore()');
    let startDamages = runningScore;

    //
    const pause = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };

    console.log('startDamages', startDamages, 'runningScore', runningScore);

    // prevent double scoring for same item
    if (!item.classList.contains('damaged')) {
      item.classList.add('damaged');
      endDamages += parseInt(item.dataset.cost);
      console.log('endDamages', endDamages);

      // iterate up to totalDamages by 1 for visual engagement
      // Promise script by https://javascript.plainenglish.io/javascript-slow-down-for-loop-9d1caaeeeeed
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
        setTimeout(() => {
          runningScoreDisplay.classList.remove('mischief-managed');
          s_ding.play();
        }, 600);
      });

      runningScore = parseInt(runningScoreDisplay.textContent);
    }
  }

  //--------------  SOUND ACTIONS  ----------------//

  noiseAfterBump() {
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

  bounceBabyBack(item) {
    // get the word for current direction, i., right, left, etc.
    let currentDirection = babyContainer.className.slice(babyContainer.className.indexOf('-') + 1);
    // since we're only operating on x and y, treat up and down as one direction, and left and right as the other.

    function collisionActions() {
      console.log('collistion actions()');
      s_collision.play();
      babyInstance.noiseAfterBump();
      if (item.classList.contains('touched')) {
        babyInstance.giggle();
      } else {
        babyInstance.noiseAfterBump();
      }
    }
    item.classList.remove('tilt-left');
    item.classList.remove('tilt-right');
    switch (currentDirection) {
      case 'left':
        this.tipIt('left', item);
        collisionActions();
        this.babyPos.left = Math.round(this.babyPos.left + 30);
        babyContainer.style.left = this.babyPos.left + 'px';
        break;
      case 'right':
        this.tipIt('right', item);
        collisionActions();
        this.babyPos.right = Math.round(this.babyPos.left - 30);
        break;
      case 'up':
        this.tipIt('rand', item);
        collisionActions();
        this.babyPos.top = Math.round(this.babyPos.top + 30);
        break;
      case 'down':
        this.tipIt('rand', item);
        collisionActions();
        this.babyPos.top = Math.round(this.babyPos.top - 30);
        break;
      default:
        throw new Error("Oops, there's a bounceback issue. Can't tell where he's coming from.");
        break;
    }
    this.babyPos.right = babyContainer.getBoundingClientRect().right;
    this.babyPos.bottom = babyContainer.getBoundingClientRect().bottom;
  }

  isTouching() {
    const babyRect = babyContainer.getBoundingClientRect();

    let isColliding = false;

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();

      const horizontalOverlap = babyRect.left <= itemRect.right && babyRect.right >= itemRect.left;
      const verticalOverlap = babyRect.top <= itemRect.bottom && babyRect.bottom >= itemRect.top;

      if (horizontalOverlap && verticalOverlap) {
        item.classList.add('touched');
        let touchedItems = document.getElementsByClassName('touched');
        isColliding = true;
        this.bounceBabyBack(item);
        this.addToScore(item);

        console.log('items:', items.length, 'touchedItems:', touchedItems.length);

        if (items.length === touchedItems.length) {
          this.endGame();
        }
      }
    });

    if (!isColliding) {
      //console.log('Baby is not colliding with any item.');
    }
  }

  move(e) {
    e = e || window.Event;
    //console.log('moving', e.key);
    switch (e.key) {
      // up arrow
      case 'ArrowUp':
        this.babyPos.top = Math.round(this.babyPos.top - 10);
        this.setDirectionClass('up');
        break;
      // down arrow
      case 'ArrowDown':
        this.babyPos.top = Math.round(this.babyPos.top + 10);
        this.setDirectionClass('down');
        break;
      // left arrow
      case 'ArrowLeft':
        this.babyPos.left = Math.round(this.babyPos.left - 10);
        this.setDirectionClass('left');
        break;
      // right arrow
      case 'ArrowRight':
        this.babyPos.left = Math.round(this.babyPos.left) + 10;
        this.setDirectionClass('right');
        break;
      default:
        throw new Error('Something is wrong in the direction switch, user probably pressed not an arrow key. Do nothing. Keypress was:', e.key);
        break;
    }
    this.babyPos.right = babyContainer.getBoundingClientRect().right;
    this.babyPos.bottom = babyContainer.getBoundingClientRect().top;
    this.isTouching();
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
    if (dir === 'left') {
      item.classList.add('tip-left');
    } else if (dir === 'right') {
      item.classList.add('tip-right');
    } else {
      let rand = Math.floor(Math.random() * 2);
      rand = 0 ? item.classList.add('tip-left') : item.classList.add('tip-right');
    }
    this.addToScore(item);
  }

  startGame() {
    babyName.textContent = inputBabyName.value.toUpperCase() + "'S";
    gameIsRunning = true;

    modalBG.classList.add('hide');
    startModal.classList.add('hide');

    // place it behind everything else
    setTimeout(() => {
      modalBG.style.zIndex = -10;
    }, 505);
  }

  endGame() {
    console.log('Game Ended');
    modalBG.classList.remove('hide');
    setTimeout(() => {
      modalBG.style.zIndex = 100;
    }, 300);
    endModal.style.zIndex = 101;
    endModal.classList.remove('hide');
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
  console.log('e.key', e.key, e.key.match(startRegex) !== null);
  if (e.key.match(startRegex) !== null) {
    liftOff();
  }
});

startButton.addEventListener('click', () => {
  liftOff();
});

//--------------  RANDOM NOISES  ----------------//

// set a random timeout
// then play a random sound

function soundPause() {
  let delayTime = Math.floor(Math.random() * 5000 + 2500);
  return delayTime;
}

function makeNoises() {
  console.log('make noises');
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

// (function noiseLoop() {
//   setTimeout(() => {
//     makeNoises();
//     noiseLoop();
//   }, soundPause());
// })();
