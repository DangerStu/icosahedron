// global gScreenWidth
// global gScreenHeight
// global gRotMatrix
// global gLastMouseH
// global gLastMouseV

// global gTrackballSize
// global gCurrQuat
// global gLastQuat

export class TrackerBall {
	gCurrQuat;
	gLastQuat;
	gTrackballSize;
	rotationMatrix;

	// -------------------------------------------
	// -- initTrackball
	// -------------------------------------------
	constructor(rotationMatrix) {
		console.log("rotationMatrix");
		// debugger;
		this.rotationMatrix = rotationMatrix;
		this.gTrackballSize = 0.6;
		this.gCurrQuat = this.genQuat();
		this.gLastQuat = this.genQuat();
		// console.log(this.gLastQuat, this.gCurrQuat);

		this.gCurrQuat = this.trackballCalcQuat(this.gCurrQuat, 0.0, 0.0, 0.0, 0.0);
		// console.log(this.gLastQuat, this.gCurrQuat);
	}

	genQuat() {
		return [0.0, 0.0, 0.0, 0.0];
	}
	genTri() {
		return [0.0, 0.0, 0.0];
	}
	// -------------------------------------------
	// -- trackballCalcPathQuat
	// -------------------------------------------
	trackballCalcPathQuat(v1, v2) {
		// 	let a = this.genTri();
		// 	let d = this.genTri();
		// 	let p1 = this.genTri();
		// 	let p2 = this.genTri();
		// 	let phi = 0.0;
		// 	// --  put v1 && v2
		// 	this.rotationMatrix.vCopy(v1, p1);
		// 	this.rotationMatrix.vNormal(p1);
		// 	this.rotationMatrix.vCopy(v2, p2);
		// 	this.rotationMatrix.vNormal(p2);
		// 	// -- now get the cross product
		// 	this.rotationMatrix.vCross(p2, p1, a);
		// 	this.rotationMatrix.dot = vDot(p1, p2);
		// 	// --  put dot
		// 	// --if dot > 0 then
		// 	phi = arccos(dot) / 2;
		// 	// --else
		// 	// --phi = arccos(dot)/2
		// 	// --end if
		// 	// --  put phi
		// 	phi = phi / 6;
		// 	this.gLastQuat = this.trackballAxisToQuat(a, phi, this.gLastQuat);
	}

	// -------------------------------------------
	// -- trackballPathMove
	// -------------------------------------------
	trackballPathMove() {
		// this.gCurrQuat = this.rotationMatrix.addQuats(this.gLastQuat, this.gCurrQuat, this.gCurrQuat);
		// this.rotationMatrix.quatToMatrix3x3(this.gCurrQuat);
	}

	// -------------------------------------------
	// -- trackballCalcRotMatrix
	// -------------------------------------------
	trackballCalcRotMatrix(dx, dy) {
		console.log("dx", dx, "dy", dy, "this.inRange(2.0 * dx)", this.inRange(2.0 * dx), "this.inRange(2.0 * dy)", this.inRange(2.0 * dy));
		// console.log(dx, dy, this.inRange(2.0 * dx), this.inRange(2.0 * dy));
		this.gLastQuat = this.trackballCalcQuat(this.gLastQuat, 0, 0, this.inRange(2.0 * dx), this.inRange(2.0 * dy));
		//console.log(this.gLastQuat, this.gCurrQuat);

		this.gCurrQuat = this.rotationMatrix.addQuats(this.gLastQuat, this.gCurrQuat, this.gCurrQuat);
		//console.log(this.gLastQuat, this.gCurrQuat);

		this.rotationMatrix.quatToMatrix3x3(this.gCurrQuat);
	}

	// -------------------------------------------
	// -- inRange
	// -------------------------------------------
	inRange(x) {
		x = x > 1.0 ? 1.0 : x;
		x = x < -1.0 ? -1.0 : x;
		return x;

		x = Math.max(-1.0, x);
		return Math.min(1.0, x);
	}

	// -------------------------------------------
	// -- trackballCalcQuat
	// -------------------------------------------
	trackballCalcQuat(quat, p1x, p1y, p2x, p2y) {
		//console.log("refactor: trackballCalcQuat");
		// let quat = this.genQuat();
		let a = this.genTri();
		let d = this.genTri();
		let p1 = this.genTri();
		let p2 = this.genTri();
		let phi = 0.0;
		let t = 0.0;

		// -- check for movement
		if (p1x == p2x && p1y == p2y) {
			// -- Zero rotation
			this.rotationMatrix.vZero(quat);
			quat[3] = 1.0;
			return quat;
		}

		// -- figure out z-coords for projection of p1 & p2 to sphere
		this.rotationMatrix.vSet(p1, p1x, p1y, this.trackballProjToSphere(this.gTrackballSize, p1x, p1y));
		this.rotationMatrix.vSet(p2, p2x, p2y, this.trackballProjToSphere(this.gTrackballSize, p2x, p2y));

		// -- now get the cross product
		this.rotationMatrix.vCross(p2, p1, a);

		// -- figure out rotation around axis
		this.rotationMatrix.vSub(p1, p2, d);
		t = this.rotationMatrix.vLength(d) / (2.0 * this.gTrackballSize);

		// -- make sure t is in range
		t = this.inRange(t);

		phi = 2.0 * Math.asin(t);

		//const x =
		this.trackballAxisToQuat(a, phi, quat);
		console.log(quat);
		return quat;
		// return this.trackballAxisToQuat(a, phi, quat);
	}

	// -------------------------------------------
	// -- trackballAxisToQuat
	// -------------------------------------------
	trackballAxisToQuat(a, phi, quat) {
		if (a[0] == 0 && a[1] == 0 && a[2] == 0) {
			a[0] = 1.0;
		}
		this.rotationMatrix.vNormal(a);
		this.rotationMatrix.vCopy(a, quat);
		this.rotationMatrix.vScale(quat, Math.sin(phi / 2.0));
		quat[3] = Math.cos(phi / 2.0);
		return quat;
	}

	// -------------------------------------------
	// -- trackballProjToSphere
	// -------------------------------------------
	trackballProjToSphere(r, x, y) {
		let d = parseFloat(Math.sqrt(x * x + y * y));
		let z;
		if (d < r * 0.7071067811865475244) {
			// -- inside sphere
			console.log("inside");
			z = parseFloat(Math.sqrt(r * r - d * d));
		} else {
			console.log("outside");
			t = r / 1.4142135623730950488;
			z = (t * t) / d;
		}
		return z;
	}
}
