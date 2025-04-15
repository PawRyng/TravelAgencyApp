"use client"
import { OfferFormData } from "@/types";
import TextInput from "@/components/form/textInput";
import InputFiles from "@/components/form/imageInput";
import { Button } from "@heroui/button";
import { addTravel } from "./action";
import { useActionState, startTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import { redirect } from "next/navigation";


import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Tytuł jest wymagany"),
}).required();

export default  function AddTravel() {
  const t = useTranslations('Travel')
  const [state, action, isPending] = useActionState(addTravel, undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError
  } = useForm<OfferFormData>({
      resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<OfferFormData> = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    data.images?.map(image => formData.append('images', image))    
    startTransition(() => action(formData));
  };

  useEffect(() => {
    if (state && state.status) {
      if (state.status === 201) {
        redirect(`/travels/${state.travelId}`);
      } 
    }
  }, [state]);
  
  return (
    <section className="flex flex-col">
        <form 
        onSubmit={handleSubmit(onSubmit)}
        >
          <input type="text" />
        <TextInput 
          id="title"
          register={register}
          errorMessage={errors.title?.message || null}
        />
          <InputFiles
          setValue={setValue}
          />

        <Button
          isLoading={isPending}
          className="w-48 mr-0 ml-auto"
          type="submit"
        >
          {!isPending ? t("add_travel") : t("adding_travel")}
        </Button>
        </form>
    </section>
  );
}