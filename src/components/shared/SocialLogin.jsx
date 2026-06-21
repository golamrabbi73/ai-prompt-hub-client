import { useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const SocialLogin = () => {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);

      toast.success("Logged in successfully");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Google sign-in failed");
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="btn btn-outline w-full border-base-300"
    >
      <FcGoogle size={18} /> Continue with Google
    </button>
  );
};

export default SocialLogin;