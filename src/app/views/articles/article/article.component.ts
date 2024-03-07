import {
  Component, effect, inject, Injector, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ArticleType } from 'src/types/article.type';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safe-html.pipe';
import {
  FormControl, FormsModule, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { ArticleCardType } from 'src/types/article-card.type';
import { ArticleCardComponent } from 'src/app/shared/components/article-card/article-card.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { environment } from 'src/environments/environment';
import { CommentsResponseType } from 'src/types/comments-response.type';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ActionType } from 'src/types/action.type';
import { UserInfoType } from 'src/types/user-info.type';
import { CommentActionsType } from 'src/types/comment-actions.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule,
    SafeHtmlPipe,
    FormsModule,
    ReactiveFormsModule,
    ArticleCardComponent,
    SafeHtmlPipe,
    RouterModule,
  ],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  articleService = inject(ArticleService);

  activatedRoute = inject(ActivatedRoute);

  authService = inject(AuthService);

  injector = inject(Injector);

  commentService = inject(CommentService);

  snackBar = inject(MatSnackBar);

  loaderService = inject(LoaderService);

  serverStaticPath = environment.serverStaticPath;

  article!: ArticleType;

  article$!: Observable<ArticleType>;

  relatedArticles$!: Observable<ArticleCardType[]>;

  isLogged = false;

  loaderIsShown = false;

  comment: FormControl<string | null> = new FormControl('', Validators.required);

  offset = 3;

  action = ActionType;

  userInfo: UserInfoType | null = null;

  commentActions: CommentActionsType[] = [];

  url = '';

  title = '';

  // Facebook social share Link/URL: https://www.facebook.com/sharer/sharer.php?u=[URL]
  // VKontakte (VK) social share Link/URL: http://vk.com/share.php?url=[URL]
  // Instagram social share Link/URL: There is no universal share URL for Instagram
  // or a third-party service that uses Instagram's API.
  shareLinkObjects = [
    {
      svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_17_2179)">
                <path
                d="M3.82296 0.178284C1.82104 0.178284 0.178345 1.82097 0.178345 3.82289V16.1762C0.178345 18.1781 1.82104 19.8208 3.82296 19.8208H16.1763C18.1782 19.8208 19.8209 18.1781 19.8209 16.1762V3.82289C19.8209 1.82097 18.1782 0.178284 16.1763 0.178284H3.82296ZM3.82296 1.96397H16.1763C17.2121 1.96397 18.0352 2.78706 18.0352 3.82289V16.1762C18.0352 17.212 17.2121 18.0351 16.1763 18.0351H3.82296C2.78712 18.0351 1.96403 17.212 1.96403 16.1762V3.82289C1.96403 2.78706 2.78712 1.96397 3.82296 1.96397ZM9.7485 6.63395C9.09282 6.62698 8.53479 6.63395 8.2209 6.78741C8.01164 6.88855 7.85121 7.11874 7.94886 7.1292C8.07093 7.14664 8.34646 7.20593 8.49294 7.40473C8.68128 7.65933 8.6743 8.23479 8.6743 8.23479C8.6743 8.23479 8.77893 9.81819 8.4197 10.017C8.17208 10.153 7.83377 9.87748 7.10136 8.61844C6.72818 7.96973 6.44568 7.25476 6.44568 7.25476C6.44568 7.25476 6.39337 7.12223 6.29571 7.05247C6.17713 6.96528 6.01321 6.93738 6.01321 6.93738L4.26589 6.94784C4.26589 6.94784 4.00431 6.95831 3.91015 7.06991C3.82296 7.17454 3.90317 7.38031 3.90317 7.38031C3.90317 7.38031 5.27034 10.5785 6.81886 12.1898C8.23834 13.6686 9.84964 13.5709 9.84964 13.5709H10.5821C10.5821 13.5709 10.8018 13.5465 10.9134 13.4279C11.018 13.3163 11.0145 13.1071 11.0145 13.1071C11.0145 13.1071 11.0006 12.127 11.454 11.9805C11.9039 11.841 12.4759 12.9292 13.0862 13.3477C13.5501 13.6651 13.9023 13.5953 13.9023 13.5953L15.5345 13.5709C15.5345 13.5709 16.3855 13.5186 15.981 12.8455C15.9496 12.7932 15.7473 12.3502 14.7707 11.4434C13.7454 10.4948 13.8814 10.6483 15.116 9.00557C15.8659 8.00461 16.1658 7.39426 16.0716 7.1292C15.981 6.88158 15.4299 6.94784 15.4299 6.94784L13.5919 6.95831C13.5919 6.95831 13.4559 6.94087 13.3547 7.00016C13.2571 7.05945 13.1943 7.19896 13.1943 7.19896C13.1943 7.19896 12.9014 7.97322 12.5142 8.63239C11.6981 10.0205 11.3668 10.0972 11.2342 10.01C10.9238 9.80773 11.0006 9.20088 11.0006 8.77189C11.0006 7.42217 11.2063 6.86414 10.603 6.71766C10.4042 6.66883 10.2577 6.63744 9.7485 6.63395Z" fill="#709FDC" />
              </g>
              <defs>
                <clipPath id="clip0_17_2179">
                  <rect width="19.9997" height="19.9997" fill="white" />
                </clipPath>
              </defs>
            </svg>`,
      shareUrlExist: true,
      href: 'http://vk.com/share.php?url=[url]&title=[title]',
    },
    {
      svg: `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_17_2175)">
                <path
                  d="M10.3321 0.000488281C4.81923 0.000488281 0.332275 4.48744 0.332275 10.0003C0.332275 15.5132 4.81923 20.0002 10.3321 20.0002C15.845 20.0002 20.332 15.5132 20.332 10.0003C20.332 4.48744 15.845 0.000488281 10.3321 0.000488281ZM10.3321 1.66713C14.9443 1.66713 18.6653 5.38816 18.6653 10.0003C18.6653 14.1897 15.5918 17.6346 11.5723 18.2326V12.4303H13.9453L14.3181 10.0199H11.5723V8.70315C11.5723 7.70233 11.9011 6.81353 12.837 6.81353H14.3408V4.7107C14.0767 4.67487 13.5176 4.59677 12.461 4.59677C10.2544 4.59677 8.96169 5.76174 8.96169 8.41669V10.0199H6.69285V12.4303H8.96169V18.2115C5.00625 17.5591 1.99891 14.1445 1.99891 10.0003C1.99891 5.38816 5.71994 1.66713 10.3321 1.66713Z" fill="#709FDC" />
              </g>
              <defs>
                <clipPath id="clip0_17_2175">
                  <rect width="20.0002" height="20" fill="white" transform="translate(0.332275)" />
                </clipPath>
              </defs>
            </svg>`,
      shareUrlExist: true,
      href: 'https://www.facebook.com/sharer.php?u=[url]',
    },
    {
      svg: `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_17_2177)">
                <path
                  d="M6.6203 0.178284C3.45001 0.178284 0.844727 2.78008 0.844727 5.95386V14.0452C0.844727 17.2155 3.44653 19.8208 6.6203 19.8208H14.7117C17.882 19.8208 20.4873 17.219 20.4873 14.0452V5.95386C20.4873 2.78357 17.8855 0.178284 14.7117 0.178284H6.6203ZM6.6203 1.96397H14.7117C16.9194 1.96397 18.7016 3.74617 18.7016 5.95386V14.0452C18.7016 16.2529 16.9194 18.0351 14.7117 18.0351H6.6203C4.41261 18.0351 2.63041 16.2529 2.63041 14.0452V5.95386C2.63041 3.74617 4.41261 1.96397 6.6203 1.96397ZM15.9393 3.91706C15.4894 3.91706 15.1302 4.27629 15.1302 4.7262C15.1302 5.17611 15.4894 5.53534 15.9393 5.53534C16.3893 5.53534 16.7485 5.17611 16.7485 4.7262C16.7485 4.27629 16.3893 3.91706 15.9393 3.91706ZM10.666 4.6425C7.71892 4.6425 5.30894 7.05247 5.30894 9.99955C5.30894 12.9466 7.71892 15.3566 10.666 15.3566C13.6131 15.3566 16.023 12.9466 16.023 9.99955C16.023 7.05247 13.6131 4.6425 10.666 4.6425ZM10.666 6.42818C12.6505 6.42818 14.2374 8.01507 14.2374 9.99955C14.2374 11.984 12.6505 13.5709 10.666 13.5709C8.68151 13.5709 7.09462 11.984 7.09462 9.99955C7.09462 8.01507 8.68151 6.42818 10.666 6.42818Z" fill="#709FDC" />
              </g>
              <defs>
                <clipPath id="clip0_17_2177">
                  <rect width="19.9997" height="19.9997" fill="white" transform="translate(0.665771)" />
                </clipPath>
              </defs>
            </svg>`,
      shareUrlExist: false,
      href: 'https://instagram.com',
    },
  ];

  ngOnInit(): void {
    this.url = window.location.href;
    this.shareLinkObjects.filter((item) => item.shareUrlExist).forEach((shareLinkObj) => {
      shareLinkObj.href = shareLinkObj.href.replace('[url]', encodeURI(this.url));
    });

    effect(() => {
      this.isLogged = this.authService.$isLogged();
    }, { injector: this.injector });

    if (this.isLogged) {
      this.authService.getUserInfo().subscribe({
        next: (userInfoResponse: UserInfoType | DefaultResponseType) => {
          let error = '';
          if ((userInfoResponse as DefaultResponseType).error !== undefined) {
            error = (userInfoResponse as DefaultResponseType).message;
            throw new Error((userInfoResponse as DefaultResponseType).message);
          }
          const userInfo = userInfoResponse as UserInfoType;
          if (!userInfo.id || !userInfo.name || !userInfo.email) {
            error = 'Ошибка данных пользователя';
          }
          if (error) {
            this.snackBar.open(error);
          }
          this.userInfo = userInfo;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this.snackBar.open(errorResponse.error.message);
          } else {
            this.snackBar.open('Возникла ошибка');
          }
        },
      });
    }

    effect(() => {
      this.loaderIsShown = this.loaderService.$isShown();
    }, { injector: this.injector });

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.getArticle(params['url']);
        this.relatedArticles$ = this.articleService.getRelatedArticle(params['url']);
      });
  }

  getArticle(articleUrl: string) {
    this.articleService.getArticle(articleUrl)
      .subscribe((articleResponse: ArticleType) => {
        this.article = articleResponse;
        this.title = encodeURI(this.article.title);
        this.shareLinkObjects.filter((item) => item.shareUrlExist).forEach((shareLinkObj) => {
          if (shareLinkObj.href.includes('[title]')) {
            shareLinkObj.href = shareLinkObj.href.replace('[title]', this.title);
          }
        });
        if (this.isLogged) {
          this.getCommentActions();
        }
      });
  }

  getCommentActions() {
    this.commentService.getArticleCommentActions(this.article.id)
      .subscribe((commentActionsResponse: CommentActionsType[]) => {
        this.commentActions = commentActionsResponse;
        this.processComments();
      });
  }

  processComments() {
    if (this.article.comments.length > 0) {
      this.article.comments = this.article.comments.map((comment) => {
        const commentAction = this.commentActions.find((item) => comment.id === item.comment);
        if (commentAction) {
          comment.action = commentAction.action;
        }
        return comment;
      });
    }
  }

  addComment() {
    if (this.comment.value) {
      this.commentService.addComment(this.article.id, this.comment.value)
        .subscribe({
          next: (commentResponse: DefaultResponseType) => {
            this.snackBar.open(commentResponse.message);
            if (commentResponse.error) {
              throw new Error(commentResponse.message);
            }
            this.getArticle(this.article.url);
            this.comment.setValue('');
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.snackBar.open(errorResponse.error.message);
            } else {
              this.snackBar.open('Ошибка при создании коммантария');
            }
          },
        });
    }
  }

  loadMoreComments(articleId: string) {
    this.loaderService.show();
    this.commentService.getComments(this.offset, articleId)
      .subscribe({
        next: (commentsResponse: CommentsResponseType) => {
          this.article.comments = this.article.comments.concat(commentsResponse.comments);
          this.article.commentsCount = commentsResponse.allCount;
          this.loaderService.hide();

          this.processComments();
          this.offset += 10;
        },
        error: () => {
          this.loaderService.hide();
        },
      });
  }

  handleReaction(commentId: string, action: ActionType) {
    this.commentService.applyAction(commentId, action)
      .subscribe({
        next: (actionResponse: DefaultResponseType) => {
          if (!actionResponse.error) {
            let message = 'Ваш голос учтен';
            if (action === ActionType.violate) {
              message = 'Жалоба отправлена';
            } else {
              const commentIndex = this.article.comments.findIndex((item) => item.id === commentId);
              if (commentIndex > -1) {
                const updatedComment = this.article.comments[commentIndex];
                this.commentService.getUserActionsforComment(updatedComment.id)
                  .subscribe((userActionsResponse) => {
                    if (userActionsResponse.length > 0) {
                      const userActionForComment: ActionType = userActionsResponse[0].action;
                      if (userActionForComment === ActionType.like) {
                        updatedComment.likesCount += 1;
                        if (updatedComment.action !== undefined) {
                          updatedComment.dislikesCount = (updatedComment.dislikesCount > 0)
                            ? (updatedComment.dislikesCount - 1) : 0;
                        }
                      } else {
                        updatedComment.dislikesCount += 1;
                        if (updatedComment.action !== undefined) {
                          updatedComment.likesCount = (updatedComment.likesCount > 0)
                            ? (updatedComment.likesCount - 1) : 0;
                        }
                      }
                      updatedComment.action = userActionForComment;
                    } else {
                      if (action === ActionType.like) {
                        updatedComment.likesCount = (updatedComment.likesCount > 0)
                          ? (updatedComment.likesCount - 1) : 0;
                      } else if (action === ActionType.dislike) {
                        updatedComment.dislikesCount = (updatedComment.dislikesCount > 0)
                          ? (updatedComment.dislikesCount - 1) : 0;
                      }
                      delete updatedComment.action;
                    }
                    this.article.comments.splice(commentIndex, 1, updatedComment);
                  });
              }
            }
            this.snackBar.open(message);
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error) {
            if (action === ActionType.violate) {
              this.snackBar.open('Жалоба уже отправлена');
            } else if (errorResponse.error.message) {
              this.snackBar.open(errorResponse.error.message);
            } else {
              this.snackBar.open('Возникла ошибка');
            }
          }
        },
      });
  }
}
