import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  TextField,
  FormControlLabel,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import The64SquaresBallLoader from "../layouts/loader/Loader";
import MetaData from "../layouts/MataData/MataData";
import { Link, useNavigate } from "react-router-dom";
import { signUp, clearErrors } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "../../context/AlertContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./AuthForm.css";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { isAuthenticated, error, loading: authLoading } = useSelector(
    (state) => state.userData
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(true);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      alert.success("Account created successfully!");
      navigate("/account");
    }
  }, [dispatch, isAuthenticated, error, alert, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!termsAccepted) {
      newErrors.terms = "Please accept the Terms & Conditions.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.set("name", name.trim());
    formData.set("email", email.trim());
    formData.set("password", password);
    if (avatar) {
      formData.set("avatar", avatar);
    }

    dispatch(signUp(formData));
  };

  return (
    <>
      <MetaData title={"Create Account | THE64SQUARES"} />
      {authLoading ? (
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
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">
                Join THE64SQUARES to curate your collection and track bespoke orders.
              </p>
            </div>

            <form onSubmit={handleSignUpSubmit} noValidate>
              <div className="auth-fields-stack">
                <div className="auth-field-group">
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    autoComplete="name"
                  />
                </div>

                <div className="auth-field-group">
                  <TextField
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    autoComplete="new-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
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

                <div className="auth-field-group">
                  <TextField
                    label="Confirm Password"
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: "" });
                    }}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword}
                    autoComplete="new-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            edge="end"
                            size="small"
                            className="auth-password-toggle-btn"
                            aria-label="Toggle confirm password visibility"
                          >
                            {showConfirmPassword ? (
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

              {/* Avatar Upload Card */}
              <div className="auth-avatar-card">
                <div className="auth-avatar-preview-wrap">
                  <Avatar
                    alt="Avatar Preview"
                    src={avatarPreview}
                    className="auth-avatar-thumb"
                  />
                  <span className="auth-avatar-label-text">
                    {avatarPreview ? "Avatar Selected" : "Optional Profile Avatar"}
                  </span>
                </div>
                <input
                  accept="image/*"
                  id="avatar-upload-input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload-input" style={{ margin: 0 }}>
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon style={{ color: "#FFFFFF", fontSize: "1.1rem" }} />}
                    className="auth-upload-btn"
                  >
                    {avatarPreview ? "Change" : "Upload"}
                  </Button>
                </label>
              </div>

              {/* Checkboxes */}
              <div className="auth-checkboxes-stack">
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (errors.terms) setErrors({ ...errors, terms: "" });
                      }}
                    />
                  }
                  label="I accept THE64SQUARES Terms of Use & Conditions"
                  className="auth-checkbox-item"
                />
                {errors.terms && (
                  <span style={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: "14px" }}>
                    {errors.terms}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="contained"
                className="auth-submit-btn"
                fullWidth
              >
                Create Account
              </Button>

              <Typography variant="body2" className="auth-terms-note">
                By creating an account, you agree to our{" "}
                <Link to="/policy/privacy">Privacy Policy</Link>.
              </Typography>

              <div className="auth-switch-note">
                Already have an account?
                <Link to="/login" className="auth-switch-link">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Signup;


