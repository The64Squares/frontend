import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 120px)",
    paddingTop: "7.5rem",
    paddingBottom: "4rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    backgroundColor: "var(--bg-primary, #FAFAFA)",
    backgroundImage: "radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.02) 0%, transparent 75%)",
  },
  form: {
    width: "100%",
    maxWidth: "440px",
    margin: "auto",
    borderRadius: "16px",
    padding: "2.5rem 2.25rem",
    backgroundColor: "#FFFFFF",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    boxShadow: "0 20px 45px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)",
  },

  avatar: {
    margin: "0 auto 0.75rem auto",
    backgroundColor: "#09090B !important",
    color: "#FFFFFF !important",
    width: "48px !important",
    height: "48px !important",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
  },

  heading: {
    textAlign: "center",
    fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif) !important",
    fontSize: "1.95rem !important",
    fontWeight: "700 !important",
    color: "#09090B !important",
    letterSpacing: "-0.01em",
    marginTop: "0.25rem",
    marginBottom: "0.35rem",
  },
  subheading: {
    textAlign: "center",
    fontFamily: "var(--font-sans, -apple-system, sans-serif) !important",
    fontSize: "0.85rem !important",
    color: "#71717A !important",
    marginBottom: "1.75rem !important",
    lineHeight: 1.45,
  },

  // Input styles
  textField: {
    marginBottom: "1.25rem",
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#FAFAFA",
      transition: "all 0.2s ease",
      "& fieldset": {
        borderColor: "#E4E4E7",
      },
      "&:hover fieldset": {
        borderColor: "#A1A1AA",
      },
      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#09090B",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "var(--font-sans, -apple-system, sans-serif)",
      color: "#71717A",
      fontSize: "0.9rem",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#09090B",
      fontWeight: 500,
    },
    "& .MuiOutlinedInput-input": {
      fontFamily: "var(--font-sans, -apple-system, sans-serif)",
      color: "#09090B",
      fontSize: "0.925rem",
      padding: "13px 14px",
    },
  },

  nameInput: {
    width: "100%",
  },
  emailInput: {
    width: "100%",
  },
  passwordInput: {
    width: "100%",
    position: "relative",
  },

  showPasswordButton: {
    position: "absolute",
    top: "50%",
    right: "8px",
    transform: "translateY(-50%)",
    color: "#71717A !important",
    minWidth: "auto",
    padding: "6px",
    borderRadius: "50%",
    border: "none !important",
    background: "transparent !important",
    "&:hover": {
      color: "#09090B !important",
      backgroundColor: "rgba(0, 0, 0, 0.05) !important",
    },
  },

  rememberMeContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
    "& .MuiFormControlLabel-label": {
      fontSize: "0.85rem",
      color: "#52525B",
      fontFamily: "var(--font-sans, -apple-system, sans-serif)",
    },
    "& .MuiCheckbox-root": {
      color: "#A1A1AA",
      "&.Mui-checked": {
        color: "#09090B",
      },
    },
  },

  forgotPasswordLink: {
    color: "#52525B",
    fontSize: "0.825rem",
    fontWeight: 500,
    textDecoration: "none",
    fontFamily: "var(--font-sans, -apple-system, sans-serif)",
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#09090B",
      textDecoration: "underline",
    },
  },

  termsAndConditionsText: {
    fontFamily: "var(--font-sans, -apple-system, sans-serif) !important",
    color: "#71717A !important",
    textAlign: "center",
    lineHeight: "1.45 !important",
    fontSize: "0.775rem !important",
    marginTop: "1rem !important",
    marginBottom: "0.5rem !important",
  },

  privacyText: {
    marginLeft: "4px",
    textDecoration: "underline",
    color: "#09090B",
    fontWeight: 500,
    "&:hover": {
      color: "#27272A",
    },
  },

  loginButton: {
    color: "#FFFFFF !important",
    backgroundColor: "#09090B !important",
    border: "1px solid #09090B !important",
    borderRadius: "10px !important",
    padding: "12px 0 !important",
    fontFamily: "var(--font-sans, -apple-system, sans-serif) !important",
    fontWeight: "600 !important",
    fontSize: "0.925rem !important",
    letterSpacing: "0.02em !important",
    textTransform: "none !important",
    marginTop: "1.25rem !important",
    marginBottom: "1rem !important",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important",
    "&:hover": {
      backgroundColor: "#27272A !important",
      borderColor: "#27272A !important",
      transform: "translateY(-1px)",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
    },
    "&:disabled": {
      backgroundColor: "#E4E4E7 !important",
      color: "#A1A1AA !important",
      borderColor: "#E4E4E7 !important",
      cursor: "not-allowed",
    },
  },

  createAccount: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#09090B",
    paddingLeft: "6px",
    textDecoration: "none",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#27272A",
      textDecoration: "underline",
    },
  },

  // SignUp specific styles
  gridcheckbox: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    marginTop: "0.75rem",
    marginBottom: "0.5rem",
  },
  checkbox: {
    "& .MuiFormControlLabel-label": {
      fontSize: "0.8rem",
      color: "#52525B",
      fontFamily: "var(--font-sans, -apple-system, sans-serif)",
    },
    "& .MuiCheckbox-root": {
      color: "#A1A1AA",
      padding: "4px 8px 4px 0",
      "&.Mui-checked": {
        color: "#09090B",
      },
    },
  },

  // Avatar Uploader
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1rem",
    backgroundColor: "#FAFAFA",
    borderRadius: "10px",
    border: "1px dashed #D4D4D8",
    marginTop: "0.5rem",
    marginBottom: "1rem",
  },
  avatar2: {
    width: "48px !important",
    height: "48px !important",
    backgroundColor: "#09090B !important",
    color: "#FFFFFF !important",
    border: "2px solid #E4E4E7",
  },
  input: {
    display: "none",
  },
  uploadAvatarButton: {
    color: "#FFFFFF !important",
    backgroundColor: "#09090B !important",
    borderRadius: "8px !important",
    padding: "7px 14px !important",
    textTransform: "none !important",
    fontSize: "0.825rem !important",
    fontFamily: "var(--font-sans, -apple-system, sans-serif) !important",
    fontWeight: "500 !important",
    transition: "all 0.2s ease !important",
    "&:hover": {
      backgroundColor: "#27272A !important",
      transform: "translateY(-1px)",
    },
  },
  uploadAvatarText: {
    margin: 0,
    fontSize: "0.825rem",
    color: "#FFFFFF",
    fontWeight: 500,
  },

  // Admin / Product Update styles
  updateProduct: {
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    width: "100%",
    gap: "1rem",
    overflow: "hidden",
    margin: "-1.1rem 0 0 0",
    padding: 0,
  },
  firstBox1: {
    width: "20%",
    margin: "0rem",
    height: "fit-content",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
    display: "block",
    [theme.breakpoints.down("999")]: {
      display: "none",
    },
  },
  toggleBox1: {
    width: "16rem",
    margin: "0rem",
    height: "fit-content",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
    display: "block",
    zIndex: "100",
    position: "absolute",
    top: "58px",
    left: "17px",
  },
  secondBox1: {
    width: "75%",
    backgroundColor: "#FAFAFA",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    margin: "-0.5rem 0 0 0",
    gap: "10px",
    justifyContent: "center",
    [theme.breakpoints.down("999")]: {
      width: "100%",
    },
  },
  navBar1: {
    margin: "0rem",
  },
  form2: {
    marginTop: "-6rem",
  },
  imgIcon: {
    width: "auto",
    marginLeft: "1rem",
    alignSelf: "center",
    "& svg": {
      color: "#09090B",
      fontSize: "2.5rem !important",
    },
  },
  descriptionInput: {
    marginTop: theme.spacing(3),
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& fieldset": {
        borderColor: "#E4E4E7",
      },
      "&:hover fieldset": {
        borderColor: "#09090B",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#09090B",
      },
    },
  },
  descriptionIcon: {
    marginRight: theme.spacing(1),
    color: "#71717A",
  },
  selectOption: {
    marginTop: theme.spacing(3),
    position: "relative",
    width: "100%",
  },
  imageArea: {
    display: "flex",
    gap: "18px",
    width: "90%",
    overflowX: "scroll",
    scrollbarWidth: "10px",
    margin: "2rem 0",
    padding: "3px 16px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
    borderRadius: "8px",
  },
  image: {
    width: "4.5rem ",
    height: "4rem ",
    objectFit: "cover",
    borderRadius: "6px",
  },
  labelText: {
    color: "#71717A",
    fontSize: "14px",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "14px",
    pointerEvents: "none",
  },
  formControl: {
    width: "100%",
  },
  select: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "&:hover fieldset": {
        borderColor: "#09090B",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#09090B",
      },
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#F4F4F5",
      color: "#09090B",
    },
  },
  menu: {
    marginTop: theme.spacing(1),
    "& .MuiMenuItem-root": {
      color: "#09090B",
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#F4F4F5",
      color: "#09090B",
    },
  },
}));

export default useStyles;

