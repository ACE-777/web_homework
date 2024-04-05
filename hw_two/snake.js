window.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const scoreText  = document.querySelector("#scoreText");
    const bestResultText  = document.querySelector("#bestResult");
    const resetButton = document.querySelector("#resetbutton");
    const tableSize = 10;

    function drawRect(x,y,color) {
        const size = 38;
        const padding = 3;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect((size + padding) * x, (size + padding) * y, size, size);
        ctx.fill();
    }

    class Snake {
        x = 0;
        y = 0;
        color = "#000";
        dire = 2;
        tailList = [];

        update() {
            let prev = {x:this.x, y:this.y};
            for (let i in this.tailList) {
                let temp = this.tailList[i];
                this.tailList[i] = prev;
                prev = temp;
            }

            switch( this.dire) {
                case 0: this.x -= 1; break;
                case 1: this.y -= 1; break;
                case 2: this.x += 1; break;
                case 3: this.y += 1; break;
            }

            this.x = this.loop(this.x);
            this.y = this.loop(this.y);
        }

        addTail() {
            this.tailList.push( {x:this.x, y:this.y});
        }

        loop(value) {
            if( value < 0) {
                value = tableSize -1;
            } else if(value > tableSize - 1) {
                value = 0;
            }

            return value;
        }
    }

    class Apple {
        x=0;
        y=0;
        color = "#193";

        randomPosition(snake) {
            do {
                this.x = parseInt(Math.random() * tableSize);
                this.y = parseInt(Math.random() * tableSize);
            } while (this.collidesWithSnake(snake) || this.collidesWithRock(rocks));
        }

        collidesWithSnake(snake) {
            if(snake.tailList.length === tableSize*tableSize) {
                alert("Поздравляем! Вы выиграли!");
            }

            for (let i = 0; i < snake.tailList.length; i++) {
                if (this.x === snake.tailList[i].x && this.y === snake.tailList[i].y) {

                    return true;
                }
            }

            return false;
        }


        collidesWithRock(rocks) {
            for (let rock of rocks) {
                if (this.x === rock.x && this.y === rock.y) {
                    return true;
                }
            }

            return false;
        }
    }

    class Rock {
        x=0;
        y=0;
        color = "#630"


        randomPosition(snake, apple) {
            do {
                this.x = parseInt(Math.random() * tableSize);
                this.y = parseInt(Math.random() * tableSize);
            } while (this.collidesWithSnake(snake) || this.collidesWithApple(apple));
        }

        collidesWithSnake(snake) {
            for (let i = 0; i < snake.tailList.length; i++) {
                if (this.x === snake.tailList[i].x && this.y === snake.tailList[i].y) {
                    return true;
                }
            }
            return false;
        }

        collidesWithApple(apple) {
            return this.x === apple.x && this.y === apple.y;
        }

    }
    function resetGame() {
        let maximumScore = results[0];
        for(let i = 0; i < results.length; i++) {
            if(maximumScore < results[i]) {
                maximumScore = results[i]
            }
        }

        bestResultText.textContent = "best result:"+maximumScore;

        score = 0;
        scoreText.textContent = "current score:"+score;

        rocks = [];
        snake.tailList = [];

        clearInterval(gameInterval);
        startGame();
    }

    let rocks = [];
    let results = [];
    let snake = new Snake();
    let apple = new Apple();
    let score = 0;
    let gameInterval = 200;
    apple.randomPosition(snake);

    function startGame() {
        gameInterval = setInterval(function () {
            for (let x = 0; x < tableSize; x++) {
                for (let y = 0; y < tableSize; y++) {
                    drawRect(x, y, "#eee");
                }
            }

            snake.update();

            for (let i = 1; i < snake.tailList.length; i++) {
                if (snake.x === snake.tailList[i].x && snake.y === snake.tailList[i].y) {
                    results.push(score)
                    alert("Поздравляем! Вы проиграли!");
                    resetGame();

                    break;
                }
            }

            if (snake.x === apple.x && snake.y === apple.y) {
                score += 1;
                scoreText.textContent = "current score:" + score;
                snake.addTail();
                apple.randomPosition(snake);

                let rock = new Rock();
                rock.randomPosition(snake, apple);
                rocks.push({x: rock.x, y: rock.y, color: rock.color});
            }

            for (let rock of rocks) {
                if (snake.x === rock.x && snake.y === rock.y) {
                    results.push(score)
                    alert("Поздравляем! Вы проиграли!");
                    resetGame();

                    break;
                }
            }


            for (let i in snake.tailList) {
                let p = snake.tailList[i];
                drawRect(p.x, p.y, snake.color);
            }

            drawRect(snake.x, snake.y, snake.color);
            drawRect(apple.x, apple.y, apple.color);
            for (let rock of rocks) {
                drawRect(rock.x, rock.y, rock.color);
            }


        }, 150);
    }

    startGame();

    resetButton.addEventListener("click", function() {
        results.push(score)
        resetGame();
    });

    window.addEventListener("keydown", function(e) {
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            snake.dire = e.keyCode - 37;
        }
    });
});
