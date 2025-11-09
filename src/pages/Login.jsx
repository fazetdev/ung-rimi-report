import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find(
            (user) =>
                user.email.toLowerCase() === formData.email.toLowerCase() &&
                user.password === formData.password
        );

        if (!existingUser) {
            alert("Invalid email or password.");
            return;
        }

        // Check if user is pending approval
        if (existingUser.role === "pending" || existingUser.status === "pending") {
            alert("Your account is pending admin approval. Please contact administrator.");
            return;
        }

        // Check if user is inactive
        if (existingUser.status === "inactive") {
            alert("Your account has been deactivated. Please contact administrator.");
            return;
        }

        // Use the login function from context
        login(existingUser);

        // Redirect based on specific role
        const roleRedirects = {
            "admin": "/dashboard/admin",
            "principal": "/dashboard/principal",
            "vp_admin": "/dashboard/vp-admin",
            "senior_master": "/dashboard/senior-master",
            "exam_officer": "/dashboard/exam-officer",
            "form_master": "/dashboard/form-master",
            "teacher": "/dashboard/teacher"
        };

        const redirectPath = roleRedirects[existingUser.role] || "/dashboard";
        navigate(redirectPath);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-5 text-center">Staff Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 mb-3 w-full rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border p-2 mb-3 w-full rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 mb-4"
                >
                    Login
                </button>
            </form>

            <p className="text-center text-sm text-gray-600">
                User registration is managed by system administrators only.
            </p>

            {/* Demo admin credentials hint */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <strong>Demo Admin Access:</strong><br/>
                Email: admin@school.edu<br/>
                Password: admin123
            </div>
        </div>
    );
}

export default Login;
