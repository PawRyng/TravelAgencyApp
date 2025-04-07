import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { getTranslations } from "next-intl/server";
import { getIsAdmin } from "@/controller/sessionHandle";
import LogoutButton from "./LogoutButton";

export const LoggedUser = async () => {
  const t = await getTranslations("Nav");
  const isAdmin = await getIsAdmin();
  return (
    <>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="start"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link href="/travels">{t("Travels")}</Link>
        </NavbarItem>
        {isAdmin && (
          <>
            <NavbarItem className="hidden sm:flex gap-2">
              <Link href="/users">{t("Users")}</Link>
            </NavbarItem>
          </>
        )}
        <NavbarItem className="hidden sm:flex gap-2">
          <LogoutButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <Link href="/travels">{t("Travels")}</Link>
          {isAdmin && <Link href="/users">{t("Users")}</Link>}
        </div>
      </NavbarMenu>
    </>
  );
};
