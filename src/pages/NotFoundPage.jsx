import NotFoundMessage from "../components/organisms/NotFoundMessage";
import AuthTemplate from "../components/templates/AuthTemplate";

function NotFoundPage() {
  return (
    <AuthTemplate content={<NotFoundMessage />} />
  );
}

export default NotFoundPage;