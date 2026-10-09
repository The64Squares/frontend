import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login, clearErrors } from "../../actions/userAction";
import The64SquaresBallLoader from "../layouts/loader/Loader";
import { useAlert } from "../../context/AlertContext";
import MetaData from "../layouts/MataData/MataData";
import "./AuthForm.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.userData
  );

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, isAuthenticated, loading, error, alert, navigate, redirect]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  const handleShowPasswordClick = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      hasError = true;
    }

    if (hasError) return;

    dispatch(login(email.trim(), password));
  };

  return (
    <>
      <MetaData title={"Sign In | THE64SQUARES"} />
      {loading ? (
        <The64SquaresBallLoader />
      ) : (
        <div className="auth-page-container">
          <div className="auth-card">
            <div className="auth-header">
              <Link to="/" className="auth-logo-wrap" title="THE64SQUARES Home">
                <img
                  src="/logo.png"
                  alt="THE64SQUARES"
                  className="auth-brand-logo"
                />
              </Link>
              <h1 className="auth-title">Sign In</h1>
              <p className="auth-subtitle">
                Welcome back. Enter your credentials to access your bespoke chess collection.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="auth-fields-stack">
                <div className="auth-field-group">
                  <TextField
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={handleEmailChange}
                    error={Boolean(emailError)}
                    helperText={emailError}
                    autoComplete="email"
                  />
                </div>

                <div className="auth-field-group">
                  <TextField
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
                    error={Boolean(passwordError)}
                    helperText={passwordError}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleShowPasswordClick}
                            edge="end"
                            size="small"
                            className="auth-password-toggle-btn"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>

              <div className="auth-options-row">
                <FormControlLabel
                  control={<Checkbox size="small" defaultChecked />}
                  label="Remember me"
                  className="auth-checkbox-label"
                />
                <Link to="/password/forgot" className="auth-forgot-link">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="contained"
                className="auth-submit-btn"
                fullWidth
              >
                Sign In
              </Button>

              <Typography variant="body2" className="auth-terms-note">
                By signing in, you accept THE64SQUARES{" "}
                <Link to="/policy/privacy">Terms of Use</Link> and acknowledge our{" "}
                <Link to="/policy/privacy">Privacy Policy</Link>.
              </Typography>

              <div className="auth-switch-note">
                Don't have an account?
                <Link to="/signup" className="auth-switch-link">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


