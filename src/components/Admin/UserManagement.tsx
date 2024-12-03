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
import styles from './UserManagement.module.css';

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
        <div id="userManagement" className="p-4 space-y-2 overflow-hidden">
            {/* Table */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                {/* Search Input */}
                <button
                    onClick={() => {
                        setSelectedUser({ id: 0, name: "", role: "", status: "" }); // Default values for a new user
                        setIsModalOpen(true);
                    }}
                    className={`${styles.btn} ${styles['btn-primary']}`}
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
                        className={`${styles['input-txt']} dark:bg-gray-800 dark:text-gray-200`}
                        aria-label="Search users by name"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className={`${styles['input-txt-inline-icon']} dark:hover:text-gray-300`}
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
                        className={`${styles.dropdown} dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700`}
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <table className={styles.table + ' dark:bg-gray-800 dark:text-white'} aria-labelledby="user-management-table">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className={`${styles['table-header']}`}>Name</th>
                        <th className={`${styles['table-header']}`}>Role</th>
                        <th className={`${styles['table-header']}`}>Status</th>
                        <th className={`${styles['table-header-center']}`}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map((user) => (
                        <tr key={user.id} className={`${styles['table-row']} dark:border-gray-700`}>
                            <td className={`${styles['table-cell']}`}>{user.name}</td>
                            <td className={`${styles['table-cell']}`}>{user.role}</td>
                            <td className={`${styles['table-cell']}`}>{user.status}</td>
                            <td className={`${styles['table-cell-center']}`}>
                                <button
                                    aria-label="edit user"
                                    onClick={() => handleEdit(user)}
                                    className={`${styles['icon-btn-primary']}`}
                                >
                                    <PencilSquareIcon className="h-5 w-5" />
                                </button>
                                <button
                                    aria-label="delete user"
                                    onClick={() => handleDelete(user)}
                                    className={`${styles['icon-btn-danger']}`}
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className={styles['pagination-container']} aria-labelledby="Pagination for User Management Table">
                <button
                    className={`${styles['pagination-btn']} ${currentPage === 1
                        ? styles['pagination-btn-disabled']
                        : styles['pagination-btn-active']
                        }`}
                    disabled={currentPage === 1}
                    onClick={handlePrevPage}
                    aria-label="previous page"
                >
                    Previous
                </button>
                <span className="text-gray-700 font-medium dark:text-white" aria-labelledby="Page number">
                    Page <span className="font-bold">{currentPage}</span> of{" "}
                    <span className="font-bold">{totalPages}</span>
                </span>
                <button
                    className={`${styles['pagination-btn']} ${currentPage === totalPages
                        ? styles['pagination-btn-disabled'] : styles['pagination-btn-active']
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
                    <label className={`${styles['modal-label']} dark:text-gray-300`}>
                        Name
                        <input
                            type="text"
                            value={selectedUser?.name || ""}
                            onChange={(e) =>
                                setSelectedUser((prev: any) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="Enter Full Name"
                            aria-label="Name"
                            className={`${styles['modal-input']} dark:bg-gray-700`}
                            required
                        />
                    </label>
                    <label className={`${styles['modal-label']} dark:text-gray-300`}>
                        Role
                        <select
                            value={selectedUser?.role || ""}
                            onChange={(e) =>
                                setSelectedUser((prev: any) => ({ ...prev, role: e.target.value }))
                            }
                            className={`${styles['modal-select']} dark:bg-gray-700`}
                            required
                            aria-label="role selection"
                        >
                            <option value="">Select Role</option>
                            <option value="Student">Student</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </label>
                    <label className={`${styles['modal-label']} dark:text-gray-300`}>
                        Status
                        <select
                            value={selectedUser?.status || ""}
                            onChange={(e) =>
                                setSelectedUser((prev: any) => ({ ...prev, status: e.target.value }))
                            }
                            className={`${styles['modal-select']} dark:bg-gray-700`}
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
                        className={`${styles['modal-button']}`}
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
                <div className={`${styles['modal-body']}dark:text-gray-300`}>Are you sure you want to delete {selectedUser?.name}?</div>
                <div className={`${styles['modal-footer']}`}>
                    <button
                        className={`${styles['modal-footer-btn-cancel']} dark:bg-gray-700`}
                        onClick={() => setIsDeleteOpen(false)}
                        aria-label="Canceling delete user"
                    >
                        Cancel
                    </button>
                    <button
                        className={`${styles['modal-footer-btn-danger']}`}
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
