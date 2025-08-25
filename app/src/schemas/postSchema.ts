import Joi from "joi"

export const postSchema: Joi.Schema = Joi.object().keys({
    title: Joi.string().required(),
    plot: Joi.string().required(),
    genres: Joi.array().required()
})
