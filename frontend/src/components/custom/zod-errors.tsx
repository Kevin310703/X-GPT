// export function ZodErrors({ error }: { error: string[] }) {
//     if (!error) return null;
//     return error.map((err: string, index: number) => (
//       <div key={index} className="text-red-500 text-xs italic mt-1 py-2">
//         {err[0]}
//       </div>
//     ));
//   }

export function ZodErrors({ error }: { error: string[] | undefined }) {
  if (!error || error.length === 0) return null;

  return (
    <div className="text-red-500 text-xs italic py-2">
      {error[0]} {/* Chỉ hiển thị lỗi đầu tiên */}
    </div>
  );
}
