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

    objLocationMap[item.dataset.name] = {
        top   : Math.ceil( item.getBoundingClientRect().top ),
        bottom: Math.floor( item.getBoundingClientRect().bottom ),
        left  : Math.floor( item.getBoundingClientRect().left ),
        right : Math.floor( item.getBoundingClientRect().right ),
    };
} );
console.log( 'locations', objLocationMap );

class baby {
    constructor( name ) {
        this.name = name;
        this.babyPosition = {top: babyIcon.offsetTop, left: babyIcon.offsetLeft};
    }

    setDirectionClass( direction ) {
        babyIcon.className = '';
        babyIcon.classList.add( 'going-' + direction );
        if ( direction === 'up' || direction === 'down' ) {
            babyIcon.style.top = this.babyPosition.top.toString() + 'px';
        } else if ( direction === 'left' || direction === 'right' ) {
            babyIcon.style.left = this.babyPosition.left.toString() + 'px';
        }
    }

    move( e ) {
        e = e || window.Event;
        console.log( 'moving', e.key );
        switch ( e.key ) {
            // up arrow
            case 'ArrowUp':
                this.babyPosition.top = Math.ceil( this.babyPosition.top ) - 10;
                this.setDirectionClass( 'up' );
                break;
            // down arrow
            case 'ArrowDown':
                this.babyPosition.top = Math.floor( this.babyPosition.top ) + 10;
                this.setDirectionClass( 'down' );
                break;
            // left arrow
            case 'ArrowLeft':
                this.babyPosition.left = Math.floor( this.babyPosition.left ) - 10;
                this.setDirectionClass( 'left' );
                break;
            // right arrow
            case 'ArrowRight':
                this.babyPosition.left = Math.floor( this.babyPosition.left ) + 10;
                this.setDirectionClass( 'right' );
                break;
            default:
                console.log( 'something is wrong in the direction switch. Keypress was:', e.key );
                break;
        }
        this.babyPosition.right = babyIcon.getBoundingClientRect().right;
        this.babyPosition.bottom = babyIcon.getBoundingClientRect().bottom;
        this.isTouching();
    }

    addToScore() {
    }

    isTouching() {
        let verticalTouch = false;
        let horizontalTouch = false;
        Object.entries( objLocationMap ).forEach( ( entry ) => {
            const [key, coord] = entry;
            console.log( 'NAME:', key, 'COORD:', coord );
            console.log( 'babyPosition', this.babyPosition );
            console.log( `baby.bottom >= ${key}.top:`, this.babyPosition.bottom >= coord['top'] );
            console.log( `baby.top <= ${key}.bottom:`, this.babyPosition.top <= coord['bottom'] );
            console.log( `baby.right >= ${key}.left:`, this.babyPosition.bottom >= coord['left'] );
            console.log( `baby.left <= ${key}.right:`, this.babyPosition.bottom >= coord['top'] );
            // vertical touch
            if ( key === 'top' || key == 'bottom' ) {
                if ( this.babyPosition.bottom >= coord['top'] && this.babyPosition.top <= coord['bottom'] ) {
                    console.log( 'vertical touch' );
                    verticalTouch = true;
                }
            }
            //  horizontal touch
            if ( key === 'left' || key == 'right' ) {
                if ( this.babyPosition.right >= coord['left'] && this.babyPosition.left <= coord['right'] ) {
                    console.log( 'vertical touch' );
                    horizontalTouch = true;
                }
            }
        } );

        if ( horizontalTouch || verticalTouch ) {
            // Elements are touching each other
        }
    }
}

const screenBaby = new baby( 'Toby' );

babyIcon.addEventListener( 'click', () => {
    console.log( 'Baby clicked' );
} );

window.addEventListener( 'keydown', ( e ) => {
    screenBaby.move( e );
} );
