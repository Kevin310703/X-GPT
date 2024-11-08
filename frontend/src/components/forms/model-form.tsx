"use client";

import { useModel } from "@/components/provider/model-provider";

export function ModelForm() {
  const { selectedModel, setSelectedModel } = useModel();

  function handleFormSubmit(model: string) {
    console.log("Selected model:", model);
  }

  return (
    <div className="w-full max-w-[660px]">
      <form
        className="text-2xl font-bold text-[#1B2559] flex items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setSelectedModel(selectedValue);
            handleFormSubmit(selectedValue);
          }}
          className="text-lg font-bold bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 transition duration-150 ease-in-out"
        >
          <option value="T5">T5</option>
          <option value="Stable Diffusion">Stable Diffusion</option>
        </select>
      </form>
    </div>
  );
}
