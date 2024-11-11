// components/ClientWrapper.tsx
"use client";

import { ReactNode } from "react";
import { useModel } from "@/components/provider/model-provider";

interface ClientWrapperProps {
  children: (props: { selectedModel: string }) => ReactNode;
}

export const ClientWrapper = ({ children }: ClientWrapperProps) => {
  const { selectedModel } = useModel();
  return <>{children({ selectedModel })}</>;
};
