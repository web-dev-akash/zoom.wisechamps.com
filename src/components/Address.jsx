import React, { useEffect, useState } from "react";
import {
  Button,
  ChakraProvider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Header } from "./Header";
import { RaceBy } from "@uiball/loaders";

export const Address = ({ email, link, credits }) => {
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [address, setAddess] = useState({
    pincode: "",
    flat: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
  });
  const [pincode, setPincode] = useState("");
  const [invalidPincode, setInvalidPincode] = useState(false);

  const handleAddressFormChange = async (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value.trim();
    if (name === "pincode" && value.length === 6) {
      const url = `${process.env.REACT_APP_PINCODE_API}=${value}`;
      setPincode(value);
      axios.get(url).then((res) => {
        if (res.data.total !== 0) {
          setInvalidPincode(false);
          const state = res.data.records[0]._statename.toLowerCase();
          const city = res.data.records[0].districtname.toLowerCase();
          setAddess({ ...address, city: city, state: state });
        } else {
          setInvalidPincode(true);
        }
      });
    } else if (name === "pincode" && value.length < 6) {
      setInvalidPincode(true);
    }
    setAddess({ ...address, [name]: value });
  };

  const handleAddressSubmit = async (email, addressData, pincode, link) => {
    try {
      console.log(addressData);
      if (pincode.length !== 6) {
        alert("Please Enter a valid Pincode");
        return;
      }
      if (
        !addressData.flat ||
        !addressData.street ||
        !addressData.city ||
        !addressData.state
      ) {
        alert("Please Fill all the required details");
        return;
      }
      if (addressData.street.length <= 3) {
        alert("Please enter the valid Street, Area or City");
        return;
      }

      setLoading(true);
      setMode("loading");
      const address = `${addressData.flat}, ${addressData.street}, ${
        addressData.landmark ? addressData.landmark + ", " : ""
      }${addressData.city}, ${addressData.state}`;
      const body = {
        email: email,
        address: address,
        pincode: Number(pincode),
      };
      const url = `https://backend.wisechamps.com/quiz/address`;
      const res = await axios.post(url, body);
      if (link === null) {
        setMode("nosession");
        return;
      }
      window.location.assign(link);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error);
    }
  };

  const handleSkipAddress = async (link) => {
    try {
      if (link === null) {
        setMode("nosession");
        return;
      }
      setLoading(true);
      setMode("loading");
      window.location.assign(link);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error);
    }
  };

  useEffect(() => {}, [address.city, address.state, invalidPincode]);

  if (loading || mode === "loading") {
    return (
      <div
        id="loadingDiv"
        style={{
          width: "fit-content",
        }}
      >
        <p>
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
      <div>
        <h1>Something Went Wrong. Please Refresh</h1>
      </div>
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

  return (
    <ChakraProvider disableEnvironment={true} disableGlobalStyle={true}>
      <Header />
      <FormControl
        className="animate__animated animate__fadeInRight address"
        border={"1px solid #ccc"}
        p={"1.5rem 2rem 2rem 2rem"}
        borderRadius={"10px"}
        margin={"5rem auto 1rem auto"}
        width={["95%", "95%", "600px", "600px"]}
      >
        <Text
          textAlign={"left"}
          fontWeight={"700"}
          fontSize={["25px", "25px", "30px", "30px"]}
          color={"#6666ff"}
          margin={"10px 0 30px 0"}
        >
          During the quizzes we announce winners regularly who are awarded gifts{" "}
          <br />
          <Spacer height={5} />
          <Text fontSize={"15px"} color={"#000"}>
            To receive gifts from Wisechamps please fill in your complete
            courier address.
          </Text>
          {/* Delivery Address for <br />
          <Text width={"max-content"}>Your Gifts</Text> */}
        </Text>
        <FormLabel fontSize={["13px", "13px", "15px", "15px"]} mt={5} mb={1}>
          Pincode
        </FormLabel>
        <Input
          isInvalid={invalidPincode}
          fontSize={["12px", "12px", "15px", "15px"]}
          type="number"
          name="pincode"
          placeholder="Eg. 123456"
          isRequired
          onChange={handleAddressFormChange}
        />
        <FormLabel fontSize={["13px", "13px", "15px", "15px"]} mt={5} mb={1}>
          Flat, House no., Building, Company, Apartment
        </FormLabel>
        <Input
          fontSize={["12px", "12px", "15px", "15px"]}
          name="flat"
          placeholder="Eg. House no. 10"
          isRequired
          onChange={handleAddressFormChange}
        />
        <FormLabel fontSize={["13px", "13px", "15px", "15px"]} mt={5} mb={1}>
          Area, Street, Sector, Village, City
        </FormLabel>
        <Input
          fontSize={["12px", "12px", "15px", "15px"]}
          name="street"
          placeholder="Eg. ABC Street"
          isRequired
          onChange={handleAddressFormChange}
        />
        <FormLabel fontSize={["13px", "13px", "15px", "15px"]} mt={5} mb={1}>
          Landmark
        </FormLabel>
        <Input
          fontSize={["12px", "12px", "15px", "15px"]}
          name="landmark"
          placeholder="Eg. Near SBI bank"
          onChange={handleAddressFormChange}
        />
        <FormLabel fontSize={["13px", "13px", "15px", "15px"]} mt={5} mb={1}>
          District
        </FormLabel>
        <Input
          id={"city"}
          fontSize={["12px", "12px", "15px", "15px"]}
          value={address.city}
          name="city"
          placeholder="Eg. New Delhi"
          isRequired
          onChange={handleAddressFormChange}
        />
        <FormLabel fontSize={["13px", "13px", "15px", "15px"]} mt={5} mb={1}>
          State
        </FormLabel>
        <Input
          id={"city"}
          fontSize={["12px", "12px", "15px", "15px"]}
          value={address.state}
          name="state"
          placeholder="Eg. Delhi"
          isRequired
          onChange={handleAddressFormChange}
        />
        <Spacer height={8} />
        <Flex
          flexDir={["row", "row", "column", "column"]}
          gap={2}
          flexBasis={1}
        >
          <Button
            fontSize={["13px", "13px", "15px", "15px"]}
            width={["50%", "50%", "100%", "100%"]}
            background={"rgba(129, 140, 248)"}
            color={"white"}
            border={"2px solid transparent"}
            cursor={"pointer"}
            onClick={() => handleAddressSubmit(email, address, pincode, link)}
            transition={"0.5s ease"}
            _hover={{
              outline: "none",
              background: "white",
              color: "black",
              border: "2px solid rgba(129, 140, 248)",
              boxShadow: "0 0 0 5px rgb(129 140 248 / 30%)",
            }}
            _focus={{
              outline: "none",
              background: "white",
              color: "black",
              border: "2px solid rgba(129, 140, 248)",
              boxShadow: "0 0 0 5px rgb(129 140 248 / 30%)",
            }}
          >
            Submit
          </Button>
          <Button
            fontSize={["13px", "13px", "15px", "15px"]}
            width={["50%", "50%", "100%", "100%"]}
            background={"rgba(129, 140, 248)"}
            color={"white"}
            border={"2px solid transparent"}
            cursor={"pointer"}
            onClick={() => handleSkipAddress(link)}
            transition={"0.5s ease"}
            _hover={{
              outline: "none",
              background: "white",
              color: "black",
              border: "2px solid rgba(129, 140, 248)",
              boxShadow: "0 0 0 5px rgb(129 140 248 / 30%)",
            }}
            _focus={{
              outline: "none",
              background: "white",
              color: "black",
              border: "2px solid rgba(129, 140, 248)",
              boxShadow: "0 0 0 5px rgb(129 140 248 / 30%)",
            }}
          >
            Ask me Later
          </Button>
        </Flex>
      </FormControl>
    </ChakraProvider>
  );
};
