import React, { useState } from "react";
import styles from "./login.module.css";
import { useDispatch } from "react-redux";
// import { setLoginData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import { setLoginData } from "../Redux/userSlice";
import isynclogin from "../assets/Login.jpeg";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userid, setuserid] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // userid regex for validation
//   const useridRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const tempErrors = {};
    if (!userid) tempErrors.userid = "userid is required";
    // else if (!useridRegex.test(userid)) tempErrors.userid = "Invalid userid address";

    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();



    if (!validate()) return;

   // console.log(password , userid)

    const payload = {
        userid ,
        password

    }



    // Simulate backend response
    // const userData = {
    //   userid,
    //   userid: userid.split("@")[0],
    //   role: "Admin",
    // };

    const data =  await userApi.login(payload)
   // console.log(data)

    if(data?.status == "success")
    {
        // dispatch(setLoginData({
        //     role : data?.role
        // }))

        dispatch(setLoginData({
            role : data?.role ,
            userid : data?.user

        }))

        navigate("/home")
    }else{
        alert("Invalid userid or password");
    }

    // dispatch(setLoginData(userData));
    // navigate("/home"); // redirect to home page
  };

  return (
    <div className={styles.container}>
      <div  className={styles.isyncLogin} >
          <img style={{width : "100%" ,height:"100%"}} src={isynclogin} alt="" />
       </div>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label>User id</label>
            <input
              type="text"
              value={userid}
              onChange={(e) => setuserid(e.target.value)}
              placeholder="Enter your userid"
            />
            {errors.userid && <span className={styles.error}>{errors.userid}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        <div className={styles.footer}>
          &copy; 2025 ISyncLite BackupPC Dashboard
        </div>
      </div>
    </div>
  );
}

export default Login;
