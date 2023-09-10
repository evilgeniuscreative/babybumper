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
console.log('items', items);
items.forEach((item) => {
  console.log(this);

  item.addEventListener('click', function () {
    this.classList.add('tip-left');
  });
});
class baby {
  constructor(name) {
    this.name = name;
  }

  move() {}

  addToScore() {}

  isTouching() {}
}
