import { Box, Flex, Text } from "@chakra-ui/react";
import HeaderComponent from "./components/HeaderComponent";
import SendTransactionComponent from "./components/SendTransactionComponent";
import SignMessageComponent from "./components/SignMessageComponent";
import VerifyMessageComponent from "./components/VerifyMessageComponent";

import { createWeb3Modal, defaultConfig, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

// 1. Get projectId
const projectId = process.env.REACT_APP_WEB3MODAL_PROJECTID || "YOUR_PROJECT_ID";

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
};

const polygon = {
    chainId: 137,
    name: "Polygon",
    currency: "MATIC",
    explorerUrl: "https://polygonscan.com",
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
};

// 3. Create a metadata object
const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "https://mywebsite.com", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
    /*Required*/
    metadata,

    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: "...", // used for the Coinbase SDK
    defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
    ethersConfig,
    chains: [mainnet, polygon],
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

function App() {
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
	const [needRefresh, setNeedRefresh] = useState(true);

    const [infoAccount, setInfoAccount] = useState({
        address: null,
        chainId: null,
        provider: null,
        signer: null,
        balance: 0,
    });

    useEffect(() => {
        const getBalance = async () => {
            const provider = new ethers.BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            const balance = await provider.getBalance(address);
            console.log("Fetched balance: ", balance.toString());
            // Convert balance to ETH
            // 1 ETH = 10^18 wei
            const ethBalance = ethers.formatEther(balance);
            console.log("Converted balance: ", ethBalance.toString());
            setInfoAccount({
                provider: provider,
                signer: signer,
                balance: ethBalance,
            });

			setNeedRefresh(false);
        };

        walletProvider && getBalance();
    }, [walletProvider, needRefresh, address]);

    return (
        <Box w={"100vw"} h={"100vh"} bgColor={"gray.700"}>
            {!isConnected ? (
                <Flex w={"100vw"} h={"100vh"} alignItems={"center"} justifyContent={"center"}>
                    <w3m-button />
                </Flex>
            ) : (
                <>
                    <HeaderComponent />
                    <Flex gap={4} p={4}>
                        <Text color={"white"} fontSize={"xl"}>
                            Address: {address}
                        </Text>
                        {infoAccount.balance && (
                            <>
                                <Text color={"white"} fontSize={"xl"}>
                                    Balance: {infoAccount.balance}
                                </Text>
                                <Text color={"white"} fontSize={"xl"}>
                                    Symbol: ETH
                                </Text>
                            </>
                        )}
                        <Text color={"white"} fontSize={"xl"}>
                            Chain Id: {chainId}
                        </Text>
                    </Flex>

                    <SendTransactionComponent infoAccount={infoAccount} />
                    
                    <Flex gap={4}>
                        <SignMessageComponent infoAccount={infoAccount} />
                        <VerifyMessageComponent infoAccount={infoAccount} />
                    </Flex>
					
                </>
            )}
        </Box>
    );
}

export default App;
