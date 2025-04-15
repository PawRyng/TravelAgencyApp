"use client";

import { Input } from "@heroui/input";

interface EmailInputProps {
  errorMessage: string | null;
  register: any; 
  id: string; 
}

export default function EmailInput({
  errorMessage,
  register,
  id,
}: EmailInputProps) {

  return (
    <Input
      {...register(id)}
      id={id}
      labelPlacement="outside"
      type="text"
      errorMessage={errorMessage}
      isInvalid={!!errorMessage}
    />
  );
}
