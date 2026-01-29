import joi from 'joi';

const createUser = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
};

export { createUser };
