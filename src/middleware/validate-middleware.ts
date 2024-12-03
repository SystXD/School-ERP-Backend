import { ValidationChain } from "express-validator";
import { handler } from "../lib/utils";
import { ApiResponse } from "../lib/structures";

export const validate = (validations: ValidationChain[]) => {
  return handler(async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        res
          .status(400)
          .json(
            new ApiResponse(400, "Errors found in request", result.array())
          );
        return;
      }
    }

    next();
  });
};
