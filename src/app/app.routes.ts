import { Routes } from '@angular/router';
import { MainComponent } from './views/main/main.component';
import { LoginComponent } from './views/user/login/login.component';
import { SingupComponent } from './views/user/singup/singup.component';
import { authForwardGuard } from './core/auth/auth-forward.guard';
import { PolicyComponent } from './views/policy/policy.component';
import { BlogComponent } from './views/articles/blog/blog.component';
import { ArticleComponent } from './views/articles/article/article.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      { path: '', component: MainComponent },
      { path: 'login', component: LoginComponent, canActivate: [authForwardGuard] },
      { path: 'signup', component: SingupComponent, canActivate: [authForwardGuard] },
      { path: 'blog', component: BlogComponent },
      { path: 'article/:url', component: ArticleComponent },
    ],
  },
  { path: 'policy', component: PolicyComponent },
];
