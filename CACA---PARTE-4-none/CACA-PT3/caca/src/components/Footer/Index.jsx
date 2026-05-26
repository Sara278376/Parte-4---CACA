import './Footer.css';
import FormularioNewsletter from './Formulario_newsletter/Index';
import Contactos from './Contactos/Index';

export default function Footer() {
  return (
    <div id="full_footer">
      <FormularioNewsletter />
      <Contactos />
    </div>
  );
}