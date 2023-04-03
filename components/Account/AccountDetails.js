import classes from "./AccountDetails.module.css";
import { useEffect } from "react";

const AccountDetails = (props) => {
  return (
    <div className={classes.title}>
      <h1> Account Details </h1>
      <div className={classes.container}>
        <h1>
        Welcome {props.user.fname} {props.user.lname}!
        </h1>
        <p>Username: {props.user.username}</p>
        <p>Email: {props.user.email}</p>
        <p>Phone: {props.user.phone}</p>
        <button
          onClick={() => {
            console.log(props.toggle);
            props.setToggle(!props.toggle);
          }}
        >
          Update Your Info!
        </button>
      </div>
    </div>
  );
};

export default AccountDetails;
