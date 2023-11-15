import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://rlvtg.onrender.com/forgot-password", { email });

      if (response.data.message) {
        setMessage(response.data.message);
      } else {
        setMessage("Something went wrong!");
      }
    } catch (error) {
      setMessage("Error sending reset password request. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="forgot-password">
        <h2>Forgot Password</h2>
        {message ? (
          <p>{message}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Request Password Reset</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;