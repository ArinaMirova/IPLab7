(function(){    
    function Tetris(canvasId, scoreId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.scoreEl = document.getElementById(scoreId);
        this.width = 10;
        this.height = 15;
        this.score = 0;
        this.interval = null;
        this.color = getRandomColor();

        this.startCoord = {
            x: 5,
            y: 0
        };

        this.curCoord = {
            x: 5,
            y: 0
        };

        this.figures = [
            [
                [1,1,1,1]
            ],
            [
                [1,1],
                [1,1]
            ],
            [
                [1,1,0],
                [0,1,1]
            ],
            [
                [0,1,1],
                [1,1,0]
            ],
            [
                [1,1],
                [1,0],
                [1,0]
            ],
            [
                [1,1],
                [0,1],
                [0,1]
            ],
            [
                [0,1,0],
                [1,1,1]
            ]
        ];

        this.figure = this.figures[randomInteger(1, this.figures.length) - 1];
        
        this.map = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]            
        ];
    };

    Tetris.prototype.__remove = function(x,y,figure) {
        var figWidth = figure[0].length,
            figHeight = figure.length;
        
        if(x < 0 || x + figWidth > this.width || y < 0 || y + figHeight > this.height) {
            return;
        }
        
        for(var i = 0; i < figHeight; i++){
            for(var j = 0; j < figWidth; j++) {
                if(figure[i][j] == 1) {
                    this.map[y + i][x + j] = 0;
                }
            }
        }        
    };

    Tetris.prototype.startGame = function() {
        var that = this;

        document.removeEventListener('keydown', that.__keydownEventHandler.bind(that));
        document.addEventListener('keydown', that.__keydownEventHandler.bind(that));

        if(that.interval) {
            clearInterval(that.interval);
        }
        
        that.__add(that.curCoord.x, that.curCoord.y, that.figure);
        
        that.interval = setInterval(function(){
            that.fall();
        }, 1000);
    };

    Tetris.prototype.rotate = function() {
        this.__remove(this.curCoord.x, this.curCoord.y, this.figure);
            
        this.__drawAll();
        
        var rotatedFigure = this.__rotateFigure(this.figure);
        
        var res = this.__add(this.curCoord.x, this.curCoord.y, rotatedFigure);
        
        if(res) {
            this.figure = rotatedFigure;
        } else {
            this.__add(this.curCoord.x, this.curCoord.y, this.figure);                
        }
    };

    Tetris.prototype.__keydownEventHandler = function(event) {
        var that = this;
        
        switch(event.keyCode) {
            case 37:
                that.left();
                break;
            case 38:
                that.rotate();
                break;
            case 39: 
                that.right();
                break;
            case 40:
                that.fall();
                break;
        }
    };

    Tetris.prototype.__addScore = function(value){
        this.score += value;
            
        this.scoreEl.innerHTML = this.score;
    };

    Tetris.prototype.__end = function(){        
        if(this.interval) {
            clearInterval(this.interval);
        }
                    
        document.removeEventListener('keydown', this.__keydownEventHandler.bind(this));
        
        alert("GAME OVER! YOUR SCORE: " + this.score);
    };

    Tetris.prototype.right = function() {
        this.__remove(this.curCoord.x, this.curCoord.y, this.figure);
        
        this.__drawAll();
        
        var res = this.__add(this.curCoord.x + 1, this.curCoord.y, this.figure);
        
        if(res) {
            this.curCoord.x++;
        } else {                
            this.__add(this.curCoord.x, this.curCoord.y, this.figure);
        }   
    };

    Tetris.prototype.left = function(){
        this.__remove(this.curCoord.x, this.curCoord.y, this.figure);
            
        this.__drawAll();
        
        var res = this.__add(this.curCoord.x - 1, this.curCoord.y, this.figure);
        
        if(res) {
            this.curCoord.x--;
        } else {             
            this.__add(this.curCoord.x, this.curCoord.y, this.figure);
        }  
    };

    Tetris.prototype.fall = function() {
        var that = this;
        
        if(that.interval) {
            clearInterval(that.interval);
        }
        
        that.interval = setInterval(function(){
            that.fall();
        }, 1000);
        
        that.__remove(that.curCoord.x, that.curCoord.y, that.figure);
        
        that.__drawAll();
        
        var res = that.__add(that.curCoord.x, that.curCoord.y + 1, that.figure);
        
        if(res) {
            that.curCoord.y++;
        } else {
            if(that.curCoord.x === that.startCoord.x && that.curCoord.y === that.startCoord.y) {
                that.__end();
            } else {                    
                that.__add(that.curCoord.x, that.curCoord.y, that.figure);
                
                that.__checkFill();
                
                that.__drawAll();
                
                that.curCoord.x = that.startCoord.x;
                that.curCoord.y = that.startCoord.y;
                
                that.figure = that.figures[randomInteger(1, that.figures.length) - 1];
                            
                that.color = getRandomColor();                
                
                var drawed = that.__add(that.curCoord.x, that.curCoord.y, that.figure);

                if(!drawed) {
                    that.__end();
                }
            }
        }
    };

    Tetris.prototype.__checkFill = function(){
        for(var i = 0; i < this.height; i++) {
            var notEmpty = true;
            
            for(var j = 0; j < this.width; j++) {
                if(this.map[i][j] === 0) {
                    notEmpty = false;
                    break;
                }
            }
            
            if(notEmpty) {
                this.map.splice(i, 1);
                this.map.unshift([0,0,0,0,0,0,0,0,0,0]);
                
                this.__addScore(100);
            }
        }
    };

    Tetris.prototype.__clearAll = function() {
        this.context.fillStyle = "white";

        this.context.fillRect(0,0,500,500);
    };

    Tetris.prototype.__drawAll = function(){
        this.__clearAll();
            
        this.context.fillStyle = "black";
        
        for(var i = 0; i < this.height; i++) {
            for(var j = 0; j < this.width; j++) {
                if(this.map[i][j] === 1) {
                    var corX = (j + 1) * 2 + j * 20,
                        corY = (i + 1) * 2 + i * 20;
                
                    this.context.fillRect(corX, corY, 20, 20);
                }
            }
        }
    };

    Tetris.prototype.__rotateFigure = function(figure) {
        var width = figure[0].length,
            height = figure.length,
            res = [];
        
        for(var i = 0; i < width; i++) {
            var tmp = [];
            
            for(var j = height - 1; j >= 0; j-- ) {
                tmp.push(figure[j][i]);
            }
            
            res.push(tmp);
        }
        
        return res;
    };

    Tetris.prototype.__add = function(x, y, figure) {
        var figWidth = figure[0].length,
            figHeight = figure.length;
        
        if(x < 0 || x + figWidth > this.width || y < 0 || y + figHeight > this.height) {
            return false;
        }
        
        for(var i = 0; i < figHeight; i++){
            for(var j = 0; j < figWidth; j++) {
                if(figure[i][j] == 1) {
                    if(this.map[y + i][x + j] === 1) {
                        return false;
                    }
                }
            }
        }
        
        for(var i = 0; i < figHeight; i++){
            for(var j = 0; j < figWidth; j++) {
                if(figure[i][j] == 1) {                        
                    this.map[y + i][x + j] = 1;
                }
            }
        }
        
        this.__draw(x,y,figure, this.color);
        
        return true;
    };

    Tetris.prototype.__draw = function(x, y, figure, color) {
        var figWidth = figure[0].length,
            figHeigh = figure.length;
        
        this.context.fillStyle = color;
        
        for(var i = 0; i < figHeigh; i++) {
            for(var j = 0; j < figWidth; j++) {
                if(figure[i][j] === 0) continue;
                
                var corX = (x + j + 1) * 2 + (x + j) * 20,
                    corY = (y + i + 1) * 2 + (y + i) * 20;
                
                this.context.fillRect(corX, corY, 20, 20);
            }
        }    
    };

    function getRandomColor() {
        var colors = [
            "red",
            "green",
            "violet",
            "blue",
            "darkviolet"
        ];
        
        var randIndex = randomInteger(1, colors.length) - 1;
        
        return colors[randIndex];
    }

    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }

    window.tetris = new Tetris('tetris', 'score');

    window.tetris.startGame();
})();