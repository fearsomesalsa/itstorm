import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentService } from 'src/app/shared/services/comment.service';
import { of, throwError } from 'rxjs';
import { ArticleType } from 'src/types/article.type';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ActionType } from '../../../../types/action.type';
import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  beforeEach(() => {
    const articleServiceSpy = jasmine.createSpyObj('ArticleService', ['getArticle', 'getRelatedArticle']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserInfo', '$isLogged']);
    const commentServiceSpy = jasmine.createSpyObj('CartService', ['applyAction', 'getUserActionsforComment']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide', '$isShown']);

    TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        { provide: ArticleService, useValue: articleServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({ url: 'test' }) } },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CommentService, useValue: commentServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
      ],
    });
    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const article: ArticleType = {
      id: 'test',
      title: 'test',
      description: 'test',
      image: 'test',
      date: '2023-01-20T09:04:37.390Z',
      category: 'test',
      url: 'test',
      text: 'test',
      comments: [{
        id: 'test',
        text: 'test',
        date: '2023-01-20T09:04:37.390Z',
        likesCount: 2,
        dislikesCount: 3,
        user: {
          id: 'test',
          name: 'test',
        },
      }],
      commentsCount: 1,
    };

    component.article = article;
  });

  it('should add class "active" to like reaction block when user applies like', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(of({
      error: false,
      message: 'Успешное действие!',
    }));
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.like,
      },
    ]));

    component.handleReaction('test', ActionType.like);
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const commentLike: HTMLElement | null = componentElement.querySelector('.article-comments-item-reaction.like');
    expect(commentLike?.classList.contains('active')).toBe(true);
  });

  it('should add class "active" to dislike reaction block when user applies dislike', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(of({
      error: false,
      message: 'Успешное действие!',
    }));
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.dislike,
      },
    ]));

    component.handleReaction('test', ActionType.dislike);
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const commentLike: HTMLElement | null = componentElement.querySelector('.article-comments-item-reaction.dislike');
    expect(commentLike?.classList.contains('active')).toBe(true);
  });

  it('should increase likes count with 1 when user applies like', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(of({
      error: false,
      message: 'Успешное действие!',
    }));
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.like,
      },
    ]));

    component.handleReaction('test', ActionType.like);
    fixture.detectChanges();

    expect(component.article.comments[0].likesCount).toBe(3);
  });

  it('should increase dislikes count with 1 when user applies dislike', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(of({
      error: false,
      message: 'Успешное действие!',
    }));
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.dislike,
      },
    ]));

    component.handleReaction('test', ActionType.dislike);
    fixture.detectChanges();

    expect(component.article.comments[0].dislikesCount).toBe(4);
  });

  it('should increase likes count and decrease dislikes count with 1 when user replaces dislike with like', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(of({
      error: false,
      message: 'Успешное действие!',
    }));
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.like,
      },
    ]));

    component.article.comments[0].action = ActionType.dislike;
    component.handleReaction('test', ActionType.like);
    fixture.detectChanges();

    expect(component.article.comments[0].likesCount).toBe(3);
    expect(component.article.comments[0].dislikesCount).toBe(2);
  });

  it('should increase dislikes count and decrease likes count with 1 when user replaces like with dislike', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(of({
      error: false,
      message: 'Успешное действие!',
    }));
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.dislike,
      },
    ]));

    component.article.comments[0].action = ActionType.like;
    component.handleReaction('test', ActionType.dislike);
    fixture.detectChanges();

    expect(component.article.comments[0].likesCount).toBe(1);
    expect(component.article.comments[0].dislikesCount).toBe(4);
  });

  it('should call snackbar.open() when user apply action', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(of({
      error: false,
      message: 'Успешное действие!',
    }));
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.like,
      },
    ]));

    component.article.comments[0].action = ActionType.violate;
    component.handleReaction('test', ActionType.violate);
    fixture.detectChanges();

    expect(component.snackBar.open).toHaveBeenCalled();
  });

  it('should call snackbar.open() with "Жалоба отправлена" when user apply violate action first time', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(of({
      error: false,
      message: 'Успешное действие!',
    }));
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.like,
      },
    ]));

    component.handleReaction('test', ActionType.violate);
    fixture.detectChanges();

    expect(component.snackBar.open).toHaveBeenCalledWith('Жалоба отправлена');
  });

  it('should call snackbar.open() with "Жалоба уже отправлена" when user apply violate action second time', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(
      throwError(() => ({
        error: true,
        message: 'Это действие уже применено к комментарию',
      })),
    );
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.like,
      },
    ]));

    component.handleReaction('test', ActionType.violate);
    fixture.detectChanges();

    expect(component.snackBar.open).toHaveBeenCalledWith('Жалоба уже отправлена');
  });

  it('should call snackbar.open() with "Ваш голос учтен" when user apply like action', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(of({
      error: false,
      message: 'Успешное действие!',
    }));
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.like,
      },
    ]));

    component.handleReaction('test', ActionType.like);
    fixture.detectChanges();

    expect(component.snackBar.open).toHaveBeenCalledWith('Ваш голос учтен');
  });

  it('should call snackbar.open() with "Ваш голос учтен" when user apply dislike action', () => {
    const commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    commentServiceSpy.applyAction.and.returnValue(of({
      error: false,
      message: 'Успешное действие!',
    }));
    commentServiceSpy.getUserActionsforComment.and.returnValue(of([
      {
        comment: 'test',
        action: ActionType.dislike,
      },
    ]));

    component.handleReaction('test', ActionType.dislike);
    fixture.detectChanges();

    expect(component.snackBar.open).toHaveBeenCalledWith('Ваш голос учтен');
  });
});
