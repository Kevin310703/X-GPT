"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import { updateProfileAction } from "@/app/data/actions/profile-actions";
import { SubmitButton } from "@/components/custom/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StrapiErrors } from "@/components/custom/strapi-errors";

interface ProfileFormProps {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  credits: number;
}

const INITIAL_STATE = {
  data: null,
  strapiErrors: null,
  message: null,
};

export function ProfileForm({
  data,
  className,
}: {
  readonly data: ProfileFormProps;
  readonly className?: string;
}) {
  const updateProfileWithId = updateProfileAction.bind(null, data.id);

  const [formState, formAction] = useActionState(
    updateProfileWithId,
    INITIAL_STATE
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
    <form className={cn("space-y-4", className)} action={formAction}>
      <p className="text-xl font-semibold text-[#1B2559] mb-4 border-b pb-2">
        Your Information
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

      <div className="space-y-4 grid ">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="username"
            name="username"
            placeholder="Username"
            defaultValue={data.username || ""}
            disabled
          />
          <Input
            id="email"
            name="email"
            placeholder="Email"
            defaultValue={data.email || ""}
            disabled
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            name="firstName"
            placeholder="First Name"
            defaultValue={data.firstName || ""}
          />
          <Input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            defaultValue={data.lastName || ""}
          />
        </div>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Write your bio here..."
          className="resize-none border rounded-md w-full h-[224px] p-2"
          defaultValue={data.bio || ""}
          required
        />
      </div>
      <div className="flex justify-end">
        <SubmitButton className="bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] hover:shadow-lg transition-colors" text="Update Profile" loadingText="Saving Profile" />
      </div>
      <StrapiErrors error={formState?.strapiErrors} />
    </form>
  );
}
