export function getCategoryContextLabel(params: {
  level: number;
  parentName: string | null;
}) {
  const { level, parentName } = params;

  if (level === 1) {
    return {
      type: "ROOT" as const,
      label: "Đây là danh mục cấp 1 (danh mục cha)",
      description: "Danh mục này không thuộc bất kỳ danh mục cha nào.",
    };
  }

  return {
    type: "CHILD" as const,
    label: `Đang sửa danh mục con của: ${parentName ?? "Không xác định"}`,
    description: `Danh mục hiện thuộc cấp ${level}.`,
  };
}
