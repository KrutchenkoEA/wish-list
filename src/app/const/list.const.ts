import {ICollection} from '../models/collection.model';

export const ADMIN_COLLECTION: ICollection = {route: 'admin', name: 'Админ', isVisible: true};
export const COMMON_COLLECTION: ICollection = {route: 'common', name: 'Лист желаний', isVisible: true};
export const COLLECTION_LIST: ICollection[] = [
  {route: 'ev', name: 'Женя', isVisible: false},
  {route: 'po', name: 'Поля', isVisible: false}
];
