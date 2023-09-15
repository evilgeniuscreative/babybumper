// create a baby class
// - add move method, up down left right depending on the input
// - add addToScore method to update score
// - add isTouching method to determine if the baby is touching anything
/*
 *
 *
 *
 *
 */
const items = document.querySelectorAll('.item');
const babyIcon = document.getElementById('baby');
const objLocationMap = {};
console.log('items', items);
items.forEach((item, i) => {
  console.log('item', i, item.dataset.name);

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

  isTouching() {
    const babyRect = babyIcon.getBoundingClientRect();

    let isColliding = false;

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();

      const horizontalOverlap = babyRect.left <= itemRect.right && babyRect.right >= itemRect.left;
      const verticalOverlap = babyRect.top <= itemRect.bottom && babyRect.bottom >= itemRect.top;

      if (horizontalOverlap && verticalOverlap) {
        console.log('Baby is colliding with item:', item.dataset.name);
        isColliding = true;
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

window.screen.height;
