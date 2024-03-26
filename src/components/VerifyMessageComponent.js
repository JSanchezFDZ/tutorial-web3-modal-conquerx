import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";

const VerifyMessageComponent = () => {
    const [data2Verify, setData2Verify] = useState({
        address: "",
        message: "",
        signature: "",
    });
    const [resultVerification, setResultVerification] = useState(false);

    const handleOnChange = (e) => {
        const param = e.target.name;
        const value = e.target.value;
        setData2Verify({ ...data2Verify, [param]: value });
    };

    const handleVerifyMessage = () => {
        if (data2Verify.address && data2Verify.message && data2Verify.signature) {
            const recoveredAddress = ethers.verifyMessage(data2Verify.message, data2Verify.signature);
            const isVerified = recoveredAddress === data2Verify.address;
            setResultVerification(isVerified);
        }
    };

    return (
        <Flex direction={"column"} w={"50%"} p={4} gap={2}>
            <Text fontSize={"xl"} color={"white"} fontWeight={"bold"}>
                Verify Message
            </Text>
            <Input placeholder="Message..." name={"message"} onChange={handleOnChange} color={"white"} />
            <Input placeholder="Public key" name={"address"} onChange={handleOnChange} color={"white"} />
            <Input placeholder="Signature" name={"signature"} onChange={handleOnChange} color={"white"} />
            <Button onClick={handleVerifyMessage}>Verify Message</Button>
            {resultVerification && (
                <Text color={"white"} fontWeight={"bold"}>
                    Verified Message 👍
                </Text>
            )}
        </Flex>
    );
};
export default VerifyMessageComponent;
