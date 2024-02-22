import { useState, useEffect } from "react";
import { RaceBy } from "@uiball/loaders";
import moment from "moment";
import axios from "axios";
import "./App.css";
import "animate.css";
import { Header } from "./components/Header";
import { Address } from "./components/Address";
import {
  Box,
  Button,
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";

export const App = () => {
  const query = new URLSearchParams(window.location.search);
  const [email, setEmail] = useState(query.get("email"));
  const [credits, setCredits] = useState(0);
  const [mode, setMode] = useState("");
  const [username, setUsername] = useState("");
  const [currCredits, setCurrcredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [grade, setGrade] = useState("");
  const [link, setLink] = useState("");
  const [address, setAddress] = useState("");
  const [team, setTeam] = useState("");
  const [pincode, setPincode] = useState("");
  const [invalidPincode, setInvalidPincode] = useState(true);

  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );

  const handleChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handleChangeGrade = (e) => {
    e.preventDefault();
    const grade = e.target.value;
    setGrade(grade);
  };

  const handlePincodeChange = async (e) => {
    e.preventDefault();
    const value = e.target.value.trim();
    if (value.length === 6) {
      const url = `${process.env.REACT_APP_PINCODE_API}=${value}`;
      axios.get(url).then((res) => {
        if (res.data.total !== 0) {
          setInvalidPincode(false);
        } else {
          setInvalidPincode(true);
        }
      });
    } else {
      setInvalidPincode(true);
    }
    setPincode(value);
  };

  const handleGradeSubmit = async (email, grade, address) => {
    try {
      setLoading(true);
      const url = `https://backend.wisechamps.com/quiz/team`;
      const res = await axios.post(url, { email: email, grade: grade });
      console.log(res.data);
      const mode = res.data.mode;
      const phone = res.data.phone;
      const student_name = res.data.student_name;
      const newLink = res.data.newLink;
      const team = res.data.team;
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
      if (mode === "gradeUpdated") {
        setLink(newLink);
        if (team && address) {
          window.location.assign(newLink);
        } else if (team) {
          setMode("address");
        } else {
          setMode("team");
        }
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

  const handleClick = async (emailParam) => {
    if (!emailRegex.test(emailParam)) {
      alert("Please Enter a Valid Email");
      return;
    }
    try {
      setMode("");
      setLoading(true);
      const url = `https://backend.wisechamps.com/meeting`;
      const res = await axios.post(url, { email: emailParam });
      const mode = res.data.mode;
      const link = res.data.link;
      const credits = res.data.credits ? res.data.credits : 0;
      const grade = res.data.grade;
      const team = res.data.team;
      const address = res.data.address;
      setGrade(grade);
      setCredits(credits);
      setAddress(address);
      setTeam(team);
      if (mode === "zoomlink") {
        setMode(mode);
        setLink(link);
        if (credits <= 3) {
          setMode("buyCredits");
        } else if (team && address) {
          window.location.assign(link);
        } else if (team) {
          setMode("address");
        } else {
          setMode("team");
        }
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

  const handleTeamAndAddress = async (team, address, link) => {
    try {
      setLoading(true);
      if (team && address) {
        window.location.assign(link);
      } else if (team) {
        setMode("address");
      } else {
        setMode("team");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log("error is ------------", error);
    }
  };

  const updateTeam = async (emailParam, pincode, address, link) => {
    try {
      setLoading(true);
      setMode("zoomlink");
      let team = "";
      console.log(pincode);
      console.log(pincode.charAt(0) === "1");
      if (
        pincode.charAt(0) === "1" ||
        pincode.charAt(0) === "2" ||
        pincode.charAt(0) === "7" ||
        pincode.charAt(0) === "8" ||
        pincode.charAt(0) === "9"
      ) {
        team = "North";
      } else {
        team = "South";
      }
      const url = `https://backend.wisechamps.com/quiz/team`;
      const res = await axios.post(url, { email: emailParam, team: team });
      if (address) {
        window.location.assign(link);
      } else {
        setMode("address");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log("error is ------------", error);
    }
  };

  useEffect(() => {
    if (email) {
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
        <p style={{ fontSize: "18px" }}>{"Searching for your session.."}</p>
        <RaceBy
          size={300}
          lineWeight={20}
          speed={1.4}
          color="rgba(129, 140, 248)"
        />
      </div>
    );
  }

  if (mode === "buyCredits") {
    return (
      <>
        <Header />
        <div className="animate__animated animate__fadeInRight">
          <p style={{ fontSize: "15px" }}>
            You have only <b>{credits}</b> quiz balance left.
            <br />
            Please add more quiz balance to enjoy uninterrupted quizzes.
          </p>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <button
              id="submit-btn"
              onClick={() =>
                window.location.assign(
                  `https://quizbalance.wisechamps.com?email=${email}`
                )
              }
            >
              Add more
            </button>
            <button
              id="submit-btn"
              onClick={() => handleTeamAndAddress(team, address, link)}
            >
              Ask me later
            </button>
          </div>
        </div>
      </>
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
            onClick={() => handleGradeSubmit(email, grade, address)}
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

  if (mode === "team") {
    return (
      <>
        <Header />
        <ChakraProvider resetCSS={false}>
          <Box
            className="animate__animated animate__fadeInRight"
            border={"1px solid #6666ff"}
            margin={"0 auto"}
            width={["80%", "80%", "400px", "400px"]}
            padding={"2rem 1rem"}
            borderRadius={"10px"}
          >
            <form>
              <Text fontWeight={"500"} mt={0} fontSize={"18px"}>
                Please Enter your Area Pincode
              </Text>
              <FormControl mb={7} isRequired>
                <Input
                  boxSizing="border-box"
                  isInvalid={invalidPincode && pincode}
                  fontSize={["12px", "12px", "15px", "15px"]}
                  type="number"
                  name="pincode"
                  placeholder="Enter Pincode"
                  onChange={handlePincodeChange}
                />
              </FormControl>
              <Button
                type="submit"
                width={"100%"}
                isDisabled={invalidPincode}
                id="submit-btn"
                onClick={() => updateTeam(email, pincode, address, link)}
              >
                Submit
              </Button>
            </form>
          </Box>
        </ChakraProvider>
      </>
    );
  }

  if (mode === "address") {
    return <Address email={email} link={link} credits={credits} />;
  }

  if (mode === "zoomlink") {
    return (
      <div
        style={{
          overflow: "hidden",
        }}
      >
        <p style={{ fontSize: "18px" }}>
          You have currently <b>{credits ? credits : 0} </b>
          quiz balance..
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
          </div>
        </div>
      </div>
    </>
  );
};
