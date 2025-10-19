import express from "express"
import { createProduct, deleteProduct, getProducts, getSingleProduct, updateProduct } from "../controllers/productController"

const router = express.Router()

router.route('/products').get(getProducts)
router.route('/products/:id').get(getSingleProduct).put(updateProduct).delete(deleteProduct)
router.route('/admin/products').post(createProduct)


export default router