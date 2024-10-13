import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "./contexts/AdminContext";
import { useUserContext } from "./contexts/UserContext";

const SettingsForm = () => {
  const navigate = useNavigate();
  const { getAdmin, patchAdmin } = useAdmin();
  const { userDatabase } = useUserContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Store the original name and email for comparison
  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const userData = await getAdmin(); // Get user data from server
        setName(userData.name);
        setEmail(userData.email);
        setOriginalName(userData.name);
        setOriginalEmail(userData.email);
      } catch (err) {
        console.error("Error fetching admin settings", err);
      }
    };
    fetchUserSettings();
  }, [getAdmin]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmNewPassword":
        setConfirmNewPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Check for existing names and emails, excluding the original name and email
    const nameExists = userDatabase.some(
      (user) => user.name === name && user.name !== originalName
    );
    const emailExists = userDatabase.some(
      (user) => user.email === email && user.email !== originalEmail
    );

    const validationErrors = {
      nameRequired: !name,
      emailRequired: !email,
      invalidEmailFormat: !emailFormatRegex.test(email),
      currentPasswordRequired: !currentPassword,
      newPasswordRequired: !newPassword,
      confirmNewPasswordRequired: !confirmNewPassword,
      confirmNewPasswordMismatch: confirmNewPassword !== newPassword,
      nameTaken: nameExists,
      emailTaken: emailExists,
    };

    switch (true) {
      case validationErrors.nameRequired:
        setError("Name cannot be empty!");
        break;
      case validationErrors.emailRequired:
        setError("Email must not be empty!");
        break;
      case validationErrors.invalidEmailFormat:
        setError("Email format is invalid");
        break;
      case validationErrors.currentPasswordRequired:
        setError("Current password is required");
        break;
      case validationErrors.newPasswordRequired:
        setError("New password is required");
        break;
      case validationErrors.confirmNewPasswordRequired:
        setError("Confirm new password is required");
        break;
      case validationErrors.confirmNewPasswordMismatch:
        setError("Confirm new password does not match new password");
        break;
      case validationErrors.nameTaken:
        setError("Name is already taken");
        break;
      case validationErrors.emailTaken:
        setError("Email is already taken");
        break;
      default:
        const updatedUser = {
          name,
          email,
          currentPassword,
          newPassword,
        };

        try {
          const response = await patchAdmin(updatedUser); // Update the user settings and get the response

          // Store the new token in localStorage
          if (response.token) {
            localStorage.setItem("authToken", response.token);
            window.dispatchEvent(new Event("storage")); // Dispatch storage event to notify UserProfile (CROSS TAB NAME MOUNTING)
            console.log("token", localStorage.getItem("authToken"));
          }

          alert("Settings updated successfully!");
          navigate("/profile"); // Navigate to profile on success
        } catch (error) {
          setError("Error updating settings: " + error.message);
        }
        break;
    }
  };

  return (
    <section className="flex-grow sm:flex sm:flex-col sm:grow-0 sm:w-5/6">
      <h1 className="pl-5 sm:text-left sm:p-0 text-lg sm:text-xl tracking-wide font-bold text-zinc-500 sm:mb-2 sm:ml-0">
        Settings
      </h1>
      <div className="flex sm:flex-grow justify-center rounded-md bg-white shadow-md">
        <form
          className="flex max-w-xs flex-grow flex-col gap-4 py-10 text-sm sm:max-w-5/6 sm:px-10 sm:text-base"
          onSubmit={handleSubmit}
        >
          <div>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Name"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Email"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              placeholder="Current Password"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              placeholder="New Password"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              placeholder="Confirm New Password"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex flex-row gap-4 ">
            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600"
            >
              Update Settings
            </button>
            <button
              type="button"
              className="w-full rounded bg-red-500 p-2 font-semibold text-white hover:bg-red-600"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SettingsForm;
