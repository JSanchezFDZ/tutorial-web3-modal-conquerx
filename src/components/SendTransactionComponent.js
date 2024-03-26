import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { parseEther } from "ethers";

const SendTransactionComponent = ({ infoAccount }) => {
    const [transactionValue, setTransactionValue] = useState({ to: "", value: 0 });

    const [txInfo, setTxInfo] = useState({
        isConfirming: false,
        isConfirmed: false,
        hash: "",
    });

    const handleOnChange = (e) => {
        const param = e.target.name;
        const value = param === "to" ? e.target.value : parseEther(e.target.value);

        setTransactionValue({ ...transactionValue, [param]: value });
    };

    const handleSendTransaction = async () => {
        infoAccount.signer.sendTransaction(transactionValue).then((tx) => {
          setTxInfo({ isConfirming: true, hash: tx.hash });
            console.log("TxHash: ", tx.hash);
            // Wait for the transaction to be confirmed
            tx.wait().then(() => {
                console.log("Tx confirmed");
                setTxInfo({ ...txInfo, isConfirming: false, isConfirmed: true });
            });
        });
    };

    return (
        <Flex w={"100%"} p={4} direction={"column"} gap={2}>
            <Text fontWeight={"bold"} fontSize={"2xl"} color={"white"}>
                Send Transaction
            </Text>
            {txInfo.isConfirmed && (
                <>
                    <Text color={"white"} fontWeight={"bold"}>
                        TxHas: {txInfo.hash}
                    </Text>
                    <Text color={"white"} fontWeight={"bold"}>
                        Status: {txInfo.isConfirming ? "Pending..." : txInfo.isConfirmed ? "Confirmed 👍" : null}
                    </Text>
                </>
            )}
            <Input placeholder="Wallet address" name="to" onChange={handleOnChange} color={"white"} />
            <Input placeholder="Value" name="value" onChange={handleOnChange} color={"white"} />
            <Button onClick={handleSendTransaction}>Send Transaction</Button>
        </Flex>
    );
};
export default SendTransactionComponent;
