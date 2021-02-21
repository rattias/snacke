export const VER = '0.9.2'
export const TILE_WIDTH = 32
export const TILE_HEIGHT = 32
export const HEADER_ROWS = 2

export const DEFAULT_WIDTH = 1000
export const DEFAULT_HEIGHT = 2000

export const SNAKE_START_LEN = 5

export const GRASS_ID = 0
export const WALL_ID = 1
export const EGG_START = 2
export const EGG_BROWN_ID = EGG_START
export const EGG_WHITE_ID = EGG_START + 1
export const EGG_BLUE_ID = EGG_START + 2
export const EGG_GOLD_ID = EGG_START + 3
export const EGG_BLACK_ID = EGG_START + 4

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

export const LIFE_ID = SNAKE_LAST + 1

export const HOLE_BACKGROUND = LIFE_ID + 1
export const HOLE_FOREGROUND_START = HOLE_BACKGROUND + 1

export const EMPTY_ID = HOLE_FOREGROUND_START + 5

export const EGG_BROWN_VALUE = 100
export const EGG_WHITE_VALUE = 200
export const EGG_BLUE_VALUE = 400
export const EGG_GOLD_VALUE = 1000
export const EGG_BROWN_LEN_INC = 4
export const EGG_WHITE_LEN_INC = 6
export const EGG_BLUE_LEN_INC = 8
export const EGG_GOLD_LEN_INC = 0
