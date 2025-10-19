import express from "express"
import { createCategory, getAllCategories } from "../controllers/categoryController"


const router = express.Router()

router.route('/categories')
    .get(getAllCategories)

router.route('/admin/categories')
    .post(createCategory)


export default router