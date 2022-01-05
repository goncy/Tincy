import * as React from "react";
import SocketIO from "socket.io-client";
import {Button, FormControl, FormLabel, Input, Stack, StackDivider, Text} from "@chakra-ui/react";

import Navbar from "./components/Navbar";
import Countdown from "./components/Countdown";

const socket = SocketIO(process.env.NODE_ENV === "production" ? "/" : "http://localhost:8000");

const App: React.FC = () => {
  const [endTime, setEndTime] = React.useState<number>(0);
  const [minutes, setMinutes] = React.useState<number>(0);

  function handleUpdateMinutes(minutes: number) {
    socket.emit("update", minutes * 60 * 1000);
  }

  React.useEffect(() => {
    socket.on("endtime", (endTime: number) => setEndTime(endTime));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Stack height="100%" spacing={4}>
      <Navbar />
      <Stack
        divider={<StackDivider />}
        flex={1}
        height="100%"
        overflow="hidden"
        paddingBottom={4}
        paddingX={4}
        spacing={4}
      >
        <Stack flex={1}>
          <Text fontWeight="500" textStyle="title" textTransform="uppercase">
            Tiempo límite
          </Text>
          <Stack
            alignItems="center"
            flex={1}
            fontSize="5xl"
            justifyContent="center"
            overflowY="auto"
            textStyle="title"
          >
            <Countdown>{endTime}</Countdown>
          </Stack>
        </Stack>
        <Stack flex={1}>
          <Text fontWeight="500" textStyle="title" textTransform="uppercase">
            Acciones
          </Text>
          <Stack alignItems="center" flex={1} justifyContent="center" overflowY="auto" spacing={4}>
            <Stack maxWidth={480} width="100%">
              <FormControl as="fieldset">
                <FormLabel as="legend" textStyle="soft">
                  Minutos
                </FormLabel>
                <Input
                  placeholder="5"
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.valueAsNumber)}
                />
              </FormControl>
              <Stack direction="row" gap={4}>
                <Button
                  colorScheme="primary"
                  flex={1}
                  onClick={() => handleUpdateMinutes(Math.abs(minutes))}
                >
                  Agregar
                </Button>
                <Button
                  colorScheme="primary"
                  flex={1}
                  onClick={() => handleUpdateMinutes(-Math.abs(minutes))}
                >
                  Quitar
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default App;
