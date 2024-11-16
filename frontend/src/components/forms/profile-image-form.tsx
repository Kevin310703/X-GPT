"use client";
import React, { useEffect } from "react";
import { useActionState } from "react";

import { cn } from "@/lib/utils";

import { uploadProfileImageAction } from "@/app/data/actions/profile-actions";

import { SubmitButton } from "@/components/custom/submit-button";
import ImagePicker from "@/components/custom/image-picker";
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";

interface ProfileImageFormProps {
  id: string;
  url: string;
  alternativeText: string;
}

const initialState = {
  message: null,
  data: null,
  strapiErrors: null,
  zodErrors: null,
};

export function ProfileImageForm({
  data,
  className,
}: {
  data: Readonly<ProfileImageFormProps>;
  className?: string;
}) {
  const uploadProfileImageWithIdAction = uploadProfileImageAction.bind(
    null,
    data?.id
  );

  const [formState, formAction] = useActionState(
    uploadProfileImageWithIdAction,
    initialState
  );

  useEffect(() => {
    if (formState.message) {
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [formState.message]);

  return (
    <form className={cn("space-y-4 mb-16", className)} action={formAction}>
      <p className="text-xl font-semibold text-[#1B2559] mb-4 border-b pb-2">
        Avatar
      </p>

      {/* Hiển thị thông báo */}
      {formState.message && (
        <p
          className={cn(
            "text-sm p-2 rounded-md mb-4",
            formState.strapiErrors
              ? "text-red-700 bg-red-100 border border-red-300"
              : "text-green-700 bg-green-100 border border-green-300"
          )}
        >
          {formState.message}
        </p>
      )}

      <div className="">
        <ImagePicker
          id="image"
          name="image"
          label="Profile Image"
          defaultValue={data?.url || ""}
        />
        <ZodErrors error={formState.zodErrors?.image} />
        <StrapiErrors error={formState.strapiErrors} />
      </div>
      <div className="flex justify-end">
        <SubmitButton className="bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] hover:shadow-lg transition-colors" 
        text="Update Image" loadingText="Saving Image" />
      </div>
    </form>
  );
}