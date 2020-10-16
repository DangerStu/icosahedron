export const getVertices = (vertexCount) => {
	let vertices = [];
	switch (vertexCount) {
		case 4:
			// -- Tetrahedron ----------------------------
			vertices = [
				[0, 0, 1.0],
				[0.9428088, 0, -0.3333333],
				[-0.4714045, 0.8164967, -0.3333333],
				[-0.4714045, -0.8164967, -0.3333333],
			];
			break;

		case 6:
			// -- Octohedron ----------------------------
			vertices = [
				[0.0, 0.0, 1.0],
				[1.0, 0.0, 0.0],
				[0.0, 1.0, 0.0],
				[-1.0, 0.0, 0.0],
				[0.0, -1.0, 0.0],
				[0.0, 0.0, -1.0],
			];

			break;

		case 8:
			// -- Cube -----------------------------------
			vertices = [
				[0, 0, 1.0],
				[0.9428093, 0, 0.3333333],
				[-0.4714045, 0.8164965, 0.3333333],
				[-0.4714045, -0.8164965, 0.3333333],
				[0.4714045, 0.8164965, -0.3333333],
				[0.4714045, -0.8164965, -0.3333333],
				[-0.9428093, 0, -0.3333333],
				[0, 0, -1.0],
			];

			break;

		case 12:
			// -- Icosahedron ----------------------------
			vertices = [
				[0.0, 0.0, 1.0],
				[0.8, 0.0, 0.4],
				[0.3, 0.8367, 0.4],
				[-0.7, 0.5477, 0.4],
				[-0.7, -0.5477, 0.4],
				[0.3, -0.8367, 0.4],
				[-0.8, 0.0, -0.4],
				[-0.3, -0.8367, -0.4],
				[0.7, -0.5477, -0.4],
				[0.7, 0.5477, -0.4],
				[-0.3, 0.8367, -0.4],
				[0.0, 0.0, -1.0],
			];
			break;

		default:
			break;
	}
	return vertices;
};