import { RequestHandler } from "express"


export const getProducts: RequestHandler = async (req, res) => {
    res.status(200).json({
        message: 'All Products'
    })
}