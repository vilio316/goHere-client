import axios from "axios";
import { useState } from "react";
import { ToastNotification } from "../ToastComponents";
import { Link } from "react-router";
import { useToast } from "../../contexts/ToastContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, updateNewPassword] = useState("");
  const { showToast, updateMessageObj, messageObject } = useToast();

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    if (newPassword == confirmNewPassword && confirmNewPassword.length > 7) {
      try {
        const { data } = await axios.post(
          "http://localhost:8090/auth/update_password",
          { email, password: newPassword },
          {
            withCredentials: true,
          }
        );
        const { success } = await data;
        if (success) {
          updateMessageObj({
            ...messageObject,
            action: "Update Password",
            success: true,
          });
          showToast(true);
        }
      } catch (error: any) {
        console.log(error);
        showToast(true);
        updateMessageObj({
          ...messageObject,
          action: `Error: ${error.response.status} ${error.response.statusText}`,
          success: false,
        });
      }
    } else if (confirmNewPassword.length < 8 || newPassword.length < 8) {
      updateMessageObj({
        ...messageObject,
        action: "Password must be at least 8 characters long",
        success: false,
      });
      showToast(true);
    }
  };

  return (
    <div className="md:min-h-[50vh] relative min-h-[80vh] grid border-2 border-black md:w-5/10 p-2 md:p-4 rounded-2xl ">
      <ToastNotification />
      <form onSubmit={handleUpdate}>
        <Link to={"/"} className="text-3xl">
          GoHere{" "}
        </Link>
        <p className="text-2xl my-2">Forgot Password?</p>
        <p>Create a new one with your email address here.</p>
        <label htmlFor="email" className="text-xl my-2 ">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="block border-2 border-black p-2 text-indent-4 autofocus required rounded-xl w-3/4"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="newPassword" className="text-xl my-2 ">
          New Password
        </label>
        <input
          type="password"
          name="new_password"
          id="newPassword"
          className="block border-2 border-black p-2 text-indent-4 rounded-xl w-3/4"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword" className="text-xl my-2 ">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          className="block border-2 border-black p-2 text-indent-4 rounded-xl w-3/4"
          onChange={(e) => updateNewPassword(e.target.value)}
        />

        <button
          type="submit"
          className=" disabled:bg-blue-200 disabled:opacity-75 bg-blue-400 p-2 my-1 rounded-2xl md:my-2 text-center min-w-[45%] hover:underline hover:md-text-[20px] hover:font-bold"
          disabled={
            confirmNewPassword !== newPassword || confirmNewPassword.length < 7
          }
        >
          Submit
        </button>
      </form>
    </div>
  );
}
