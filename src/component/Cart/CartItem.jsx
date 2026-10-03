import React  from "react";
import { makeStyles } from "@mui/styles";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Input,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {
  dispalyMoney,
  generateDiscountedPrice,

} from "../DisplayMoney/DisplayMoney";


const useStyles = makeStyles((theme) => ({
  roots11: {
    display: "flex",
    alignItems: "center",
    padding: "1.25rem",
    width: "100%",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    margin: "0 0 1rem 0",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E4E4E7",
    boxSizing: "border-box",

    [theme.breakpoints.down(600)]: {
      padding: "0.85rem",
    },
  },
  root11: {
    display: "flex",
    alignItems: "center",
    padding: "1.25rem",
    width: "100%",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    margin: "0 0 1rem 0",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E4E4E7",
    boxSizing: "border-box",

    [theme.breakpoints.down(600)]: {
      padding: "0.85rem",
    },
  },
  media: {
    width: "110px",
    height: "110px",
    marginRight: "16px",
    borderRadius: "6px",
    objectFit: "cover",
    flexShrink: 0,

    [theme.breakpoints.down(600)]: {
      width: "80px",
      height: "80px",
      marginRight: "12px",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
    padding: "0 !important",
  },
  cartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: "1rem",
    fontWeight: 600,
    [theme.breakpoints.down(600)]: {
      fontSize: "0.875rem",
    },
  },

  cartDeleteIcon: {
    color: "#71717A",
    "&:hover": {
      color: "#ed1c24",
    },
    [theme.breakpoints.down(499)]: {
      marginRight: "-2rem",
    },
  },

  priceItem: {
    display: "flex",
    alignItems: "baseline",
    gap: "1rem",
    marginLeft: "1.2rem",
    [theme.breakpoints.down(599)]: {
      marginLeft: "0rem",
      marginRight: "-1rem",
    },
  },

  cartSubHeadings: {
    fontSize: "16px",
    fontWeight: 500,
    textTransform: "uppercase",
    color: "#414141",
    [theme.breakpoints.down(599)]: {
      fontSize: "14px",
    },
    [theme.breakpoints.down(499)]: {
      fontSize: "12px",
    },
  },
  itemPrice: {
    fontSize: "16px",
    fontWeight: 400,
    [theme.breakpoints.down(599)]: {
      fontSize: "14px",
    },
    [theme.breakpoints.down(499)]: {
      fontSize: "13px",
    },
  },
  itemOldPrice: {
    marginLeft: "-8px",
    fontSize: "14px",
    fontWeight: 400,

    [theme.breakpoints.down(499)]: {
      fontSize: "12px",
    },
  },

  contentBottom: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "1rem",
    alignItems: "baseline",
    width: "fit-content",
    flexDirection: "column",
    [theme.breakpoints.down(599)]: {
      marginLeft: "0rem",
      marginRight: "-1rem",
    },
    [theme.breakpoints.down(550)]: {
      position: "relative",
      marginLeft: "0rem",
    },
  },
 
}));




function CartItem({
  deleteCartItems,
  item,
  decreaseQuantity,
  increaseQuantity,
  length,
}) {
  const classes = useStyles();

  /// calculate price after discount

  let finalPrice = generateDiscountedPrice(item.price);
  let discountedPrice = item.price - finalPrice;
  discountedPrice = dispalyMoney(discountedPrice);
  let total = finalPrice * item.quantity;
  total = dispalyMoney(total);
  finalPrice = dispalyMoney(finalPrice);

  return (
    <Card className={length < 2 ? classes.root11 : classes.roots11}>
      <CardMedia
        className={classes.media}
        image={item.image}
        title={item.name}
      />
      <CardContent className={classes.content}>
        <div className={classes.contentTop}>
          <div className={classes.cartHeader}>
            <Typography variant="subtitle1" className={classes.title}>
              {item.name}
            </Typography>

            <IconButton
              aria-label="delete"
              className={classes.cartDeleteIcon}
              onClick={() => deleteCartItems(item.productId)}
            >
              <DeleteIcon />
            </IconButton>
          </div>

          <div className={classes.priceItem}>
            <Typography className={classes.cartSubHeadings} variant="body2">
              Price:
            </Typography>
            <Typography variant="subtitle1" className={classes.itemPrice}>
              {finalPrice}
            </Typography>
            <Typography
              variant="caption"
              component="span"
              color="black"
              className={classes.itemOldPrice}
            >
              <del>{discountedPrice}</del>
            </Typography>
          </div>
        </div>
        <div className={classes.contentBottom}>
          <div className="prod_details_additem">
            <h5>QTY:</h5>
            <div className="additem">
              <IconButton
                onClick={() => decreaseQuantity(item.productId, item.quantity)}
                className="additem_decrease"
              >
                <RemoveIcon />
              </IconButton>
              <Input
                readOnly
                type="number"
                value={item.quantity}
                className="input"
              />
              <IconButton
                onClick={() =>
                  increaseQuantity(item.productId, item.quantity, item.stock)
                }
                className="additem_increase"
              >
                <AddIcon />
              </IconButton>
            </div>
          </div>

          <div className={classes.priceItem}>
            <Typography variant="body2" className={classes.cartSubHeadings}>
              TOTAL:
            </Typography>
            <Typography variant="subtitle1" className={classes.price}>
              {total}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartItem;
