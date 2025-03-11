import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations();
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {t("Home")}
    </section>
  );
}
