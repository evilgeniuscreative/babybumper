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
const sofa = document.getElementById( 'sofa' );
const objLocationMap = {};
console.log( 'items', items );
items.forEach( ( item, i ) => {
    console.log( 'item', i, item.dataset.name );

    item.addEventListener( 'click', function () {
        this.classList.toggle( 'tip-left' );
    } );

    objLocationMap[item.dataset.name] = {
        top   : Math.round( item.getBoundingClientRect().top ),
        bottom: Math.round( item.getBoundingClientRect().bottom ),
        left  : Math.round( item.getBoundingClientRect().left ),
        right : Math.round( item.getBoundingClientRect().right ),
    };
} );
console.log( 'locations', objLocationMap );

class baby {
    constructor( name ) {
        this.name = name;
        this.babyPosX = 50;
        this.babyPosY = 350;
        this.moveSpeed = 10;

        // this.babyPos = {
        //     top   : Math.round( babyIcon.getBoundingClientRect().top ),
        //     bottom: Math.round( babyIcon.getBoundingClientRect().bottom ),
        //     left  : Math.round( babyIcon.getBoundingClientRect().left ),
        //     right : Math.round( babyIcon.getBoundingClientRect().right ),
        // };
    }

    setDirectionClass( direction ) {
        babyIcon.className = '';
        babyIcon.classList.add( 'going-' + direction );
        // if ( direction === 'up' || direction === 'down' ) {
        //     babyIcon.style.top = this.babyPos.top.toString() + 'px';
        //
        // } else if ( direction === 'left' || direction === 'right' ) {
        //     babyIcon.style.left = this.babyPos.left.toString() + 'px';
        // }
    }

    update() {
        babyIcon.style.left = this.babyPosX + 'px';
        babyIcon.style.top = this.babyPosY + 'px';
        if ( this.isColliding( babyIcon, sofa ) ) {
            console.log( 'collision detected' );
        }
        requestAnimationFrame( this.update );
    }

    isColliding( babyWrapper, itemDiv ) {
        const babyCoords = babyWrapper.getBoundingClientRect();
        const itemCoords = itemDiv.getBoundingClientRect();
        return !(babyCoords.right < itemCoords.left || babyCoords.left > itemCoords.right ||
            babyCoords.bottom < itemCoords.top || babyCoords.top > itemCoords.bottom);
    }

    move( e ) {
        e = e || window.Event;
        // console.log( 'moving', e.key );
        switch ( e.key ) {
            // up arrow
            case 'ArrowUp':
                this.babyPosY -= this.moveSpeed;
                this.setDirectionClass( 'up' );
                break;
            // down arrow
            case 'ArrowDown':
                this.babyPosY += this.moveSpeed;
                this.setDirectionClass( 'down' );
                break;
            // left arrow
            case 'ArrowLeft':
                this.babyPosX -= this.moveSpeed;
                this.setDirectionClass( 'left' );
                break;
            // right arrow
            case 'ArrowRight':
                this.babyPosX += this.moveSpeed;
                this.setDirectionClass( 'right' );
                break;
            default:
                console.log( 'something is wrong in the direction switch. Keypress was:', e.key );
                break;
        }

        this.isTouching();
    }

    addToScore() {
    }

    isTouching() {
        let isColliding = false;
        Object.entries( objLocationMap ).forEach( ( entry ) => {
            const [itemName, itemPos] = entry;
            console.log( 'NAME:', itemName, 'COORD:', itemPos );
            // console.log( 'babyPosition', this.babyPos );
            console.log( 'babyPosX:', this.babyPosX, 'babyPosY:', this.babyPosY );


        } );


    }
}


const screenBaby = new baby( 'Toby' );

window.addEventListener( 'keydown', ( e ) => {
    screenBaby.move( e );
} );


