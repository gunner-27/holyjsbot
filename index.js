
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
  // move в сторону убегаем (к углам)
  let xVector = 0, yVector = 0;
  if (x < 5 && x != 0) {
    xVector = x * (-1);
  } else {
    if (x != 9) {
      xVector = 9 - x;
    }
  }
  if (y < 5 && y != 0) {
    yVector = y * (-1);
  } else {
    if (x != 9) {
      yVector = 9 - y;
    }
  }
  if (xVector == 0 && yVector == 0) {
    if (x == 9) {
      API.move(-1, 0);
    } else {
      API.move(1, 0);
    }
  } else {
    let totalMoves = Math.abs(xVector) + Math.abs(yVector);
    if (totalMoves <= actionPoints) {
      API.move(xVector, yVector);
    } else {
      if (actionPoints < Math.abs(xVector)) {
        API.move(Math.sign(xVector) * actionPoints, 0);
      } else {
        if (actionPoints == Math.abs(xVector)) {
          API.move(xVector, 0);
        } else {
          let yPoints = actionPoints - Math.abs(xVector);
          API.move(xVector, yPoints * Math.sign(yVector));
        }
      };
    }
  }

} else {
  // move жрем противника
  let { xE, yE} = getNearEmenyPosition(actionPoints, enemies);
  let xVector = xE-x;
  let yVector = yE-y;

  API.move(xVector, yVector);

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
