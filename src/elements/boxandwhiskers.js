'use strict';

function isVertical(bar) {
    return bar._view.width !== undefined;
}

function whiskers(boxplot) {
    const iqr = boxplot.q3 - boxplot.q1;
    const iqr1 = Math.max(boxplot.min, boxplot.q1 - iqr);
    const iqr3 = Math.min(boxplot.max, boxplot.q3 + iqr);
    return {iqr1, iqr3};
}

/**
 * Helper function to get the bounds of the box and whiskers
 * @private
 * @param elem {Chart.Element.BoxAndWhiskers} the bar
 * @return {{left, top, right, bottom}} bounds of the bar
 */
function getBounds(elem) {
    const vm = elem._view;

    const boxplot = vm.boxplot;
    const {iqr1, iqr3} = whiskers(boxplot);

    if (isVertical(elem)) {
        const {x, width} = vm;
        const x0 = x - width / 2;
        return {
            left: x0,
            top: iqr1,
            right: x0 + width,
            bottom: iqr3
        };
    } else {
        const {y, height} = vm;
        const y0 = y - height / 2;
        return {
            left: iqr1,
            top: y0,
            right: iqr3,
            bottom: y0 + height
        };
    }
}

module.exports = function (Chart) {
    Chart.defaults.global.elements.boxandwhiskers = Object.assign({}, Chart.defaults.global.elements.rectangle, {
        borderWidth: 1
    });

    Chart.elements.BoxAndWhiskers = Chart.Element.extend({
        draw() {
            const ctx = this._chart.ctx;
            const vm = this._view;

            ctx.fillStyle = vm.backgroundColor;
            ctx.strokeStyle = vm.borderColor;
            ctx.lineWidth = vm.borderWidth;

            const boxplot = vm.boxplot;
            const {iqr1, iqr3} = whiskers(boxplot);

            if (isVertical(this)) {
                const {x, width} = vm;
                const x0 = x - width / 2;
                ctx.beginPath();
                ctx.fillRect(x0, boxplot.q1, width, boxplot.q3 - boxplot.q1);
                ctx.strokeRect(x0, boxplot.q1, width, boxplot.q3 - boxplot.q1);
                ctx.moveTo(x0, iqr1);
                ctx.lineTo(x0 + width, iqr1);
                ctx.moveTo(x, iqr1);
                ctx.lineTo(x, boxplot.q1);
                ctx.moveTo(x0, iqr3);
                ctx.lineTo(x0 + width, iqr3);
                ctx.moveTo(x, iqr3);
                ctx.lineTo(x, boxplot.q3);
                ctx.moveTo(x0, boxplot.median);
                ctx.lineTo(x0 + width, boxplot.median);
            } else {
                const {y, height} = vm;
                const y0 = y - height / 2;
                ctx.beginPath();
                ctx.fillRect(boxplot.q1, y0, boxplot.q3 - boxplot.q1, height);
                ctx.strokeRect(boxplot.q1, y0, boxplot.q3 - boxplot.q1, height);

                ctx.moveTo(iqr1, y0);
                ctx.lineTo(iqr1, y0 + height);
                ctx.moveTo(iqr1, y);
                ctx.lineTo(boxplot.q1, y);
                ctx.moveTo(iqr3, y0);
                ctx.lineTo(iqr3);
                ctx.moveTo(iqr3, y);
                ctx.lineTo(boxplot.q3, y);
                ctx.moveTo(boxplot.median, y0);
                ctx.lineTo(boxplot.median, y0 + height);
                ctx.stroke();
                ctx.closePath();
            }
        },
        height() {
            const vm = this._view;
            return vm.base - vm.y;
        },
        inRange(mouseX, mouseY) {
            if (!this._view) {
                return false;
            }
            const bounds = getBounds(this);
            return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
        },
        inLabelRange(mouseX, mouseY) {
            if (!this._view) {
                return false;
            }
            const bounds = getBounds(this);
            if (isVertical(me)) {
                return mouseX >= bounds.left && mouseX <= bounds.right;
            } else {
                return mouseY >= bounds.top && mouseY <= bounds.bottom;
            }
        },
        inXRange(mouseX) {
            const bounds = getBounds(this);
            return mouseX >= bounds.left && mouseX <= bounds.right;
        },
        inYRange(mouseY) {
            const bounds = getBounds(this);
            return mouseY >= bounds.top && mouseY <= bounds.bottom;
        },
        getCenterPoint() {
            const vm = this._view;
            const {x, y, boxplot} = vm;

            if (isVertical(this)) {
                return {x, y: boxplot.median};
            } else {
                return {x: boxplot.median, y};
            }
        },
        getArea() {
            const vm = this._view;
            const iqr = vm.boxplot.q3 - vm.boxplot.q1;
            if (isVertical(this)) {
                return iqr * vm.width;
            } else {
                return iqr * vm.height;
            }
        }
    });

};

