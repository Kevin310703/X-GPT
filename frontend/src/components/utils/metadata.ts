// utils/metadata.ts
import { Metadata } from "next";

export const generatePageMetadata = (slug: string): Metadata => {
  const pageTitle = `Page Title for ${slug}`;
  const pageDescription = `This is the description for ${slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
  };
};
