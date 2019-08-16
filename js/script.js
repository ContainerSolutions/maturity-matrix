// CHECK IF THE MOUSE IS OVER A CLICKABLE DOT (BLACK DOTS ON THE LEFT)
function pointInCircle() {
    for (var i = 0; i < lines.length; i++) {
        var dx = mouse.x - lines[i].x1,
            dy = mouse.y - lines[i].y1,
            dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) {
            canvas.style.cursor = 'pointer';
            selectedRow = i;
            canDrag = true;
            break;
        } else {
            canvas.style.cursor = 'default';
            canDrag = false;
        }
    }
}

// DRAW BASIC LAYOUT (CANVAS + DOTS + DELIMITERS)
var x = 0,
    y = 0;
var marginLeft = 15;
var radius = 10;
var mouse = {
    "x": 0,
    "y": 0
};
var lines = [];
var selectedRow = -1;
var canDrag = false;
var isDragging = false;
var cellWidth = document.getElementsByClassName('col')[0].offsetWidth;
var cellHeight = document.getElementsByClassName('col')[0].offsetHeight;
var max = {
    "x": 0,
    "id": -1
};
var min = {
    "x": 0,
    "id": -1
};
var old = {
    "x": 0,
    "id": 0
};
var col = document.getElementsByClassName('col');
var row = document.getElementsByClassName('row');
var canvas = document.getElementById("canvas");
var table = document.getElementById("table");
table.style.minWidth = table.offsetWidth + 'px';
var current = document.getElementById("current");
var goal = document.getElementById("goal");
var ctx = canvas.getContext("2d");
canvas.width = table.offsetWidth + marginLeft;
canvas.height = table.offsetHeight + marginLeft;
canvas.style.width = table.offsetWidth + marginLeft + 'px';
canvas.style.height = table.offsetHeight + marginLeft + 'px';
current.style.left = cellWidth + marginLeft - current.offsetWidth / 2 + 'px';
current.style.top = cellHeight * 10 + radius + 40 + 'px';
goal.style.left = cellWidth * 4.5 + marginLeft - goal.offsetWidth / 2 + 'px';
goal.style.top = cellHeight * 10 + radius + 40 + 'px';
for (var i = 0; i < row.length; i++) {
    for (var j = 0; j < col.length; j++) {
        x = j * cellWidth + marginLeft;
        if (j > 0) {
            x += cellWidth / 2
        }
        y = i * cellHeight + cellHeight * 2;
        if (j == 0) {
            lines.push({
                "x1": x,
                "y1": y + 30,
                "x2": marginLeft,
                "y2": y + 30
            });
        }
    }
}

// ANIMATION LOOP
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255,255,255,.15)';
    ctx.fillRect(marginLeft + cellWidth, cellHeight, cellWidth * 3.5, cellHeight * 9);
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(marginLeft + cellWidth, cellHeight);
    ctx.lineTo(marginLeft + cellWidth, cellHeight * 10);
    ctx.strokeStyle = "#2940f9";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cellWidth * 4.5 + marginLeft, cellHeight);
    ctx.lineTo(cellWidth * 4.5 + marginLeft, cellHeight * 10);
    ctx.strokeStyle = "#ff17aa";
    ctx.stroke();

    //DRAW FINAL SHAPE (BLUE AREA)

    ctx.fillStyle = 'rgba(0,0,255,.15)';
    ctx.strokeStyle = "rgba(0,0,255,.25";
    ctx.beginPath();
    if (max.x > 0) {
        ctx.moveTo(marginLeft + cellWidth, cellHeight);
        ctx.lineTo(max.x, cellHeight);
        current.style.left = min.x - current.offsetWidth / 2 + 'px';
        if (min.x >= goal.offsetLeft) {
            current.style.top = cellHeight * 10 + radius + 75 + 'px';
        } else {
            current.style.top = cellHeight * 10 + radius + 40 + 'px';
        }
    } else {
        ctx.moveTo(marginLeft + cellWidth, lines[0].y1);
    }

    var lastPoint = 0;
    for (var k = 0; k < lines.length; k++) {
        if (lines[k].x1 != lines[k].x2) {
            ctx.lineTo(lines[k].x2, lines[k].y2 - 30);
            lastPoint = k;
        }
    }
    if (max.x > 0) {
        ctx.lineTo(min.x, cellHeight * 10);
        ctx.lineTo(marginLeft + cellWidth, cellHeight * 10);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([0, 0]);

    for (var i = 0; i < row.length; i++) {
        for (var j = 0; j < col.length; j++) {
            x = j * cellWidth + marginLeft;
            if (j > 0) {
                x += cellWidth / 2;
            }
            y = i * cellHeight + cellHeight * 2;
            if (j > 0) {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 5]);
                ctx.moveTo(old.x, old.y);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.setLineDash([0, 0]);
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.fillStyle = "white";
            ctx.fill();
            if (j !== col.length - 2) {
                if (j == 0) {
                    ctx.lineWidth = 3;
                } else {
                    ctx.lineWidth = 2;
                }
                ctx.strokeStyle = "#000000";
            } else {
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#ff17aa";
            }
            ctx.stroke();
            old = {
                "x": x,
                "y": y
            }
        }
    }
    // DRAW A LINE ON MOUSE DRAG
    if (isDragging) {
        ctx.beginPath();
        ctx.strokeStyle = "#0000FF";
        ctx.moveTo(lines[selectedRow].x1, lines[selectedRow].y1 - 30);
        ctx.lineTo(mouse.x, lines[selectedRow].y1 - 30);
        ctx.stroke();
    }
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// EVENT LISTENERS
canvas.addEventListener("mousemove", function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    pointInCircle();
});
canvas.addEventListener("mousedown", function(event) {
    if (canDrag) {
        isDragging = true;
    }
});

// SAVE MOUSE UP POSITION
canvas.addEventListener("mouseup", function(event) {
    if (isDragging) {
        isDragging = false;
        if (mouse.x > cellWidth + marginLeft) {
            if (mouse.x < cellWidth * 5.5 + marginLeft) {
                lines[selectedRow].x2 = mouse.x;
                if ((max.id==-1 || max.id >= selectedRow) && mouse.x <= cellWidth * 5.5) {
                    max.x = mouse.x;
                    max.id = selectedRow
                }
                if ((max.id==-1 ||min.id <= selectedRow) && mouse.x <= cellWidth * 5.5) {
                    min.x = mouse.x;
                    min.id = selectedRow;
                }

            } else {
                lines[selectedRow].x2 = cellWidth * 5.5 + marginLeft;
                if ((max.id==-1 || max.id >= selectedRow)) {
                    max.x = cellWidth * 5.5 + marginLeft;
                    max.id = selectedRow
                }
                if ((max.id==-1 || min.id <= selectedRow)) {
                    min.x = cellWidth * 5.5 + marginLeft;
                    min.id = selectedRow
                }
            }
        }
    }
});
canvas.addEventListener("mouseup", function(event) {
    if (isDragging) {
        isDragging = false;
        if (mouse.x > cellWidth + marginLeft) {
            if (mouse.x < cellWidth * 5.5 + marginLeft) {
                lines[selectedRow].x2 = mouse.x;
                if ((max.x == -1 || max.id <= selectedRow) && mouse.x<=cellWidth * 4.5) {
                    max.x = mouse.x;
                    max.id = selectedRow
                }
                if ((min.x == -1 || min.id >= selectedRow)&& mouse.x<=cellWidth * 4.5) {
                    min.x = mouse.x;
                    min.id = selectedRow
                }
				else{
                    min.x = cellWidth * 4.5+ marginLeft;
                    min.id = selectedRow				
				}
            } else {
                lines[selectedRow].x2 = cellWidth * 5.5 + marginLeft;
                if (max.x == -1 || max.id <= selectedRow) {
                    max.x = cellWidth * 4.5 + marginLeft;
                    max.id = selectedRow
                }
                if (min.x == -1 || min.id >= selectedRow) {
                    min.x = cellWidth * 4.5 + marginLeft;
                    min.id = selectedRow
                }
            }
        }
    }
});
window.addEventListener("resize", function() {
    cellWidth = document.getElementsByClassName('col')[0].offsetWidth;
    cellHeight = document.getElementsByClassName('col')[0].offsetHeight;
    canvas.width = table.offsetWidth + marginLeft;
    canvas.height = table.offsetHeight + marginLeft;
    canvas.style.width = table.offsetWidth + marginLeft + 'px';
    canvas.style.height = table.offsetHeight + marginLeft + 'px';
    current.style.left = cellWidth + marginLeft - current.offsetWidth / 2 + 'px';
    current.style.top = cellHeight * 10 + radius + 40 + 'px';
    goal.style.left = cellWidth * 4.5 + marginLeft - goal.offsetWidth / 2 + 'px';
    goal.style.top = cellHeight * 10 + radius + 40 + 'px';
});

// SAVE IMAGE AS PNG
(function(exports) {
    function urlsToAbsolute(nodeList) {
        if (!nodeList.length) {
            return [];
        }
        var attrName = 'href';
        if (nodeList[0].__proto__ === HTMLImageElement.prototype || nodeList[0].__proto__ === HTMLScriptElement.prototype) {
            attrName = 'src';
        }
        nodeList = [].map.call(nodeList, function(el, i) {
            var attr = el.getAttribute(attrName);
            if (!attr) {
                return;
            }
            var absURL = /^(https?|data):/i.test(attr);
            if (absURL) {
                return el;
            } else {
                return el;
            }
        });
        return nodeList;
    }

    function screenshotPage() {
        var wrapper = document.getElementById('wrapper');
        let projectName = document.getElementById('input').value;
        html2canvas(wrapper, {
            onrendered: function(canvas) {
                canvas.toBlob(function(blob) {
                    saveAs(blob, (projectName ? projectName : 'myProject' )+ '.png')
                });
            }
        });
    }

    function addOnPageLoad_() {
        window.addEventListener('DOMContentLoaded', function(e) {
            var scrollX = document.documentElement.dataset.scrollX || 0;
            var scrollY = document.documentElement.dataset.scrollY || 0;
            window.scrollTo(scrollX, scrollY);
        });
    }

    function generate() {
        screenshotPage();
    }
    console.log(exports, "exports");
    exports.screenshotPage = screenshotPage;
    exports.generate = generate;
})(window);