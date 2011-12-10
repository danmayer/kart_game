// Keyboard control comes from
// http://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript
// (http://stackoverflow.com/users/18936/bobince)
function KeyboardController(keys, repeat) {
    // Lookup of key codes to timer ID, or null for no repeat
    var timers= {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    document.onkeydown= function(event) {
        event.preventDefault();
        var key= (event || window.event).keyCode;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat);
        }
        return false;
    };

    // Cancel timeout and mark key as released on keyup
    document.onkeyup= function(event) {
        var key= (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur= function() {
        for (key in timers)
            if (timers[key]!==null)
                clearInterval(timers[key]);
        timers= {};
    };
};
KeyboardController({
    37: function() { drawMap.move({z: drawMap.z + 1}); drawMap.sprite(-1)}, //Left
    38: function() { drawMap.move({y: 3}); }, // UP
    39: function() { drawMap.move({z: drawMap.z - 1}); drawMap.sprite(1) },//Right
    40: function() { drawMap.move({y:  - 3}); } //Down
}, 20);



/* TouchController
 * This provides a simple interface for mapping the screen positions to event handlers
 * It's based on the KeyboardController above but written by me.
 *
 *     ||-------   window.innerWidth    -------------||
 *  +--------------+----------------+-----------------+   =
 *  | top-left     |  top-center    |   top-right     |   |
 *  | middle-left  |  middle-center |   middle-right  |  window.innerHeight
 *  | bottom-left  |  bottom-center |   bottom-right  |   |
 *  +--------------+----------------+-----------------+   =
 *
 * It's a poor-man's touch interface handler.
 * It only handles a single touch at a time. If you want something cleverer, you should use something else
 */
function TouchController(areas, repeat) {
    var touchtimer;
    document.onmousedown = document.ontouchstart = document.ontouchmove = function(e) {
      e.preventDefault();
      var position;
      e.touches = [{'clientX':e.pageX,'clientY':e.pageY}];
      switch(true) {
        case (e.touches[0].clientY<window.innerHeight/3) :
                                                          position = 'top';
                                                          break;
        case (e.touches[0].clientY>(2*window.innerHeight)/3) :
                                                          position = 'bottom';
                                                          break;
        default :
                                                          position = 'middle';
                                                          break;
      }
      position+='-';
      switch(true) {
        case (e.touches[0].clientX<window.innerWidth/3) :
                                                          position += 'left';
                                                          break;
        case (e.touches[0].clientX>(2*window.innerWidth)/3) :
                                                          position += 'right';
                                                          break;
        default :
                                                          position += 'center';
                                                          break;
      }

      if (!(position in areas)) {
         return true;
      }
      areas[position]();
      if (repeat!==0) {
	    	clearInterval(touchtimer);
        touchtimer= setInterval(areas[position], repeat);
      }
      return false;
  };
  // Cancel timeout
  document.onmouseup = document.ontouchend= function(e) {
    clearInterval(touchtimer);
  };
};
TouchController({
    'top-left': function() { drawMap.move({y: 2}); drawMap.move({z: drawMap.z + 2}); drawMap.sprite(-1) }, // UP + LEFT
    'top-center': function() { drawMap.move({y: 2}); }, // UP
    'top-right': function() { drawMap.move({y: 2}); drawMap.move({z: drawMap.z - 2}); drawMap.sprite(1) }, // UP + Right

    'middle-left': function() { drawMap.move({z: drawMap.z + 2}); drawMap.sprite(-1) }, //Left
    'middle-right': function() { drawMap.move({z: drawMap.z - 2}); drawMap.sprite(1) },//Right

    'bottom-left': function() { drawMap.move({y:  - 2}); drawMap.move({z: drawMap.z + 2}); drawMap.sprite(-1)  }, //Down + Left
    'bottom-center': function() { drawMap.move({y:  - 2}); }, //Down
    'bottom-right': function() { drawMap.move({y:  - 2}); drawMap.move({z: drawMap.z - 2}); drawMap.sprite(1)  }, //Down + Right
}, 20);