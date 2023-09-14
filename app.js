class Player {
    constructor( x, y, element ) {
        this.x = x;
        this.y = y;
        this.element = element;
        this.moveSpeed = 5; // Speed of movement in pixels
    }

    move( dx, dy ) {
        this.x += dx;
        this.y += dy;
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    }
}

document.addEventListener( "DOMContentLoaded", function () {
    const playerElement = document.getElementById( "playerEntity" );
    const obstacleElement = document.getElementById( "obstacleEntity" );

    const player = new Player( 50, 50, playerElement );

    document.addEventListener( "keydown", function ( event ) {
        switch ( event.key ) {
            case "ArrowUp":
                player.move( 0, -player.moveSpeed );
                break;
            case "ArrowDown":
                player.move( 0, player.moveSpeed );
                break;
            case "ArrowLeft":
                player.move( -player.moveSpeed, 0 );
                break;
            case "ArrowRight":
                player.move( player.moveSpeed, 0 );
                break;
        }
    } );

    function update() {
        // Check for collisions
        if ( isColliding( player.element, obstacleElement ) ) {
            console.log( "Collision detected!" );
        }

        // Request the next frame
        requestAnimationFrame( update );
    }

    // Start the update loop
    update();

    function isColliding( div1, div2 ) {
        const rect1 = div1.getBoundingClientRect();
        const rect2 = div2.getBoundingClientRect();

        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }
} );