"use client"
import { useState } from "react";
import { Input } from "@heroui/input";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons";
import { useTranslations } from "next-intl";

interface EmailInputProps {
  errorMessage: string | null;
  register: any; // Typowanie funkcji register z react-hook-form
  id: string; // ID input, które będzie powiązane z label
}

export default function PasswordInput({ errorMessage, register, id }: EmailInputProps) {
    const t = useTranslations("Login");
    const [isVisible, setIsVisible] = useState(false);
  
    const toggleVisibility = () => setIsVisible(!isVisible);
  
    return (
      <Input
        {...register("password")} // Powiązanie z react-hook-form
        id={id}
        className="max-w-xs"
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        label={t("Password")}
        placeholder={t("EnterYourPassword")}
        type={isVisible ? "text" : "password"}
        variant="bordered"
        errorMessage={errorMessage} // Obsługa komunikatu o błędzie
        isInvalid={!!errorMessage} // Ustawienie stanu niepoprawnego, jeśli jest błąd
      />
    );
  }