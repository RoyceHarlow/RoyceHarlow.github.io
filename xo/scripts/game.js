var B = 0, X = 1, O = 2;

var field = new Array();

var acceptMoves = true;

var size, minSize = 5, maxSize = 50, defaultSize = 10;
var ai, minAi = 0, maxAi = 10, defaultAi = 4;

// Change active player highlight.
var togglePlayer = function() {
	for(var i = 1; i <= 2; i++) {
		if($("#player" + i).hasClass("active")) $("#player" + i).removeClass("active");
		else $("#player" + i).addClass("active");
	}
}

// Get current player's sign.
var currentSign = function() {
	if($("#player1").hasClass("active")) return X;
	else return O;
}

// Get JQuery cell object.
var cellAt = function(x, y) {
	return $(".cell[x=" + x + "][y=" + y + "]");
}

// Get cell value.
var at = function(x, y) {
	return field[x][y];
}

var checkForWin = function() {
	var draw = true;

	// Iterate through the field and count complete lines' lengths.
	for(x = 0; x < size; x++) for(y = 0; y < size; y++) {
		var s = at(x, y);

		// Not draw if at least one cell is empty.
		if(s == B) {
			draw = false;
			continue;
		}

		var win = false;

		// Horizontal line.
		if(!win && x <= size - 5) {
			win = true;

			for(i = 0; i < 5; i++)
				if(at(x + i, y) != s) {
					win = false;
					break;
				}
		}

		// Vertical line.
		if(!win && y <= size - 5) {
			win = true;

			for(i = 0; i < 5; i++)
				if(at(x, y + i) != s) {
					win = false;
					break;
				}
		}

		// Diagonal line facing down.
		if(!win && x <= size - 5 && y <= size - 5) {
			win = true;

			for(i = 0; i < 5; i++)
				if(at(x + i, y + i) != s) {
					win = false;
					break;
				}
		}

		// Diagonal line facing up.
		if(!win && x <= size - 5 && y >= 4) {
			win = true;

			for(i = 0; i < 5; i++)
				if(at(x + i, y - i) != s) {
					win = false;
					break;
				}
		}

		if(win) {
			var winner = "Player " + ($("#player1").hasClass("active") ? 1 : 2);
			alert(winner + " wins!");

			// Prevent further moves.
			acceptMoves = false;
			return;
		}
	}

	if(draw) {
		alert("Draw!");

		// Prevent further moves.
		acceptMoves = false;
		return;
	}

	acceptMoves = true;
}

var makeMove = function(x, y) {
	var cell = cellAt(x, y);
	var sign = currentSign();

	cell.attr("src", "res/" + (sign == X ? "x" : "o") + ".png");
	field[x][y] = sign;

	checkForWin();
}

// Some magic constants.
var phi = function(l, s, k) {
	if(l >= 4) return 100;
	if(s < 4) return 1;

	switch(l) {
		case 3: return 10.0 * (k + 1.0);
		case 2: return 6;
		case 1: return 3;
		default: return 0;
	}
}

var efficiency = function(x, y) {
	var v = currentSign(); // AI's sign.
	var w = v == X ? O : X; // Player's sign.

	// Skip impossible moves.
    if(at(x, y) != B) return 0;

    var m = 0, n = 0, l, s, k, cx, cy;

    // Some magic here.
	l = 0; cx = x; cy = y; while(++cx < size && at(cx, cy) == v) ++l;
	cx = x; cy = y; while(--cx >= 0 && at(cx, cy) == v) ++l;
	s = 0; cx = x; cy = y; while(++cx < size && at(cx, cy) != w) ++s;
	cx = x; cy = y; while(--cx >= 0 && at(cx, cy) != w) ++s;
	k = 0; cx = x; cy = y; while(++cx < size && at(cx, cy) == v); if(cx < size && at(cx, cy) == B) ++k;
	cx = x; cy = y; while(--cx >= 0 && at(cx, cy) == v); if(cx >= 0 && at(cx, cy) == B) ++k;
	m += phi(l, s, k);

	l = 0; cx = x; cy = y; while(++cy < size && at(cx, cy) == v) ++l;
	cx = x; cy = y; while(--cy >= 0 && at(cx, cy) == v) ++l;
	s = 0; cx = x; cy = y; while(++cy < size && at(cx, cy) != w) ++s;
	cx = x; cy = y; while(--cy >= 0 && at(cx, cy) != w) ++s;
	k = 0; cx = x; cy = y; while(++cy < size && at(cx, cy) == v); if(cy < size && at(cx, cy) == B) ++k;
	cx = x; cy = y; while(--cy >= 0 && at(cx, cy) == v); if(cy >= 0 && at(cx, cy) == B) ++k;
	m += phi(l, s, k);

	l = 0; cx = x; cy = y; while(++cx < size && ++cy < size && at(cx, cy) == v) ++l;
	cx = x; cy = y; while(--cx >= 0 && --cy >= 0 && at(cx, cy) == v) ++l;
	s = 0; cx = x; cy = y; while(++cx < size && ++cy < size && at(cx, cy) != w) ++s;
	cx = x; cy = y; while(--cx >= 0 && --cy >= 0 && at(cx, cy) != w) ++s;
	k = 0; cx = x; cy = y; while(++cx < size && ++cy < size && at(cx, cy) == v); if(cx < size && cy < size && at(cx, cy) == B) ++k;
	cx = x; cy = y; while(--cx >= 0 && --cy >= 0 && at(cx, cy) == v); if(cx >= 0 && cy >= 0 && at(cx, cy) == B) ++k;
	m += phi(l, s, k);

	l = 0; cx = x; cy = y; while(++cx < size && --cy >= 0 && at(cx, cy) == v) ++l;
	cx = x; cy = y; while(--cx >= 0 && ++cy < size && at(cx, cy) == v) ++l;
	s = 0; cx = x; cy = y; while(++cx < size && --cy >= 0 && at(cx, cy) != w) ++s;
	cx = x; cy = y; while(--cx >= 0 && ++cy < size && at(cx, cy) != w) ++s;
	k = 0; cx = x; cy = y; while(++cx < size && --cy >= 0 && at(cx, cy) == v); if(cx < size && cy >= 0 && at(cx, cy) == B) ++k;
	cx = x; cy = y; while(--cx >= 0 && ++cy < size && at(cx, cy) == v); if(cx >= 0 && cy < size && at(cx, cy) == B) ++k;
	m += phi(l, s, k);

	l = 0; cx = x; cy = y; while(++cx < size && at(cx, cy) == w) ++l;
	cx = x; cy = y; while(--cx >= 0 && at(cx, cy) == w) ++l;
	s = 0; cx = x; cy = y; while(++cx < size && at(cx, cy) != v) ++s;
	cx = x; cy = y; while(--cx >= 0 && at(cx, cy) != v) ++s;
	k = 0; cx = x; cy = y; while(++cx < size && at(cx, cy) == w); if(cx < size && at(cx, cy) == B) ++k;
	cx = x; cy = y; while(--cx >= 0 && at(cx, cy) == w); if(cx >= 0 && at(cx, cy) == B) ++k;
	n += phi(l, s, k);

	l = 0; cx = x; cy = y; while(++cy < size && at(cx, cy) == w) ++l;
	cx = x; cy = y; while(--cy >= 0 && at(cx, cy) == w) ++l;
	s = 0; cx = x; cy = y; while(++cy < size && at(cx, cy) != v) ++s;
	cx = x; cy = y; while(--cy >= 0 && at(cx, cy) != v) ++s;
	k = 0; cx = x; cy = y; while(++cy < size && at(cx, cy) == w); if(cy < size && at(cx, cy) == B) ++k;
	cx = x; cy = y; while(--cy >= 0 && at(cx, cy) == w); if(cy >= 0 && at(cx, cy) == B) ++k;
	n += phi(l, s, k);

	l = 0; cx = x; cy = y; while(++cx < size && ++cy < size && at(cx, cy) == w) ++l;
	cx = x; cy = y; while(--cx >= 0 && --cy >= 0 && at(cx, cy) == w) ++l;
	s = 0; cx = x; cy = y; while(++cx < size && ++cy < size && at(cx, cy) != v) ++s;
	cx = x; cy = y; while(--cx >= 0 && --cy >= 0 && at(cx, cy) != v) ++s;
	k = 0; cx = x; cy = y; while(++cx < size && ++cy < size && at(cx, cy) == w); if(cx < size && cy < size && at(cx, cy) == B) ++k;
	cx = x; cy = y; while(--cx >= 0 && --cy >= 0 && at(cx, cy) == w); if(cx >= 0 && cy >= 0 && at(cx, cy) == B) ++k;
	n += phi(l, s, k);

	l = 0; cx = x; cy = y; while(++cx < size && --cy >= 0 && at(cx, cy) == w) ++l;
	cx = x; cy = y; while(--cx >= 0 && ++cy < size && at(cx, cy) == w) ++l;
	s = 0; cx = x; cy = y; while(++cx < size && --cy >= 0 && at(cx, cy) != v) ++s;
	cx = x; cy = y; while(--cx >= 0 && ++cy < size && at(cx, cy) != v) ++s;
	k = 0; cx = x; cy = y; while(++cx < size && --cy >= 0 && at(cx, cy) == w); if(cx < size && cy >= 0 && at(cx, cy) == B) ++k;
	cx = x; cy = y; while(--cx >= 0 && ++cy < size && at(cx, cy) == w); if(cx >= 0 && cy < size && at(cx, cy) == B) ++k;
	n += phi(l, s, k);

	return m + ai/4.0 * n;
}

// Random number within a range.
var rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function aiMove() {
	var e, maxE = 0;
	var moves;
	var p;

	for(x = 0; x < size; x++) for(y = 0; y < size; y++) {
		// Skip impossible moves.
		if(at(x, y) != B) continue;

		// Calculate efficience of the particular move.
		e = efficiency(x, y);

		if(e > 0) {
			// Reset an array of moves if found a more efficient one.
			if(e > maxE) {
				maxE = e;
				moves = new Array();
				p = 0;
			}

			// Add new move to an array.
			if(e == maxE)
				moves[p++] = {
					x: x,
					y: y
				};
		}
	}

	// Pick a random move from an array of the most efficient ones.
	var move = moves[rand(0, p - 1)];
	makeMove(move.x, move.y);

	// If not win.
	if(acceptMoves)
		togglePlayer();
}

function getUrlParameter(param) {
	var url = window.location.search.substring(1);
	var urlVars = url.split('&');

	for(var i = 0; i < urlVars.length; i++) {
		var urlParam = urlVars[i].split('=');

		if(urlParam[0] == param)
			return urlParam[1];
	}
}

$(document).ready(function() {
	// Get size url parameter.
	size = getUrlParameter("size");

	// Normalize field size.
	if(size < minSize) size = minSize;
	else if(size > maxSize) size = maxSize;
	else if(!(size >= minSize && size <= maxSize)) size = defaultSize;

	// Get AI url parameter.
	ai = getUrlParameter("ai");

	// Normalize AI aggression.
	if(ai < minAi) ai = minAi;
	else if(ai > maxAi) ai = maxAi;
	else if(!(ai >= minAi && ai <= maxAi)) ai = defaultAi;

	// Allocate field arrays.
	for(x = 0; x < size; x++) {
		field[x] = new Array();

		for(y = 0; y < size; y++)
			field[x][y] = 0;
	}

	// Adjust styles for large fields.
	if(size > 20) {
		$("#header").addClass("game");
		$("#game").addClass("game");
	}

	// Generate field HTML.
	var html = "<table>";

	for(var y = 0; y < size; y++) {
		html += "<tr>";

		for(var x = 0; x < size; x++)
			html += "<td><image class=\"cell\" src=\"res/blank.png\" x=\"" + x + "\" y=\"" + y + "\"/></td>";

		html += "</tr>";
	}

	html += "</table>";

	$("#main").html(html);

	// Install click handler.
	$(".cell").on("mousedown", function(e) {
		// Get cell coordinates.
		var x = $(this).attr("x");
		var y = $(this).attr("y");

		// Game has ended or cell isn't empty.
		if(!acceptMoves || at(x, y) != B) return;

		makeMove(x, y);

		// If not win.
		if(acceptMoves) {
			// Change active player highlight.
			togglePlayer();

			// If AI is activated.
			if(ai != 0) {
				acceptMoves = false;

				// Perform the move after half second delay.
				setTimeout(aiMove, 500);
			}
		}
	});
});
