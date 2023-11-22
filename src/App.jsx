import { useState, useEffect } from "react";
import { RaceBy } from "@uiball/loaders";
import axios from "axios";
import "./App.css";

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
  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );
  const handleChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
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
      window.location.reload();
      return;
    }
    try {
      setMode("");
      setLoading(true);
      const url = `https://backend.wisechamps.com/meeting`;
      const res = await axios.post(url, { email: emailParam, payId });
      const mode = res.data.mode;
      const link = res.data.link;
      if (mode === "zoomlink") {
        setMode("zoomlink");
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

  if (loading) {
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
      <div>
        <h1>Something Went Wrong. Please Refresh</h1>
      </div>
    );
  }

  if (mode === "nosession") {
    return (
      <div>
        <p>
          It appears that there is no active
          <br />
          session at this moment.
        </p>
      </div>
    );
  }

  if (mode === "nouser") {
    return (
      <div className="email-not-found">
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
    );
  }

  if (mode === "showCredits") {
    return (
      <div
        id="loadingDiv"
        style={{
          width: "fit-content",
        }}
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
    );
  }

  return (
    <div className="main">
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
  );
};
