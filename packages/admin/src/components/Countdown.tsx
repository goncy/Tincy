import * as React from "react";
import {Stack, Text} from "@chakra-ui/react";

interface Props {
  children: number;
}

const Countdown: React.VFC<Props> = ({children}) => {
  const [hours, setHours] = React.useState<number>(0);
  const [minutes, setMinutes] = React.useState<number>(0);
  const [seconds, setSeconds] = React.useState<number>(0);

  React.useEffect(() => {
    const interval = setInterval(function () {
      const now = new Date().getTime();
      const distance = children - now;

      if (distance < 0) {
        setHours(0);
        setMinutes(0);
        setSeconds(0);

        clearInterval(interval);
      } else {
        setHours(Math.floor(distance / (1000 * 60 * 60)));
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [children]);

  if (!children) return null;
  if (hours === 0 && minutes === 0 && seconds === 0) return <span>...</span>;

  return (
    <Stack direction="row" spacing={4}>
      <Text>{String(hours).padStart(2, "0")}h</Text>
      <Text>{String(minutes).padStart(2, "0")}m</Text>
      <Text>{String(seconds).padStart(2, "0")}s</Text>
    </Stack>
  );
};

export default Countdown;
