ScriptProcessorNode;
/*
 *
 *
 *
 *
 */
const items = document.querySelectorAll('.item');
const babyIcon = document.getElementById('baby');
const enterBabyName = document.getElementById('enterBabyName');
const startButton = document.getElementById('start');
const modal = document.getElementById('modalBG');
const babyName = document.getElementById('babyName');
let gameRunning = false;
let score = 0;
// baby image is 244 x 192
//console.log('innerHeight', window.innerHeight, 'innerWidth', window.innerWidth);

// set baby starting position
babyIcon.style.top = window.innerHeight - 325 + 'px';
babyIcon.style.left = window.innerWidth / 2 - 150 + 'px';
const itemReference = {};

// SOUNDS
const fart = [];
const laugh = [];
const s_boing = new Audio('sounds/boing.mp3');
const s_collision = new Audio('sounds/collision.mp3');
const s_wah = new Audio('sounds/wah.mp3');
const s_crying = new Audio('sounds/crying.mp3');
const s_giggle = new Audio('sounds/giggle.mp3');
fart.push(new Audio('sounds/fart_0.mp3'));
fart.push(new Audio('sounds/fart_1.mp3'));
fart.push(new Audio('sounds/fart_2.mp3'));
console.log(fart);
for (let l = 0; l < 12; l++) {
  laugh.push(new Audio('sounds/laugh_' + l + '.mp3'));
}
console.log(laugh);
const s_crash = new Audio('sounds/crash-loud-short.mp3');
const s_end = new Audio('sounds/endgame.mp3');
const s_glass_break = new Audio('sounds/glass-break-short.mp3');
const s_glass_deeper = new Audio('sounds/glass-break-deeper.mp3');
const s_mouth_harp = new Audio('sounds/mouth-harp.mp3');
const s_moving_chair = new Audio('sounds/moving-chair.mp3');
const s_moving_furn = new Audio('sounds/moving-furniture.mp3');

items.forEach((item, i) => {
  item.addEventListener('click', function () {
    this.classList.toggle('tip-left');
  });

  itemReference[item.dataset.name] = {
    top: Math.round(item.getBoundingClientRect().top),
    bottom: Math.round(item.getBoundingClientRect().bottom),
    left: Math.round(item.getBoundingClientRect().left),
    right: Math.round(item.getBoundingClientRect().right),
    width: Math.round(item.getBoundingClientRect().width),
    height: Math.round(item.getBoundingClientRect().height),
  };
});
console.log('locations', itemReference);

class baby {
  constructor(name) {
    this.name = name;
    this.babyPos = { top: babyIcon.offsetTop, left: babyIcon.offsetLeft };
  }

  addToScore(item) {
    console.log(item.dataset.score);
    score += item.dataset.score;
  }

  bounceBabyBack(item) {
    // get the word for current direction, i., right, left, etc.
    let currentDir = babyIcon.className.slice(babyIcon.className.indexOf('-') + 1);
    // since we're only operating on x and y, treat up and down as one direction, and left and right as the other.

    item.classList.remove('tilt-left');
    item.classList.remove('tilt-right');
    switch (currentDir) {
      case 'left':
        this.tipIt('left', item);
        s_collision.play();
        this.cry();
        if (item.classList.contains('touched')) {
          this.giggle();
        } else {
          this.cry();
        }
        this.babyPos.left = Math.round(this.babyPos.left + 30);
        babyIcon.style.left = this.babyPos.left + 'px';
        break;
      case 'right':
        this.tipIt('right', item);
        s_collision.play();
        if (item.classList.contains('touched')) {
          this.giggle();
        } else {
          this.cry();
        }
        this.babyPos.right = Math.round(this.babyPos.left - 30);
        break;
      case 'up':
        this.tipIt('rand', item);
        s_collision.play();
        if (item.classList.contains('touched')) {
          this.giggle();
        } else {
          this.cry();
        }
        this.babyPos.top = Math.round(this.babyPos.top + 30);
        break;
      case 'down':
        this.tipIt('rand', item);
        s_collision.play();
        if (item.classList.contains('touched')) {
          this.giggle();
        } else {
          this.cry();
        }
        this.babyPos.top = Math.round(this.babyPos.top - 30);
        break;
      default:
        throw new Error("Oops, there's a bounceback issue. Can't tell where he's coming from.");
        break;
    }
    this.babyPos.right = babyIcon.getBoundingClientRect().right;
    this.babyPos.bottom = babyIcon.getBoundingClientRect().bottom;
  }

  cry() {
    setTimeout(() => {
      console.log('enter cry');
      document.getElementById('babyImg').src = 'img/baby-cry.webp';
      s_crying.play();
    }, 100);
    setTimeout(() => {
      document.getElementById('babyImg').src = 'img/baby.webp';
      s_laugh.play();
    }, 4300);
  }

  isTouching() {
    const babyRect = babyIcon.getBoundingClientRect();

    let isColliding = false;

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();

      const horizontalOverlap = babyRect.left <= itemRect.right && babyRect.right >= itemRect.left;
      const verticalOverlap = babyRect.top <= itemRect.bottom && babyRect.bottom >= itemRect.top;

      if (horizontalOverlap && verticalOverlap) {
        console.log('😳 👼🏻  Baby is colliding with item:', item.dataset.name);
        isColliding = true;
        this.bounceBabyBack(item);
        item.classList.add('touched');
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
    this.babyPos.right = babyIcon.getBoundingClientRect().right;
    this.babyPos.bottom = babyIcon.getBoundingClientRect().top;
    this.isTouching();
  }

  setDirectionClass(direction) {
    babyIcon.className = '';
    babyIcon.classList.add('going-' + direction);
    if (direction === 'up' || direction === 'down') {
      babyIcon.style.top = this.babyPos.top + 'px';
    } else if (direction === 'left' || direction === 'right') {
      babyIcon.style.left = this.babyPos.left + 'px';
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
}

window.addEventListener('keydown', (e) => {
  if (gameRunning) {
    screenBaby.move(e);
  }
});

enterBabyName.addEventListener('keyup', () => {
  if (enterBabyName.value.length > 1) {
    startButton.disabled = false;
  }
});
startButton.addEventListener('click', () => {
  const screenBaby = new baby(enterBabyName.value);
  babyName.textContent = enterBabyName.value.toUpperCase() + "'S";
  gameRunning = true;
  modal.classList.add('hide');
  setTimeout(() => {
    modal.style.zIndex = -10;
  }, 505);
});

let iterations = 1;
(function gig(iterations) {
  iterations += 1;
  if (iterations <= 50) {
    // TODO: need to create a minimum time between noises
    let soundPause = Math.floor(Math.random() * 200000 + 14000);
    console.log('soundPause', soundPause);
    setTimeout(() => {
      let laughOrFart = Math.floor(Math.random() * 10);
      if (laughOrFart === 0) {
        // fart
        let fartNum = Math.floor(Math.random() * 3);
        console.log(fart[fartNum]);
        fart[fartNum].play();
      } else {
        let laughNum = Math.floor(Math.random() * 10);
        console.log(laugh[laughNum]);
        laugh[laughNum].play();
      }
    }, soundPause);
    gig(iterations);
  }
})(iterations);
