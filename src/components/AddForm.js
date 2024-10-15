import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./contexts/UserContext";

const AddForm = () => {
  const { addUser, userDatabase } = useUserContext(); // Use addUser method from context
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Check for existing names and emails
    const nameExists = userDatabase.some((user) => user.name === name);
    const emailExists = userDatabase.some((user) => user.email === email);

    const validationErrors = {
      nameRequired: !name,
      emailRequired: !email,
      invalidEmailFormat: !emailFormatRegex.test(email),
      passwordRequired: !password,
      confirmPasswordRequired: !confirmPassword,
      confirmPasswordMismatch: confirmPassword !== password,
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
      case validationErrors.passwordRequired:
        setError("Password is required");
        break;
      case validationErrors.confirmPasswordRequired:
        setError("Confirm password is required");
        break;
      case validationErrors.confirmPasswordMismatch:
        setError("Confirm password does not match password");
        break;
      case validationErrors.nameTaken:
        setError("Name is already taken");
        break;
      case validationErrors.emailTaken:
        setError("Email is already taken");
        break;
      default:
        const newUser = {
          name,
          email,
          password,
        };

        // Add user using the context's addUser method
        try {
          await addUser(newUser); // Call the addUser method from context
          alert("New user added successfully!");
          navigate("/users"); // Navigate to users page on success
        } catch (error) {
          setError("Error adding user: " + error.message);
        }

        // Reset form fields
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        break;
    }
  };

  return (
    <section className="flex-grow sm:flex sm:flex-col sm:grow-0 sm:w-5/6">
      <h1 className="pl-5 sm:text-left sm:p-0 text-lg sm:text-xl tracking-wide font-bold text-zinc-500 sm:mb-2 sm:ml-0">
        Add User
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
              name="password"
              value={password}
              placeholder="Password"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm Password"
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
              Add User
            </button>
            <Link to="/users" className="w-full h-full block">
              <button className="w-full rounded bg-red-500 p-2 font-semibold text-white hover:bg-red-600">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddForm;
