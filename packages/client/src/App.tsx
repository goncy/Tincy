import * as React from "react";
import SocketIO from "socket.io-client";
import {AnimatePresence, motion} from "framer-motion";

const socket = SocketIO(process.env.NODE_ENV === "production" ? "/" : "http://localhost:8000");

const AnimatedNumber: React.VFC<{children: number; suffix: string}> = ({children, suffix}) => (
  <div style={{display: "inline-flex", gap: 4}}>
    <AnimatePresence>
      <motion.span
        key={children}
        animate={{y: 0, opacity: 1}}
        exit={{y: 20, opacity: 0, position: "absolute"}}
        initial={{y: -20, opacity: 0}}
        style={{minWidth: "1rem"}}
        transition={{
          ease: "easeOut",
          duration: 1,
        }}
      >
        {String(children).padStart(2, "0")}
      </motion.span>
    </AnimatePresence>
    <span>{suffix}</span>
  </div>
);

const App: React.VFC = () => {
  const [endtime, setEndtime] = React.useState<number>(0);
  const [hours, setHours] = React.useState<number>(0);
  const [minutes, setMinutes] = React.useState<number>(0);
  const [seconds, setSeconds] = React.useState<number>(0);

  React.useEffect(() => {
    socket.on("endtime", (endtime: number) => setEndtime(endtime));
  }, []);

  React.useEffect(() => {
    const interval = setInterval(function () {
      const now = new Date().getTime();
      const distance = endtime - now;

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
  }, [endtime]);

  if (!endtime) return null;

  return (
    <>
      <div style={{display: "inline-flex", gap: 12}}>
        <AnimatedNumber suffix="h">{hours}</AnimatedNumber>
        <AnimatedNumber suffix="m">{minutes}</AnimatedNumber>
        <AnimatedNumber suffix="s">{seconds}</AnimatedNumber>
      </div>
    </>
  );
};

export default App;
