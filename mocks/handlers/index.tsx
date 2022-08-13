import { articleHandlers } from './article';
import { userHandlers } from './user';

export const handlers = [...userHandlers, ...articleHandlers];
