import { ToastNotification } from "../ToastComponents";

export default function ForgotPassword() {
  return (
    <div className="md:min-h-[50vh] relative min-h-[80vh] grid border-2 border-black md:w-5/10 p-2 md:p-4 rounded-2xl ">
      <ToastNotification />
      <form>
        <p>Forgot Password?</p>
        <p>Create a new one with your email address here.</p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="newPassword">New Password</label>
        <input type="password" name="new_password" id="newPassword" />
        <label htmlFor="confirmPassword"></label>
        <input type="password" name="confirmPassword" id="confirmPassword" />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
