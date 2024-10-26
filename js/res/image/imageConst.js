// constants for image handling
// color constants for image data arrays.
var RED = 0;
var GREEN = 1;
var BLUE = 2;
var ALPHA = 3;

var IMG_W = 0;
var IMG_H = 1;

// color deficiency constants
var NORMAL = -1;
var PROTANOPE =  0;
var DEUTERANOPE = 1;
var TRITANOPE = 2;

var COL_DEF_NAMES = ["Protanope","Deuteranope","Tritanope"];

// some general image manipulation values
// scotopic relative sensitivity
/*    The relative values are estimated using the data in
        Cornsweet (1970) p. 147 and scaled so that a full white
        in photopic will be a full white in scotopic
        We do adapt you know.
  */
var SCOTOPIC_BAL = [0.50, 1.20, 1.30]; // relative balances for outputs to convert a color to SCOTOPIC red, then green the blue balance0
var SCOTOPIC_BAL_EXAG = [0.15, 1.0, 1.50]; // relative balances for outputs to convert a color to SCOTOPIC red, then green the blue balance0
var ORIG_BAL = [1, 1, 1]; // restore image to original balance

// image type values for drawing simple stereo images
var CIRCLE = 0;
var SQUARE = 1;
var RECTANGLE = 2;
var OVAL = 3

// indexes for stereo objects
var	LEFT = 0; // left eye
var RIGHT = 1; // right eye

// Anaglyph types
var RED_CYAN = 0;
var RED_BLUE = 1;
var RED_GREEN = 2;
var RC_COLOR = 3;
var ANAGLYPH_NAMES = ["Red-Cyan","Red-Blue","Red-Green","Red-Cyan Color"];
var ANAGLYPH_NAMES_SHORT = ["Red-Cyan","Red-Blue","Red-Green"];


// image editing type parameters to pass
// parameter constants
var BRIGHTNESS = 0; // The size of the font for the sentence
var NEW_FILE = 1; //  a new file has been sent along.
var GRAY_SCALE_KEEP = 2; // convert image to gray scale but keep array of original image.
var ADJUST_COLOR_BAL = 3; // change the relative intensities of red green and blue primaries.
var SIDE_BY_SIDE = 4; // show the edited picture side by side the original image.
var CONTRAST = 5; // adjust the contrast in the image.
var CONTRAST_MAX = 6; // Adjust the contrast of the image, but keep the maximum intensity
var BLOCK = 7; // average in block areas
var SCALE_WIDTH = 8; // adjust width of image
var SCALE_HEIGHT = 9; // adjust height of image
var NEW_IMAGE = 10; // pass a new image along
var DEFICIENCY = 11; // pass along a color deficiency
var LABEL = 12; // pass a long labels for the image (2, one for the original)
var NEW_FILE_NAME = 13; // pass along a new file name
var BLUR = 14; // blur the images, currently a linearly weighted average over a radius.
var USE_CUR_IMAGE = 15; // update the current image not the original image
var BLUR_GRAY = 16; // MAKE THE IMAGE GRAYSCALE AND THEN BLUR
var ROD_MONOCHROMAT = 17; // stack together operations to simulate rod monocromacy
var V_POS = 18;  // adjust the top point of the image proportionally to the height of the page.
var BACKGROUND = 19; // the background color if image does not fill the screen
var ADD_OBJECTS = 20; // add object on top of drawing
var FIT_TO_HEIGHT  = 21;  // make the image fit the height and let the width do as it may.
var X_POS = 22; // adjust the horizontal offset as a proportion of the canvas
var INVERT_COLORS = 23; // invert the colors of the original image.  Store in separate file.
var GAUSS_BLUR = 24; // blur the image.
// gauss blur indexes
var DO_GAUSS = 0;
var GAUSS_RADIUS = 1;
var REVEAL = 25; // reveal a part of the original image
var DO_REVEAL = 0;
var REV_DIAM = 1;

// tracking code and parameterers
var DO_TRACK = 26; // start the tracking of the mouse movements over the image for a period of time
var TRACK_FLAG = 0; // boolean flag to start the tracking
var TRACK_DUR = 1; // how long to do the tracking in seconds
var TRACK_RATE = 2; // msec between tracking samples.
var SHOW_TRACK_AFTER = 3; // flag for image to show the tracking on the image after the tracking period is done
var SHOW_TRACK_METHOD = 4; // code for how the tracking should be processed before displayed.
var SIMPLE = 0; //default, just put a point at each sample point
var FIXATION_1 = 1; // define fixations by not moving more than defined region do the tracking by the data, but only show dots
						// when in this defined area
var TRACK_PARAM = 5;  // any parameters that need to be passed for the tracking method
var ADJUST_TRACK_PARAM = 27; // if tracking is displayed allow user to adjust parameters

// linear blur code and parameters
var LINEAR_BLUR = 28; // do a gaussian blur along one axis, allow the angle to be determined dynamically
var BLUR_STD_DEV = 0; // the standard deviation of the gausian blur (will go out 3 standard deviations)
var BLUR_DEG = 1; // the angle, in degrees of the blur

// the constants for the objects to draw
var SHOW_OBJ = 0;
var TYPE_OBJ = 1; // the index of the type of object
var CIRCLE = 0; // the code for a circle
var OBJ_POS =2; // the index for the position of the object, relative to the pertinent dimensions of canvas for z in front or behind image
var OBJ_X = 0; // x index
var OBJ_Y = 1; // y index
var OBJ_Z = 2; // z index
var FRONT = 0; // in front of the image
var BEHIND = 1; // behind image but in front of background
var OBJ_SIZE = 3;  // the index size of the object relative to the width of the canvas
var OBJ_COLOR = 4; // the index color of the object

// data sample constants
var MOUSE_X = 0;
var MOUSE_Y = 1;
var IMG_WIDTH = 2;
var IMG_HEIGHT = 3;
var MOUSE_X_PRO = 4;
var MOUSE_Y_PRO = 5;