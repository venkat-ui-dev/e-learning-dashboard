"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    setUsers,
    addUser,
    updateUser,
    deleteUser,
} from "@/store/features/userManagementSlice"; // Redux slice
import Modal from "@/components/Common/Modal";
import { PencilSquareIcon, TrashIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

interface Users {
    id: number;
    name: string;
    role: string;
    status: string;
}

interface UserManagementProps {
    initialUserData: Users[];
}

export default function UserManagement({ initialUserData }: UserManagementProps) {
    const dispatch = useDispatch();
    const { users } = useSelector((state: RootState) => state.userManagement);

    const [selectedUser, setSelectedUser] = useState<Users | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [filteredUsers, setFilteredUsers] = useState<Users[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Initialize Redux state with SSR data
    useEffect(() => {
        if (initialUserData) {
            dispatch(setUsers(initialUserData));
        }
    }, [initialUserData, dispatch]);

    // Filter and search logic
    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedRole === "all" || user.role.toLowerCase() === selectedRole)
        );
        setFilteredUsers(filtered);
    }, [users, searchTerm, selectedRole]);

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleAddUser = async () => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedUser),
            });
            const newUser = await response.json();
            dispatch(addUser(newUser));
            setIsModalOpen(false);
            toast.success("User added successfully");
        } catch (error) {
            console.log(error)
            toast.error("Failed to add user");
        }
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/users`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedUser),
            });
            const updatedUser = await response.json();
            dispatch(updateUser(updatedUser));
            setIsModalOpen(false);
            toast.success("User updated successfully");
        } catch (error) {
            console.log(error)
            toast.error("Failed to update user");
        }
    };

    const handleEdit = (user: Users) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (user: Users) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/users?id=${selectedUser?.id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                dispatch(deleteUser(selectedUser!.id));
                toast.success("User deleted successfully");
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            console.log(error)
            toast.error("Error deleting user");
        }
        setIsDeleteOpen(false);
    };

    return (
        <div id="userManagement">
            <h2 className="text-lg font-bold" id="user-management-heading">User Management</h2>
            {/* Table */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                {/* Search Input */}
                <button
                    onClick={() => {
                        setSelectedUser({ id: 0, name: "", role: "", status: "" }); // Default values for a new user
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-700 transform hover:scale-105 transition-all"
                    aria-label="Add new user"
                >
                    <UserIcon className="h-4 w-4" />
                    Add User
                </button>

                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full dark:bg-gray-800 dark:text-gray-200"
                        aria-label="Search users by name"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Clear search"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Role Filter Dropdown */}
                <div>
                    <select
                        aria-label="Filter by role"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md" aria-labelledby="user-management-table">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map((user) => (
                        <tr key={user.id} className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.role}</td>
                            <td className="px-4 py-2">{user.status}</td>
                            <td className="px-4 py-2 text-center">
                                <button
                                    aria-label="edit user"
                                    onClick={() => handleEdit(user)}
                                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    <PencilSquareIcon className="h-5 w-5" />
                                </button>
                                <button
                                    aria-label="delete user"
                                    onClick={() => handleDelete(user)}
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 space-x-4" aria-labelledby="Pagination for User Management Table">
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg shadow ${currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    disabled={currentPage === 1}
                    onClick={handlePrevPage}
                    aria-label="previous page"
                >
                    Previous
                </button>
                <span className="text-gray-700 font-medium" aria-labelledby="Page number">
                    Page <span className="font-bold">{currentPage}</span> of{" "}
                    <span className="font-bold">{totalPages}</span>
                </span>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg shadow ${currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    aria-label="next Page"
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                >
                    Next
                </button>
            </div>


            {/* Add Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setSelectedUser(null);
                    setIsModalOpen(false);
                }}
                title={selectedUser?.id ? "Edit User" : "Add User"} // Dynamic title
                aria-labelledby="Add or Edit User"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        selectedUser?.id ? handleSaveChanges() : handleAddUser();
                    }}
                >
                    <label className="block mb-2">
                        <span className="text-gray-700 dark:text-gray-300">Name</span>
                        <input
                            type="text"
                            value={selectedUser?.name || ""}
                            onChange={(e) =>
                                setSelectedUser((prev: any) => ({ ...prev, name: e.target.value }))
                            }
                            aria-label="Name"
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border rounded-md"
                            required
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700 dark:text-gray-300">Role</span>
                        <select
                            value={selectedUser?.role || ""}
                            onChange={(e) =>
                                setSelectedUser((prev: any) => ({ ...prev, role: e.target.value }))
                            }
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border rounded-md"
                            required
                            aria-label="role selection"
                        >
                            <option value="">Select Role</option>
                            <option value="Student">Student</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700 dark:text-gray-300">Status</span>
                        <select
                            value={selectedUser?.status || ""}
                            onChange={(e) =>
                                setSelectedUser((prev: any) => ({ ...prev, status: e.target.value }))
                            }
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border rounded-md"
                            required
                            aria-label="users status"
                        >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        aria-label="Add or Edit User"
                    >
                        {selectedUser ? "Save Changes" : "Add User"}
                    </button>
                </form>
            </Modal>


            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title="Confirm Delete"
                aria-labelledby="delete user"
            >
                <p>Are you sure you want to delete {selectedUser?.name}?</p>
                <div className="flex justify-end mt-4 space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                        onClick={() => setIsDeleteOpen(false)}
                        aria-label="Canceling delete user"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={confirmDelete}
                        aria-label="delete user"
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}
