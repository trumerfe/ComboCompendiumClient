import { useSelector } from "react-redux";
import "./Layout.scss";

const Layout = ({ children }) => {
  const theme = useSelector((state) => state.app.theme);

  return (
    <div className="layout" data-theme={theme}>
      <main className="layout__content">{children}</main>
    </div>
  );
};

export default Layout;
