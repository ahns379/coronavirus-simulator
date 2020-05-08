var virus_particles = {
  COLORS: {
    healthy: "#98FB98",
    infected: "#8B0000",
    recovered: "#00FFFF",
    dead: "#000000"
  },
    infected: 2,
    death_rate: 0.0001,
    speed: 5,
    s: 15,
    recovery: 1200,
    count: 500
};

(function() {
  var playAnimation = true;

  function init(){
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    if(canvas && canvas.getContext) {
      playAnimation = true;
      context = canvas.getContext('2d');
      windowResizeHandler();
      createParticles();
      loop();
    }
  }

  function infectParticle(virus){
    if (virus.healthStatus == "healthy") {
      virus.healthStatus = "infected";
      virus.fillColor = virus_particles.COLORS.infected;
      virus.timeToRecover = virus_particles.recovery;
    }
  }
  function recoverParticle(virus) {
    virus.healthStatus = "recovered";
    virus.fillColor = virus_particles.COLORS.recovered;
    virus.timeToRecover = 0;
  }

  function killParticle(virus) {
    virus.healthStatus = "dead";
    virus.fillColor = virus_particles.COLORS.dead;
    virus.directionX = virus.directionX * 0;
    virus.directionY = virus.directionY * 0;
    virus.speed = 0;
  }

  function createParticles(){
    coronavirus = [];

    for (var i = 0; i < virus_particles.count; i++) {
      var posX = Math.random() * (window.innerWidth - virus_particles.s/2)
      var posY = Math.random() * (window.innerHeight - virus_particles.s/2);

      var directionX = Math.random();
      var directionY = Math.random();

      var virus = {
        pos: { x: posX, y: posY },
        size: virus_particles.s,
        directionX: directionX,
        directionY: directionY,
        speed: virus_particles.speed,
        index:i,
        fillColor: virus_particles.COLORS.healthy,
        healthStatus: "healthy",
        timeToRecover: 0
      };
      coronavirus.push( virus );
    }

    for(var i = 0; (i < virus_particles.infected && (i < coronavirus.length - 1) ); i++ ) {
      infectParticle(coronavirus[i]);
    }

  }

  function loop(){
    var percentageInfectedParticles = (coronavirus.filter(p => {return (p.healthStatus == "infected" || p.healthStatus == "dead")}).length / coronavirus.length);
    context.fillStyle = 'rgba(250,250, 250)';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    var z = 0;
    var xdist = 0;
    var ydist = 0;
    var dist = 0;

    for (var i=0; i < coronavirus.length; i++){

      var virus = coronavirus[i];

      if(virus.pos.x <=virus.size/2 || virus.pos.x >= virus_particles.SCREEN_WIDTH - virus_particles.s/2){
        virus.directionX *= -1;
      }

      if(virus.pos.y <=virus.size/2 || virus.pos.y >= virus_particles.SCREEN_HEIGHT - virus_particles.s/2){
        virus.directionY *= -1;
      }

      if (virus.healthStatus == "infected") {
        virus.timeToRecover--;
        if (virus.timeToRecover <= 0) {
          recoverParticle(virus);
        } else if (Math.random() <= virus_particles.death_rate) {
          killParticle(virus);
        }
      }

      for(var s=0; s < coronavirus.length; s++) {
        var collision = coronavirus[s];
          if(collision.index != virus.index) {
            z = virus_particles.s;
            xdist = Math.abs(collision.pos.x - virus.pos.x);
            ydist = Math.abs(collision.pos.y - virus.pos.y);
            dist = Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2));
            if(dist < z) {
              randomiseDirection(collision);
              if (virus.healthStatus == "infected" || collision.healthStatus == "infected") {
                infectParticle(collision);
                infectParticle(virus);
              }
            }
          }
        }

        virus.pos.x -= virus.directionX;
        virus.pos.y -= virus.directionY;

        context.beginPath();
        context.fillStyle = virus.fillColor;
        context.lineWidth = virus.size;
        context.arc(virus.pos.x, virus.pos.y, virus.size/2, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
    }

    if (playAnimation) {
      animationRequest = requestAnimationFrame(loop);
    }
  }

  function randomiseDirection (virus) {
    var r = (Math.random() * 180)/Math.PI;
    virus.directionX = Math.sin(r) ;
    virus.directionY = Math.cos(r) ;
  }

  function windowResizeHandler() {
    virus_particles.SCREEN_WIDTH = window.innerWidth;
    virus_particles.SCREEN_HEIGHT = window.innerHeight;
    canvas.width = virus_particles.SCREEN_WIDTH;
    canvas.height = virus_particles.SCREEN_HEIGHT;
  }

  init();
}());
