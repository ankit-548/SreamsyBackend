//  Generalized method for using async await and try catch as we will be connecting to db all the time 
//  and this will work as wrapper just need to pass function in this wrapper.
// using promises: 
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    .catch((err) => next(err))
};
// Why is .catch((err) => next(err)) Important?
// Express uses next(err) to pass errors to its built-in error-handling middleware.
// Without this, you’d have to manually wrap every async route with try...catch, which is repetitive.

export {asyncHandler};


// using async await: 
// const asyncHandler = () => {() => {}}
// const asyncHandler = () => () => {}
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)        
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }