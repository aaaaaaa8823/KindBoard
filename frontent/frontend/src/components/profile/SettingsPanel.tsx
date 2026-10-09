import { useState } from "react";
import "./SettingsPanel.css"; 
import { useNavigate } from "react-router-dom";
import { changePassword, updateUser } from "../../api/users";
type Props = {
  user: { id: number; username: string; email: string } | null;
};

export default function SettingsPanel({ user }: Props) {
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloginOpen, setReloginOpen] = useState(false);
  const navigate = useNavigate();

  const initial = (user?.username ?? "?").charAt(0).toUpperCase();

  async function handleUpdateProfile(e: React.SyntheticEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if(!user?.id){
        setError("Not logged in");
        return;
    }

    await updateUser(user.id, {
  username: username.trim(),
  email: email.trim(),
});

console.log("UPDATE OK", {
  propEmail: user.email,
  formEmail: email,
});

setReloginOpen(true); // всегда, для проверки
return;

//     try {
//         await updateUser(user.id, {
//         username: username.trim(),
//         email: email.trim(),
//     });

//   const emailChanged =
//     email.trim().toLowerCase() !== (user.email ?? "").toLowerCase();

//   const next = {
//     ...user,
//     id: user.id,
//     username: username.trim(),
//     email: email.trim(),
//   };
//   localStorage.setItem("user", JSON.stringify(next));
//   window.dispatchEvent(new Event("user-updated"));

//   if (emailChanged) {
//     setReloginOpen(true);
//     return;
//   }

//   setMessage("Profile updated");
// } catch (err) {
//   setError(err instanceof Error ? err.message : "Update failed");
// }
}

function confirmRelogin() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setReloginOpen(false);
  navigate("/login");
}

  async function handleChangePassword(e: React.SyntheticEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    try{
        await changePassword({
            currentPassword,
            newPassword
        });

        setMessage("Password updated");

    }catch(err){
        setError(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="settings-panel">
        {reloginOpen && (
  <div className="relogin-backdrop">
    <div className="relogin-modal" role="dialog">
      <h3>Email updated</h3>
      <p>
        For security you need to sign in again with your new email.
      </p>
      <button type="button" className="btn-primary" onClick={confirmRelogin}>
        Go to sign in
      </button>
    </div>
  </div>
)}
      <div className="settings-header">
        <div className="settings-avatar">{initial}</div>
        <div>
          <div className="settings-name">{username ?? "User"}</div>
          <div className="settings-email">{email ?? ""}</div>
        </div>
      </div>

      <form className="settings-form" onSubmit={handleUpdateProfile}>
        <label className="settings-label">Full name</label>
        <input
          className="settings-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="settings-label">Email</label>
        <input
          className="settings-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" className="btn-primary">
          Update profile
        </button>
      </form>

      <h3 className="settings-subtitle">Change password</h3>

      <form className="settings-form" onSubmit={handleChangePassword}>
        <label className="settings-label">Current password</label>
        <input
          className="settings-input"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />

        <label className="settings-label">New password</label>
        <input
          className="settings-input"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />

        <button type="submit" className="btn-primary">
          Change password
        </button>
      </form>

      <div className="settings-footer">
        <button type="button" className="btn-danger">
          Delete
        </button>
      </div>

      {message && <p className="settings-ok">{message}</p>}
      {error && <p className="settings-error">{error}</p>}
    </div>
  );
}