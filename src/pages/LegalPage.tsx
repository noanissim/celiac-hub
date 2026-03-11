import { Helmet } from "react-helmet-async";

const LegalPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Helmet>
        <title>Legal Disclaimer — CeliacHub</title>
        <meta name="description" content="Legal disclaimer and terms of use for CeliacHub academic project." />
      </Helmet>

      <h1 className="mb-8 text-3xl font-bold text-foreground">Legal Disclaimer / הצהרה משפטית</h1>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">Academic &amp; Educational Purpose</h2>
          <p>
            CeliacHub was created by Noa Nissim as a student portfolio project and Proof of Concept (POC) for
            educational purposes only. This application is <strong>not a commercial service</strong>. It is an
            academic demonstration built to showcase full-stack development skills.
          </p>
          <p className="mt-2 text-sm" dir="rtl">
            CeliacHub נוצר על ידי נועה ניסים כפרויקט אקדמי ותיק עבודות בלבד. האפליקציה אינה שירות מסחרי.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">Copyright &amp; Fair Use</h2>
          <p>
            All recipes and images are the property of their respective owners (e.g., Sapira Sayag, Oogio.net,
            Essy Roz, etc.). They are used here under "Fair Use" for educational and non-commercial demonstration
            only. If you are a content owner and wish for your content to be removed, please contact me immediately.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">No Medical Advice</h2>
          <p>
            The content on CeliacHub is for <strong>informational purposes only</strong>. It is NOT medical advice.
            Always consult with a healthcare professional before making dietary changes.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">Accuracy of Information</h2>
          <p>
            Restaurant menus, gluten-free options, and opening hours are subject to change. We do not guarantee the
            accuracy of any third-party data provided in this app.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">Limitation of Liability</h2>
          <p>
            The developer shall not be held liable for any damages, health issues, or misinformation resulting from
            the use of this application.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalPage;
