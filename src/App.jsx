import { useState, useEffect } from "react";
import { RaceBy } from "@uiball/loaders";
import moment from "moment";
import axios from "axios";
import "./App.css";
import "animate.css";
import { Header } from "./components/Header";

export const App = () => {
  const query = new URLSearchParams(window.location.search);
  const [email, setEmail] = useState(query.get("email"));
  const [linkId, setLinkId] = useState(query.get("razorpay_payment_link_id"));
  const [payId, setPayId] = useState(query.get("razorpay_payment_id"));
  const [credits, setCredits] = useState(query.get("credits"));
  const [amount, setAmount] = useState(query.get("amount"));
  const [mode, setMode] = useState("");
  const [username, setUsername] = useState("");
  const [currCredits, setCurrcredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [grade, setGrade] = useState("");
  const [link, setLink] = useState("");

  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );
  const handleChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handleChangeGrade = (e) => {
    const grade = e.target.value;
    setGrade(grade);
  };

  const handleGradeSubmit = async (email, grade) => {
    try {
      setLoading(true);
      setMode("zoomlink");
      const url = `https://backend.wisechamps.com/quiz/team`;
      const res = await axios.post(url, { email: email, grade: grade });
      const phone = res.data.phone;
      const student_name = res.data.student_name;
      const newLink = res.data.newLink;
      const start_date = moment().format("YYYY-MM-DD");
      const expiry_date = moment().add(1, "year").format("YYYY-MM-DD");
      const api = process.env.REACT_APP_API;
      const authToken = process.env.REACT_APP_TOKEN;
      const config = {
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      };
      const body = {
        phone: phone,
        email: email,
        student_name: student_name,
        student_grade: grade,
        expiry_date: expiry_date,
        start_date: start_date,
      };
      await axios.post(api, body, config);
      window.location.assign(newLink);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log("error is ------------", error);
    }
  };

  const capturePayment = async ({ email, payId, linkId, credits, amount }) => {
    try {
      setLoading(true);
      const url = `https://backend.wisechamps.com/payment/capture`;
      const res = await axios.post(url, {
        linkId,
        payId,
        email,
        credits,
        amount,
      });
      console.log(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log("error is ------------", error);
    }
  };

  const handleClick = async (emailParam) => {
    if (!emailRegex.test(emailParam)) {
      alert("Please Enter a Valid Email");
      return;
    }
    try {
      setMode("");
      setLoading(true);
      const url = `https://backend.wisechamps.com/meeting`;
      const res = await axios.post(url, { email: emailParam, payId });
      const mode = res.data.mode;
      const link = res.data.link;
      const credits = res.data.credits;
      const grade = res.data.grade;
      setLink(link);
      setGrade(grade);
      setCredits(credits);
      if (mode === "zoomlink") {
        setMode(mode);
        window.location.assign(link);
      } else {
        setMode(mode);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log("error is ------------", error);
    }
  };

  const handleCredits = async (emailParam) => {
    if (!emailRegex.test(emailParam)) {
      alert("Please Enter a Valid Email");
      window.location.reload();
      return;
    }
    try {
      setMode("showCredits");
      setLoading(true);
      const url = `https://backend.wisechamps.com/meeting`;
      const res = await axios.post(url, { email: emailParam, payId });
      const credits = res.data.credits;
      const name = res.data.name;
      setCurrcredits(credits);
      setUsername(name);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log("error is ------------", error);
    }
  };

  useEffect(() => {
    if (email && payId && linkId && credits && amount) {
      capturePayment({
        email,
        payId,
        linkId,
        credits,
        amount,
      });
      handleClick(email);
    }
  }, []);

  if (loading || mode === "loading") {
    return (
      <div
        style={{
          overflow: "hidden",
        }}
      >
        <p style={{ fontSize: "18px" }}>
          {payId
            ? "Processing Your Payment.."
            : mode === "showCredits"
            ? "Getting your credit balance"
            : "Searching for your session.."}
        </p>
        <RaceBy
          size={300}
          lineWeight={20}
          speed={1.4}
          color="rgba(129, 140, 248)"
        />
      </div>
    );
  }

  if (mode === "oldData") {
    return (
      <>
        <Header />
        <div
          className="main mainReferee animate__animated animate__fadeInRight"
          style={{
            marginTop: "40px",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px 0",
            }}
          >
            Select Your Grade
          </h3>
          <label className="label">
            <input
              value="1"
              name="value-radio"
              id="value-2"
              className="radio-input"
              type="radio"
              onChange={handleChangeGrade}
            />
            <div className="radio-design"></div>
            <div
              className="label-text"
              style={{
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Grade 1
            </div>
          </label>
          <label className="label">
            <input
              value="2"
              name="value-radio"
              id="value-3"
              className="radio-input"
              type="radio"
              onChange={handleChangeGrade}
            />
            <div className="radio-design"></div>
            <div
              className="label-text"
              style={{
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Grade 2
            </div>
          </label>
          <label className="label">
            <input
              value="3"
              name="value-radio"
              id="value-4"
              className="radio-input"
              type="radio"
              onChange={handleChangeGrade}
            />
            <div className="radio-design"></div>
            <div
              className="label-text"
              style={{
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Grade 3
            </div>
          </label>
          <label className="label">
            <input
              value="4"
              name="value-radio"
              id="value-4"
              className="radio-input"
              type="radio"
              onChange={handleChangeGrade}
            />
            <div className="radio-design"></div>
            <div
              className="label-text"
              style={{
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Grade 4
            </div>
          </label>
          <label className="label">
            <input
              value="5"
              name="value-radio"
              id="value-2"
              className="radio-input"
              type="radio"
              onChange={handleChangeGrade}
            />
            <div className="radio-design"></div>
            <div
              className="label-text"
              style={{
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Grade 5
            </div>
          </label>
          <label className="label">
            <input
              value="6"
              name="value-radio"
              id="value-3"
              className="radio-input"
              type="radio"
              onChange={handleChangeGrade}
            />
            <div className="radio-design"></div>
            <div
              className="label-text"
              style={{
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Grade 6
            </div>
          </label>
          <label className="label">
            <input
              value="7"
              name="value-radio"
              id="value-4"
              className="radio-input"
              type="radio"
              onChange={handleChangeGrade}
            />
            <div className="radio-design"></div>
            <div
              className="label-text"
              style={{
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Grade 7
            </div>
          </label>
          <label className="label">
            <input
              value="8"
              name="value-radio"
              id="value-4"
              className="radio-input"
              type="radio"
              onChange={handleChangeGrade}
            />
            <div className="radio-design"></div>
            <div
              className="label-text"
              style={{
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Grade 8
            </div>
          </label>
          <button
            id="submit-btn"
            onClick={() => handleGradeSubmit(email, grade)}
            style={{
              marginTop: "10px",
              width: "100%",
            }}
          >
            Submit
          </button>
        </div>
      </>
    );
  }

  if (mode === "zoomlink") {
    return (
      <div
        style={{
          overflow: "hidden",
        }}
      >
        <p style={{ fontSize: "18px" }}>Redirecting you to Zoom..</p>
        <RaceBy
          size={300}
          lineWeight={20}
          speed={1.4}
          color="rgba(129, 140, 248)"
        />
      </div>
    );
  }

  if (error || mode.includes("internalservererror")) {
    return (
      <>
        <Header />
        <div className="animate__animated animate__fadeInRight">
          <h1>Something Went Wrong. Please Refresh</h1>
        </div>
      </>
    );
  }

  if (mode === "nosession") {
    return (
      <>
        <Header />
        <div className="animate__animated animate__fadeInRight">
          <p>
            It appears that there is no active
            <br />
            session at this moment.
          </p>
        </div>
      </>
    );
  }

  if (mode === "nouser") {
    return (
      <>
        <Header />
        <div className="email-not-found animate__animated animate__fadeInRight">
          <p>
            This Email is not registered with us. <br />
            Please use a registered Email Address
          </p>
          <div>
            <button id="submit-btn" onClick={() => setMode("")}>
              Try Again
            </button>
            <button
              id="submit-btn"
              onClick={() => {
                window.open(
                  `https://wa.me/919717094422?text=${encodeURIComponent(
                    "Please send me my registered email"
                  )}`,
                  "_blank"
                );
                setMode("");
              }}
            >
              Get Your Registered Email
            </button>
          </div>
        </div>
      </>
    );
  }

  if (mode === "showCredits") {
    return (
      <>
        <Header />
        <div
          id="loadingDiv"
          style={{
            width: "fit-content",
          }}
          className="animate__animated animate__fadeInRight"
        >
          <p>
            Hi {username}, Your have currently <b>{currCredits} credits</b>.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {currCredits < 10 ? (
              <button
                id="submit-btn"
                onClick={() =>
                  window.location.assign(
                    `https://payment.wisechamps.com?email=${email}`
                  )
                }
              >
                Buy Credits Now
              </button>
            ) : null}
            <button id="submit-btn" onClick={() => handleClick(email)}>
              Join Meeting Now
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="main animate__animated animate__fadeInRight">
        <h3>Email</h3>
        <div className="form">
          <input
            className="input"
            type="email"
            placeholder="Enter Email"
            inputMode="email"
            onChange={handleChange}
          />
          <p>* Please use the registered Email.</p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <button id="submit-btn" onClick={() => handleClick(email)}>
              Join Zoom Meeting
            </button>
            <button id="submit-btn" onClick={() => handleCredits(email)}>
              Get Your Credit Balance
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
