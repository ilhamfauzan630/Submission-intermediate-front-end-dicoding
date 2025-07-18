import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';
import AddStoryPage from '../pages/story/add-story/add-story-page';
import StoryDetailPage from '../pages/story/story-detail/story-detail-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';

const routes = {
  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/home': () => checkAuthenticatedRoute(new HomePage()),
  '/about': () => checkAuthenticatedRoute(new AboutPage()),
  '/add-story': () => checkAuthenticatedRoute(new AddStoryPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),

  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
};

export default routes;
