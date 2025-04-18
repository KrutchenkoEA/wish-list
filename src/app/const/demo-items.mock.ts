import { v4 as uuidv4 } from 'uuid';
import { Item } from '../models/item.model';

export const DEMO_ITEMS: Item[] = [
  {
    id: uuidv4(),
    title: 'Книга: Чистый код',
    description: 'Руководство по написанию читаемого кода',
    link: 'https://example.com/book',
    isActive: true,
  },
  {
    id: uuidv4(),
    title: 'Наушники Sony WH-1000XM4',
    description: 'Беспроводные наушники с шумоподавлением',
    link: 'https://example.com/headphones',
    isActive: true,
  },
  {
    id: uuidv4(),
    title: 'Смарт-часы Apple Watch SE',
    description: 'Умные часы с функциями фитнеса и уведомлений',
    link: 'https://techshop.com/watch-se',
    isActive: false,
  },
  {
    id: uuidv4(),
    title: 'Плед с подогревом',
    description: 'Мягкий и теплый плед для уютных вечеров',
    link: 'https://cosyshop.io/heated-blanket',
    isActive: true,
  },
  {
    id: uuidv4(),
    title: 'LEGO Creator Expert: Пиратский корабль',
    description: 'Набор конструктора для взрослых и детей',
    link: 'https://lego.com/pirates',
    isActive: true,
  },
  {
    id: uuidv4(),
    title: 'Термокружка Contigo',
    description: 'Термокружка, сохраняющая тепло до 7 часов',
    link: 'https://cups-and-more.shop/contigo',
    isActive: false,
  },
  {
    id: uuidv4(),
    title: 'Настольная игра Codenames',
    description: 'Веселая игра для компании от 4 человек',
    link: 'https://boardgames.store/codenames',
    isActive: true,
  },
  {
    id: uuidv4(),
    title: 'Кофемашина DeLonghi Magnifica',
    description: 'Автоматическая кофемашина для дома и офиса',
    link: 'https://caffe-life.com/delonghi-magnifica',
    isActive: true,
  },
  {
    id: uuidv4(),
    title: 'Подписка на Spotify Premium',
    description: 'Музыкальный стриминг без рекламы',
    link: 'https://spotify.com/premium',
    isActive: true,
  },
  {
    id: uuidv4(),
    title: 'Подписка на Notion Plus',
    description: 'Расширенный функционал для продуктивности',
    link: 'https://notion.so/plans',
    isActive: true,
  },
];
