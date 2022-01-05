import React from "react";
import {
  useColorModeValue,
  Stack,
  useColorMode,
  Box,
  Heading,
  useClipboard,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {SunIcon, MoonIcon, CopyIcon, TimeIcon} from "@chakra-ui/icons";

const CopiedToast = () => (
  <Alert backgroundColor="primary.500" color="white" status="success" variant="solid">
    <AlertIcon />
    Browser souce link copied to clipboard!
  </Alert>
);

const Navbar: React.FC = () => {
  const {onCopy} = useClipboard(`http://localhost:8001`);
  const toast = useToast();
  const backgroundColor = useColorModeValue("primary.500", "dark.900");
  const {colorMode, toggleColorMode} = useColorMode();

  function handleCopySource() {
    onCopy();
    toast({
      duration: 5000,
      render: CopiedToast,
    });
  }

  return (
    <Stack
      alignItems="center"
      backgroundColor={backgroundColor}
      boxShadow="md"
      direction="row"
      justifyContent="space-between"
      padding={4}
    >
      <Heading color="white" fontSize="2xl" fontWeight="500">
        <Stack alignItems="center" direction="row" spacing={2}>
          <TimeIcon />
          <span>Tincy</span>
        </Stack>
      </Heading>
      <Stack alignItems="center" direction="row" spacing={4}>
        <CopyIcon color="white" cursor="pointer" height={5} width={5} onClick={handleCopySource} />
        <Box color="white" cursor="pointer" onClick={toggleColorMode}>
          {colorMode === "dark" ? (
            <SunIcon height={5} width={5} />
          ) : (
            <MoonIcon height={5} width={5} />
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Navbar;
