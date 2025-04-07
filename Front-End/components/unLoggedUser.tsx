
import {
    Navbar as HeroUINavbar,
    NavbarContent,
    NavbarMenu,
    NavbarItem,
  } from "@heroui/navbar";
  import { Link } from "@heroui/link";
import { getTranslations } from "next-intl/server";
  
  export const UnLoggedUser = async () => {
    const t = await getTranslations('Nav');
    return (
       <>
            <NavbarContent
              className="hidden sm:flex basis-1/5 sm:basis-full"
              justify="start"
            >
              <NavbarItem className="hidden sm:flex gap-2">
                  <Link href="/login">{t('Login')}</Link>
              </NavbarItem>
            </NavbarContent>
      
            <NavbarMenu>
              <div className="mx-4 mt-2 flex flex-col gap-2">
                <Link href="/login">{t('Login')}</Link>
              </div>
            </NavbarMenu>
       </>  
    );
  };
  