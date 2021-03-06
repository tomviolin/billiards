let balls;
let bbcollide = false;
let bbcoll2 = false;
let bbcoll3 = false;
let bdrop = false;
let brelease = false;
Howler.autoUnlock = true;


let vibbing = false;

function vibrate(n) {
	if (vibbing) return false;
	return navigator.vibrate(n);
}

function vibp(t) {
	if (t < 5) {
		vibbing=false;
		return;
	}
	navigator.vibrate(10);
	let vibint = setTimeout(()=>{ vibp(t-10); },t);
}

function vibpock() {
	vibbing = true;
	vibp(120);
}

planck.testbed('8 Ball', function (testbed) {
  var pl = planck, Vec2 = pl.Vec2, Math = pl.Math;
  testbed.background = '#004400';
  testbed.drawRadial = false;
  var SPI4 = Math.sin(Math.PI / 4), SPI3 = Math.sin(Math.PI / 3);
  console.log(testbed);
  var COLORED = true;
  var BLACK = { fill: 'black', stroke: '#ffffff40' };
  var WHITE = { fill: 'white', stroke: '#00000000' };
  var COLORS = [
    { fill: '#ffdd00', stroke: '#00000000' },
    { fill: '#ffdd00', stroke: '#ffffff',strokeWidth: '55px' },
    { fill: '#ff3300', stroke: '#00000000' },
    { fill: '#ff3300', stroke: '#ffffff',strokeWidth: '55px' },
    { fill: '#662200', stroke: '#00000000' },
    { fill: '#662200', stroke: '#ffffff',strokeWidth: '55px' },
    { fill: '#ff8800', stroke: '#00000000' },
    { fill: '#ff8800', stroke: '#ffffff',strokeWidth: '55px' },
    { fill: '#00bb11', stroke: '#00000000' },
    { fill: '#00bb11', stroke: '#ffffff',strokeWidth: '55px' },
    { fill: '#9900ff', stroke: '#00000000' },
    { fill: '#9900ff', stroke: '#ffffff',strokeWidth: '55px' },
    { fill: '#0077ff', stroke: '#00000000' },
    { fill: '#0077ff', stroke: '#ffffff',strokeWidth: '55px' }
  ];

  var width = 8.00, height = 4.00;

  var BALL_R = 0.12;
  var POCKET_R = 0.22;

  testbed.x = 0;
  testbed.y = 0;
  testbed.width = width+POCKET_R*5.5;;// * 1.2;
  testbed.height = height+POCKET_R*5.5;;// * 1.7;
  testbed.ratio = 150;
  testbed.mouseForce = -30;

  pl.Settings.velocityThreshold = 0;

  var world = pl.World({});

  var railH = [
    Vec2(POCKET_R, height * .5),
    Vec2(POCKET_R, height * .5 + POCKET_R),
    Vec2(width * .5 - POCKET_R / SPI4 + POCKET_R, height * .5 + POCKET_R),
    Vec2(width * .5 - POCKET_R / SPI4, height * .5)
  ];

  var railV = [
    Vec2(width * .5, -(height * .5 - POCKET_R / SPI4)),
    Vec2(width * .5 + POCKET_R, -(height * .5 - POCKET_R / SPI4 + POCKET_R)),
    Vec2(width * .5 + POCKET_R, height * .5 - POCKET_R / SPI4 + POCKET_R),
    Vec2(width * .5, height * .5 - POCKET_R / SPI4)
  ];

  var railFixDef = {
    friction: 0.0,
    restitution: 0.999,
    userData: 'rail'
  };
  var pocketFixDef = {
    userData: 'pocket'
  };
  var ballFixDef = {
    friction: 0.0,
    restitution: 0.999,
    density: 1,
    userData: 'ball'
  };
  var ballBodyDef = {
    linearDamping: 0.99999,
    angularDamping: 0.99999
  };

  let rv1 = world.createBody(); rv1.createFixture(pl.Polygon(railV.map(Vec2.scaleFn(+1, +1))), railFixDef);
  let rv2 = world.createBody(); rv2.createFixture(pl.Polygon(railV.map(Vec2.scaleFn(-1, +1))), railFixDef);

  let rh1 = world.createBody(); rh1.createFixture(pl.Polygon(railH.map(Vec2.scaleFn(+1, +1))), railFixDef);
  let rh2 = world.createBody(); rh2.createFixture(pl.Polygon(railH.map(Vec2.scaleFn(-1, +1))), railFixDef);
  let rh3 = world.createBody(); rh3.createFixture(pl.Polygon(railH.map(Vec2.scaleFn(+1, -1))), railFixDef);
  let rh4 = world.createBody(); rh4.createFixture(pl.Polygon(railH.map(Vec2.scaleFn(-1, -1))), railFixDef);
  let rails = [rv1, rv2, rh1, rh2, rh3, rh4];
  rails.forEach((rail) => rail.render = { fill: '#003300' });

  let pk1 = world.createBody(); pk1.createFixture(pl.Circle(Vec2(0, -height * .5 - POCKET_R * 1.5), POCKET_R), pocketFixDef);
  let pk2 = world.createBody(); pk2.createFixture(pl.Circle(Vec2(0, +height * .5 + POCKET_R * 1.5), POCKET_R), pocketFixDef);

  let pk3 = world.createBody(); pk3.createFixture(pl.Circle(Vec2(+width * .5 + POCKET_R * .7, +height * .5 + POCKET_R * .7), POCKET_R), pocketFixDef);
  let pk4 = world.createBody(); pk4.createFixture(pl.Circle(Vec2(-width * .5 - POCKET_R * .7, +height * .5 + POCKET_R * .7), POCKET_R), pocketFixDef);

  let pk5 = world.createBody(); pk5.createFixture(pl.Circle(Vec2(+width * .5 + POCKET_R * .7, -height * .5 - POCKET_R * .7), POCKET_R), pocketFixDef);
  let pk6 = world.createBody(); pk6.createFixture(pl.Circle(Vec2(-width * .5 - POCKET_R * .7, -height * .5 - POCKET_R * .7), POCKET_R), pocketFixDef);
  let pockets = [pk1, pk2, pk3, pk4, pk5, pk6];
  pockets.forEach((p) => p.render = { fill: 'black', stroke: '#ffffff', strokeWidth: '0.1px' });
  createBalls = function() {
    balls = rack(BALL_R).map(Vec2.translateFn(width / 4, 0));
    balls.push({ x: -width / 4, y: 0 });

    if (COLORED) {
      shuffleArray(COLORS);
      for (var i = 0; i < COLORS.length; i++) {
        balls[i].render = COLORS[i];
      }
      balls[14].render = balls[4].render;
      balls[4].render = BLACK;
      balls[balls.length - 1].render = WHITE;
    }

    for (i = 0; i < balls.length; i++) {
      var ball = world.createDynamicBody(ballBodyDef);
      ball.setBullet(true);
      ball.setPosition(balls[i]);
      ball.createFixture(pl.Circle(BALL_R), ballFixDef);
      ball.render = balls[i].render;
    }
  }
  world.on('post-solve', function (contact, contactImpulse) {
    var fA = contact.getFixtureA(), bA = fA.getBody();
    var fB = contact.getFixtureB(), bB = fB.getBody();
    var udA = fA.getUserData();
    var udB = fB.getUserData();
    console.log(udA + ' <=> ' + udB);
    let totimp = 0;
    contactImpulse.normalImpulses.forEach((nimp) => {
      totimp += nimp;
      console.log(nimp + " => " + totimp);
    });
    if (totimp > .01 && udA == 'ball' && udB == 'ball' && bbcollide != false) {
      if (totimp > 1) {
        let id = bbcollide.play();
        bbcollide.volume(Math.max(totimp*.3,1),id);
      } else if (totimp > 0.5) {
        let id = bbcoll2.play();
        bbcoll2.volume(totimp*4,id);
      } else if (totimp > 0.02) {
        let id = bbcoll3.play();
        bbcoll3.volume(totimp*6,id);
      }
    }
    vibrate(Math.trunc(totimp*2+1));
    var ball = fA.getUserData() === ballFixDef.userData && bA || fB.getUserData() === ballFixDef.userData && bB;
    var pocket = fA.getUserData() === pocketFixDef.userData && bA || fB.getUserData() === pocketFixDef.userData && bB;
    //if (bbcollide !== false) bbcollide.play();
    // do not change world immediately
    setTimeout(function () {
      if (ball && pocket) {
        if (bdrop) {
          bdrop.play();
          bdrop.volume(2);
	  vibpock();
        }
        world.destroyBody(ball);
      }
    }, 1);
  });





  startsound = (md) => {
    if (bbcollide === false) {
      console.log('turning on bbcollide!');
	    vibpock();
      bbcollide = new Howl({
        src: ['ball_collide-big.mp3']
      });
      bbcoll2 = new Howl({
        src: ['ball_collide_smaller.mp3']
      });
      bbcoll3 = new Howl({
        src: ['ball_collide_smallest.mp3']
      });
      bdrop = new Howl({
        src: ['ball-hit-sink.mp3']
      });
      brelease = new Howl({
        src: ['ball_release.mp3']
      });
      brelease.play();
      brelease.on('end', createBalls);
      console.log(md);
    }
  };

  testbed.canvas.addEventListener('mousemove', startsound);
  testbed.canvas.addEventListener('mouseover', startsound);
  testbed.canvas.addEventListener('mouseout', startsound);
  testbed.canvas.addEventListener('mouseup', startsound);
  testbed.canvas.addEventListener('touchstart', startsound);
  testbed.canvas.addEventListener('touchend', startsound);
  return world;

  function rack(r) {
    var n = 5;
    var balls = [];
    var d = r * 2, l = SPI3 * d;
    for (var i = 0; i < n; i++) {
      for (var j = 0; j <= i; j++) {
        balls.push({
          x: i * l /*- (n - 1) * 0.5 * l*/ + Math.random(r * 0.02),
          y: (j - i * 0.5) * d + Math.random(r * 0.02),
        });
      }
    }
    return balls;
  }

  function shuffleArray(array) {
    // http://stackoverflow.com/a/12646864/483728
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

});
