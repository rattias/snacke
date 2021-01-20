import {
  TILE_HEIGHT, TILE_WIDTH,
  EMPTY_ID, WALL_ID, EGG_BROWN_ID, EGG_WHITE_ID, EGG_BLUE_ID, EGG_GOLD_ID, EGG_BLACK_ID,
  SNAKE_START_LEN,
  SNAKE_HEAD_R, SNAKE_HEAD_L, SNAKE_HEAD_U, SNAKE_HEAD_D, SNAKE_BODY_R, SNAKE_BODY_L, SNAKE_BODY_U, SNAKE_BODY_D, SNAKE_TAIL_R, SNAKE_TAIL_L, SNAKE_TAIL_U, SNAKE_TAIL_D, SNAKE_CORNER_UL, SNAKE_CORNER_UR, SNAKE_CORNER_BL, SNAKE_CORNER_BR,
  EGG_BROWN_VALUE, EGG_WHITE_VALUE, EGG_BLUE_VALUE, EGG_GOLD_VALUE, EGG_BROWN_LEN_INC, EGG_WHITE_LEN_INC, EGG_BLUE_LEN_INC
} from './constants.js'

const tailMap = new Map([
  [SNAKE_TAIL_U + '_' + SNAKE_BODY_U, SNAKE_TAIL_U],
  [SNAKE_TAIL_U + '_' + SNAKE_CORNER_UL, SNAKE_TAIL_R],
  [SNAKE_TAIL_R + '_' + SNAKE_CORNER_BR, SNAKE_TAIL_U],
  [SNAKE_TAIL_R + '_' + SNAKE_BODY_R, SNAKE_TAIL_R],
  [SNAKE_TAIL_R + '_' + SNAKE_CORNER_UR, SNAKE_TAIL_D],
  [SNAKE_TAIL_D + '_' + SNAKE_CORNER_BL, SNAKE_TAIL_R],
  [SNAKE_TAIL_D + '_' + SNAKE_BODY_D, SNAKE_TAIL_D],
  [SNAKE_TAIL_D + '_' + SNAKE_CORNER_BR, SNAKE_TAIL_L],
  [SNAKE_TAIL_L + '_' + SNAKE_CORNER_UL, SNAKE_TAIL_D],
  [SNAKE_TAIL_L + '_' + SNAKE_BODY_L, SNAKE_TAIL_L],
  [SNAKE_TAIL_L + '_' + SNAKE_CORNER_BL, SNAKE_TAIL_U],
  [SNAKE_TAIL_U + '_' + SNAKE_CORNER_UR, SNAKE_TAIL_L]
])

const headMap = new Map([
  ['0_1_' + SNAKE_HEAD_U, [SNAKE_HEAD_R, SNAKE_CORNER_UL]],
  ['0_1_' + SNAKE_HEAD_D, [SNAKE_HEAD_R, SNAKE_CORNER_BL]],
  ['0_1_' + SNAKE_HEAD_R, [SNAKE_HEAD_R, SNAKE_BODY_R]],
  ['1_0_' + SNAKE_HEAD_R, [SNAKE_HEAD_D, SNAKE_CORNER_UR]],
  ['1_0_' + SNAKE_HEAD_L, [SNAKE_HEAD_D, SNAKE_CORNER_UL]],
  ['1_0_' + SNAKE_HEAD_D, [SNAKE_HEAD_D, SNAKE_BODY_D]],
  ['0_-1_' + SNAKE_HEAD_U, [SNAKE_HEAD_L, SNAKE_CORNER_UR]],
  ['0_-1_' + SNAKE_HEAD_D, [SNAKE_HEAD_L, SNAKE_CORNER_BR]],
  ['0_-1_' + SNAKE_HEAD_L, [SNAKE_HEAD_L, SNAKE_BODY_L]],
  ['-1_0_' + SNAKE_HEAD_R, [SNAKE_HEAD_U, SNAKE_CORNER_BR]],
  ['-1_0_' + SNAKE_HEAD_L, [SNAKE_HEAD_U, SNAKE_CORNER_BL]],
  ['-1_0_' + SNAKE_HEAD_U, [SNAKE_HEAD_U, SNAKE_BODY_U]]
])

export default class Snake {
  /**
   * @param {Game} game
   */
  constructor (game) {
    this.game = game
    this.body = []
    for (let i = 0; i < SNAKE_START_LEN; i++) {
      this.body.push([1, 1 + i])
    }
    this.head = SNAKE_START_LEN - 1
    this.tail = 0
    this.dir = [0, 1]
    for (let i = 1; i < this.body.length - 1; i++) {
      this.game.putTileAt(SNAKE_BODY_R, this.body[i][1], this.body[i][0])
    }
    this.game.putTileAt(SNAKE_TAIL_R, this.body[0][1], this.body[0][0])
    this.game.putTileAt(SNAKE_HEAD_R, this.body[this.body.length - 1][1], this.body[this.body.length - 1][0])
    this.nextDir = [0, 1]
  }

  setDir (d) {
    if (d[0] === -this.dir[0] && d[1] === -this.dir[1]) {
      console.log("can't go back")
      return
    }
    this.nextDir = d
  }

  getDir () {
    return this.dir
  }

  /** @param { Array<number> } */
  _rotate (v) {
    return [v[1], -v[0]]
  }

  /** @param { Array<number> } */
  _mirror (v) {
    return [-v[0], -v[1]]
  }

  /**
    * @returns { Boolean } true unless the snake died.
    */
  update () {
    const h = this.body[this.head]
    let tl = this.game.getTileAt(h[1] + this.nextDir[1], h[0] + this.nextDir[0])
    if (tl !== WALL_ID) {
      this.dir = this.nextDir
    } else {
      tl = this.game.getTileAt(h[1] + this.dir[1], h[0] + this.dir[0])
      if (tl === WALL_ID) {
        const dirRight = this._rotate(this.dir)
        const tileRight = this.game.getTileAt(h[1] + dirRight[1], h[0] + dirRight[0])
        const dirLeft = this._mirror(dirRight)
        const tileLeft = this.game.getTileAt(h[1] + dirLeft[1], h[0] + dirLeft[0])
        if (tileLeft !== WALL_ID && tileRight !== WALL_ID) {
          return true
        }
        if (tileLeft !== WALL_ID) {
          this.nextDir = this.dir = dirLeft
          tl = tileLeft
        } else {
          this.nextDir = this.dir = dirRight
          tl = tileRight
        }
      }
    }
    switch (tl) {
      case EMPTY_ID:
        break
      case EGG_BROWN_ID:
        this.body.splice(this.head + 1, 0, ...Array(EGG_BROWN_LEN_INC).fill([-1, -1]))
        this.game.eatEgg(EGG_BROWN_ID, EGG_BROWN_VALUE, EGG_BROWN_VALUE / 1000)
        break
      case EGG_WHITE_ID:
        this.body.splice(this.head + 1, 0, ...Array(EGG_WHITE_LEN_INC).fill([-1, -1]))
        this.game.eatEgg(EGG_WHITE_ID, EGG_WHITE_VALUE, EGG_WHITE_VALUE / 1000)
        break
      case EGG_BLUE_ID:
        this.body.splice(this.head + 1, 0, ...Array(EGG_BLUE_LEN_INC).fill([-1, -1]))
        this.game.eatEgg(EGG_BLUE_ID, EGG_BLUE_VALUE, EGG_BLUE_VALUE / 1000)
        break
      case EGG_GOLD_ID:
        this.game.eatEgg(EGG_GOLD_ID, EGG_GOLD_VALUE, EGG_GOLD_VALUE / 1000)
        break
      case EGG_BLACK_ID:
        this.game.eatEgg(EGG_BLACK_ID, 0, 0)
        break
      case WALL_ID:
        // we've already rotate to avoid wall, so if we end up here
        // we have walls on three sides. can only die.
        return false
      default:
        // hit the snake body!
        return false
    }
    // erase tail, replace last body with tail
    const tl0Coords = this.body[(this.head + 1) % this.body.length]
    const tl1Coords = this.body[(this.head + 2) % this.body.length]
    if (tl0Coords[0] >= 0) {
      const tl0 = this.game.getTileAt(tl0Coords[1], tl0Coords[0])
      const tl1 = this.game.getTileAt(tl1Coords[1], tl1Coords[0])
      tl = tailMap.get(tl0 + '_' + tl1)
      this.game.putTileAt(EMPTY_ID, tl0Coords[1], tl0Coords[0])
      this.game.putTileAt(tl, tl1Coords[1], tl1Coords[0])
    }

    // replace head with body
    const prevHead = this.body[this.head]
    const prevHeadTl = this.game.getTileAt(prevHead[1], prevHead[0])
    this.head++
    if (this.head === this.body.length) {
      this.head = 0
    }
    this.body[this.head] = [h[0] + this.dir[0], h[1] + this.dir[1]]
    const tls = headMap.get(this.dir[0] + '_' + this.dir[1] + '_' + prevHeadTl)
    this.game.putTileAt(tls[1], prevHead[1], prevHead[0])
    this.game.putTileAt(tls[0], this.body[this.head][1], this.body[this.head][0])
    return true
  }

  getXY () {
    const h = this.body[this.head]
    return [h[1] * TILE_WIDTH + TILE_WIDTH / 2, h[0] * TILE_HEIGHT + TILE_HEIGHT / 2]
  }
}
