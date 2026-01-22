import React, { useState } from "react";
import styles from "./login.module.css";
import { useDispatch } from "react-redux";
// import { setLoginData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import { setLoginData } from "../Redux/userSlice";
import isynclogin from "../assets/Login.png";
import threeImages from "../assets/Image.png"
import cloudlogo from "../assets/Logo.svg"


function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userid, setuserid] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
      userid,
      password

    }



    // Simulate backend response
    // const userData = {
    //   userid,
    //   userid: userid.split("@")[0],
    //   role: "Admin",
    // };

    const data = await userApi.login(payload)
    // console.log(data)

    if (data?.status == "success") {
      // dispatch(setLoginData({
      //     role : data?.role
      // }))

      dispatch(setLoginData({
        role: data?.role,
        userid: data?.user

      }))

      navigate("/home")
    } else {
      alert("Invalid userid or password");
    }

    // dispatch(setLoginData(userData));
    // navigate("/home"); // redirect to home page
  };

  return (
    <div className={styles.container}>
      <div className={styles.isyncLogin} >


        <div className={styles.cloudlogoBox}>
          <img style={{ width: "100%" }} src={cloudlogo} alt="" />
        </div>

        <div className={styles.IsyncLiBox}>

          <div>Smart</div>
          <li>Secure</li>
          <li>Intelligent Backup</li>


        </div>
        <div className={styles.threeImagesBox}>
          <img style={{ width: "100%" }} src={threeImages} alt="" />
        </div>


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
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={styles.passwordInput}
              />

              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={
                    showPassword
                      ? "/assets/show.png"
                      : "/assets/eye.png"
                  }
                  alt="Toggle password"
                />
              </button>
            </div>


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
