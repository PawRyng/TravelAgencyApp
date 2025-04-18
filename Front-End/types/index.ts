import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface LoginFormData {
  email: string;
  password: string;
}

export interface OfferFormData {
  title: string;
  images?: File[];
}
