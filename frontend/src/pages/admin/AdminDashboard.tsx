import { Editor } from "@components/editor/Editor";
import { useState } from "react";

const AdminDashboard = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <p
        data-placeholder="Nhập mô tả sản phẩm..."
        className="is-editor-empty"
      ></p>
      <Editor value={value} onChange={setValue} />

      <div className="mt-4 flex gap-2">
        <button onClick={() => setValue("")}>Clear</button>

        <button onClick={() => setValue("<h2>Hello World</h2>")}>
          Set Content
        </button>
      </div>
    </>
  );
};

export default AdminDashboard;
