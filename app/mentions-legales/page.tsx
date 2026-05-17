export default function MentionsLegales() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-foreground">
      <h1 className="text-3xl font-bold mb-10">Mentions légales</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Éditeur du site</h2>
        <p className="text-muted leading-relaxed">
          [Nom et prénom ou raison sociale]<br />
          [Adresse postale]<br />
          [Numéro SIRET / SIREN]<br />
          Email : [email de contact]<br />
          Téléphone : [numéro]
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Hébergeur</h2>
        <p className="text-muted leading-relaxed">
          Vercel Inc.<br />
          440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
          <a href="https://vercel.com" className="underline hover:text-foreground transition">vercel.com</a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Propriété intellectuelle</h2>
        <p className="text-muted leading-relaxed">
          L&apos;ensemble des contenus présents sur ce site (textes, images, vidéos) est protégé par le droit
          d&apos;auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite de
          l&apos;éditeur.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Données personnelles</h2>
        <p className="text-muted leading-relaxed">
          Les données collectées via les formulaires de ce site (prénom, nom, adresse email) sont utilisées
          uniquement dans le cadre de la relation commerciale et ne sont pas transmises à des tiers. Conformément
          au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données en
          contactant : [email de contact].
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Cookies</h2>
        <p className="text-muted leading-relaxed">
          Ce site utilise des cookies techniques nécessaires à son fonctionnement ainsi que des cookies de
          mesure d&apos;audience (Facebook Pixel). En naviguant sur ce site, vous acceptez l&apos;utilisation de ces
          cookies. Vous pouvez les désactiver dans les paramètres de votre navigateur.
        </p>
      </section>

      <p className="text-sm text-muted mt-12">
        Ces mentions légales sont fournies à titre indicatif et doivent être complétées et validées par un
        professionnel du droit.
      </p>
    </main>
  );
}
