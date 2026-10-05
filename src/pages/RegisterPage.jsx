import RegisterForm from "../components/organisms/RegisterForm";
import AuthTemplate from "../components/templates/AuthTemplate";

function RegisterPage() {
  return (
    <AuthTemplate content={<RegisterForm />} />
  );
}

export default RegisterPage;