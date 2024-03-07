import { Params } from '@angular/router';
import { ActiveParamsType } from 'src/types/active-params.type';

export class ActiveParamsUtil {
  static processParams(params: Params): ActiveParamsType {
    const activeParams: ActiveParamsType = { page: 1 };

    if (Object.prototype.hasOwnProperty.call(params, 'categories')) {
      activeParams.categories = Array.isArray(params['categories'])
        ? params['categories']
        : [params['categories']];
    }

    if (Object.prototype.hasOwnProperty.call(params, 'page')) {
      activeParams.page = +params['page'];
    }

    return activeParams;
  }
}
