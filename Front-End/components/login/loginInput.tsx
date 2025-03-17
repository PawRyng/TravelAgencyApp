"use client"

import { Input } from "@heroui/input";
import { useTranslations } from "next-intl";

interface EmailInputProps {
  errorMessage: string | null;
  register: any; // Typowanie funkcji register z react-hook-form
  id: string; // ID input, które będzie powiązane z label
}

export default function EmailInput({ errorMessage, register, id }: EmailInputProps) {
  const t = useTranslations("Login");

  return (
    <div>
      <Input
        {...register("email")}
        id={id}
        className="max-w-xs"
        type="email"
        variant="bordered"
        errorMessage={errorMessage} 
        isInvalid={!!errorMessage} 
        placeholder={t('E-Mail')}
        label={t('E-Mail')}
      />
    </div>
  );
}
