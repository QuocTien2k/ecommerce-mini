import { useState } from "react";
import { useAdminUsersQuery } from "../hooks/useAdminUsersQuery";
import { useUserStatusMutation } from "../hooks/useUserStatusMutation";

const AdminUserPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useAdminUsersQuery({
    page,
    limit: 6,
  });

  const { mutate: setStatus, isPending } = useUserStatusMutation();

  if (isLoading) return <div>Loading users...</div>;

  const users = data?.data ?? [];
  const meta = data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin Users</h2>

      {isFetching && <p>Refreshing...</p>}

      <table border={1} cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td>{user.email}</td>

              <td>{user.isActive ? "Active" : "Locked"}</td>

              <td>
                <button
                  disabled={isPending}
                  onClick={() =>
                    setStatus({
                      userId: user.id,
                      isActive: !user.isActive,
                    })
                  }
                >
                  {user.isActive ? "Lock" : "Unlock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: 16 }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 8px" }}>Page {page}</span>

        <button
          disabled={users.length === 0}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      <p>Total: {totalPages}</p>
    </div>
  );
};

export default AdminUserPage;
