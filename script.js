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
        this.babyPos = {top: babyIcon.offsetTop, left: babyIcon.offsetLeft};
    }

    setDirectionClass( direction ) {
        babyIcon.className = '';
        babyIcon.classList.add( 'going-' + direction );
        if ( direction === 'up' || direction === 'down' ) {
            babyIcon.style.top = this.babyPos.top.toString() + 'px';
        } else if ( direction === 'left' || direction === 'right' ) {
            babyIcon.style.left = this.babyPos.left.toString() + 'px';
        }
    }

    move( e ) {
        e = e || window.Event;
        console.log( 'moving', e.key );
        switch ( e.key ) {
            // up arrow
            case 'ArrowUp':
                this.babyPos.top = Math.round( this.babyPos.top - 10 );
                this.setDirectionClass( 'up' );
                break;
            // down arrow
            case 'ArrowDown':
                this.babyPos.top = Math.round( this.babyPos.top + 10 );
                this.setDirectionClass( 'down' );
                break;
            // left arrow
            case 'ArrowLeft':
                this.babyPos.left = Math.round( this.babyPos.left - 10 );
                this.setDirectionClass( 'left' );
                break;
            // right arrow
            case 'ArrowRight':
                this.babyPos.left = Math.round( this.babyPos.left ) + 10;
                this.setDirectionClass( 'right' );
                break;
            default:
                console.log( 'something is wrong in the direction switch. Keypress was:', e.key );
                break;
        }
        this.babyPos.right = babyIcon.getBoundingClientRect().right;
        this.babyPos.bottom = babyIcon.getBoundingClientRect().bottom;
        this.isTouching();
    }

    addToScore() {
    }

    isTouching() {
        let verticalTouch = false;
        let horizontalTouch = false;
        Object.entries( objLocationMap ).forEach( ( entry ) => {
            const [itemName, itemPos] = entry;
            console.log( 'NAME:', itemName, 'COORD:', itemPos );
            console.log( 'babyPosition', this.babyPos );

// if it's in-between the item top and bottom AND in-between item's left and right, it's touching
            // top 0 => top 1000
            // left 0 => left 1000

            const hTouch = this.babyPos.right >= itemPos.left || this.babyPos.left <= itemPos.right; // horizontal plane match
            const vTouch = this.babyPos.top <= itemPos.bottom || this.babyPos.bottom >= itemPos.top; // vertical plane match


            console.log( 'vTouch:', vTouch, 'hTouch', hTouch );
            console.log( 'isTouching:', vTouch && hTouch );

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


;
window.screen.height

