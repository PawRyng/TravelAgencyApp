"use client"
import PasswordInput from "@/components/login/passwordInput";
import EmailInput from "@/components/login/loginInput";
import { startTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useActionState } from "react";
import { login } from "./actions";
import type { LoginFormData } from "@/types";
import { redirect } from "next/navigation";


const validationSchema = Yup.object({
  email: Yup.string()
    .email("Nieprawidłowy email")
    .required("Email jest wymagany"),
  password: Yup.string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .matches(/[A-Z]/, "Hasło musi zawierać co najmniej jedną dużą literę")
    .matches(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
    .matches(/[@$!%*?&]/, "Hasło musi zawierać co najmniej jeden znak specjalny")
    .required("Hasło jest wymagane"),
}).required();

export default function MyForm() {

  const [state, action, isPending] = useActionState(login, false);

  const t = useTranslations('Login');
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema)
  });
  
  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    startTransition(() => {
      action(data);
    });
  };

  useEffect(()=>{
    if(state && state.status){
      if(state.status === 200){
        redirect('/');
      }
      else if(state.status === 404){
        setError('email', {type:"validate", message: state.message})
      }
      else if(state.status === 401){
        setError('password', {type:"validate", message: state.message})
      }
    }
  }, [state])


  return (
    <section  className="flex items-center justify-center">
      <form className="flex flex-col gap-2 w-80" onSubmit={handleSubmit(onSubmit)}>
        {/* Pole e-mail */}
        <EmailInput
          id="email"
          register={register}
          errorMessage={errors.email?.message || null}
        />

        {/* Pole hasła */}
        <PasswordInput
          id="password"
          register={register}
          errorMessage={errors.password?.message || null}
        />

        <Button isLoading={isPending} className="w-48 mr-0 ml-auto" type="submit">{!isPending ? t('Login') : t('Logging')}</Button>
      </form>
    </section>
  );
}
