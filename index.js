let { x, y } = API.getCurrentPosition();
let actionPoints = API.getActionPointsCount();
let enemies = API.getEnemies();
let enemiesNear = 0;

enemies.forEach(enemy => {
  enemy.distanse = getDistance(x, y, enemy.position);
  if (enemy.distanse.total <= actionPoints) {
    enemiesNear++;
  }
});

if (enemiesNear == 0) {
  // бежим в угол
  let xVector = 0, yVector = 0;
  if (x <= 4) {
    xVector = 0 - x;
  } else {
    xVector = 9 - x;
  }

  if (y <= 4) {
    yVector = 0 - y;
  } else {
    yVector = 9 - y;
  }

  if (xVector == 0 && yVector == 0) {
    if (x == 0) {
      API.move(1, y);
    } else {
      API.move(8, y);
    }
  } else {
    if (actionPoints <= xVector) {
      API.move(x + Math.sign(xVector) * actionPoints, y);
    } else {
      let yPoints = actionPoints - Math.abs(xVector);
      if (yPoints <= yVector) {
        API.move(x + xVector, y + Math.sign(yVector) * yPoints);
      } else {
        API.move(x + xVector, y + yVector);
      }
    }
  }

} else {
  // едим врага
  let { eX, eY } = getNearEmenyPosition(actionPoints, enemies);
  API.move(eX, eY);
}

function getDistance(x, y, enemyPoints) {
  let Distance = {
    x: Math.abs(Math.abs(x) - Math.abs(enemyPoints.x)),
    y: Math.abs(Math.abs(y) - Math.abs(enemyPoints.y)),
    total: x + y
  };
  return Distance;
};

function getNearEmenyPosition(actionPoints, enemies) {
  enemies.forEach(e => {
    if (e.distanse.total <= actionPoints) {
      return (e.position.x, e.position.y);
    }
  });
}
