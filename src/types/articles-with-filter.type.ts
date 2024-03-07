import { ArticleCardType } from './article-card.type';

export type ArticlesWithFilterType = {
    count: number,
    pages: number,
    items: ArticleCardType[]
}
