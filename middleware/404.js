module.exports = (req, res) => {
    const content = '404 | not found';
    res
        .status(404)
        .json(content);
};
