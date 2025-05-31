import { StatusCodes } from "http-status-codes";

export const validate = (schemas) => {
  return async (req, res, next) => {
    try {
      for (const [segment, schema] of Object.entries(schemas)) {
        if (schema) {
          req[segment] = await schema.parseAsync(req[segment]);
        }
      }
      next();
    } catch (error) {
      if (error.issues) {
        const messages = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: messages });
      }
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.message || error });
    }
  };
};
