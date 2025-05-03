const asyncHandler = (requesthandeler) => {
    return (req, res, next) => {
        Promise.resolve(requesthandeler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler }
