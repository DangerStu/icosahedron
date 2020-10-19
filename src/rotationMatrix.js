export class RotationMatrix {
	matrix = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
	radions = { x: 0.0, y: 0.0, z: 0.0 };

	makeRotationMatrix() {
		debugger;
		const xRot = this.setXrotMatrix(this.radions.x);
		const yRot = this.setYrotMatrix(this.radions.y);
		const zRot = this.setZrotMatrix(this.radions.z);
		this.matrix = this.multMatrix3x3(xRot, yRot);
		this.matrix = this.multMatrix3x3(this.matrix, zRot);
	}

	multMatrix1x3(a) {
		return this._multMatrix1x3(a, this.matrix);
	}

	// -------------------------------------------
	// -- multMatrix1x3
	// -------------------------------------------
	_multMatrix1x3(a, b) {
		const m = [0, 0, 0];
		m[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
		m[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
		m[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

		return m;
	}

	// -------------------------------------------
	// -- multMatrix3x3
	// -------------------------------------------
	multMatrix3x3(a, b) {
		const m = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];

		m[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
		m[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
		m[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

		m[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
		m[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
		m[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];

		m[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
		m[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
		m[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

		return m;
	}

	// -----------------------------------------
	// -- setZrotMatrix
	// -------------------------------------------
	setZrotMatrix(rads) {
		const r = [Math.cos(rads), Math.sin(rads), 0, -Math.sin(rads), Math.cos(rads), 0, 0, 0, 1];
		return r;
	}

	// -------------------------------------------
	// -- setXrotMatrix
	// -------------------------------------------
	setXrotMatrix(rads) {
		const r = [1, 0, 0, 0, Math.cos(rads), Math.sin(rads), 0, -Math.sin(rads), Math.cos(rads)];

		return r;
	}

	// -------------------------------------------
	// -- setYrotMatrix
	// -------------------------------------------
	setYrotMatrix(rads) {
		// rads = (iAng * pi) / 180;

		const r = [Math.cos(rads), 0, -Math.sin(rads), 0, 1, 0, Math.sin(rads), 0, Math.cos(rads)];
		return r;
	}

	// -------------------------------------------
	// -- addQuats
	// -------------------------------------------
	addQuats(q1, q2) {
		// console.log("refactor addQuats");
		const t1 = [0.0, 0.0, 0.0, 0.0];
		const t2 = [0.0, 0.0, 0.0, 0.0];
		const t3 = [0.0, 0.0, 0.0, 0.0];
		const tf = [0.0, 0.0, 0.0, 0.0];

		this.vCopy(q1, t1);
		this.vScale(t1, q2[3]);

		this.vCopy(q2, t2);
		this.vScale(t2, q1[3]);

		this.vCross(q2, q1, t3);
		this.vAdd(t1, t2, tf);
		this.vAdd(t3, tf, tf);

		tf[3] = q1[3] * q2[3] - this.vDot(q1, q2);

		// d[0] = tf[0];
		// d[1] = tf[1];
		// d[2] = tf[2];
		// d[3] = tf[3];

		return tf;
		// -- add normalizeation
	}

	// -------------------------------------------
	// -- vZero
	// -------------------------------------------
	vZero(v) {
		v[0] = 0.0;
		v[1] = 0.0;
		v[2] = 0.0;
	}

	// -------------------------------------------
	// -- vSet
	// -------------------------------------------
	vSet(v, x, y, z) {
		v[0] = parseFloat(x);
		v[1] = parseFloat(y);
		v[2] = parseFloat(z);
	}

	// -------------------------------------------
	// -- vSub
	// -------------------------------------------
	vSub(v1, v2, d) {
		d[0] = v1[0] - v2[0];
		d[1] = v1[1] - v2[1];
		d[2] = v1[2] - v2[2];
	}

	// -------------------------------------------
	// -- vCopy
	// -------------------------------------------
	vCopy(v1, d) {
		// d = [...v1];
		d[0] = v1[0];
		d[1] = v1[1];
		d[2] = v1[2];
		return d;
	}

	// -------------------------------------------
	// -- vCross
	// -------------------------------------------
	vCross(v1, v2, cross) {
		let d = [0, 0, 0];
		d[0] = v1[1] * v2[2] - v1[2] * v2[1];
		d[1] = v1[2] * v2[0] - v1[0] * v2[2];
		d[2] = v1[0] * v2[1] - v1[1] * v2[0];
		this.vCopy(d, cross);
	}

	// -------------------------------------------
	// -- vLength
	// -------------------------------------------
	vLength(v) {
		return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	}

	// -------------------------------------------
	// -- vScale
	// -------------------------------------------
	vScale(v, scale) {
		v[0] = v[0] * scale;
		v[1] = v[1] * scale;
		v[2] = v[2] * scale;
	}

	// ------------------------------------------
	// -- vNormal
	// -------------------------------------------
	vNormal(v) {
		this.vScale(v, 1.0 / this.vLength(v));
	}

	// -------------------------------------------
	// -- vDot
	// -------------------------------------------
	vDot(v1, v2) {
		return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
	}

	// -------------------------------------------
	// -- vAdd
	// -------------------------------------------
	vAdd(v1, v2, d) {
		d[0] = v1[0] + v2[0];
		d[1] = v1[1] + v2[1];
		d[2] = v1[2] + v2[2];
	}

	// -------------------------------------------
	// -- quatToMatrix3x3
	// -------------------------------------------
	quatToMatrix3x3(quat) {
		this.matrix[0] = 1.0 - 2.0 * (quat[1] * quat[1] + quat[2] * quat[2]);
		this.matrix[1] = 2.0 * (quat[0] * quat[1] - quat[2] * quat[3]);
		this.matrix[2] = 2.0 * (quat[2] * quat[0] + quat[1] * quat[3]);

		this.matrix[3] = 2.0 * (quat[0] * quat[1] + quat[2] * quat[3]);
		this.matrix[4] = 1.0 - 2.0 * (quat[2] * quat[2] + quat[0] * quat[0]);
		this.matrix[5] = 2.0 * (quat[1] * quat[2] - quat[0] * quat[3]);

		this.matrix[6] = 2.0 * (quat[2] * quat[0] - quat[1] * quat[3]);
		this.matrix[7] = 2.0 * (quat[1] * quat[2] + quat[0] * quat[3]);
		this.matrix[8] = 1.0 - 2.0 * (quat[1] * quat[1] + quat[0] * quat[0]);
	}

	// -------------------------------------------
	// -- normalizeQuat
	// -------------------------------------------
	normalizeQuat(q) {
		let mag = float(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);
		q[0] = q[0] / mag;
		q[1] = q[1] / mag;
		q[2] = q[2] / mag;
		q[3] = q[3] / mag;
	}
}
