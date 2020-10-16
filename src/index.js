import _ from "lodash";
import "./style.scss";
// import Icon from "./profile.jpg";
import $ from "jquery";
import { Observable, merge, fromEvent, interval } from "rxjs";
import { map, mapTo } from "rxjs/operators";
import { mouseenterAsObservable, mouseleaveAsObservable } from "rx-jquery";

import { arccos, arcsin } from "./asin";
import { getVertices } from "./vertices";
import { TrackerBall } from "./trackerball";
import { RotationMatrix } from "./rotationMatrix";

const CENTER = 200;
const RADIUS = 150;
const SPRITE_WIDTH = 80;
const ONE_DEGREE = 6.28319 / 360;

function stage() {
	return $("<div></div>").addClass("stage");
}

function debug() {
	return $("<div>Hello</div>").addClass("debug");
}

const Hedron = {
	sprites: [],
	$parent: null,
	$debug: null,
	timer: null,
	observable: null,
	currentId: -1,
	mousePoint: { x: 0, y: 0 },
	displayList: [],

	rotMatrix: [1.0, 0.0, 0, 0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0],
	angles: [0.0, 0.0, 0.0],

	mountToParent: function ($parent, $debug) {
		this.$parent = $parent;
		this.$debug = $debug;

		return this;
	},

	trackMouse: function () {
		$(document).on("mousemove", (event) => {
			// console.log(this.mousePoint);
			this.mousePoint = { x: event.pageX, y: event.pageY };
		});
		return this;
	},

	_mergeObservable: function (observable) {
		if (!this.observable) {
			this.observable = observable;
		} else {
			this.observable = merge(this.observable, observable);
		}
	},

	addSprites: function (sprites) {
		const _that = this;
		const vertices = getVertices(sprites.length);
		_.forEach(sprites, ({ id, animationControler, content }, index) => {
			// console.log("index", index, vertices[index]);
			// animationControler.
			const sprite = new Sprite(id, animationControler, content, this.$parent);
			this.sprites.push(sprite);
			this._mergeObservable(sprite.observable);
		});
		// this.sprites = sprites;

		return this;
	},

	observe() {
		const _that = this;
		this.observable.subscribe((cmd) => {
			console.log("hedron:", cmd);
			switch (cmd.action) {
				case "mouseenter":
					_that.currentId = cmd.id;
					break;

				case "mouseleave":
					if (_that.currentId === cmd.id) {
						_that.currentId = -1;
					}
					break;

				case "tagsprite":
					_that.currentId = cmd.id;
					break;

				case "missedsprite":
					_that.currentId = cmd.id;
					break;

				default:
					break;
			}
			_that.$debug.html(_that.currentId !== -1 ? `over: ${_that.currentId}` : ``);
		});
		return this;
	},

	animate() {
		const _that = this;

		let tagSprite = new Observable((subscriber) => {
			this.timer = setInterval(() => {
				//trackerball.rotationMatrix.radions.x += 1.0 * ONE_DEGREE;
				// trackerball.rotationMatrix.radions.z += 1.0 * ONE_DEGREE;
				//trackerball.rotationMatrix.makeRotationMatrix();

				//trackerball.trackballCalcRotMatrix(0.01, 0.0025);

				trackerball.trackballCalcRotMatrix(0.01, 0.0);
				this.sprites.forEach((sprite) => {
					sprite.animate();
				});

				var collidingElement = document.elementFromPoint(this.mousePoint.x, this.mousePoint.y);
				if (collidingElement != null && collidingElement.className == "sprite") {
					let id = +collidingElement.id.replace(/sprite-(\d+)/g, "$1");

					if (_that.currentId !== id) {
						subscriber.next({ action: "tagsprite", id });
					}

					// console.log("Tag!", collidingElement.id);
				} else {
					if (_that.currentId !== -1) {
						subscriber.next({ action: "missedsprite", id: -1 });
					}
				}
			}, 16);
		});

		this._mergeObservable(tagSprite);

		return this;
	},

	// createSpriteDiv()
};

class Sprite {
	content;
	animationControler;
	$div;
	observable;

	constructor(id, animationControler, content, $parent) {
		this.id = id;
		this.animationControler = animationControler;
		this.content = content;
		const point = animationControler.getPosition();

		this.$div = $(`<div>${content}</div>`).addClass("sprite").attr("id", `sprite-${id}`).css(point).appendTo($parent);

		let enter = fromEvent(this.$div, "mouseenter").pipe(mapTo({ action: "mouseenter", id }));
		let leave = fromEvent(this.$div, "mouseleave").pipe(mapTo({ action: "mouseleave", id }));

		this.observable = merge(enter, leave);

		return this;
	}

	animate() {
		const point = this.animationControler.animate().getPosition();
		this.$div.css(point);
		return this;
	}

	get isMouseOver() {}

	get observable() {
		return this.observable;
	}
}

class CircleCntrl {
	radions = 0.0;
	stepSize = 1;
	animator = undefined;

	constructor(radions, stepSize, animator) {
		// console.log(radions);
		this.radions = radions;
		this.stepSize = stepSize;
		this.animator = animator;

		return this;
	}

	setup() {}

	animate() {
		this.radions += this.stepSize;
		return this;
	}

	getPosition() {
		const point = { top: CENTER - SPRITE_WIDTH / 2 + Math.sin(this.radions) * RADIUS, left: CENTER - SPRITE_WIDTH / 2 + Math.cos(this.radions) * RADIUS };
		return point;
	}

	// Animation(rad)
}

class HedronCntrl {
	vertex = [0, 0, 0];

	constructor(vertex) {
		// console.log(radions);
		this.vertex = vertex;
		// this.stepSize = stepSize;

		return this;
	}

	animate() {
		//this.radions += this.stepSize;
		return this;
	}

	getPosition() {
		let rotatedVertex = rotationMatrix.multMatrix1x3(this.vertex);
		// console.log("rotatedVertex", rotatedVertex);
		const opacity = Math.min(1.0 + rotatedVertex[2] * 0.2, 1.0);
		//console.log("opacity", opacity);

		rotationMatrix.vScale(rotatedVertex, RADIUS);
		//console.log("scaledVertex", rotatedVertex[2]);

		const point = { top: CENTER - SPRITE_WIDTH / 2 + rotatedVertex[0], left: CENTER - SPRITE_WIDTH / 2 + rotatedVertex[1], "z-index": parseInt(400 + rotatedVertex[2]), opacity };
		return point;
	}
}

const rotationMatrix = new RotationMatrix();
const trackerball = new TrackerBall(rotationMatrix);

$(() => {
	const $stage = stage();
	$stage.appendTo("body");
	const $debug = debug();
	$debug.appendTo($stage);
	const vertices = getVertices(6);

	rotationMatrix.makeRotationMatrix();
	const sprites = [
		{ id: 0, animationControler: new HedronCntrl(vertices[0]), content: "0" },
		{ id: 1, animationControler: new HedronCntrl(vertices[1]), content: "1" },
		{ id: 2, animationControler: new HedronCntrl(vertices[2]), content: "2" },
		{ id: 3, animationControler: new HedronCntrl(vertices[3]), content: "3" },
		{ id: 4, animationControler: new HedronCntrl(vertices[4]), content: "4" },
		{ id: 5, animationControler: new HedronCntrl(vertices[5]), content: "5" },
	];

	// console.log("d", d);

	// const sprites = [
	// 	{ id: 0, animationControler: new CircleCntrl(0.0 * ONE_DEGREE, 1.0 * ONE_DEGREE), content: "0" },
	// 	{ id: 1, animationControler: new CircleCntrl(90.0 * ONE_DEGREE, 1.0 * ONE_DEGREE), content: "1" },
	// 	{ id: 2, animationControler: new CircleCntrl(180.0 * ONE_DEGREE, 1.0 * ONE_DEGREE), content: "2" },
	// 	{ id: 3, animationControler: new CircleCntrl(270.0 * ONE_DEGREE, 1.0 * ONE_DEGREE), content: "3" },
	// ];

	const hedron = Hedron.mountToParent($stage, $debug).addSprites(sprites).trackMouse().animate().observe();

	console.log(Hedron);
});

//document.body.appendChild(component());
