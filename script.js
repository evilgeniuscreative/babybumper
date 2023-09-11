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
  console.log(item);

  item.addEventListener('click', function () {
    this.classList.toggle('tip-left');
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
