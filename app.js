
/*
           The actual CSS bit.
           *
           * We do the rotation first so we don't need to worry about transforming the origin.
           *
           * Step 1:
           * Rotate the map around the amount you want
           *
           *  0-----------+                  0
           *  |  ↑        |    +60deg       / \ ↑
           *  |  p        |   ------->    /    \p
           *  |           |             /       \
           *  +-----------+           +          \
           *                           \          +
           *                            \        /
           *                             \     /
           *                              \  /
           *                               +
           * Here 'p' is the player, '↑' is the direction the player is looking
           * The map is rotated around the default origin (0)
           *
           *
           * Step 2:
           * Translate the rotated map so that the player is back where they were but facing a different direction
           *
           *
           *                                  0                             0
           *                                 / \                           / \
           *         0                     /    \                        /    \
           *        / \ ↑      up 30px   /       ↑        right 40px   /   ↑   \
           *      /    \p     -------> +         p\      ------->    +     p    \
           *    /       \               \          +                  \          +
           *  +          \               \        /                    \        /
           *   \          +               \     /                       \     /
           *    \         /                \  /                          \  /
           *     \      /                   +                             +
           *      \   /
           *        +
           *
           *
*/

this.perspective = navigator.vendor.match(/Apple/) ? 300 : 1000;

this.drawMap = {
  x: -430,
  y: -130,
  z: 0,
  frame: 0,
  spriteTimeout: null,
  m: document.getElementById('map'),
  defaultTransform: 'scaleX(7) scaleY(3) perspective(' + perspective + ') rotateX(65deg)',
  move: function(position) {
    var original_x, original_y;
    original_y = drawMap.y;
    original_x = drawMap.x;
    if (position.y != null) {
      drawMap.y += Math.cos(drawMap.z * Math.PI / 180) * position.y;
      drawMap.x += Math.sin(drawMap.z * Math.PI / 180) * position.y;
    }
    if (position.z != null) drawMap.z = position.z % 360;
    if ((drawMap.y > 500 || drawMap.x > 500) || (drawMap.y < -500 || drawMap.x < -500)) {
      drawMap.y = original_y;
      return drawMap.x = original_x;
    } else {
      drawMap.m.style.webkitTransform = drawMap.defaultTransform + ' rotateZ(' + drawMap.z + 'deg) translate3d(' + drawMap.x + 'px, ' + drawMap.y + 'px, -10px)';
      return drawMap.m.style.mozTransform = drawMap.defaultTransform + ' rotateZ(' + drawMap.z + 'deg) translate3d(' + drawMap.x + 'px, ' + drawMap.y + 'px, -10px)';
    }
  },
  sprite: function(deltaFrame) {
    var callback, delta;
    if (drawMap.spriteTimeout) clearTimeout(drawMap.spriteTimeout);
    drawMap.frame = Math.max(-4, Math.min(drawMap.frame + deltaFrame, 4));
    document.getElementById('cart').style.backgroundPositionX = (-232 + (-1 * drawMap.frame * 58)) + 'px';
    if (drawMap.frame !== 0) {
      delta = -drawMap.frame / Math.abs(drawMap.frame);
      callback = function() {
        return drawMap.sprite(delta);
      };
      drawMap.spriteTimeout = setTimeout(callback, 100);
    }
    return document.getElementById('trees').style.backgroundPosition = -(drawMap.z / 360) * 100 + '%';
  }
};

this.drawMap.move({});

