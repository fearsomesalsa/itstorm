import {
  Component, HostListener, OnInit, OnDestroy, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from 'src/app/shared/services/category.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticlesWithFilterType } from 'src/types/articles-with-filter.type';
import { ArticleCardComponent } from 'src/app/shared/components/article-card/article-card.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryType } from 'src/types/category.type';
import { ActiveParamsUtil } from 'src/app/shared/utils/active-params.util';
import {
  Subscription,
  map, Observable, switchMap, tap,
} from 'rxjs';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, ArticleCardComponent, RouterModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit, OnDestroy {
  categoryService = inject(CategoryService);

  articleService = inject(ArticleService);

  snackBar = inject(MatSnackBar);

  router = inject(Router);

  activatedRoute = inject(ActivatedRoute);

  subscription: Subscription | null = null;

  categories: CategoryType[] = [];

  activeParams: ActiveParamsType = { page: 1 };

  articles$!: Observable<ArticlesWithFilterType>;

  pages: number[] = [];

  pagesAmount = 1;

  openFilter = false;

  ngOnInit(): void {
    this.activeParams = ActiveParamsUtil.processParams(this.activatedRoute.snapshot.queryParams);

    // чтобы каждый раз не запрашивать одни и те же категории при примении фильтра
    // я их запрашиваю 1 раз при создании компонента и отписываюсь
    // далее при изменении activatedRoute.queryParams существующие категории будут обрабатываться
    this.subscription = this.categoryService.getCategories()
      .pipe(
        // в запросе на категории использую snapshot активного роута, но еще не подписываюсь на него
        tap((categoriesResponse: CategoryType[]) => { this.categories = categoriesResponse; }),
        map(() => this.processCategories(this.activeParams)),
        // switchMap завершает предыдущую подписку, делает новую
        // остается 1 активная подписка - на параметры активного роута
        switchMap(() => this.activatedRoute.queryParams
          .pipe(
            map((params) => ActiveParamsUtil.processParams(params)),
          )),
      )
      .subscribe({
        next: (params) => {
          this.activeParams = params;
          this.processCategories(this.activeParams);
          // подписываюсь на this.articles$ через async pipe в шаблоне
          this.articles$ = this.articleService.getArticlesWithFilter(this.activeParams)
            .pipe(
              tap((articlesResponse: ArticlesWithFilterType) => {
                this.processPages(articlesResponse.pages);
              }),
            );
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this.snackBar.open(errorResponse.error.message);
          } else {
            this.snackBar.open('Возникла ошибка');
          }
          this.router.navigate(['/']);
        },
      });
  }

  filter(url: string, applied: boolean): void {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories
        .find((item: string) => item === url);
      if (existingCategoryInParams && !applied) {
        this.activeParams.categories = this.activeParams.categories
          .filter((item: string) => item !== url);
      } else if (!existingCategoryInParams && applied) {
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else if (applied) {
      this.activeParams.categories = [url];
    }
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], { queryParams: this.activeParams });
  }

  toggleFilter(): void {
    this.openFilter = !this.openFilter;
  }

  removeFromFilter(url: string): void {
    this.activeParams.categories = this.activeParams.categories?.filter((item) => item !== url);
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], { queryParams: this.activeParams });
  }

  processCategories = (activeParams: ActiveParamsType = { page: 1 }): void => {
    this.categories = this.categories.map((category: CategoryType) => {
      if (activeParams.categories !== undefined) {
        const existingCategory = activeParams.categories.find((item) => item === category.url);
        category.appliedToFilter = !!existingCategory;
      } else {
        category.appliedToFilter = false;
      }
      return category;
    });
  };

  processPages(pagesAmount: number): void {
    this.pagesAmount = pagesAmount;
    this.pages = [this.activeParams.page];
    for (let i = 1; i < 3; i += 1) {
      if ((this.activeParams.page + i) <= pagesAmount) {
        this.pages.push(this.activeParams.page + i);
        if (this.pages.length === 3) {
          return;
        }
      }
      if ((this.activeParams.page - i) > 0) {
        this.pages.unshift(this.activeParams.page - i);
        if (this.pages.length === 3) {
          return;
        }
      }
    }
  }

  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], { queryParams: this.activeParams });
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page -= 1;
      this.router.navigate(['/blog'], { queryParams: this.activeParams });
    }
  }

  openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pagesAmount) {
      this.activeParams.page += 1;
      this.router.navigate(['/blog'], { queryParams: this.activeParams });
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    // проверяю, кликнули ли мы на элемент, у которого в названии класса есть 'blog-filters-select'
    if (this.openFilter && (event.target as HTMLElement).className.indexOf('blog-filters-select') === -1) {
      this.openFilter = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
