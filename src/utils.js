'use strict';

export function computeLaneWidth(width, padding) {
    if (padding == null || padding === 0) {
        return width;
    }
    let laneWidth;
    if (padding > 1) { // compute as pixel
        laneWidth = width - Math.abs(padding);
    } else { // compute as percent
        laneWidth = width - width * Math.abs(padding);
    }
    return laneWidth < 0 ? 0 : laneWidth;
}