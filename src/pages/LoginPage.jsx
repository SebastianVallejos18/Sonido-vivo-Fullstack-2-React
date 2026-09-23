import LoginForm from "../components/organisms/LoginForm";
import AuthTemplate from "../components/template/AuthTemplate";

function LoginPage() {
  return (
    <AuthTemplate content={<LoginForm />} />
  );
}

export default LoginPage;