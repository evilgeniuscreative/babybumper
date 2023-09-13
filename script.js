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
const items = document.querySelectorAll( '.item' );
const babyIcon = document.getElementById( 'baby' );
const objLocationMap = {};
console.log( 'items', items );
items.forEach( ( item, i ) => {
    console.log( 'item', i, item.dataset.name );

    item.addEventListener( 'click', function () {
        this.classList.toggle( 'tip-left' );
    } );

    objLocationMap[item.dataset.name] = {top: item.getBoundingClientRect().top, bottom: item.getBoundingClientRect().bottom, left: item.getBoundingClientRect().left, right: item.getBoundingClientRect().right};
} );
console.log( 'locations', objLocationMap );

class baby {
    constructor( name ) {
        this.name = name;
        this.babyPosition = {top: babyIcon.offsetTop, left: babyIcon.offsetLeft}
    }

    move( e ) {
        e = e || window.Event;


        console.log( 'move', e.key );
        switch ( e.key ) {
            // up arrow
            case 'ArrowUp':
                this.babyPosition.top = Math.ceil( this.babyPosition.top ) - 10;
                babyIcon.className = '';
                babyIcon.classList.add( 'going-up' );
                babyIcon.style.top = this.babyPosition.top.toString() + 'px';
                break;
            // down arrow
            case 'ArrowDown':
                this.babyPosition.top = Math.floor( this.babyPosition.top ) + 10;
                babyIcon.className = '';
                babyIcon.classList.add( 'going-down' );
                babyIcon.style.top = this.babyPosition.top.toString() + 'px';
                break;
            // left arrow
            case 'ArrowLeft':
                this.babyPosition.left = Math.floor( this.babyPosition.left ) - 10;
                babyIcon.className = '';
                babyIcon.classList.add( 'going-left' );
                babyIcon.style.left = this.babyPosition.left.toString() + 'px';

                break;
            // right arrow
            case 'ArrowRight':
                this.babyPosition.left = Math.floor( this.babyPosition.left ) + 10;
                babyIcon.className = '';
                babyIcon.classList.add( 'going-right' );
                babyIcon.style.left = this.babyPosition.left.toString() + 'px';
                break;
        }
        console.log( 'babyIcon', babyIcon, 'babyPosition', this.babyPosition );
    }

    addToScore() {
    }

    isTouching() {

    }
}

const screenBaby = new baby( 'Toby' );

babyIcon.addEventListener( 'click', () => {
    console.log( 'Baby clicked' );
} );


window.addEventListener( 'keydown', ( e ) => {
    screenBaby.move( e )
} )