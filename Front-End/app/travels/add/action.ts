"use server";

import { getQueryWithAuth } from "@/controller/axios";
import type { AddTravelRespone } from "@/types/travel";

export async function addTravel(
  state: AddTravelRespone | undefined,
  formData: FormData
): Promise<AddTravelRespone> {
  try {
    const axios = await getQueryWithAuth();
    const respone = await axios.post("/travels/add", formData);

    return { status: respone.status, travelId: respone.data };
  } catch (e) {
    console.log(e as Error);
    return { status: 500 };
  }
}
