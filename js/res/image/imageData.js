// image data handling routines

// get one gun out of image data
function GetColor2D(pixelArray, color, width, height) {
    this.pixelArray = pixelArray; // The image data data
    this.color = color; // the gun to get
    this.w = width; // width of area to grab
    this.h = height; // height of area to grab

    // get the image data

    this.outData = [];

    // now convert into 2d array of image
    for (this.x = 0; this.x < this.w; this.x++) {
        //            alert("getImage2d this.x = " + this.x);
        this.outData[this.x] = []; // declare the second dimension
        for (this.y = 0; this.y < this.h; this.y++) {
            // now find the position in the image data array
            this.pos = this.y * this.w * 4 + this.x * 4 + this.color;
            //                alert("psotion in data array = " + this.pos + " data value = " + this.imageData.data[this.pos]);
            this.outData[this.x][this.y] = this.pixelArray[this.pos];

        }
    }

    // return the 2d array from the image
    return this.outData;
}

// Get data from canvas and grab one gun
function GetImage2D(canvas, color, startX, startY, width, height) {
    this.context = canvas.getContext("2d"); // drawing context
    this.color = color;
    this.startX = startX; // x start of area to grab
    this.startY = startY; // y start of area to grab
    this.w = width; // width of area to grab
    this.h = height; // height of area to grab

    // get the image data

    this.outData = [];

    if (this.context != null) {
        this.imageData = this.context.getImageData(this.startX, this.startY, this.w, this.h);

        // the 2 dimensional array of the output data
        this.outData = this.GetColor2D(this.imageData.data, color, this.w, this.h);
    } else {
        this.outData = null;
    }

    // return the 2d array from the image
    return this.outData;
}

// get one gun out of image data
function GetArray3D(pixelArray, width, height) {
    this.pixelArray = pixelArray; // The image data data
    this.w = width; // width of area to grab
    this.h = height; // height of area to grab

    // create the image data array
    this.outData = []; // the x dimension

    // now convert into 2d array of image
    for (this.x = 0; this.x < this.w; this.x++) {
        //            alert("getImage2d this.x = " + this.x);
        this.outData[this.x] = []; // declare the second dimension the y dimension
        for (this.y = 0; this.y < this.h; this.y++) {
            // now find the position in the image data array
            this.outData[this.x][this.y] = []; // declare the color dimension/ leave off alpha
            this.pos = this.y * this.w * 4 + this.x * 4;
            this.outData[this.x][this.y][RED] = Number(this.pixelArray[this.pos + RED]);
            this.outData[this.x][this.y][GREEN] = this.pixelArray[this.pos + GREEN];
            this.outData[this.x][this.y][BLUE] = this.pixelArray[this.pos + BLUE];
            //            if (this.x == 0 && this.y == 0) {
            //                alert("R = "+RED);
            //                alert("position in data array = " + this.pos + " R = " + this.pixelArray[this.pos + RED] + " G = "
            //                    + this.pixelArray[this.pos + GREEN] + " B = " + this.pixelArray[this.pos + BLUE]);
            //            }
        }
    }

    //    alert("getArray3d " + this.outData[50][0][0] + " " + this.outData[50][0][1] + " " + this.outData[0][0][2]);

    // return the 2d array from the image
    return this.outData;
}

// Get data from canvas and convert to 3d array, x, y, guns, ignore alpha
function GetImage3D(canvas, startX, startY, width, height) {
    this.context = canvas.getContext("2d"); // drawing context
    this.startX = startX; // x start of area to grab
    this.startY = startY; // y start of area to grab
    this.w = width; // width of area to grab
    this.h = height; // height of area to grab

    // get the image data

    this.outData = [];

    if (this.context != null) {
        this.imageData = this.context.getImageData(this.startX, this.startY, this.w, this.h);

        // the 2 dimensional array of the output data
        this.outData = GetArray3D(this.imageData.data, this.w, this.h);
    } else {
        this.outData = null;
    }

    // return the 3d array from the image
    return this.outData;
}

// back to image array
function Array3Dto1D(imageArray) {
    this.outData = null;
    this.outData = [];
    this.w = imageArray.length;
    this.h = imageArray[0].length;
    for (this.x = 0; this.x < this.w; this.x++) {
        for (this.y = 0; this.y < this.h; this.y++) {
            this.idx = this.y * this.w * 4 + this.x * 4;
            this.outData[this.idx + RED] = imageArray[this.x][this.y][RED];
            this.outData[this.idx + GREEN] = imageArray[this.x][this.y][GREEN];
            this.outData[this.idx + BLUE] = imageArray[this.x][this.y][BLUE];
            this.outData[this.idx + ALPHA] = 255;
        }
    }

    return this.outData;
}

// put image data back into a one dimensional array
function RearrangePixels(r, g, b, a) {
    this.r = r; // red gun, 2d array
    this.g = g; // green gun 2 d array
    this.b = b; // blue gun 2 d array
    this.a = a; // alpha on value or 2 d array

    // the output array
    this.outPixels = Array();

    // height and width of array
    this.w = this.r.length;
    this.h = this.r[0].length;
    //    alert("gun array dimensions = " + this.w + " " + this.h);

    // the current index
    this.x = 0;
    this.y = 0;

    this.i = 0; // current position in the output array
    this.length = this.w * this.h * 4;
    for (this.i = 0; i < this.length; i += 4) {
        this.outPixels[this.i + RED] = this.r[this.x][this.y];
        this.outPixels[this.i + GREEN] = this.g[this.x][this.y];
        this.outPixels[this.i + BLUE] = this.b[this.x][this.y];
        if (this.a.length == this.w) { // add alpha but check if array or single value
            this.outPixels[this.i + ALPHA] = this.a[this.x][this.y];
        } else {
            this.outPixels[this.i] = a;
        }
        this.x++; // height varies faster
        if (this.x >= this.w) { // have I reached end of of column
            this.x = 0;
            this.y++;
        }
    }
    //    do {
    //        this.outPixels[this.i] = this.r[this.x][this.y]; // add red
    //        this.i++; // increase index
    //        this.outPixels[this.i] = this.g[this.x][this.y]; // add green
    //        this.i++; // increase index
    //        this.outPixels[this.i] = this.b[this.x][this.y]; // add blue
    //        this.i++; // increase index
    //        if (this.a.length == this.w) { // add alpha but check if array or single value
    //            this.outPixels[this.i] = this.a[this.x][this.y];
    //        } else {
    //            this.outPixels[this.i] = a;
    //        }
    //        this.i++; // increase index

    //        this.x++; // height varies faster
    //        if (this.x >= this.w) { // have I reached end of of column
    //            this.x = 0;
    //            this.y++;
    //        }
    //    } while (this.y < this.h);

    return this.outPixels;
}

function BrightGun(gun, bright) {
    this.gun = gun; // the array of pixes for one color
    this.bright = bright;
    // test range
    if (this.bright >= 255) {
        this.bright = 0;
    }
    if (this.bright <= -255) {
        this.bright = 0; // if out of range no brightness change.
    }

    // create a lookup table to adjust brightness
    this.lut = Array();
    for (this.i = 0; this.i < 256; this.i++) {
        // value from grom 0 to 255
        this.lut[this.i] = this.i + bright;
        if (this.lut[this.i] > 255) {
            this.lut[this.i] = 255; // check for maximum value
        }
        if (this.lut[this.i] < 0) {
            this.lut[this.i] = 0; // check for minimum value
        }
    }

    this.w = this.gun.length;
    this.h = this.gun[0].length;
    this.outGun = Array();

    // go throught pixel array for current gun
    for (this.x = 0; this.x < this.w; this.x++) {
        this.outGun[this.x] = Array();
        for (this.y = 0; this.y < this.h; this.y++) {
            this.outGun[this.x][this.y] = this.lut[this.gun[this.x][this.y]];
        }
    }

    return this.outGun;

}

// adjust brightness of entire image
function AdjustBrightness(pixelArray, bright, startX, startY, width, height) {
    // new version.
    this.bright = bright;
    // test range
    if (this.bright >= 255) {
        this.bright = 0;
    }
    if (this.bright <= -255) {
        this.bright = 0; // if out of range no brightness change.
    }

    this.lut = Array();
    for (this.i = 0; this.i < 256; this.i++) {
        // value from grom 0 to 255
        this.lut[this.i] = this.i + bright;
        if (this.lut[this.i] > 255) {
            this.lut[this.i] = 255; // check for maximum value
        }
        if (this.lut[this.i] < 0) {
            this.lut[this.i] = 0; // check for minimum value
        }
    }

    this.newData = Array(); // declary the output array
    for (this.i = 0; i < pixelArray.length; i += 4) {
        // +4 as exach pixel is r g b a
        this.newData[this.i] = this.lut[pixelArray[this.i]]; // red
        this.newData[this.i + 1] = this.lut[pixelArray[this.i + 1]]; // green
        this.newData[this.i + 2] = this.lut[pixelArray[this.i + 2]]; // blue
        this.newData[this.i + 3] = pixelArray[this.i + 3]; // do not change alpha
    }

    //    alert("new data length= " + this.newData.length + " old Alpha = " + pixelArray[3] + " new alpha = " + this.newData[3]);

    return this.newData;
}

function doContrast(pixelArray, contrast) {
    this.pixelArray = pixelArray;
    this.contrast = contrast;
    this.outImage = []; // output array

    // first find the mean  value of each gun (do not change alhpa)
    this.rMean = 0;
    this.gMean = 0;
    this.bMean = 0;
    this.count = 0; // how many elements;
    for (this.i = 0; this.i < this.pixelArray.length; this.i += 4) {
        this.rMean += this.pixelArray[this.i + RED];
        this.gMean += this.pixelArray[this.i + GREEN];
        this.bMean += this.pixelArray[this.i + BLUE];
        this.count++; // one more element in each array
    }

    // change sums to means
    this.rMean = this.rMean / this.count;
    this.gMean = this.gMean / this.count;
    this.bMean = this.bMean / this.count;

    // do the contrast calculation a pixel at a time.
    for (this.i = 0; this.i < this.pixelArray.length; this.i += 4) {
        this.outImage[i + RED] = this.contrast * (this.pixelArray[this.i + RED] - this.rMean) + this.rMean;
        this.outImage[i + GREEN] = this.contrast * (this.pixelArray[this.i + GREEN] - this.gMean) + this.gMean;
        this.outImage[i + BLUE] = this.contrast * (this.pixelArray[this.i + BLUE] - this.bMean) + this.bMean;
        this.outImage[i + ALPHA] = this.pixelArray[i + ALPHA]; // do not change alpha

        // check for limit violations
        if (this.outImage[i + RED] > 255) {
            this.outImage[i + RED] = 255;
        }
        if (this.outImage[i + GREEN] > 255) {
            this.outImage[i + GREEN] = 255;
        }
        if (this.outImage[i + BLUE] > 255) {
            this.outImage[i + BLUE] = 255;
        }
    }

    return this.outImage;
}

function doContrastKeepMax(pixelArray, contrast) {
    // first find the max
    this.max = 0;
    for (this.i = 0; this.i < pixelArray.length; this.i += 4) {
        if (this.max < pixelArray[this.i + RED]) {
            this.max = pixelArray[this.i + RED];
        }
        if (this.max < pixelArray[this.i + GREEN]) {
            this.max = pixelArray[this.i + GREEN];
        }
        if (this.max < pixelArray[this.i + BLUE]) {
            this.max = pixelArray[this.i + BLUE];
        }
    }

    this.tempImage = doContrast(pixelArray, contrast);

    // find new max
    this.newMax = 0;
    for (this.i = 0; this.i < pixelArray.length; this.i += 4) {
        if (this.newMax < tempImage[this.i + RED]) {
            this.newMax = tempImage[this.i + RED];
        }
        if (this.newMax < tempImage[this.i + GREEN]) {
            this.newMax = tempImage[this.i + GREEN];
        }
        if (this.newMax < tempImage[this.i + BLUE]) {
            this.newMax = tempImage[this.i + BLUE];
        }
    }

    this.outImage = [];
    if (this.newMax == this.max) {
        // no change
        this.outImage = this.tempImage;
    } else {
        this.change = this.max - this.newMax;
        for (this.i = 0; this.i < tempImage.length; this.i += 4) {
            this.outImage[i + RED] = this.tempImage[i + RED] + this.change;
            this.outImage[i + GREEN] = this.tempImage[i + GREEN] + this.change;
            this.outImage[i + BLUE] = this.tempImage[i + BLUE] + this.change;
            this.outImage[i + ALPHA] = this.tempImage[i + ALPHA];

            // check for range violations
            if (this.outImage[this.i + RED] < 0) {
                this.outImage[this.i + RED] = 0;
            }
            if (this.outImage[this.i + GREEN] < 0) {
                this.outImage[this.i + GREEN] = 0;
            }
            if (this.outImage[this.i + BLUE] < 0) {
                this.outImage[this.i + BLUE] = 0;
            }
        }
    }

    return this.outImage;
}

// convert image to grayscale.
function GrayScale(pixelArray) {
    // first try.  Average R G B values
    this.newImage = new Array(); // output data array

    for (this.i = 0; this.i < pixelArray.length; this.i += 4) {
        this.gray = Math.floor((pixelArray[this.i] + pixelArray[this.i + 1] + pixelArray[this.i + 2]) / 3 + 0.5); // determine average level
        if (this.gray > 255) {
            // error check
            this.gray = 255;
        } // should not happen  but we are rounding

        // assign new values
        this.newImage[this.i] = this.gray;
        this.newImage[this.i + 1] = this.gray;
        this.newImage[this.i + 2] = this.gray;
        this.newImage[this.i + 3] = pixelArray[this.i + 3]; // do not change alpha
    }

    return this.newImage;
}

// invert the colors of the image
function InvertColors(pixelArray) {
    // first try.  Average R G B values
    this.newImage = new Array(); // output data array

    for (this.i = 0; this.i < pixelArray.length; this.i += 4) {
        this.gray = Math.floor((pixelArray[this.i] + pixelArray[this.i + 1] + pixelArray[this.i + 2]) / 3 + 0.5); // determine average level
        if (this.gray > 255) {
            // error check
            this.gray = 255;
        } // should not happen  but we are rounding

        // assign new values
        this.newImage[this.i] = 255 - pixelArray[this.i];
        this.newImage[this.i + 1] = 255 - pixelArray[this.i + 1];
        this.newImage[this.i + 2] = 255 - pixelArray[this.i + 2];
        this.newImage[this.i + 3] = pixelArray[this.i + 3]; // do not change alpha
    }

    return this.newImage;
}

function ColorBalance(pixelArray, balance) {
    this.newImage = new Array();

    // make sure the balance array is right length
    if (balance.length = 3) {
        // first convert all the images
        this.maxInt = 0; // the max intensity on any gun to scale so image fits in range afterwords.
        for (this.i = 0; this.i < pixelArray.length; this.i += 4) {
            // assign new values
            this.newImage[this.i + RED] = Math.floor(pixelArray[this.i + RED] * balance[RED] + 0.5);
            if (this.newImage[this.i + RED] > this.maxInt) {
                this.maxInt = this.newImage[this.i + RED];
            }
            this.newImage[this.i + GREEN] = Math.floor(pixelArray[this.i + GREEN] * balance[GREEN] + 0.5);
            if (this.newImage[this.i + GREEN] > this.maxInt) {
                this.maxInt = this.newImage[this.i + GREEN];
            }
            this.newImage[this.i + BLUE] = Math.floor(pixelArray[this.i + BLUE] * balance[BLUE] + 0.5);
            if (this.newImage[this.i + BLUE] > this.maxInt) {
                this.maxInt = this.newImage[this.i + BLUE];
            }
            this.newImage[this.i + ALPHA] = pixelArray[this.i + ALPHA]; // do not change alpha
        }

        // now check for excess values
        if (this.maxInt > 255) {
            // I have values in excess
            this.scale = 255 / this.maxInt;
            for (this.i = 0; this.i < this.newImage.length; this.i += 4) {
                this.newImage[i + RED] = Math.floor(this.newImage[i + RED] * this.scale + 0.5);
                this.newImage[i + GREEN] = Math.floor(this.newImage[i + GREEN] * this.scale + 0.5);
                this.newImage[i + BLUE] = Math.floor(this.newImage[i + BLUE] * this.scale + 0.5);
            }
        }
    }

    return this.newImage;
}

// average, in each color the information in a block and replace that area by the average
function blockImage(pixelArray, w, h, bW, bH) {
    this.pixelArray = pixelArray;
    this.w = w; // width of image
    this.h = h; // height of image
    this.bW = bW; // width of bock to average in
    this.bH = bH; // height of block to average in

    // the arrays with the blocked image
    //    this.newR = [];
    //    this.newG = [];
    //    this.newB = [];

    // do the averaging
    this.outImage = []; // declar the output array
    for (this.i = 0; this.i < this.w; this.i += this.bW) {
        for (this.j = 0; this.j < this.h; this.j += this.bH) {
            // move through the image in steps of the block size
            //create each block
            // first figure out average value on each gun
            this.avR = 0;
            this.avG = 0;
            this.avB = 0;
            this.count = 0;
            // EXAMINE HOW I GO THROUGH THE FIGURE.
            this.endW = this.i + this.bW; // end of block width
            if (this.endW > this.w) { // make sure image does not go behond end of picture
                this.endW = this.w;
            }
            for (this.x = this.i; this.x < this.endW; this.x++) {
                this.endH = this.j + this.bH; // end of block height
                if (this.endH > this.h) { // make sure image does not go behond end of picture
                    this.endH = this.h;
                }
                for (this.y = this.j; this.y < this.endH; this.y++) {
                    var idx = 4 * (this.x + this.y * this.w);
                    this.avR += this.pixelArray[idx + RED]; // add each pixel in the block.  keep guns separate
                    this.avG += this.pixelArray[idx + GREEN]; // add each pixel in the block.  keep guns separate
                    this.avB += this.pixelArray[idx + BLUE]; // add each pixel in the block.  keep guns separate
                    this.count++;
                }
            }

            // create the averages
            this.avR = Math.floor(this.avR / this.count + 0.5);
            this.avG = Math.floor(this.avG / this.count + 0.5);
            this.avB = Math.floor(this.avB / this.count + 0.5);

            // put back into block.
            for (this.x = this.i; this.x < this.endW; this.x++) {
                this.endH = this.j + this.bH;
                if (this.endH > this.h) { // make sure image does not go behond end of picture
                    this.endH = this.h;
                }
                for (this.y = this.j; this.y < this.endH; this.y++) {
                    var idx = 4 * (this.x + this.y * this.w);
                    this.outImage[idx + RED] = this.avR; // restore each pixels, one gun at a time
                    this.outImage[idx + GREEN] = this.avG; // restore each pixels, one gun at a time
                    this.outImage[idx + BLUE] = this.avB; // restore each pixels, one gun at a time
                    this.outImage[idx + ALPHA] = this.pixelArray[idx + ALPHA]; // do not change alpha
                }
            }
        }
    } // end the averaging

    //    this.outImage = RearrangePixels(this.r, this.g, this.b, this.pixelArray[ALPHA]);

    return this.outImage;
}

// blur the image along a linear dimension.  eventually the weighting will be gausian
function linBlur(pixelArray, w, h, stDev, deg) {
    this.pixelArray = pixelArray;
    this.w = w; // width of image
    this.h = h; // height of image
    this.stDev = stDev; // standard deviation of the blur
    this.windowLength = 3 * this.stDev; // how far to travel along the line, 3 standard deviations
    this.deg = deg % 360; // the angle of the blur put in one circle
    if (this.deg < 0) {
        this.deg = 360 + this.deg; // put all into positive values
    }
    this.deg = -this.deg; // make negative as Javascript goes clockwise but the rest of us go counterclockwise
    this.rad = this.deg * Math.PI / 180;
    // create normal distribution 
    this.normal = new NormalDistribution();
    this.normal.stdDev = this.stDev; // set the standard deviation of the normal distribution

    // determine the direction to do the averaging
    this.dir = true; // go along the x axis
    if (this.deg < -45 && this.deg > -135) {
        this.dir = false; // go along the y axis
    }
    if (this.deg < -225 && this.deg > -315) {
        this.dir = false; // go along the y axis
    }

    // create an array of weights
    this.weightArray = [];
    for (this.i = 0; this.i < this.stDev * 4; this.i++) {
        this.weightArray[this.i] = this.normal.getValue(this.i);
    }

    // do the averaging
    this.outImage = []; // declare the output array
    for (this.i = 0; this.i < this.w; this.i++) {
        for (this.j = 0; this.j < this.h; this.j++) {
            // move through the image in steps of the block size
            //create each block
            // first figure out average value on each gun
            this.avR = 0;
            this.avG = 0;
            this.avB = 0;
            this.count = 0;
            // EXAMINE HOW I GO THROUGH THE FIGURE.

            if (this.dir) { // horizontal
                // going along the x axis
                this.endW = this.i + this.windowLength; // end of block width
                this.startW = this.i - this.windowLength;

                this.count = 0; // reset the divisor
                for (this.x = this.startW; this.x < this.endW; this.x++) {
                    // determine the y axis point
                    this.y = Math.floor(this.j + (this.x - this.i) * Math.tan(this.rad) + 0.5); // uses slope to determing the nex y position

                    // keep the height values in the picture
                    if (this.y < 0) {
                        this.y = -1;
                    }
                    if (this.y >= this.h) { // make sure image does not go beyond end of picture
                        //                        this.y = this.h-1;
                        this.y = -1;
                    }

                    // add the value to the average
                    // if in range
                    if (this.x < this.w && this.x >= 0 && this.y != -1) {
                        var dist = Math.floor(Math.sqrt((this.x - this.i) * (this.x - this.i) + (this.y - this.j) * (this.y - this.j)) + 0.5); // distance from point
                        if (dist >= this.weightArray.length) {
                            dist = this.weightArray.length-1;
                        }
                        var wgt = this.weightArray[dist]; // weight contribution by normal function.
                        var idx = 4 * (this.x + this.y * this.w); // convert from rectangular array to linear array 
                        this.avR += this.pixelArray[idx + RED] * wgt; // add each pixel in the block.  keep guns separate
                        this.avG += this.pixelArray[idx + GREEN] * wgt; // add each pixel in the block.  keep guns separate
                        this.avB += this.pixelArray[idx + BLUE] * wgt; // add each pixel in the block.  keep guns separate
                        this.count += wgt; // add weight to divisor of the average
                    }
                }
            } else { // vertical
                // going along the x axis
                this.endH = this.j + this.windowLength; // end of block width
                this.startH = this.j - this.windowLength;

                this.count = 0; // reset the divisor
                for (this.y = this.startH; this.y < this.endH; this.y++) {
                    // determine the y axis point
                    this.x = Math.floor(this.i - (this.y - this.j) * Math.tan(this.rad - Math.PI / 2) + 0.5); // uses slope to determing the nex y position

                    // keep the height values in the picture
                    if (this.x < 0) {
                        this.x = -1;
                    }
                    if (this.x >= this.w) { // make sure image does not go beyond end of picture
                        this.x = -1;
                    }

                    // add the value to the average
                    // if in range
                    if (this.y >= 0 && this.y < this.h && this.x != -1) {
                        var dist = Math.floor(Math.sqrt((this.x - this.i) * (this.x - this.i) + (this.y - this.j) * (this.y - this.j)) + 0.5); // distance from point
                        if (dist >= this.weightArray.length) {
                            dist = this.weightArray.length;
                        }
                        var wgt = this.weightArray[dist]; // weight contribution by normal function.
                        var idx = 4 * (this.x + this.y * this.w); // convert from rectangular array to linear array 
                        this.avR += this.pixelArray[idx + RED] * wgt; // add each pixel in the block.  keep guns separate
                        this.avG += this.pixelArray[idx + GREEN] * wgt; // add each pixel in the block.  keep guns separate
                        this.avB += this.pixelArray[idx + BLUE] * wgt; // add each pixel in the block.  keep guns separate
                        this.count += wgt;
                    }
                }
            }

            // create the averages
            this.avR = Math.floor(this.avR / this.count + 0.5);
            this.avG = Math.floor(this.avG / this.count + 0.5);
            this.avB = Math.floor(this.avB / this.count + 0.5);

            // put back into image
            var idx = 4 * (this.i + this.j * this.w);
            this.outImage[idx + RED] = this.avR; // restore each pixels, one gun at a time
            this.outImage[idx + GREEN] = this.avG; // restore each pixels, one gun at a time
            this.outImage[idx + BLUE] = this.avB; // restore each pixels, one gun at a time
            this.outImage[idx + ALPHA] = this.pixelArray[idx + ALPHA]; // do not change alpha
        }
    } // end the averaging

    //    this.outImage = RearrangePixels(this.r, this.g, this.b, this.pixelArray[ALPHA]);

    return this.outImage;
}

// average, in each color the information in a block and replace that area by the average
function blurImage(pixelArray, w, h, r) {
    this.pixelArray = pixelArray;
    this.w = w; // width of image
    this.h = h; // height of image
    this.r = r; // radius of averaging area

    // do the averaging
    this.outImage = []; // declare the output array

    this.weights = [];
    // create array for weights
    for (this.i = 0; this.i <= 2 * this.r + 1; this.i++) {
        this.weights[this.i] = []; // declare second dimension
        for (this.j = 0; this.j <= 2 * this.r + 1; this.j++) {
            this.weights[this.i][this.j] = (this.r - Math.sqrt((this.r - this.i) * (this.r - this.i) + (this.r - this.j) * (this.r - this.j))) / this.r;
            if (this.weights[this.i][this.j] < 0) {
                this.weights[this.i][this.j] = 0;
            }
        }
    }

    for (this.i = 0; this.i < this.w; this.i++) {
        for (this.j = 0; this.j < this.h; this.j++) {
            // move through the image in steps of the block size
            //create each block
            // first figure out average value on each gun
            this.avR = 0;
            this.avG = 0;
            this.avB = 0;
            this.count = 0;
            // EXAMINE HOW I GO THROUGH THE FIGURE.
            this.startW = this.i - this.r;
            if (this.startW < 0) {
                this.startW = 0;
            }
            this.endW = this.i + this.r; // end of block width
            if (this.endW > this.w) { // make sure image does not go beyond end of picture
                this.endW = this.w;
            }
            for (this.x = this.startW; this.x < this.endW; this.x++) {
                this.startH = this.j - this.r; // end of block height
                if (this.startH < 0) { // make sure image does not go beyond end of picture
                    this.startH = 0;
                }
                this.endH = this.j + this.r; // end of block height
                if (this.endH > this.h) { // make sure image does not go beyond end of picture
                    this.endH = this.h;
                }
                for (this.y = this.startH; this.y < this.endH; this.y++) {
                    var idx = 4 * (this.x + this.y * this.w);
                    var d = this.weights[this.x - this.i + this.r][this.y - this.j + this.r];
                    this.avR += this.pixelArray[idx + RED] * d; // add each pixel in the block.  keep guns separate
                    this.avG += this.pixelArray[idx + GREEN] * d; // add each pixel in the block.  keep guns separate
                    this.avB += this.pixelArray[idx + BLUE] * d; // add each pixel in the block.  keep guns separate
                    this.count += d;
                }
            }

            // create the averages
            this.avR = Math.floor(this.avR / this.count + 0.5);
            this.avG = Math.floor(this.avG / this.count + 0.5);
            this.avB = Math.floor(this.avB / this.count + 0.5);

            var idx = 4 * (this.i + this.j * this.w);
            this.outImage[idx + RED] = this.avR; // restore each pixels, one gun at a time
            this.outImage[idx + GREEN] = this.avG; // restore each pixels, one gun at a time
            this.outImage[idx + BLUE] = this.avB; // restore each pixels, one gun at a time
            this.outImage[idx + ALPHA] = this.pixelArray[idx + ALPHA]; // do not change alpha
        }
    } // end the averaging

    return this.outImage;
}

// blur a gray scale image
function blurImageGray(pixelArray, w, h, r) {
    this.pixelArray = pixelArray;
    this.w = w; // width of image
    this.h = h; // height of image
    this.r = r; // radius of averaging area

    // do the averaging
    this.outImage = []; // declare the output array

    this.weights = [];
    // create array for weights
    for (this.i = 0; this.i <= 2 * this.r + 1; this.i++) {
        this.weights[this.i] = []; // declare second dimension
        for (this.j = 0; this.j <= 2 * this.r + 1; this.j++) {
            this.weights[this.i][this.j] = (this.r - Math.sqrt((this.r - this.i) * (this.r - this.i) + (this.r - this.j) * (this.r - this.j))) / this.r;
            if (this.weights[this.i][this.j] < 0) {
                this.weights[this.i][this.j] = 0;
            }
        }
    }

    for (this.i = 0; this.i < this.w; this.i++) {
        for (this.j = 0; this.j < this.h; this.j++) {
            // move through the image in steps of the block size
            //create each block
            // first figure out average value on each gun
            this.avR = 0;
            this.count = 0;
            // EXAMINE HOW I GO THROUGH THE FIGURE.
            this.startW = this.i - this.r;
            if (this.startW < 0) {
                this.startW = 0;
            }
            this.endW = this.i + this.r; // end of block width
            if (this.endW > this.w) { // make sure image does not go beyond end of picture
                this.endW = this.w;
            }
            for (this.x = this.startW; this.x < this.endW; this.x++) {
                this.startH = this.j - this.r; // end of block height
                if (this.startH < 0) { // make sure image does not go beyond end of picture
                    this.startH = 0;
                }
                this.endH = this.j + this.r; // end of block height
                if (this.endH > this.h) { // make sure image does not go beyond end of picture
                    this.endH = this.h;
                }
                for (this.y = this.startH; this.y < this.endH; this.y++) {
                    var idx = 4 * (this.x + this.y * this.w);
                    var d = this.weights[this.x - this.i + this.r][this.y - this.j + this.r];
                    this.avR += this.pixelArray[idx + RED] * d; // add each pixel in the block.  keep guns separate
                    this.count += d;
                }
            }

            // create the averages
            this.avR = Math.floor(this.avR / this.count + 0.5);

            var idx = 4 * (this.i + this.j * this.w);
            this.outImage[idx + RED] = this.avR; // restore each pixels, one gun at a time
            this.outImage[idx + GREEN] = this.avR; // restore each pixels, one gun at a time
            this.outImage[idx + BLUE] = this.avR; // restore each pixels, one gun at a time
            this.outImage[idx + ALPHA] = this.pixelArray[idx + ALPHA]; // do not change alpha
        }
    } // end the averaging

    return this.outImage;
}

function ScaleToCanvas(w, h, img) {
    this.w = w; // canvas width
    this.h = h; // canvas height
    this.img = img; // image
    this.imgW = this.img.naturalWidth;
    this.imgH = this.img.naturalHeight;

    // determine image ratio to canvas
    this.ratW = this.w / this.imgW; // width ratio
    this.ratH = this.h / this.imgH; // height ratio

    if (this.ratW < this.ratH) { // width is smaller than heigh
        this.imgW = this.w;
        this.imgH = this.imgH * this.ratW;
    } else {
        // height is smaller that width
        this.imgH = this.h;
        this.imgW = this.imgW * this.ratH;
    }

    //   alert(this.w + " " + this.h + " " + this.img.naturalWidth + " " + this.img.naturalHeight + " " + this.imgW + " " + this.imgH);

    return [this.imgW, this.imgH];
}

// determine the dimensions of the image to fit the height of the canvas
function ScaleToFitHeight(w, h, img) {
    this.w = w; // canvas width
    this.h = h; // canvas height
    this.img = img; // image
    this.imgW = this.img.naturalWidth;
    this.imgH = this.img.naturalHeight;

    // determine image ratio to canvas
    this.ratH = this.h / this.imgH; // height ratio

    // height is smaller that width
    this.imgH = this.h;
    this.imgW = this.imgW * this.ratH;

    //   alert(this.w + " " + this.h + " " + this.img.naturalWidth + " " + this.img.naturalHeight + " " + this.imgW + " " + this.imgH);

    return [this.imgW, this.imgH];
}

function doDichromacy(imageArray, missingCone) {
    // new algorithm, eliminate at color opponent stages
    this.cc = new ColorComputer();
    this.opponent = this.cc.fromRGBtoColorOpponent(imageArray);
    // adjust those opponent channels that are active still
    this.width = imageArray.length;
    this.height = imageArray[0].length;
    for (this.i = 0; this.i < this.width; this.i++) {
        for (this.j = 0; this.j < this.height; this.j++) {
            if (missingCone == PROTANOPE) {
                if (this.opponent[this.i][this.j][R_G] > 0) {
                    this.opponent[this.i][this.j][R_G] = 0;
                }
                this.opponent[this.i][this.j][BL_WH] *= 0.97;
                if (this.opponent[this.i][this.j][B_Y] > 0) {
                    this.opponent[this.i][this.j][B_Y] *= 0.75;
                }
            }
            if (missingCone == DEUTERANOPE) {
                if (this.opponent[this.i][this.j][R_G] < 0) {
                    this.opponent[this.i][this.j][R_G] = 0;
                }
                if (this.opponent[this.i][this.j][B_Y] > 0) {
                    this.opponent[this.i][this.j][B_Y] *= 0.5;
                }
                //                  if (opponent[i][j][ColorConst.])
                this.opponent[this.i][this.j][BL_WH] *= 0.75;
            }
            if (missingCone == TRITANOPE) {
                if (this.opponent[this.i][this.j][B_Y] < 0) {
                    this.opponent[this.i][this.j][B_Y] = 0;
                }
                this.opponent[this.i][this.j][BL_WH] *= 0.95;
            }
        }
    }
    this.outPixels = this.cc.fromColorOpponentToRGB(this.opponent);

    // re-convert the image
    return this.outPixels;

}

// function to draw simple stereo image pairs
// other functions will determine how the images are dealt with (anaglyph or image pairs or what not)
function StereoImageDraw(imgType, dispVal, xSizeFig, ySizeFig, lColor, rColor, backColor) {
    this.imgType = imgType; // code for the image type.
    this.dispVal = dispVal; // the disparity in pixels, positive is crossed and negative is uncrossed
    this.xSize = Math.floor(xSizeFig + 0.5); // the x size of the figure.  If a square is to be drawn, will also be the y dimension as well
    this.ySize = Math.floor(ySizeFig + 0.5); // the y dimension of the figure.  ignored in squares
    this.lColor = lColor; // color of the left eye image
    this.rColor = rColor; // color of the right eye image
    this.backColor = backColor; // background color

    // create the drawing canvases and context and fit to the size
    // left eye
    this.lCanvas = document.createElement("canvas");
    this.lContext = this.lCanvas.getContext("2d");
    this.lCanvas.width = this.xSize + Math.abs(this.dispVal); // add extra x distance for disparity
    this.lCanvas.height = this.ySize;
    if (this.imgType == CIRCLE || this.imgType == SQUARE) {
        this.lCanvas.height = this.xSize;
    }

    // right eye
    this.rCanvas = document.createElement("canvas");
    this.rContext = this.rCanvas.getContext("2d");
    this.rCanvas.width = this.xSize + Math.abs(this.dispVal); // add extra x distance for disparity
    this.rCanvas.height = this.ySize;
    if (this.imgType == CIRCLE || this.imgType == SQUARE) {
        this.rCanvas.height = this.xSize;
    }


    // clear the background
    this.dL = new Draw(this.lCanvas);
    this.dR = new Draw(this.rCanvas);
    // set up foreground and background
    this.dL.foreground = this.lColor;
    this.dL.background = this.backColor;
    this.dR.foreground = this.rColor;
    this.dR.background = this.backColor;

    // clear the canvases
    this.dL.clear();
    this.dR.clear();

    // now draw the figure
    this.lContext.fillStyle = this.lColor;
    this.rContext.fillStyle = this.rColor;
    // just do circle for now
    this.radius = Math.floor(this.xSize / 2);
    if (this.dispVal >= 0) {
        // Crossed or no disparity
        //        alert("here " + this.xSize + " " + this.dispVal+" "+this.radius+" "+this.lContext.fillStyle);
        // left eye
        this.dL.circle(this.radius + this.dispVal, this.radius, this.radius);
        this.lContext.fill();
        // right eye
        this.dR.circle(this.radius, this.radius, this.radius);
        this.rContext.fill();
    } else {
        // uncrossed disparity
        // right eye
        this.dR.circle(this.radius - this.dispVal, this.radius, this.radius);
        this.rContext.fill();
        // right eye
        this.dL.circle(this.radius, this.radius, this.radius);
        this.lContext.fill();
    }

    // convert to image arrays
    this.leftImage = this.lContext.getImageData(0, 0, this.lCanvas.width, this.lCanvas.height);
    this.rightImage = this.rContext.getImageData(0, 0, this.rCanvas.width, this.rCanvas.height);

    // create array of the image pairs
    this.imagePair = [];
    this.imagePair[LEFT] = this.leftImage;
    this.imagePair[RIGHT] = this.rightImage;

    return this.imagePair;
}

function StereoImageDrawBack(imgType, dispVal, xSizeFig, ySizeFig, lColor, rColor, backImgData) {
    this.imgType = imgType; // code for the image type.
    this.dispVal = dispVal; // the disparity in pixels, positive is crossed and negative is uncrossed
    this.xSize = Math.floor(xSizeFig + 0.5); // the x size of the figure.  If a square is to be drawn, will also be the y dimension as well
    this.ySize = Math.floor(ySizeFig + 0.5); // the y dimension of the figure.  ignored in squares
    this.lColor = lColor; // color of the left eye image
    this.rColor = rColor; // color of the right eye image
    this.backImgData = backImgData; // background color

    // create the drawing canvases and context and fit to the size
    // left eye
    this.lCanvas = document.createElement("canvas");
    this.lContext = this.lCanvas.getContext("2d");
    this.lCanvas.width = this.xSize + Math.abs(this.dispVal); // add extra x distance for disparity
    this.lCanvas.height = this.ySize;
    if (this.imgType == CIRCLE || this.imgType == SQUARE) {
        this.lCanvas.height = this.xSize;
    }

    // right eye
    this.rCanvas = document.createElement("canvas");
    this.rContext = this.rCanvas.getContext("2d");
    this.rCanvas.width = this.xSize + Math.abs(this.dispVal); // add extra x distance for disparity
    this.rCanvas.height = this.ySize;
    if (this.imgType == CIRCLE || this.imgType == SQUARE) {
        this.rCanvas.height = this.xSize;
    }


    // clear the background
    this.dL = new Draw(this.lCanvas);
    this.dR = new Draw(this.rCanvas);
    // set up foreground and background
    this.dL.foreground = this.lColor;
    this.dL.background = this.backColor;
    this.dR.foreground = this.rColor;
    this.dR.background = this.backColor;

    // clear the canvases
    //    this.dL.clear();
    //    this.dR.clear();
    // place the background
    this.lContext.putImageData(this.backImgData, 0, 0);
    this.rContext.putImageData(this.backImgData, 0, 0);

    // now draw the figure
    this.lContext.fillStyle = this.lColor;
    this.rContext.fillStyle = this.rColor;
    // just do circle for now
    this.radius = Math.floor(this.xSize / 2);
    if (this.dispVal >= 0) {
        // Crossed or no disparity
        //        alert("here " + this.xSize + " " + this.dispVal+" "+this.radius+" "+this.lContext.fillStyle);
        // left eye
        this.dL.circle(this.radius + this.dispVal, this.radius, this.radius);
        this.lContext.fill();
        // right eye
        this.dR.circle(this.radius, this.radius, this.radius);
        this.rContext.fill();
    } else {
        // uncrossed disparity
        // right eye
        this.dR.circle(this.radius - this.dispVal, this.radius, this.radius);
        this.rContext.fill();
        // right eye
        this.dL.circle(this.radius, this.radius, this.radius);
        this.lContext.fill();
    }

    // convert to image arrays
    this.leftImage = this.lContext.getImageData(0, 0, this.lCanvas.width, this.lCanvas.height);
    this.rightImage = this.rContext.getImageData(0, 0, this.rCanvas.width, this.rCanvas.height);

    // create array of the image pairs
    this.imagePair = [];
    this.imagePair[LEFT] = this.leftImage;
    this.imagePair[RIGHT] = this.rightImage;

    return this.imagePair;
}

// take two sets of image data and create an anaglyph, make the background transparent
// Both images must be the same size - makes my life a lot easier.
// transparent color must be a color string of rgb(r,g,b) type
// send something not possible to not have transparent color
// Can id image color to block background
this.CreateAnaglyph = function(leftImageData, rightImageData, anaglyphType, drawColor) {
    this.lEye = leftImageData; // image data array for left eye image
    this.rEye = rightImageData; // image data array for right eye image
    this.anaglyphType = anaglyphType;
    this.drawColor = drawColor; // black background where the drawn color exists.  Will not do well with blurred edges

    this.drawVal = colorVal(this.drawColor); // get values of drawn color

    // create a canvas four the output image array
    this.outCanvas = document.createElement("canvas");
    this.outCanvas.width = this.lEye.width;
    this.outCanvas.height = this.lEye.height;
    // create context
    this.outContext = this.outCanvas.getContext("2d");

    this.outImageData = this.outContext.getImageData(0, 0, this.outCanvas.width, this.outCanvas.height);

    this.outData = []; // the output image array will be added to left eye image data and sent back
    this.imgLength = this.lEye.data.length;

    if (this.lEye.width == this.rEye.width && this.lEye.height == this.rEye.height) {
        // check to make sure the two images are the same height and width, duh, same size.

        // move through the image combining
        for (this.i = 0; this.i < this.imgLength; this.i += 4) {
            // do steps of for for r, g, b, a values
            // combine the images from the two eye
            if (this.anaglyphType == RC_COLOR) {
                // weight left eye images from each gun to add color to image
                this.outImageData.data[this.i + RED] = Math.floor((0.299 * this.lEye.data[this.i + RED] +
                    0.587 * this.lEye.data[this.i + GREEN] +
                    0.114 * this.lEye.data[this.i + BLUE]) + 0.5);
                // weights for color image are taken from StereoPhoto Maker version 4.55
            } else {
                this.outImageData.data[this.i + RED] = Math.floor((this.lEye.data[this.i + RED] + this.lEye.data[this.i + GREEN] +
                    this.lEye.data[this.i + BLUE]) / 3 + 0.5);
                // if not color image
                //left eye always seems to have red, may need to change later
                // there is yellow blue, but I have not seen those glasses
                // do average across all three guns
            }

            // green output
            if (this.anaglyphType == RED_CYAN || this.anaglyphType == RED_GREEN) {
                this.outImageData.data[this.i + GREEN] = Math.floor((this.rEye.data[this.i + RED] + this.rEye.data[this.i + GREEN] +
                    this.rEye.data[this.i + BLUE]) / 3 + 0.5);
                //                    this.outImageData.data[this.i + GREEN] = 0;
            } else if (this.anaglyphType == RC_COLOR) {
                // weight guns to create semi colored image
                this.outImageData.data[this.i + GREEN] = Math.floor((0.299 * this.rEye.data[this.i + RED] +
                    0.587 * this.rEye.data[this.i + GREEN] +
                    0.114 * this.rEye.data[this.i + BLUE]) + 0.5);
                // weights for color image are taken from StereoPhoto Maker version 4.55
            } else {
                this.outImageData.data[this.i + GREEN] = 0;
            }
            // blue output
            if (this.anaglyphType == RED_CYAN || this.anaglyphType == RED_BLUE) {
                //                    alert("here blue");
                this.outImageData.data[this.i + BLUE] = Math.floor((this.rEye.data[this.i + RED] + this.rEye.data[this.i + GREEN] +
                    this.rEye.data[this.i + BLUE]) / 3 + 0.5);
                //                    this.outImageData.data[this.i + BLUE] = 0;
            } else if (this.anaglyphType == RC_COLOR) {
                // weight guns to create semi colored image
                this.outImageData.data[this.i + BLUE] = Math.floor((0.299 * this.rEye.data[this.i + RED] +
                    0.587 * this.rEye.data[this.i + GREEN] +
                    0.114 * this.rEye.data[this.i + BLUE]) + 0.5);
                // weights for color image are taken from StereoPhoto Maker version 4.55
            } else {
                this.outImageData.data[this.i + BLUE] = 0;
            }
            // no transparency where there is color
            this.outImageData.data[this.i + ALPHA] = 255.0;

            // check if image color is alone for one eye, and block background
            // left eye, red gun
            if (this.lEye.data[this.i + RED] == this.drawVal[RED] &&
                this.lEye.data[this.i + GREEN] == this.drawVal[GREEN] &&
                this.lEye.data[this.i + BLUE] == this.drawVal[BLUE]) {
                // check if no overlap between eyes
                // check right eye
                if (this.rEye.data[this.i + RED] != this.drawVal[RED] ||
                    this.rEye.data[this.i + GREEN] != this.drawVal[GREEN] ||
                    this.rEye.data[this.i + BLUE] != this.drawVal[BLUE]) {
                    this.outImageData.data[this.i + GREEN] = 0;
                    this.outImageData.data[this.i + BLUE] = 0;
                }

            }
            // right eye eye, check guns
            if (this.rEye.data[this.i + RED] == this.drawVal[RED] &&
                this.rEye.data[this.i + GREEN] == this.drawVal[GREEN] &&
                this.rEye.data[this.i + BLUE] == this.drawVal[BLUE]) {
                // check if no overlap between eyes
                // check right eye
                if (this.lEye.data[this.i + RED] != this.drawVal[RED] ||
                    this.lEye.data[this.i + GREEN] != this.drawVal[GREEN] ||
                    this.lEye.data[this.i + BLUE] != this.drawVal[BLUE]) {
                    this.outImageData.data[this.i + RED] = 0;
                    // check anaglyph type
                    if (this.anaglyphType == RED_GREEN) {
                        this.outImageData.data[this.i + BLUE] = 0;
                    }
                    if (this.anaglyphType == RED_BLUE) {
                        this.outImageData.data[this.i + GREEN] = 0;
                    }
                }

            }
        }
    }

    return this.outImageData;
}

// take two sets of image data and create an anaglyph, make the background transparent
// Both images must be the same size - makes my life a lot easier.
// transparent color must be a color string of rgb(r,g,b) type
// send something not possible to not have transparent color
// averages across all guns
this.CreateAnaglyphAvg = function(leftImageData, rightImageData, anaglyphType) {
    this.lEye = leftImageData; // image data array for left eye image
    this.rEye = rightImageData; // image data array for right eye image
    this.anaglyphType = anaglyphType;

    // create a canvas four the output image array
    this.outCanvas = document.createElement("canvas");
    this.outCanvas.width = this.lEye.width;
    this.outCanvas.height = this.lEye.height;
    // create context
    this.outContext = this.outCanvas.getContext("2d");

    this.outImageData = this.outContext.getImageData(0, 0, this.outCanvas.width, this.outCanvas.height);

    this.outData = []; // the output image array will be added to left eye image data and sent back
    this.imgLength = this.lEye.data.length;

    if (this.lEye.width == this.rEye.width && this.lEye.height == this.rEye.height) {
        // check to make sure the two images are the same height and width, duh, same size.

        // move through the image combining
        for (this.i = 0; this.i < this.imgLength; this.i += 4) {
            // do steps of for for r, g, b, a values
            // combine the images from the two eye
            this.outImageData.data[this.i + RED] = Math.floor((this.lEye.data[this.i + RED] + this.lEye.data[this.i + GREEN] +
                this.lEye.data[this.i + BLUE]) / 3 + 0.5);
            //left eye always seems to have red, may need to change later
            // there is yellow blue, but I have not seen those glasses
            // do average across all three guns
            // green output
            if (this.anaglyphType == RED_CYAN || this.anaglyphType == RED_GREEN) {
                this.outImageData.data[this.i + GREEN] = Math.floor((this.rEye.data[this.i + RED] + this.rEye.data[this.i + GREEN] +
                    this.rEye.data[this.i + BLUE]) / 3 + 0.5);
                //                    this.outImageData.data[this.i + GREEN] = 0;
            } else {
                this.outImageData.data[this.i + GREEN] = 0;
            }
            // blue output
            if (this.anaglyphType == RED_CYAN || this.anaglyphType == RED_BLUE) {
                //                    alert("here blue");
                this.outImageData.data[this.i + BLUE] = Math.floor((this.rEye.data[this.i + RED] + this.rEye.data[this.i + GREEN] +
                    this.rEye.data[this.i + BLUE]) / 3 + 0.5);
                //                    this.outImageData.data[this.i + BLUE] = 0;
            } else {
                this.outImageData.data[this.i + BLUE] = 0;
            }
            // no transparency where there is color
            this.outImageData.data[this.i + ALPHA] = 255.0;

        }
    }

    return this.outImageData;
}
