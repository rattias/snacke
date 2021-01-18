export const TILE_WIDTH = 32
export const TILE_HEIGHT = 32
export const HEADER_ROWS = 2
export const NUM_V_ISLES = 6
export const NUM_H_ISLES = 8
export const BUSH_ROWS = 3
export const BUSH_COLS = 4
export const TILEMAP_COLS = (BUSH_COLS + 1) * (NUM_V_ISLES - 1) + 3
export const TILEMAP_ROWS = (BUSH_ROWS + 1)* (NUM_H_ISLES - 1) + 3
export const TILEMAP_X = 0
export const TILEMAP_Y = HEADER_ROWS * TILE_HEIGHT
export const TILEMAP_WIDTH = TILEMAP_COLS * TILE_WIDTH
export const TILEMAP_HEIGHT = TILEMAP_ROWS * TILE_HEIGHT

export const ENERGY_BAR_X = TILEMAP_WIDTH
export const ENERGY_BAR_Y = 2 * TILE_HEIGHT
export const ENERGY_BAR_WIDTH = TILE_WIDTH - 1
export const ENERGY_BAR_HEIGHT = (TILEMAP_ROWS - 2) * TILE_HEIGHT

export const SNAKE_START_LEN = 5

export const GRASS_TILE = 0
export const WALL_TILE = 1
export const EGG_START = 2
export const EGG_BROWN_TILE = EGG_START
export const EGG_WHITE_TILE = EGG_START + 1
export const EGG_BLUE_TILE = EGG_START + 2
export const EGG_GOLD_TILE = EGG_START + 3
export const EGG_BLACK_TILE = EGG_START + 4

export const SNAKE_FIRST = 7
export const SNAKE_HEAD_R = SNAKE_FIRST
export const SNAKE_HEAD_U = SNAKE_FIRST + 1
export const SNAKE_HEAD_L = SNAKE_FIRST + 2
export const SNAKE_HEAD_D = SNAKE_FIRST + 3
export const SNAKE_BODY_R = SNAKE_FIRST + 4
export const SNAKE_BODY_U = SNAKE_FIRST + 5
export const SNAKE_BODY_L = SNAKE_FIRST + 6
export const SNAKE_BODY_D = SNAKE_FIRST + 7
export const SNAKE_TAIL_R = SNAKE_FIRST + 8
export const SNAKE_TAIL_U = SNAKE_FIRST + 9
export const SNAKE_TAIL_L = SNAKE_FIRST + 10
export const SNAKE_TAIL_D = SNAKE_FIRST + 11
export const SNAKE_CORNER_BL = SNAKE_FIRST + 12
export const SNAKE_CORNER_BR = SNAKE_FIRST + 13
export const SNAKE_CORNER_UR = SNAKE_FIRST + 14
export const SNAKE_CORNER_UL = SNAKE_FIRST + 15
export const SNAKE_LAST = SNAKE_CORNER_UL 

export const LIFE_TILE = SNAKE_LAST + 1
export const EMPTY_TILE = SNAKE_LAST + 2

export const EGG_BROWN_VALUE = 100
export const EGG_WHITE_VALUE = 200
export const EGG_BLUE_VALUE = 400
export const EGG_GOLD_VALUE = 1000
export const EGG_BROWN_LEN_INC = 4
export const EGG_WHITE_LEN_INC = 6
export const EGG_BLUE_LEN_INC = 8
export const EGG_GOLD_LEN_INC = 0

export const SCREEN_WIDTH = (TILEMAP_COLS + 1) * TILE_HEIGHT

export const JOYSTICK_Y_OFFSET = 10
export const JOYSTICK_SIDE = SCREEN_WIDTH/2
export const JOYSTICK_Y = Math.floor(TILEMAP_Y + TILEMAP_HEIGHT + JOYSTICK_Y_OFFSET)

export const JOYSTICK_X = (SCREEN_WIDTH - JOYSTICK_SIDE) / 2
export const SCREEN_HEIGHT = HEADER_ROWS * TILE_HEIGHT + TILEMAP_HEIGHT + JOYSTICK_Y_OFFSET + JOYSTICK_SIDE

