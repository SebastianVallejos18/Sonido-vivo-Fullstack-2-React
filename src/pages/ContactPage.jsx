import ContactForm from "../components/organisms/ContactForm";
import AuthTemplate from "../components/templates/AuthTemplate";

function ContactPage() {
  return (
    <AuthTemplate content={<ContactForm />} />
  );
}

export default ContactPage;