import Joi from "joi"

const toTitleCase = (str: string) =>
    str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

export const movieSchema: Joi.Schema = Joi.object().keys({
    title: Joi.string().required().custom((value) => toTitleCase(value.trim())),
    plot: Joi.string().trim().required(),
    genres: Joi.array().items(Joi.string()).unique().required().custom((values: string[]) => values.map((value: string) => value.trim().toLowerCase()))
})
