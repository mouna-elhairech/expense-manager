import { CategoriesService } from './categories.service';
export declare class CategoriesSeeder {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    private readonly logger;
    private readonly defaultCategories;
    seed(): Promise<void>;
}
