type TiptapContentProps = {
  content?: string | null;
};

export default function TiptapContent({ content }: TiptapContentProps) {
  return (
    <div
      className="
        prose
        prose-sm
        max-w-none
        dark:prose-invert

        [&_table]:w-full
        [&_table]:border-collapse

        [&_th]:border
        [&_th]:p-2
        [&_th]:bg-muted
        [&_th]:font-semibold

        [&_td]:border
        [&_td]:p-2

        [&_img]:max-w-full
        [&_img]:rounded-lg
      "
      dangerouslySetInnerHTML={{
        __html: content ?? "",
      }}
    />
  );
}
