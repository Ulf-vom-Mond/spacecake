window.onload = function() {
    var game = new Game();

    document.addEventListener('keydown', function(e) {return onKey(e, true, game);}, false);
    document.addEventListener('keyup', function(e) {return onKey(e, false, game);}, false);
};

function onKey(event, pressed, game) {
    pressed = pressed ? 0xFF : 0x00;
    if(event.key == "a") {
        game.keys = pressed & (1<<0 | game.keys) | ~pressed & (~(1<<0) & game.keys);
    }
    if(event.key == "s") {
        game.keys = pressed & (1<<1 | game.keys) | ~pressed & (~(1<<1) & game.keys);
    }
    if(event.key == "d") {
        game.keys = pressed & (1<<2 | game.keys) | ~pressed & (~(1<<2) & game.keys);
    }
    if(event.key == "f") {
        game.keys = pressed & (1<<3 | game.keys) | ~pressed & (~(1<<3) & game.keys);
    }
}