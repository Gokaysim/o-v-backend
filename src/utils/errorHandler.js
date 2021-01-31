import createError from 'http-errors';

export default app => {
    app.use((err, req, res, next) => {
        console.log(err.stack);
       next(createError(err.status||500,err.message))
    });
};
