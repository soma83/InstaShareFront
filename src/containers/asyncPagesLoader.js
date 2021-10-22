import Loadable from "react-loadable";
import Loading from "../components/Loading/Loading";

export const WelcomeAsync = Loadable({
  loader: () => import('../containers/welcome/Welcome'),
  loading: Loading
});

export const FileHandlerAsync = Loadable({
  loader: () => import('../containers/files/FileHandler'),
  loading: Loading
});

export const UsersHandlerAsync = Loadable({
  loader: () => import('../containers/user/UsersHandler'),
  loading: Loading
});

export const NotFoundAsync = Loadable({
  loader: () => import('../containers/notfound/NotFound'),
  loading: Loading
});
