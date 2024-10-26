// Parameters to control the model illustration
// This is for Steven's Power Law
function RDS_Ch07Control(controlId) {
    // what are the default parameters for each of the functions.  Parameters depend upon model calculator
    this.defaultParam = Array();
    this.defaultParam[0] = [RED_CYAN, false, 2, 2, true, 8, -8, STATIC]; // default parameters

    // bind the object to itself
    var self = this;

    // set up the objects to control the model - receive a span object to deal with
    this.span = document.getElementById(controlId); // get the span element
    // test
    this.span.innerHTML = "<strong name='text'>Adjust these parameters of the Optic Flow</strong><br>";

    // CSS for wider sliders
    var style = document.createElement('style');
    style.innerHTML = `
        input[type="range"] {
            width: 80%;
            margin: 10px 0;
        }
    `;
    document.head.appendChild(style);

    // parameters to pass to illustration
    this.type = new IllusParam(TYPE, this.defaultParam[0][0]); // type of disparity
    this.flow = new IllusParam(MOVE, this.defaultParam[0][1]);
    this.speed = new IllusParam(SPEED, this.defaultParam[0][2]);
    this.size = new IllusParam(SIZE, this.defaultParam[0][3]);
    this.resetPos = new IllusParam(4, this.defaultParam[0][4]);
    this.resetDoneVal = 0; // flag to keep track if the reset has been done.
    this.squareDisp = new IllusParam(SQUARE_DISP,this.defaultParam[0][5]);
    this.backDisp = new IllusParam(BACK_DISP,this.defaultParam[0][6]);
    this.dynamic = new IllusParam(DYNAMIC,this.defaultParam[0][7]);

    // layout parameters
    this.pctLandscape = 32; // if the device is wide, landscape sliders to right, width is 33 pct screen
    this.pctPortrait = 90; // if device is portrait or narrow, sliders below, width is 90 pct screen
    this.pct = this.pctLandscape; // current pct of screen.
    if (window.innerWidth <= window.innerHeight) { // check current dimension of browser
        // bias to below as take advantage of scrolling
        this.pct = this.pctPortrait;
    }

    // type of anaglyph
    this.typeSpan = document.createElement("span");
    this.typeBtns = new RadioList("Type of Anaglyph:", this.typeSpan, ANAGLYPH_NAMES_SHORT, "ana_type", [RED_CYAN, RED_BLUE, RED_GREEN],
        RED_CYAN, HORIZONTAL);
    this.span.appendChild(this.typeSpan);
    this.span.appendChild(document.createElement("br"));

    // slider to control the disparity of the square
    this.sliderSquareDisp = document.createElement("input");
    this.sliderSquareDisp.type = "range";
    this.sliderSquareDisp.min = -150;
    this.sliderSquareDisp.max = 150;
    this.sliderSquareDisp.step = 1;
    this.sliderSquareDisp.value = this.defaultParam[0][5];
    this.span.appendChild(document.createTextNode("Square Disparity: "));
    this.span.appendChild(document.createElement("br"));
    this.span.appendChild(this.sliderSquareDisp);
    this.squareDispValue = document.createElement("span");
    this.squareDispValue.textContent = this.sliderSquareDisp.value;
    this.span.appendChild(this.squareDispValue);
    this.span.appendChild(document.createElement("br"));

    // slider to control the disparity of the background
    this.sliderBackDisp = document.createElement("input");
    this.sliderBackDisp.type = "range";
    this.sliderBackDisp.min = -150;
    this.sliderBackDisp.max = 150;
    this.sliderBackDisp.step = 1;
    this.sliderBackDisp.value = this.defaultParam[0][6];
    this.span.appendChild(document.createTextNode("Background Disparity: "));
    this.span.appendChild(document.createElement("br"));
    this.span.appendChild(this.sliderBackDisp);
    this.backDispValue = document.createElement("span");
    this.backDispValue.textContent = this.sliderBackDisp.value;
    this.span.appendChild(this.backDispValue);
    this.span.appendChild(document.createElement("br"));

    // control dot size
    this.sliderSize = document.createElement("input");
    this.sliderSize.type = "range";
    this.sliderSize.min = 1;
    this.sliderSize.max = 16;
    this.sliderSize.step = 1;
    this.sliderSize.value = this.defaultParam[0][6];
    this.span.appendChild(document.createTextNode("Size of Dots: "));
    this.span.appendChild(document.createElement("br"));
    this.span.appendChild(this.sliderSize);

    // Create a span to display the current value
    this.sliderSizeValue = document.createElement("span");
    this.sliderSizeValue.textContent = this.sliderSize.value;
    this.span.appendChild(this.sliderSizeValue);

    this.span.appendChild(document.createElement("br"));

    // Add an event listener to update the displayed value when the slider changes
    this.sliderSize.addEventListener('input', () => {
        this.sliderSizeValue.textContent = this.sliderSize.value;
    });

    // type of RDS
    this.dynamicSpan = document.createElement("span");
    this.dynamicBtns = new RadioList("Update Stereogram:", this.dynamicSpan, DYNAMIC_NAMES, "dyn_type", DYNAMIC_VALS,
        STATIC, HORIZONTAL);
    this.span.appendChild(this.dynamicSpan);
    this.span.appendChild(document.createElement("br"));

    // start stop motion
    this.flowBtn = document.createElement("input");
    this.flowBtn.setAttribute("type", "button");
    this.flowBtn.setAttribute("value", "Move");
    this.span.appendChild(this.flowBtn);
    this.span.appendChild(document.createTextNode("  "));

    // recenter the flow
    this.centerBtn = document.createElement("input");
    this.centerBtn.setAttribute("type", "button");
    this.centerBtn.setAttribute("value", "Center");
    this.span.appendChild(this.centerBtn);
    this.span.appendChild(document.createElement("br"));

    // slider to control the speed of the top
    this.sliderSpeed = document.createElement("input");
    this.sliderSpeed.type = "range";
    this.sliderSpeed.min = 1;
    this.sliderSpeed.max = 8;
    this.sliderSpeed.step = 1;
    this.sliderSpeed.value = this.defaultParam[0][2];
    this.span.appendChild(document.createTextNode("Speed of Square: "));
    this.span.appendChild(document.createElement("br"));
    this.span.appendChild(this.sliderSpeed);

    // Create a span to display the current value
    this.sliderSpeedValue = document.createElement("span");
    this.sliderSpeedValue.textContent = this.sliderSpeed.value;
    this.span.appendChild(this.sliderSpeedValue);

    this.span.appendChild(document.createElement("br"));

    // Add an event listener to update the displayed value when the slider changes
    this.sliderSpeed.addEventListener('input', () => {
        this.sliderSpeedValue.textContent = this.sliderSpeed.value;
    });

    // here is the text for the internal explanations
    this.intExpl = []; // an array of internal explanations to display
    this.intExpl[0] = "";

    this.span.appendChild(document.createElement("br"));
    this.internalExplanation = document.createElement("p");
    this.internalExplanation.setAttribute("class", "paragraphs");

    // update if sliders are active
    this.setEnable = function() {
        // update the internal explanations
        var textExpl = "";
        textExpl += this.intExpl[0];
        this.internalExplanation.innerHTML = textExpl;
    };

    this.setEnable();

    // set up the check box listeners
    // click listeners
    this.flowBtn.onclick = function() {
        if (self.flow.value === true) {
            self.flowBtn.setAttribute("value", "Move");
            self.flow.value = false;
        } else {
            self.flowBtn.setAttribute("value", "Stop");
            self.flow.value = true;
        }
        self.setEnable();
    };
    this.centerBtn.onclick = function() { // recenter flow
        self.resetPos.value = true;
        self.resetDoneVal = 0;
        self.setEnable();
    };

    // touch listeners
    this.flowBtn.addEventListener('touchstart', function(event) {
        event.preventDefault();
        if (self.flow.value === true) {
            self.flowBtn.setAttribute("value", "Move");
            self.flow.value = false;
        } else {
            self.flowBtn.setAttribute("value", "Stop");
            self.flow.value = true;
        }
        self.setEnable();
    }, false);
    this.centerBtn.addEventListener('touchstart', function(event) {
        event.preventDefault();
        self.resetPos.value = true;
        self.resetDoneVal = 0;
        self.setEnable();
    }, false);

    // Add event listeners to update the displayed values
    this.sliderSquareDisp.addEventListener('input', function() {
        self.squareDispValue.textContent = this.value;
    });

    this.sliderBackDisp.addEventListener('input', function() {
        self.backDispValue.textContent = this.value;
    });

    // change the format for wide to narrow and the reverse
    this.reformat = function() {
        if (window.innerWidth <= window.innerHeight) {
            this.pct = this.pctPortrait;
        } else {
            this.pct = this.pctLandscape;
        }
        // No need to reset slider widths as they're now controlled by CSS
    };

    // getters and setters
    this.getParameters = function() {
        if (this.resetDoneVal > 0) {
            this.resetDoneVal = 0;
            this.resetPos.value = false;
        }
        this.type.value = this.typeBtns.getValue();
        this.speed.value = parseInt(this.sliderSpeed.value);
        this.size.value = parseInt(this.sliderSize.value);
        this.squareDisp.value = parseInt(this.sliderSquareDisp.value);
        this.backDisp.value = parseInt(this.sliderBackDisp.value);
        this.dynamic.value = this.dynamicBtns.getValue();
        this.parameters = [this.type, this.flow, this.speed, this.size, this.resetPos, this.squareDisp, this.backDisp, this.dynamic];
        if (this.resetPos.value) {
            this.resetDoneVal++;
        }
        this.setEnable();
        return this.parameters;
    };

    this.getSpecialParameters = function() {
        // return any parameters to add additional elements to the plot.
    };

    this.getSetupParameters = function() {
        var setupParam = null;
        return setupParam;
    };

    this.setDefault = function() {
        this.type.value = this.defaultParam[0][0];
        this.typeBtns.setChecked(this.type.value);
        this.flow.value = this.defaultParam[0][1];
        this.flowBtn.setAttribute("value", "Move");
        this.speed.value = this.defaultParam[0][2];
        this.sliderSpeed.value = this.speed.value;
        this.sliderSize.value = this.defaultParam[0][3];
        this.size.value = this.defaultParam[0][3];
        this.resetPos.value = this.defaultParam[0][4];
        this.sliderSquareDisp.value = this.defaultParam[0][5];
        this.sliderBackDisp.value = this.defaultParam[0][6];
        this.squareDispValue.textContent = this.defaultParam[0][5];
        this.backDispValue.textContent = this.defaultParam[0][6];
        this.dynamicBtns.setChecked(this.defaultParam[0][7]);
        this.setEnable();
    };

    this.explanation = "When you view an anaglyph random-dot stereogram without your glasses, all you see is a grid ";
    this.explanation += "of dots. There is no shape apparent other than this uninteresting ";
    this.explanation += "field of dots. Put on your glasses, now what do you see? If you have stereopsis, you should see a square ";
    this.explanation += "standing in from of the background.  To be able to see this square means that ";
    this.explanation += "the processing of the correspondent points necessary for  depth perception must precede object recognition, ";
    this.explanation += "because there are simply no objects to perceive in such figures until after stereopsis has occurred. ";
    this.explanation += "What happens to your ability to see the square if you chose <em>Dynamic</em> and make the dots change randomly ";
    this.explanation += "all the time?";
}