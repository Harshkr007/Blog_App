
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            console.log("Promise error: ",err)
            next(err)
    })
    }
}

export default asyncHandler;