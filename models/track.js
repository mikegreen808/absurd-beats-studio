import joi from "joi";

const trackSchema = joi.object({
  id: joi.string().required(),
  title: joi.string().required(),
  bpm: joi.number().required(),
  key: joi.string().required(),
  existential_tag: joi.string().required(),
  notes: joi.string().optional(),  
});

export default trackSchema;