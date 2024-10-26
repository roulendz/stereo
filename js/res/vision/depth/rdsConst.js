// constants for Random Dot Stereograms
TYPE = 0; // Type of Anaglyph
MOVE = 1; // start or stop the motion of the smaller square
SPEED = 2; // Parameter for Speed
SIZE = 3; // dot size
RESET_POS = 4; // Move square to middle of screen.
SQUARE_DISP = 5; // disparity of square
BACK_DISP = 6; // disparity of background
DYNAMIC = 7;

// flags for static or dynamic RDS
STATIC = 0; // keep same dots
DYNAMIC_RDS = 1; // update dots as often as can

DYNAMIC_VALS = [STATIC, DYNAMIC_RDS];
DYNAMIC_NAMES = ["Static", "Dynamic"];