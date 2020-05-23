module.exports = router => {
    router.get('/api/todos', async (req, res, next) => {
        console.log('sending todos');
        res.send([1, 2, 3]);
    });
};
