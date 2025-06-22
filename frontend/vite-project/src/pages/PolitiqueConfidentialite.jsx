import "./PolitiqueConfidentialite.css";


export default function PolitiqueConfidentialite() {
  return (
    <div className="politique-confidentialite">
      <h1 className="colored-title">
        <span className="titre-red">Politique </span>
        {"  "}
        <span className="titre-yellow">de</span>
        {"  "}
        <span className="titre-green">confiden</span>
        {""}
        <span className="titre-blue">tialité</span>
      </h1>{" "}
      <p>
        Conformément au RGPD, les données personnelles recueillies lors de
        l'inscription et de l'utilisation du site sont utilisées uniquement dans
        le cadre du fonctionnement du service et ne sont jamais transmises à des
        tiers sans consentement. Vous pouvez demander à tout moment la
        suppression ou la modification de vos données en nous contactant à
        l'adresse suivante : restosdesgosses@gosses.fr
      </p>
      <p>
        Nous collectons les données suivantes : nom, prénom, email, mot de passe,
        et éventuellement des informations supplémentaires que vous choisissez de
        fournir. Ces données sont stockées de manière sécurisée et ne sont
        accessibles qu'aux administrateurs du site.
      </p>
      <p>
        Pour toute question concernant notre politique de confidentialité, vous
        pouvez nous contacter à l'adresse ci-dessus. Nous nous engageons à
        protéger vos données et à respecter votre vie privée.
      </p>
      <p>
        En utilisant notre site, vous acceptez les termes de cette politique de
        confidentialité. Si vous n'êtes pas d'accord avec ces termes, veuillez
        ne pas utiliser notre site.
      </p>
    </div>
  );
}
