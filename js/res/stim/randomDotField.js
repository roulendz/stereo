function RandomDotField() {
    this.width; // the width to make the random dot field
    this.height; // the height to make the random dot field

    // parameters of random dot field
    this.dotSize = 2; // the size of the random dots default size = 2
    // the two colors of the dots
    this.front = colorString(0, 0, 0); //background color
    this.back = colorString(255, 255, 255); // foreground color

    this.getRDF = function(width, height) {
        // create the temporary image
        this.canvas = document.createElement("canvas"); // drawing canvas in the ether not attached and not visible
        this.context = this.canvas.getContext("2d"); // drawing context
        this.width = width; // the width to make the random dot field
        this.height = height; // the height to make the random dot field

        // max the canvas the appropriate size
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // get the graphics and clear the image field with black
        this.context.fillStyle = this.back;
        this.context.fillRect(0, 0, width, height);

        // now fill with white dots using a random process
        this.context.fillStyle = this.front;
        for (this.y = 0; this.y <= this.height - this.dotSize + 1; this.y += this.dotSize) {
            for (this.x = 0; this.x <= this.width - this.dotSize + 1; this.x += this.dotSize) {
                if (Math.random() < 0.5){
                    this.context.fillRect(this.x, this.y, this.dotSize, this.dotSize);
                }
            }
        }

        return this.context.getImageData(0,0,this.width,this.height);  // return the image data
    };
}

