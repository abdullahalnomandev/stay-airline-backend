import QueryBuilder from "../../builder/QueryBuilder";
import { productSearchableFields } from "./product.constant";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";


const createProduct = async (product: IProduct) => {
    const result = await Product.create(product);
    return result;
};

const getProduct = async (query: Record<string, unknown>) => {

    const productQuery = new QueryBuilder(Product.find(), query)
    .paginate()
    .search(productSearchableFields)
    .fields()
    .filter()
    .sort()


    const result = await productQuery.modelQuery;
    const pagination = await productQuery.getPaginationInfo();
    return {
        pagination,
        result
    };
};


export const ProductService = {
    createProduct,
    getProduct

}

