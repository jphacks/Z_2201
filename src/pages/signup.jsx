import { auth } from "../lib/clientApp";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import styles from "../styles/signup.module.css";
import ImageContainer from "../components/ImageContainer/ImageContainer";
import Link from "next/link";
import { db } from "../lib/clientApp";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, email, password, passwordConfirm } = event.target.elements;
    console.log(password.value);
    console.log(passwordConfirm.value);
    if (password.value.length < 6) {
      alert("パスワードは6文字以上にしてください。");
    } else if (password.value != passwordConfirm.value) {
      alert("パスワードが一致していません。");
    } else {
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((credential) => {
          const user = credential.user;
          setDoc(doc(db, "users", user.uid), {
            name: name.value,
            email: user.email,
          });
          router.push("/");
        })
        .catch((error) => {
          alert("signupに失敗しました。もう一度やり直してください。");
          console.error(error);
        });
    }
  };

  const handleChangeName = (event) => {
    setName(event.currentTarget.value);
  };
  const handleChangeEmail = (event) => {
    setEmail(event.currentTarget.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.currentTarget.value);
  };
  const handleChangePasswordConfirm = (event) => {
    setPasswordConfirm(event.currentTarget.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles["signup-contents"]}>
        <div className={styles["signup-title"]}>
          <ImageContainer imagePath="/coffee-pink.png" size="larger" />
          <h1 style={{ marginLeft: 16 }}>A cup of coffee</h1>
        </div>
        <h2>Sing Up</h2>
        <form onSubmit={handleSubmit} className={styles["signup-form"]}>
          <Input
            type="name"
            name="name"
            id="name"
            placeholder="Please enter your Nickname"
            width="50%"
            style={{ borderRadius: "16px", marginTop: "16px" }}
            onChange={(event) => handleChangeName(event)}
          />
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Please enter your Email"
            width="50%"
            style={{ borderRadius: "16px", marginTop: "16px" }}
            onChange={(event) => handleChangeEmail(event)}
          />
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Please enter your Password"
            width="50%"
            style={{ borderRadius: "16px", marginTop: "16px" }}
            onChange={(event) => handleChangePassword(event)}
          />
          <Input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            placeholder="Please enter your Password again"
            width="50%"
            style={{ borderRadius: "16px", marginTop: "16px" }}
            onChange={(event) => handleChangePasswordConfirm(event)}
          />
          <Button className={styles["signup-button"]} type="submit">
            Sign Up
          </Button>
          <p
            style={{
              display: "flex",
              marginTop: "16px",
              fontWeight: 600,
              color: "var(--white1)",
            }}
          >
            サインインは
            <Link href={"/signin"}>
              <span style={{ color: "var(--pink2)", cursor: "pointer" }}>
                こちら
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
