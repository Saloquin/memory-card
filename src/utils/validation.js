import { ZodError, ZodType } from 'zod'

export const validateBody = (schema, next) => {
    return (req, res, next) => {
        if (schema instanceof ZodType) {
            try{
            req.body = schema.parse(req.body)
            next()
            }catch(error){
                if (error instanceof ZodError) {
                    return res.status(400).send({
                        error : 'Validation failed',
                        details : error.issues,
                    })
                }
                return res.status(500).send({
                    error : "internal server error"
                })
            }
        }
    }
}

export const validateParams = (schema, next) => {
    return (req, res, next) => {
        if (schema instanceof ZodType) {
            try{
            schema.parse(req.params)
            next()
            }catch(error){
                if (error instanceof ZodError) {
                    return res.status(400).send({
                        error : 'Invalid params',
                        details : error.issues,
                    })
                }
                return res.status(500).send({
                    error : "internal server error"
                })
            }
        }
    }
}

export const validateQuery = (schema, next) => {
    return (req, res, next) => {
        if (schema instanceof ZodType) {
            try {
                req.query = schema.parse(req.query)
                next()
            } catch(error) {
                if (error instanceof ZodError) {
                    return res.status(400).send({
                        error: 'Invalid query parameters',
                        details: error.issues,
                    })
                }
                return res.status(500).send({
                    error: "internal server error"
                })
            }
        }
    }
}