"use client";

// import { motion } from "framer-motion";

export default function FrameIDTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  // if (typeof document === "undefined") {
  //   return null;
  // }

  // const referrer = document.referrer;
  // console.log("🚀 ~ referrer:", referrer);
  return (
    // <motion.div
    //   initial={{ x: "-100%", opacity: 0 }}
    //   animate={{ x: 0, opacity: 1 }}
    //   transition={{ ease: "easeInOut", duration: 0.75 }}
    // >
    <>{children}</>
  );
}
