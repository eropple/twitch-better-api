import Joi from 'joi';

export const OPTIONS_VALIDATOR =
  Joi.object().keys({
    scopes: Joi.array().items(Joi.string())
  }).required();

export const DEFAULT_OPTIONS = {
  scopes: []
};
