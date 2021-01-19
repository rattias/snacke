import Phaser from './lib/phaser.js'
import {GRASS_ID, WALL_ID, EMPTY_ID} from './constants.js'
import { TILEMAP_ROWS, TILEMAP_COLS, BUSH_ROWS, BUSH_COLS, NUM_V_ISLES, NUM_H_ISLES} from './constants.js'
import { randomize } from './util.js'
const DATA = [
    {eggs: {brown: 4,  white: 2, blue: 1, gold: 1, black: 1}, hwalls: 1, vwalls: 1},
    {eggs: {brown: 6,  white: 2, blue: 1, gold: 0, black: 0}, hwalls: 2, vwalls: 2},
    {eggs: {brown: 8,  white: 2, blue: 1, gold: 1, black: 0}, hwalls: 3, vwalls: 3},
    {eggs: {brown: 10, white: 2, blue: 1, gold: 1, black: 0}, hwalls: 4, vwalls: 4},
    {eggs: {brown: 6,  white: 4, blue: 4, gold: 0, black: 1}, hwalls: 5, vwalls: 5},
    {eggs: {brown: 6,  white: 4, blue: 4, gold: 0, black: 1}, hwalls: 5, vwalls: 5},
    {eggs: {brown: 4,  white: 2, blue: 1, gold: 1, black: 0}, hwalls: 5, vwalls: 5, dyn_eggs: 2, dyn_delay: 2000},
    {eggs: {brown: 6,  white: 2, blue: 1, gold: 1, black: 0}, hwalls: 5, vwalls: 5, dyn_eggs: 1, dyn_delay: 2000},
    {eggs: {brown: 8,  white: 2, blue: 1, gold: 1, black: 0}, hwalls: 5, vwalls: 5, dyn_eggs: 1, dyn_delay: 3000},
]

export default class Level {

    /** 
     * Create maze structure.
     * @param {number idx} level index
     */
    static _makeMaze(idx)  {
        var lv = DATA[idx]
        lv.tile_map = new Array(TILEMAP_ROWS)
        lv.background = new Array(TILEMAP_ROWS)
        // create 2D arrays for background and foreground
        for(let i=0; i<TILEMAP_ROWS; i++) {
            lv.tile_map[i] = new Array(TILEMAP_COLS).fill(EMPTY_ID)
            lv.background[i] = new Array(TILEMAP_COLS).fill(EMPTY_ID)
        }
        // paint background with grass
        for(let i=1; i < TILEMAP_ROWS - 1; i++) 
            lv.background[i] = new Array(TILEMAP_COLS).fill(GRASS_ID)
        // initially fill maze with walls
        for(let i=0; i < lv.tile_map.length; i++) {
            lv.tile_map[i] = new Array(TILEMAP_COLS).fill(WALL_ID)
        }
        // draw horizonal isles
        for(let i = 1; i < TILEMAP_ROWS - 1; i+= BUSH_ROWS + 1) {
            for(let j = 1; j < TILEMAP_COLS - 1; j++) {
                lv.tile_map[i][j] = EMPTY_ID
            }
        }
        // draw vertical isles
        for(let j = 1; j < TILEMAP_COLS - 1; j+= BUSH_COLS + 1) {
            for(let i = 1; i < TILEMAP_ROWS - 1; i++) {
                lv.tile_map[i][j] = EMPTY_ID
            }
        }
        // creates an array of sz entries, where each entry is 
        // an object with a index (between 0 and sz-1) and 
        // a value (between 0 and range-1). the elements are
        // randomized
        var randPos = function(sz, range) {
            var arr = new Array(sz)        
            for(let i=0; i < sz; i++) {
                arr[i] = {index: i, value: Math.floor(Math.random() * range)}
            }            
            return randomize(arr)
        }
        var numBushCols = NUM_V_ISLES - 1
        var numBushRows = NUM_H_ISLES - 1
        var pos = randPos(numBushCols, NUM_H_ISLES - 2)
        for(let i=0; i < Math.min(pos.length, lv.hwalls); i++) {
            var r =  1 +(pos[i].value + 1) * (BUSH_ROWS + 1)
            var c = 2 + pos[i].index * (BUSH_COLS + 1)
            for(let j=0; j<BUSH_COLS; j++)
                lv.tile_map[r][c+j] = WALL_ID
        }        
        pos = randPos(numBushRows, NUM_V_ISLES - 2)
        for(let i=0; i < Math.min(pos.length, lv.vwalls); i++) {
            var r = 2 + (pos[i].index * (BUSH_ROWS + 1))
            var c = 1 + (pos[i].value + 1) * (BUSH_COLS + 1)
            for(let j=0; j<BUSH_ROWS; j++)
                lv.tile_map[r+j][c] = WALL_ID
        }        
    }

  
    /**
     * @returns {Array<Array<number>> tile data}
     */
    static getLevel(idx) {
        if(DATA[idx].tile_map == undefined) {
            Level._makeMaze(idx)
        }
        return DATA[idx]
    }

    static isLast(idx) {
        return idx == DATA.length - 1
    }
}    
