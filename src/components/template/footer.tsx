"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative py-16 ">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#A5AE79]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#A5AE79]/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center mb-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#A5AE79]/30" />
          <div className="mx-4 text-[#A5AE79]/40 text-2xl">✦</div>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#A5AE79]/30" />
        </div>

        <motion.div
          className="flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="text-lg text-[#A5AE79] font-light tracking-[0.2em] uppercase"
            transition={{ duration: 0.6 }}
          >
            Design by Plan Essential
          </motion.div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#A5AE79]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#A5AE79]/50" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#A5AE79]/50" />
          </div>

          <motion.div
            className="relative"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Decorative corner accents */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#A5AE79]/20 rounded-tl-lg" />
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#A5AE79]/20 rounded-tr-lg" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#A5AE79]/20 rounded-bl-lg" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#A5AE79]/20 rounded-br-lg" />

            <div className="flex items-center gap-6 px-8 py-4 bg-background/10 backdrop-blur-sm rounded-lg border border-[#A5AE79]/20">
              <motion.div
                className="relative w-14 h-14 flex items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Image
                  src="https://planessential.com/logo.png"
                  alt="Plan Essential"
                  width={56}
                  height={56}
                  className="object-contain drop-shadow-lg"
                />
              </motion.div>

              <motion.span
                className="text-2xl text-[#A5AE79] font-thin"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                ×
              </motion.span>

              <motion.div
                className="relative w-28 h-14 flex items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Image
                  src="https://focuzsolution.com/logo.png"
                  alt="Focuz Solution"
                  width={112}
                  height={56}
                  className="object-contain drop-shadow-lg"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="mt-4 text-[#A5AE79]/30 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            ✦ ◆ ✦
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
