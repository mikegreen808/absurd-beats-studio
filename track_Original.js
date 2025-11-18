import joi from "joi";

const trackSchema = joi.object({
  id: joi.string().required(),
  title: joi.string().required(),
  bpm: joi.number().required(),
  key: joi.string().required(),
});

export default trackSchema;