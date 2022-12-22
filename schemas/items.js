const joi = require('joi')

const schema = joi.object({
        title: joi
            .string()
            .required()
            .min(2)
            .messages({
                "any.required": "This field is required.",
                "string.empty": "This field is empty, please, introduce a name.",
                "string.min": "This field is required, please, introduce a name with a minimum of 2 letters.",
            })
            ,
            category_id: joi
            .string()
            .required()
            .min(2)
            .max(30)
            .messages({
                "any.required": "This field is required.",
                "string.empty": "This field is empty, please, introduce a name.",
                "string.min": "This field is required, please, introduce a name with a minimum of 2 letters.",
                "string.max": "This field is required, please, introduce a name with less than 30 letters."
            }),
            unit_price: joi
            .number()
            .required()
            .min(1)
            .messages({
                "any.required": "This field is required.",
                "number.empty": "This field is empty, please, introduce a number."
                
            }),
            picture_url: joi
            .string()
            .required()
            .uri()
            .messages({
                "any.required": "This field is required.",
                "string.uri": "This field is required, please, introduce a photo."
            }),
            gender: joi
            .string()
            .required()
            .messages({
                "any.required": "This field is required.",
                "string.empty": "This field is empty, please, introduce a gender."
            }),
            description: joi
            .string()
            .required()
            .messages({
                "any.required": "This field is required.",
                "string.empty": "This field is empty, please, introduce a text."
            }),
            userId: joi
            .string()
            .required()
})

module.exports = schema