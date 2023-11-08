import { Service } from "typedi";
import { DB } from "@database";

import { Category } from "@interfaces/category.interface";
import { CreateCategoryDto, UpdateCategoryDto } from "@/dtos/categories.dto";
import { HttpException } from "@/exceptions/HttpException";

@Service()
export class CategoryService {
  public async getCategory(): Promise<Category[]> {
    const categories = await DB.Categories.findAll({
      attributes: {
        exclude: ["pk"],
      },
    });

    const transformedArticles = categories.map(category => {
      return {
        ...category.get(),
        uuid: category.uuid,
        name: category.name,
        description: category.description,
      }
    });

    return transformedArticles;
  }

  public async createCategory(data: CreateCategoryDto): Promise<Category> {
    const categoryName = await DB.Categories.findOne({ where: { name: data.name } });
    if (categoryName) throw new HttpException(false, 409, "Category ${data.name} already exists");

    const category = await DB.Categories.create({ ...data });
    return category;
  }

  public async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<Category> {
    const updatedData: any = {};

    if (categoryData.name) updatedData.name = categoryData.name;
    if (categoryData.description) updatedData.description = categoryData.description;

    await DB.Users.update(updatedData, { where: { pk: id } });

    const updateCategory: Category = await DB.Categories.findByPk(id);
    return updateCategory;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const article = await DB.Categories.findOne({ where: { pk: id } });

    if (!article) {
      throw new HttpException(false, 400, "Category is not found");
    }

    // await article.destroy({ force: true });
    await article.destroy();
    return true;
  }
}