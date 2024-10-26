const SQUARE_DYNAMIC = 1;
const ALL_DYNAMIC = 2;
const BACK_DYNAMIC = 3;
// Structure from motion demonstration
function RandomDotStereograms(idArea, idExpl) {

    this.SQUARE_DYNAMIC = 1;
    this.ALL_DYNAMIC = 2;
    this.BACK_DYNAMIC = 3;
    
    this.canvas = document.getElementById(idArea); // drawing canvas
    //	this.graph.doListen = false;						// if graph called from this object, listen from here
    this.explainP = document.getElementById(idExpl); // results explanation paragraph

    // default settings
    this.def = new Defaults();

    // basic objects
    this.d2 = new Draw(this.canvas); // the drawing library

    // Background field object
    this.backField = new RandomDotField();
    this.backPixels; // the image array for the background random dot field
    this.dotSize = 2;
    this.newBackField = true; // flag is true when need to make a new field
    this.backDisparity = -8;
    this.newBackDisparity = true; // flag if there has been a change in the background disparity
    this.backAnaPixels; // anaglyph of background
    this.backLeftPixels; // pixels of background for left eye
    this.backRightPixels; // pixels of background for right eye

    // square field objects
    this.square = new RandomDotField();
    this.squarePixels; // the image array for the square
    this.newSquare = true; // flag is true if need new square
    this.newSquarePos = true; // flag is true if square position needs to be reset randomly like at the beginning of illustration
    this.squareX = 25; // upper left corner of the square
    this.squareY = 25;
    this.squareSize; // size of the square
    this.squareDisparity = 8;
    this.newSquareDisp = true;

    // disparity creation objects
    this.anaType = RED_CYAN; // type of anaglyph
    // to create the left eye image
    this.leftEyeCanvas = document.createElement("canvas"); // canvas
    this.leftEyeContext = this.leftEyeCanvas.getContext("2d"); // context
    this.leftEyePixels; // image pixels
    // to create the right eye image
    this.rightEyeCanvas = document.createElement("canvas"); // canvas
    this.rightEyeContext = this.rightEyeCanvas.getContext("2d"); // context
    this.rightEyePixels; // image pixels

    // motion parameters
    this.flow; // the motion timer
    this.isRunning = false; // flag if the whee is spinning.
    this.dist = 0;
    this.moved = 0;
    this.stepSize = 2; // speed of update = number of dot size steps per update

    // update constants
    this.dynamic = false; // flag for if use dynamic RDS.

    // parameter constants
    // direction of motion
    this.UP = 0;
    this.DOWN = 1;
    this.LEFT = 2;
    this.RIGHT = 3;
    this.direction = this.UP;

    // drawing objects and parameters
    this.adjustSize = true; // flag to allow results canvas to adjust to size of screen.
    this.roomControls = false; // flag if need to make room for controls
    this.background = this.def.defBackground; // background color
    this.foreground = colorString(0, 0, 0); // foreground color
    this.textColor = colorString(20, 20, 20); // color of text
    this.textFont = this.def.defFont20; // text font

    this.explanation = "";

    // buttons

    // bind for listeners
    var self = this;

    this.initDOM = function() { // call the initDOM objects to initial them
        if (this.explainP !== null) {
            this.explainP.setAttribute("class", "paragraphs");
        }
    };

    // initialize the results plot
    this.init = function(param) {

        // initialize DOM objects if not called
        this.initDOM();

        // clear the results value
        this.clearExpl();

        this.draw(); // call the results drawing method for the first time.
    };

    // initialize the flow squares
    this.setupFlowSquares = function(x, y) {
        for (this.i = 0; this.i < this.numFS; this.i++) {
            this.fs[this.i] = new FlowSquare();
            this.startX[this.i] = x;
            this.startY[this.i] = y;
        }
    }


    // the main results drawing method
    this.draw = function() {
        // get the drawing context
        this.context = this.canvas.getContext("2d");
        this.canW = this.canvas.width; // current canvas width
        this.canH = this.canvas.height; // current canvas height

        if (this.adjustSize) { // check for screen size changes
            if (this.roomControls === false) { // if no controls fill browser
                resizeCanvas(this.canvas, this.context, def.defProWidthFull, 0.97 * def.defProHeightFull);
            } else if (this.roomControls === true) { // if controls, reduce overall canvas
                if (window.innerWidth > window.innerHeight) { // for wide browsers reduce width
                    resizeCanvas(this.canvas, this.context, this.def.defProWidthConW, 0.97 * this.def.defProHeightFull);
                } else { // if browser window is tall
                    resizeCanvas(this.canvas, this.context, this.def.defProWidthFull, 0.97 * this.def.defProWidthConH);
                }
            }
        }

        if (this.canW != this.canvas.width || this.canH != this.canvas.height) {
            this.newBackField = true;
            this.newSquare = true;
            this.newSquarePos = true;
        }

        this.d2.foreground = this.foreground;
        this.d2.background = this.background;
        this.d2.clear();

        var w = this.canvas.width;
        var h = this.canvas.height;

        // if needed create the background field
        if (this.newBackField) {
            // create the new field
            this.backField.dotSize = this.dotSize;
            this.backPixels = this.backField.getRDF(h, h);
            if (!this.dynamic) {
                this.newBackField = false; // set so do not need new one will need to change for dynamic rds
            }
            // do the next step
            this.newBackDisparity = true;
        }

        // create the anaglyph of the background
        if (this.newBackDisparity) {
            this.newBackDisparity = false; // clear the flag
            this.newSquareDisp = true; // make sure dot is added
            // size the canvases
            this.leftEyeCanvas.width = this.backPixels.width + Math.abs(this.backDisparity);
            this.rightEyeCanvas.width = this.backPixels.width + Math.abs(this.backDisparity);
            this.leftEyeCanvas.height = this.backPixels.height;
            this.rightEyeCanvas.height = this.backPixels.height;
            this.clearColor = colorString(127, 127, 127);

            // clear the canvases
            this.leftEyeContext.fillStyle = this.clearColor;
            this.rightEyeContext.fillStyle = this.clearColor;
            this.leftEyeContext.fillRect(0, 0, this.leftEyeCanvas.width, this.leftEyeCanvas.height);
            this.rightEyeContext.fillRect(0, 0, this.rightEyeCanvas.width, this.rightEyeCanvas.height);

            // draw the two eye images
            if (this.backDisparity < 0) { // uncrossed disparity
                this.leftEyeContext.putImageData(this.backPixels, 0, 0);
                this.rightEyeContext.putImageData(this.backPixels, Math.abs(this.backDisparity), 0);
            } else { // crossed disparity and no disparity
                this.leftEyeContext.putImageData(this.backPixels, this.backDisparity, 0);
                this.rightEyeContext.putImageData(this.backPixels, 0, 0);
            }

            // get the image pixels
            this.backLeftPixels = this.leftEyeContext.getImageData(0, 0, this.leftEyeCanvas.width, this.leftEyeCanvas.height);
            this.backRightPixels = this.rightEyeContext.getImageData(0, 0, this.rightEyeCanvas.width, this.rightEyeCanvas.height);
        }

        // now create the square if needed
        if (this.newSquare) {
            // create the square
            this.square.dotSize = this.dotSize;
            this.squareSize = w / 8; // make an eighth of the width worked ok for JAVA
            // make sure this size fits an even number of dots
            this.squareSize -= (this.squareSize % this.square.dotSize); // remove any remainder over the dot size
            this.squarePixels = this.square.getRDF(this.squareSize, this.squareSize);
            if (!this.dynamic) {
                this.newSquare = false; // reset flag
            }
            this.newSquareDisp = true; // allow for recombination
        }

        if (this.newSquarePos) {
            this.squareX = Math.floor(Math.random() * (this.backPixels.width * 0.8 - this.squareSize + this.backPixels.width * 0.1));
            // randomly select position within .1 and .9 of width,
            // take into account square size
            this.squareY = Math.floor(Math.random() * (this.backPixels.height * 0.8 - this.squareSize + this.backPixels.height * 0.1));
            // randomly select position within .1 and .9 of height,
            // take into account square size

            // adjust position to be even multiple of dot size from center
            this.squareX -= (this.squareX - (this.backPixels.width / 2)) % this.square.dotSize;
            this.squareY -= (this.squareY - (this.backPixels.height / 2)) % this.square.dotSize;
            this.newSquarePos = false; // reset flag
            this.newSquareDisp = true; // allow for recombination
        }

        // create the anaglyph of the square
        if (this.newSquareDisp || this.newSquarePos || this.newSquare) {
            this.newSquareDisp = false; // clear the flag

            this.leftEyeContext.putImageData(this.backLeftPixels, 0, 0);
            this.rightEyeContext.putImageData(this.backRightPixels, 0, 0);
            this.leftEyeContext.putImageData(this.squarePixels, this.squareX + this.squareDisparity / 2, this.squareY);
            this.rightEyeContext.putImageData(this.squarePixels, this.squareX - this.squareDisparity / 2, this.squareY);
            this.leftEyePixels = this.leftEyeContext.getImageData(0, 0, this.leftEyeCanvas.width, this.leftEyeCanvas.height);
            this.rightEyePixels = this.rightEyeContext.getImageData(0, 0, this.rightEyeCanvas.width, this.rightEyeCanvas.height);

            // get the anaglyph
            this.backAnaPixels = new CreateAnaglyph(this.leftEyePixels, this.rightEyePixels, this.anaType, this.clearColor);
        }

        // draw the square
        this.context.putImageData(this.backAnaPixels, w / 2 - this.backAnaPixels.width / 2, h / 2 - this.backAnaPixels.height / 2);

        // debug
        //        this.context.fillStyle = "red";
        //        this.context.font = this.def.defFont20;
        //        this.context.fillText("" + this.squareX + " " + this.squareY + " " + this.direction, 25, 25);
    };

    this.clearExpl = function() {
        var innerHTML = "";
        //
        if (this.explainP !== null) {
            this.explainP.innerHTML = innerHTML;
        }
    };

    this.showExpl = function() {
        // show the explanation for the text
        var innerHTML = "Here is where I will explain the results,";
        innerHTML += " yep, right here.";
        //
        this.explainP.innerHTML = this.explanation;

    };

    // methods to control the spinning of the top
    this.startMove = function() { // start drawing the light
        //alert("starting Light");
        this.isRunning = true;
        // can move
        this.canMove = false;
        do {
            this.direction = Math.floor(Math.random() * 4); // chose a direction
            if (this.direction < this.LEFT) {
                if (this.direction == this.UP) { // enough room up
                    if (this.squareY > this.backPixels.height / 2) {
                        this.canMove = true;
                        this.dist = Math.floor(this.squareY * 0.4 * Math.random() + this.squareY / 2);
                    }
                } else { // enough room down
                    if (this.squareY < this.backPixels.height / 2) {
                        this.canMove = true;
                        this.dist = Math.floor((this.backPixels.height - this.squareY) * 0.4 * Math.random() + (this.backPixels.height - this.squareY) / 2 - this.squareSize);
                    }
                }
                // how far to move
            } else {
                if (this.direction == this.LEFT) {
                    // enough room to left
                    if (this.squareX > this.backPixels.width / 2) {
                        this.canMove = true;
                        this.dist = Math.floor(this.squareX * 0.4 * Math.random() + this.squareX / 2);
                    }
                } else {
                    // enough room right
                    if (this.squareX < this.backPixels.width / 2) {
                        this.canMove = true;
                        this.dist = Math.floor((this.backPixels.width - this.squareX) * 0.4 * Math.random() + (this.backPixels.width - this.squareX) / 2 - this.squareSize);
                    }
                }
            }
        }
        while (this.canMove == false);
        this.moved = 0;
        this.flow = setInterval(self.update, 25);
    };

    // move the square
    this.update = function() {
        if (self.direction == self.UP) {
            self.squareY -= self.stepSize * self.dotSize;
            self.moved += self.stepSize * self.dotSize;
        } else if (self.direction == self.DOWN) {
            self.squareY += self.stepSize * self.dotSize;
            self.moved += self.stepSize * self.dotSize;
        } else if (self.direction == self.LEFT) {
            self.squareX -= self.stepSize * self.dotSize;
            self.moved += self.stepSize * self.dotSize;
        } else if (self.direction == self.RIGHT) {
            self.squareX += self.stepSize * self.dotSize;
            self.moved += self.stepSize * self.dotSize;
        }

        self.newSquareDisp = true;

        // see if the square has moved the required distance
        if (self.moved >= self.dist) {
            clearInterval(self.flow);
            self.pause = setInterval(self.endPause, Math.floor(250 + Math.random() * 1000));
        }

        // reset update flags
        if (self.type == SQUARE_DYNAMIC) { // update square dots
            self.newSquare = true;
        } else if (self.type == ALL_DYNAMIC) {
            self.newBackField = true;
            self.newSquare = true;
        } else if (self.type == BACK_DYNAMIC) {
            self.newBackField = true;
        } // do not worry about static as flags are always reset to false in the draw routine.

        self.draw(); // call the drawing function.
    };

    // the pause between movements are over
    this.endPause = function() {
        clearInterval(self.pause);
        self.startMove();
    }

    // stop all motions
    this.stopMove = function() {
        // turn off the light
        clearInterval(self.flow);
        clearInterval(self.pause);
        this.isRunning = false;
        this.draw();
    };

    this.canvas.onclick = function(event) {
        this.event = event || window.event; // grab the event
    }
    this.canvas.addEventListener('touchstart', function(event) {
        event.preventDefault();
    }, false);
    this.canvas.addEventListener('touchend', function(event) {
        event.preventDefault();
        this.event = event || window.event; // grab the event
        // clear the background
    }, false);


    // getters and setters
    // setters
    // set the current parameters of the illustration
    this.setParameters = function(param) {
        if (param === null) {
            // capture null data.
        } else if (param.length >= 1) { // is an array of special parameters passed
            for (var i = 0; i < param.length; i++) {
                // now check each special parameter
                if (param[i] instanceof IllusParam) { // is it the right type of object
                    if (param[i].typeParam === TYPE) {
                        // catch the current type
                        this.curType = this.anaType;
                        // get the updated type
                        this.anaType = param[i].value;
                        // are they different
                        if (this.curType != this.anaType) {
                            //                            this.newBackField = true; // redraw
                            this.newSquare = true; //  dot sizes have changed and size of background changed so need to recreate
                        }
                    } else if (param[i].typeParam === MOVE) {
                        if (this.isRunning === false) { // wheel is not spinning
                            if (param[i].value === true) {
                                this.startMove(); // if the light is currnetly off but the flag says turng light on,
                                // call routine that turns light on.
                            }
                        } else { // top is spinning
                            if (param[i].value === false) { // want to turn light off
                                //                                alert("stopping spin");
                                this.stopMove();
                            }
                        }
                    } else if (param[i].typeParam == SPEED) {
                        this.stepSize = param[i].value;
                    } else if (param[i].typeParam == SQUARE_DISP) {
                        this.squareDisparity = param[i].value;
                        this.newSquareDisp = true;
                    } else if (param[i].typeParam == BACK_DISP) {
                        this.backDisparity = param[i].value;
                        this.newBackDisparity = true;
                    } else if (param[i].typeParam == SIZE) {
                        this.curSize = this.dotSize;
                        this.dotSize = param[i].value;
                        if (this.curSize != this.dotSize) {
                            this.newBackField = true;
                            this.newSquare = true;
                        }
                    } else if (param[i].typeParam == RESET_POS) {
                        if (param[i].value === true) {
                            this.squareX = this.backPixels.width / 2 - this.squareSize / 2;
                            this.squareY = this.backPixels.height / 2 - this.squareSize / 2;
                            // adjust position to be even multiple of dot size from center
                            this.squareX -= (this.squareX - (this.backPixels.width / 2)) % this.square.dotSize;
                            this.squareY -= (this.squareY - (this.backPixels.height / 2)) % this.square.dotSize;
                            this.newSquareDisp = true;
                        }
                    } else if (param[i].typeParam == DYNAMIC) {
                        if (param[i].value == STATIC) {
                            this.dynamic = false;
                        } else {
                            this.dynamic = true;
                            this.newBackField = true;
                            this.newSquare = true;
                        }
                    }
                }
            } // end going through array
        } // end checking for array of special parameters
    };

    // set the DOM objects
    this.setDOMObjects = function(idResults, idResExpl, idResultVal) {
        this.graph.setDOMObjects(idResults);
        this.explainP = document.getElementById(idResExpl); // results explanation paragraph
    };
    // set the size of the canvas
    this.setSize = function(canvasWidth, canvasHeight) {
        //		this.graph.setSize(canvasWidth,canvasHeight);
        this.adjustSize = false;
    };

}