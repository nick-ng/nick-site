const Cube = require('cubejs');

const { scrambleToWide } = require('./utils');

Cube.initSolver();

module.exports = router => {
    router.get('/api/cube-3x3-scramble', async (req, res, next) => {
        const scramble = Cube.scramble();
        // const wideScramble = scrambleToWide(scramble);
        const cube = new Cube();
        cube.move(scramble);

        res.json({
            scramble,
            cubeString: cube.asString(),
            wideScramble: scramble,
            wideCubeString: cube.asString(),
        });
    });
};
