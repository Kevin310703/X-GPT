export function ZodErrors({ error }: { error: string[] | undefined }) {
  if (!error || error.length === 0) return null;

  return (
    <div className="text-red-500 text-xs italic py-2">
      {error[0]} {/* Chỉ hiển thị lỗi đầu tiên */}
    </div>
  );
}
