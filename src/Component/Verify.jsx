import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../Appwrite/auth'; // Import your Appwrite service

const VerifyPage = () => {
    const [message, setMessage] = useState("Verifying your account...");
    const navigate = useNavigate();

    useEffect(() => {
        // Extract userId and secret from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const secret = urlParams.get("secret");
        const userId = urlParams.get("userId");

        // If both userId and secret exist, proceed with verification
        if (secret && userId) {
            authService.createCreatorAccount()
                .then(() => {
                    setMessage("Your account has been successfully verified!");
                    
                    // Optionally, redirect to login or dashboard after a delay
                    setTimeout(() => {
                        navigate("/login"); // Redirect to login or dashboard
                    }, 3000);
                })
                .catch((error) => {
                    setMessage(`Verification failed: ${error.message}`);
                });
        } else {
            setMessage("Invalid verification link. Please try again.");
        }
    }, [navigate]);

    return (
        <div className="verify-page">
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyPage;
