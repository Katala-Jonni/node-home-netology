const createLog = req => {
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    const { method, url } = req;
    const userAgent = req.get('user-agent');

    return `${hour}:${minutes}:${seconds} ${method}: ${url} user-agent: ${userAgent}`;
};

module.exports = {
    createLog
};
