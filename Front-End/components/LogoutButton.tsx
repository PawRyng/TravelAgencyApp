"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LogoutButton() {
  const router = useRouter();
  const t = useTranslations("Nav");

  const handleLogout = async () => {
    // Wykonaj zapytanie do API logout
    const response = await axios.get("/api/logout");

    if (response.status === 200) {
      window.location.href = "/";
    }
  };

  return (
    <Link href="#" onClick={handleLogout}>
      {t("logout")}
    </Link>
  );
}
