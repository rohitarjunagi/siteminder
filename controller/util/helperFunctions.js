exports.asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    }

exports.returnErrorResponse = (status, message, res) => res.status(status).send({ message: message });