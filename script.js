/*
 *
 *
 *
 *
 */
const items = document.querySelectorAll('.item');
const babyIcon = document.getElementById('baby');

// set baby starting position
babyIcon.style.top = 400 + 'px';
babyIcon.style.left = 490 + 'px';
const objLocationMap = {};

// SOUNDS
const s_boing = new Audio('sounds/boing.mp3');
const s_collision = new Audio('sounds/collision.mp3');
const s_wah = new Audio('sounds/wah.mp3');
const s_crying = new Audio('sounds/crying.mp3');
const s_giggle = new Audio('sounds/giggle.mp3');
const s_laugh = new Audio('sounds/laugh.mp3');
const s_fart = new Audio('sounds/fart.mp3');
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

  objLocationMap[item.dataset.name] = {
    top: Math.round(item.getBoundingClientRect().top),
    bottom: Math.round(item.getBoundingClientRect().bottom),
    left: Math.round(item.getBoundingClientRect().left),
    right: Math.round(item.getBoundingClientRect().right),
    width: Math.round(item.getBoundingClientRect().width),
    height: Math.round(item.getBoundingClientRect().height),
  };
});
console.log('locations', objLocationMap);

class baby {
  constructor(name) {
    this.name = name;
    this.babyPos = { top: babyIcon.offsetTop, left: babyIcon.offsetLeft };
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

  giggle() {
    s_giggle.play();
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

  addToScore() {}

  tipIt(dir, item) {
    if (dir === 'left') {
      item.classList.add('tip-left');
    } else if (dir === 'right') {
      item.classList.add('tip-right');
    } else {
      let rand = Math.floor(Math.random() * 2);
      rand = 0 ? item.classList.add('tip-left') : item.classList.add('tip-right');
    }
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
        this.babyPos.bottom = Math.round(this.babyPos.top - 30);
        break;
      default:
        throw new Error("Oops, there's a bouneback issue. Can't tell where he's coming from.");
        break;
    }

    let randomFart = Math.floor(Math.random() * 3);
    if (randomFart === 3) {
      s_fart.play();
    }

    this.babyPos.right = babyIcon.getBoundingClientRect().right;
    this.babyPos.bottom = babyIcon.getBoundingClientRect().bottom;

    // this.babyPos[opposites[currentDir]]=
    // 1. get the (going-)right direction from class -- OK
    // 2. bounce him in the opposite direction 10px, top or left, +/-
    // 3. make a noise
    // 4. crash the object
    // 5. make a noise
    // each time he impacts the object after the first time, rerun 1-3
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
        item.classList.add('touched');
        this.bounceBabyBack(item);
      }
    });

    if (!isColliding) {
      //console.log('Baby is not colliding with any item.');
    }
  }
}

const screenBaby = new baby('Toby');

babyIcon.addEventListener('click', () => {
  console.log('Baby clicked');
});

window.addEventListener('keydown', (e) => {
  screenBaby.move(e);
});
