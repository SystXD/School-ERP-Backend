import { handler } from "../../lib/utils";
export default handler(async (req, res) => {

    res
    .status(200)
    .json({
        message: 'The Route is online!'
    })
})

