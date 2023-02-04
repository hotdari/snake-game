# snake-game
javascript snake game

# 클래스
## GameOption
- 게임내에 옵션은 GameOption 클래스에서 가져옴.
- 옵션은 여러개가 되지 않게 싱글톤으로 가져오게 설정.
- 설정기능은 아직 구현하지 않음.
```javascript
// 게임 옵션 클래스
class GameOption {
  static instance;

  constructor(){
    this.option = {
      width: 20, // 맵의 cell-width
      height: 20, // 맵의 cell-height
      target: document.getElementById("game"), // 맵생성 타겟(table)
      speed: 100, // 게임 속도
      appleSpeed: 5000, // 사과 생성 속도
      snakeColor: "#000000", // 뱀 색깔
      appleColor: "red", // 사과 색깔
      mapColor: "#ffffff" // 맵 색상
    }
  }

  static GetInstance(){
    if(!GameOption.instance) GameOption.instance = new GameOption();
    return GameOption.instance;
  }
}
```

## Map
- 게임옵션 클래스에서 가져온 옵션을 기반으로 맵을 생성
- 생성자를 선언하는 동시에 맵이 생성
- 맵은 target(table) element에 테이블 요소들로 생성됩니다.
```javascript
// 맵 클래스
class Map {
  constructor(){
    this.target = GameOption.GetInstance().option.target,
    this.width = GameOption.GetInstance().option.width,
    this.height = GameOption.GetInstance().option.height,
    this.create()
  }

  // 맵생성
  create(){
    for (let i = 0; i < this.height; i++) {
      const row = document.createElement("tr");
        for (let j = 0; j < this.height; j++) {
          const cell = document.createElement("td");
          cell.style.backgroundColor = GameOption.GetInstance().option.mapColor;
          cell.style.width = this.width + 'px';
          cell.style.height = this.height + 'px';
          cell.id = `cell-${i}-${j}`;
          row.appendChild(cell);
        }
      this.target.appendChild(row);
    }
  }
}
```

## Snake
- 뱀 클래스는 좌표를 받아서 생성
- 먹기 기능은 사과만 먹습니다. 게임 클래스에서 사과가 아닐경우 게임을 끝내게 구현
- 사과를 먹으면 snake 배열에 사과의 좌표가 추가됩니다.
```javascript
// 뱀 클래스
class Snake {
  constructor(x, y){
    this.snake = [{x, y}],
    this.direction = "right"
  }

  /**
   * 사과먹기
   * @param {*} apple
   */
  eat(apple) {
    const {x, y} = apple;
    this.snake.push({x, y})
  }
}
```

## Apple
- 맵 크기만큼만 사과 위치가 랜덤하게 생성되게하였습니다.
- 먹히는 존재여서 다른 기능은 없음
```javascript
// 사과 클래스
class Apple {
  constructor() {
    this.x = Math.floor(Math.random() * GameOption.GetInstance().option.width);
    this.y = Math.floor(Math.random() * GameOption.GetInstance().option.height);
  }
}
```