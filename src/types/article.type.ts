import { ArticleCardType } from './article-card.type';
import { CommentType } from './comment.type';

export interface ArticleType extends ArticleCardType {
    text: string,
    comments: CommentType[],
    commentsCount: number
}
