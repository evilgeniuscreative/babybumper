/*
 *
 *
 *
 *
 */
const items = document.querySelectorAll('.item');
const babyIcon = document.getElementById('baby');
const objLocationMap = {};

// SOUNDS
const s_boing = new Audio('sounds/boing.mp3');
const s_bonk_deep = new Audio('sounds/bonk-deep.mp3');
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
      babyIcon.style.top = this.babyPos.top.toString() + 'px';
    } else if (direction === 'left' || direction === 'right') {
      babyIcon.style.left = this.babyPos.left.toString() + 'px';
    }
  }

  move(e) {
    e = e || window.Event;
    console.log('moving', e.key);
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
        console.log('something is wrong in the direction switch. Keypress was:', e.key);
        break;
    }
    this.babyPos.right = babyIcon.getBoundingClientRect().right;
    this.babyPos.bottom = babyIcon.getBoundingClientRect().bottom;
    this.isTouching();
  }

  addToScore() {}

  stopBaby() {
    let babyDirection = babyIcon.className;
    switch n  
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
        this.stopBaby();
      }
    });

    if (!isColliding) {
      console.log('Baby is not colliding with any item.');
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
