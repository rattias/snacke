import { GRASS_ID, WALL_ID, EMPTY_ID } from './constants.js'

import { randomize } from './util.js'
const DATA = [
  { eggs: { brown: 4, white: 2, blue: 1, gold: 1, black: 1 }, hwalls: 1, vwalls: 1 },
  { eggs: { brown: 6, white: 2, blue: 1, gold: 0, black: 1 }, hwalls: 2, vwalls: 2 },
  { eggs: { brown: 8, white: 2, blue: 1, gold: 1, black: 2 }, hwalls: 3, vwalls: 3, holes: 2 },
  { eggs: { brown: 10, white: 2, blue: 1, gold: 1, black: 2 }, hwalls: 4, vwalls: 4, holes: 2 },
  { eggs: { brown: 6, white: 4, blue: 4, gold: 0, black: 3 }, hwalls: 5, vwalls: 5, holes: 4 },
  { eggs: { brown: 6, white: 4, blue: 4, gold: 0, black: 3 }, hwalls: 5, vwalls: 5, holes: 4 },
  { eggs: { brown: 4, white: 2, blue: 1, gold: 1, black: 3 }, hwalls: 5, vwalls: 5, dyn_eggs: 2, dyn_delay: 2000 },
  { eggs: { brown: 6, white: 2, blue: 1, gold: 1, black: 3 }, hwalls: 5, vwalls: 5, dyn_eggs: 1, dyn_delay: 1000 },
  { eggs: { brown: 8, white: 2, blue: 1, gold: 1, black: 4 }, hwalls: 5, vwalls: 5, dyn_eggs: 1, dyn_delay: 1000 }
]

export default class Level {
  /**
     * Create maze structure.
     * @param {number idx} level index
     */
  static _makeMaze (idx, lo) {
    const lv = DATA[idx]
    lv.tile_map = new Array(lo.mazeRows)
    lv.background = new Array(lo.mazeRows)
    // create 2D arrays for background and foreground
    for (let i = 0; i < lo.mazeRows; i++) {
      lv.tile_map[i] = new Array(lo.mazeCols).fill(EMPTY_ID)
      lv.background[i] = new Array(lo.mazeCols).fill(EMPTY_ID)
    }
    // paint background with grass
    for (let i = 1; i < lo.mazeRows - 1; i++) {
      lv.background[i] = new Array(lo.mazeCols).fill(GRASS_ID)
    }
    // initially fill maze with walls
    for (let i = 0; i < lo.mazeRows; i++) {
      lv.tile_map[i] = new Array(lo.mazeCols).fill(WALL_ID)
    }
    // draw horizonal isles
    for (let i = 1; i < lo.mazeRows - 1; i += lo.bushRows + 1) {
      for (let j = 1; j < lo.mazeCols - 1; j++) {
        lv.tile_map[i][j] = EMPTY_ID
      }
    }
    // draw vertical isles
    for (let j = 1; j < lo.mazeCols - 1; j += lo.bushCols + 1) {
      for (let i = 1; i < lo.mazeRows - 1; i++) {
        lv.tile_map[i][j] = EMPTY_ID
      }
    }
    // creates an array of sz entries, where each entry is
    // an object with a index (between 0 and sz-1) and
    // a value (between 0 and range-1). the elements are
    // randomized
    const randPos = function (sz, range) {
      const arr = new Array(sz)
      for (let i = 0; i < sz; i++) {
        arr[i] = { index: i, value: Math.floor(Math.random() * range) }
      }
      return randomize(arr)
    }
    const numBushCols = lo.vIsles - 1
    const numBushRows = lo.hIsles - 1
    let pos = randPos(numBushCols, lo.hIsles - 2)
    for (let i = 0; i < Math.min(pos.length, lv.hwalls); i++) {
      const r = 1 + (pos[i].value + 1) * (lo.bushRows + 1)
      const c = 2 + pos[i].index * (lo.bushCols + 1)
      for (let j = 0; j < lo.bushCols; j++) {
        lv.tile_map[r][c + j] = WALL_ID
      }
    }
    pos = randPos(numBushRows, lo.vIsles - 2)
    for (let i = 0; i < Math.min(pos.length, lv.vwalls); i++) {
      const r = 2 + (pos[i].index * (lo.bushRows + 1))
      const c = 1 + (pos[i].value + 1) * (lo.bushCols + 1)
      for (let j = 0; j < lo.bushRows; j++) {
        lv.tile_map[r + j][c] = WALL_ID
      }
    }
  }

  /**
     * @returns {Array<Array<number>> tile data}
     */
  static getLevel (idx, lo) {
    if (DATA[idx].tile_map === undefined) {
      Level._makeMaze(idx, lo)
    }
    return DATA[idx]
  }

  static isLast (idx) {
    return idx === DATA.length - 1
  }

  static mustEatEggCount (level) {
    return level.eggs.brown + level.eggs.white + level.eggs.blue + level.eggs.gold
  }
}
