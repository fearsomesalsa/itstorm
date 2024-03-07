import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { ExtraOptions, RouterModule } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/auth/auth.interceptor';

// const scrollConfig: InMemoryScrollingOptions = {
// scrollPositionRestoration: 'enabled',
// anchorScrolling: 'enabled',
// };

const extraOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 127],
  // enableViewTransitions: true
};

// const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);
// const routerConfigurationFeature: RouterConfigurationFeature = withRouterConfig(extraOptions);

export const appConfig: ApplicationConfig = {
  providers: [
    // provideRouter(routes, inMemoryScrollingFeature, routerConfigurationFeature),
    importProvidersFrom([RouterModule.forRoot(routes, extraOptions)]),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
