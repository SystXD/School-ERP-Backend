import { ApiResponse } from "../../lib/structures";
import { handler } from "../../lib/utils";

export default handler(async (req, res) => {
    res
    .status(404)
    .json(new ApiResponse(404, `The request route ${req.path} dont exist`))
})