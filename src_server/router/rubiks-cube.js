const Cube = require('cubejs');

Cube.initSolver();

module.exports = router => {
    router.get('/api/cube-3x3-scramble', async (req, res, next) => {
        const scramble = Cube.scramble();
        const cube = new Cube();
        cube.move(scramble);
        res.json({
            scramble,
            cubeString: cube.asString(),
        });
    });
};
