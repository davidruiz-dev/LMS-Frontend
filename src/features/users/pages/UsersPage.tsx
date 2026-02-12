import DataTableUsers from "@/features/users/components/data-table-users"

const UsersPage = () => {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">Lista de todos los usuarios registrados.</p>
      </div>
      <DataTableUsers />
    </div>
  )
}

export default UsersPage