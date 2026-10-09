import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Avatar } from "@mui/material";

import { useAlert } from "../../context/AlertContext";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstanat";
import "./ProductList.css";

function UserList() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, users, loading } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted, message } = useSelector(
    (state) => state.profileData
  );

  const [toggle, setToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const toggleHandler = () => {
    setToggle((prev) => !prev);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success(message || "User Deleted Successfully");
      dispatch({ type: DELETE_USER_RESET });
      dispatch(getAllUsers());
    }
    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, isDeleted, message]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toggle]);

  const deleteUserHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user account?")) {
      dispatch(deleteUser(id));
    }
  };

  const columns = [
    {
      field: "user",
      headerName: "Patron / Name",
      minWidth: 200,
      flex: 0.8,
      headerClassName: "column-header",
      renderCell: (params) => {
        const name = params.row?.name || "Unknown";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Avatar
              style={{
                width: 32,
                height: 32,
                fontSize: "0.85rem",
                backgroundColor: "#09090b",
                color: "#c5a880",
                fontWeight: "700",
              }}
            >
              {name[0]?.toUpperCase() || "U"}
            </Avatar>
            <span style={{ fontWeight: "600", color: "#09090b" }}>{name}</span>
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email Address",
      minWidth: 220,
      flex: 0.9,
      headerClassName: "column-header hide-on-mobile",
      renderCell: (params) => {
        return (
          <span style={{ color: "#52525b", fontSize: "0.88rem" }}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: "role",
      headerName: "Role & Privilege",
      minWidth: 150,
      flex: 0.6,
      headerClassName: "column-header",
      renderCell: (params) => {
        const isAdmin = params.value === "admin";
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.25rem 0.65rem",
              borderRadius: "9999px",
              fontSize: "0.76rem",
              fontWeight: "700",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              backgroundColor: isAdmin ? "rgba(5, 150, 105, 0.12)" : "rgba(113, 113, 122, 0.12)",
              color: isAdmin ? "#059669" : "#52525b",
              border: `1px solid ${isAdmin ? "rgba(5, 150, 105, 0.25)" : "rgba(113, 113, 122, 0.2)"}`,
            }}
          >
            {isAdmin ? (
              <ShieldOutlinedIcon style={{ fontSize: "0.85rem" }} />
            ) : (
              <PersonOutlineIcon style={{ fontSize: "0.85rem" }} />
            )}
            <span>{isAdmin ? "Admin" : "Patron"}</span>
          </span>
        );
      },
    },
    {
      field: "id",
      headerName: "User ID",
      minWidth: 170,
      flex: 0.7,
      headerClassName: "column-header hide-on-mobile",
      renderCell: (params) => {
        return (
          <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#71717a" }}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 110,
      flex: 0.4,
      headerClassName: "column-header1",
      sortable: false,
      renderCell: (params) => {
        const userId = params.row?.id || params.id;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link
              to={`/admin/user/${userId}`}
              className="table-action-btn edit"
              title="Edit User Role"
            >
              <EditIcon fontSize="small" />
            </Link>

            <button
              type="button"
              className="table-action-btn delete"
              onClick={() => deleteUserHandler(userId)}
              title="Delete User Account"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        );
      },
    },
  ];

  // Filtering users
  const filteredUsers = (users || []).filter((item) => {
    const matchesSearch =
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "all" || item.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const rows = filteredUsers.map((item) => ({
    id: item._id,
    role: item.role,
    email: item.email,
    name: item.name,
  }));

  return (
    <>
      <MetaData title="Users Directory - Admin" />

      <div className="product-list" style={{ marginTop: 0 }}>
        <div className={!toggle ? "listSidebar" : "toggleBox"}>
          <Sidebar />
        </div>

        <div className="list-table">
          <Navbar toggleHandler={toggleHandler} />

          <div className="productListContainer">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1.25rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.85rem",
                    fontWeight: "700",
                    color: "#09090b",
                    margin: 0,
                  }}
                >
                  Patrons & Accounts
                </h1>
                <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.84rem", color: "#71717a" }}>
                  Manage boutique registered customers, privileges, and administrator credentials.
                </p>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "9999px",
                  background: "#f4f4f5",
                  fontSize: "0.78rem",
                  fontWeight: "700",
                  color: "#3f3f46",
                }}
              >
                <PeopleAltOutlinedIcon style={{ fontSize: "1rem" }} />
                <span>{users ? users.length : 0} Total Registered</span>
              </div>
            </div>

            {/* Search and Filter Row */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: "220px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#fafafa",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  padding: "0.55rem 0.85rem",
                }}
              >
                <SearchIcon style={{ color: "#a1a1aa", fontSize: "1.15rem" }} />
                <input
                  type="text"
                  placeholder="Filter patrons by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.88rem",
                    color: "#18181b",
                  }}
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  padding: "0.6rem 0.95rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  background: "#fafafa",
                  fontSize: "0.85rem",
                  color: "#18181b",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="user">Patron Customers</option>
              </select>
            </div>

            {loading ? (
              <Loader />
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableRowSelectionOnClick
                className="productListTable"
                autoHeight
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserList;
