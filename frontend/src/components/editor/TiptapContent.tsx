import DOMPurify from "dompurify";

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
        [&_h3]:text-lg
        [&_h3]:font-semibold
        [&_h3]:mt-6
        [&_h3]:mb-2

        [&_p]:leading-7
        [&_p]:mb-3

        [&_ul]:list-disc
        [&_ul]:pl-6

      [&_a]:text-blue-600
        [&_a]:underline
      "
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content ?? ""),
      }}
    />
  );
}
