// src/components/users/UserList.tsx
import UserRow from "./UserRows";

const users = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-06-15 10:30',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'Agent',
    status: 'Active',
    lastLogin: '2023-06-14 15:22',
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'Client',
    status: 'Pending',
    lastLogin: '2023-06-10 09:45',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'Agent',
    status: 'Active',
    lastLogin: '2023-06-15 14:12',
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'Client',
    status: 'Inactive',
    lastLogin: '2023-05-22 11:30',
  },
  {
    id: 6,
    name: 'Jessica Taylor',
    email: 'jessica@example.com',
    role: 'Agent',
    status: 'Active',
    lastLogin: '2023-06-14 16:45',
  },
];

export default function UserList() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Login
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map(user => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}