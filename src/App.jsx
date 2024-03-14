import { useState, useEffect } from "react";
import { RaceBy } from "@uiball/loaders";
import moment from "moment";
import axios from "axios";
import "./App.css";
import "animate.css";
import { Header } from "./components/Header";
import { Address } from "./components/Address";
import { Box, Button, Select, Text } from "@chakra-ui/react";

export const App = () => {
  const query = new URLSearchParams(window.location.search);
  const [email, setEmail] = useState(query.get("email"));
  const [credits, setCredits] = useState(0);
  const [mode, setMode] = useState("");
  // const [username, setUsername] = useState("");
  // const [currCredits, setCurrcredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [grade, setGrade] = useState("");
  const [link, setLink] = useState("");
  const [address, setAddress] = useState("");
  const [team, setTeam] = useState("");
  // const [pincode, setPincode] = useState("");
  // const [invalidPincode, setInvalidPincode] = useState(true);

  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );

  const handleChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handleChangeGrade = (e) => {
    // e.preventDefault();
    const grade = e.target.value;
    setGrade(grade);
    console.log(grade);
  };

  // const handlePincodeChange = async (e) => {
  //   e.preventDefault();
  //   const value = e.target.value.trim();
  //   if (value.length === 6) {
  //     const url = `${process.env.REACT_APP_PINCODE_API}=${value}`;
  //     axios.get(url).then((res) => {
  //       if (res.data.total !== 0) {
  //         setInvalidPincode(false);
  //       } else {
  //         setInvalidPincode(true);
  //       }
  //     });
  //   } else {
  //     setInvalidPincode(true);
  //   }
  //   setPincode(value);
  // };

  const handleGradeSubmit = async (email, grade, address) => {
    try {
      if (!grade) {
        alert("Please select a grade");
        return;
      }
      setLoading(true);
      const url = `https://backend.wisechamps.com/quiz/team`;
      const res = await axios.post(url, { email: email, grade: grade });
      const mode = res.data.mode;
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
      if (mode === "gradeUpdated") {
        setLink(newLink);
        if (address) {
          if (newLink === null) {
            setMode("nosession");
            setLoading(false);
            return;
          }
          window.location.assign(newLink);
        } else {
          setMode("address");
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
      const address = res.data.address;
      setCredits(credits);
      setAddress(address);
      setTeam(team);
      if (mode === "zoomlink") {
        setGrade(grade);
        setMode(mode);
        setLink(link);
        if (credits <= 3) {
          setMode("buyCredits");
        } else if (address) {
          if (link === null) {
            setMode("nosession");
            setLoading(false);
            return;
          }
          window.location.assign(link);
        } else {
          setMode("address");
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

  const handleTeamAndAddress = async (address, link) => {
    try {
      setLoading(true);
      if (address) {
        if (link === null) {
          setMode("nosession");
          setLoading(false);
          return;
        }
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

  // const updateTeam = async (emailParam, pincode, address, link) => {
  //   try {
  //     setLoading(true);
  //     setMode("zoomlink");
  //     let team = "";
  //     if (
  //       pincode.charAt(0) === "1" ||
  //       pincode.charAt(0) === "2" ||
  //       pincode.charAt(0) === "7" ||
  //       pincode.charAt(0) === "8" ||
  //       pincode.charAt(0) === "9"
  //     ) {
  //       team = "North";
  //     } else {
  //       team = "South";
  //     }
  //     const url = `https://backend.wisechamps.com/quiz/team`;
  //     const res = await axios.post(url, { email: emailParam, team: team });
  //     if (address) {
  //       window.location.assign(link);
  //     } else {
  //       setMode("address");
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     setError(true);
  //     console.log("error is ------------", error);
  //   }
  // };

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
        <Box className="main animate__animated animate__fadeInRight">
          <Text fontWeight={700} fontSize={["14px", "14px", "16px", "18px"]}>
            {credits === 0 ? "No Quiz Balance" : "Low Quiz Balance"}
          </Text>
          <Text m={"10px 0 0 0"} fontSize={["13px", "13px", "15px", "16px"]}>
            You have only <b>{credits} quiz balance</b> left.
          </Text>
          <Text m={"10px 0 15px 0"} fontSize={["13px", "13px", "15px", "16px"]}>
            {credits === 0
              ? "Please add more quiz balance to join today's quiz."
              : " Please add more quiz balance to enjoy uninterrupted quizzes."}
          </Text>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Button
              fontSize={["12px", "12px", "14px", "15px"]}
              height={["35px", "35px", "40px", "40px"]}
              id="submit-btn"
              onClick={() =>
                window.location.assign(
                  `https://quizbalance.wisechamps.com?email=${email}`
                )
              }
            >
              Add Quiz Balance
            </Button>
            <Button
              fontSize={["12px", "12px", "14px", "15px"]}
              height={["35px", "35px", "40px", "40px"]}
              id="submit-btn"
              onClick={() => handleTeamAndAddress(address, link)}
            >
              Ask me later
            </Button>
          </div>
        </Box>
      </>
    );
  }

  if (mode === "oldData") {
    return (
      <Box width={"90%"} m={"0 auto"}>
        <Header />
        <Box
          width={"100%"}
          className="main mainReferee animate__animated animate__fadeInRight"
          maxWidth={"400px"}
          padding={"1.5rem"}
          textAlign={"left"}
        >
          <Text
            m={"0"}
            fontSize={["14px", "14px", "16px", "18px"]}
            fontWeight={700}
          >
            Select New Grade
          </Text>

          <Text
            fontSize={["12px", "12px", "14px", "15px"]}
            mt={"5px"}
            color={"#414141"}
          >
            Please select your grade for the new{" "}
            <Text as={"span"} color={"#2118cc"}>
              Academic Session 2024 - 2025
            </Text>
          </Text>

          <Select
            fontSize={["12px", "12px", "14px", "15px"]}
            m={"15px 0"}
            onChange={handleChangeGrade}
            border={"1px solid #4E46E4"}
            outline={"none"}
            _focus={{
              outline: "none",
              border: "1px solid #4E46E4",
            }}
          >
            <option value="" selected>
              -None-
            </option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
          </Select>

          <Button
            id="submit-btn"
            onClick={() => handleGradeSubmit(email, grade, address)}
            width={"100%"}
            fontSize={["12px", "12px", "14px", "15px"]}
          >
            Submit
          </Button>
        </Box>
      </Box>
    );
  }

  // if (mode === "team") {
  //   return (
  //     <>
  //       <Header />
  //       <Box
  //         className="animate__animated animate__fadeInRight"
  //         border={"1px solid #6666ff"}
  //         margin={"0 auto"}
  //         width={["80%", "80%", "400px", "400px"]}
  //         padding={"2rem 1rem"}
  //         borderRadius={"10px"}
  //       >
  //         <form>
  //           <Text fontWeight={"500"} mt={0} fontSize={"18px"}>
  //             Please Enter your Area Pincode
  //           </Text>
  //           <FormControl mb={7} isRequired>
  //             <Input
  //               boxSizing="border-box"
  //               isInvalid={invalidPincode && pincode}
  //               fontSize={["12px", "12px", "15px", "15px"]}
  //               type="number"
  //               name="pincode"
  //               placeholder="Enter Pincode"
  //               onChange={handlePincodeChange}
  //             />
  //           </FormControl>
  //           <Button
  //             type="submit"
  //             width={"100%"}
  //             isDisabled={invalidPincode}
  //             id="submit-btn"
  //             onClick={() => updateTeam(email, pincode, address, link)}
  //           >
  //             Submit
  //           </Button>
  //         </form>
  //       </Box>
  //     </>
  //   );
  // }

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
          <Text
            m={0}
            fontWeight={600}
            fontSize={["20px", "20px", "23px", "25px"]}
          >
            OOPS!
          </Text>
          <Text m={"5px 0 0 0"} fontSize={["15px", "15px", "17px", "19px"]}>
            There is no active session at this time <br /> Please try again
            later.
          </Text>
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
