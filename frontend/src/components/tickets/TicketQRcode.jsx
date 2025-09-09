"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";

const TicketQRCode = ({ qrData }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!qrData) {
      setQrCodeUrl("");
      setIsLoading(false);
      return;
    }

    const generateQR = async () => {
      try {
        setIsLoading(true);

        // Truncate data if it's too long - QR codes have capacity limits
        // Most QR codes can handle around 300 characters reliably at medium error correction
        const truncatedData =
          qrData.length > 250 ? qrData.substring(0, 250) + "..." : qrData;

        // Generate QR code as data URL with optimized settings
        const url = await QRCode.toDataURL(truncatedData, {
          width: 200,
          margin: 1,
          errorCorrectionLevel: "M", // L, M, Q, H - lower correction = more data capacity
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        setQrCodeUrl(url);
        setError(null);
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError("Failed to generate QR code: " + err.message);

        // Fallback: try with even less data if first attempt failed
        if (qrData.length > 100) {
          try {
            const basicData = qrData.substring(0, 100) + "...";
            const url = await QRCode.toDataURL(basicData, {
              width: 200,
              margin: 1,
              errorCorrectionLevel: "L",
            });
            setQrCodeUrl(url);
            setError(null);
          } catch (fallbackErr) {
            setError("Could not generate QR code even with reduced data");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [qrData]);

  if (isLoading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="h-10 w-10 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
        ></motion.div>
        <p className="mt-4 text-gray-400">Generating QR code...</p>
      </motion.div>
    );
  }

  if (error && !qrCodeUrl) {
    return (
      <motion.div
        className="p-6 bg-red-900/20 border border-red-500 rounded-xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <p className="text-red-300 mb-4">{error}</p>
        <div className="w-40 h-40 mx-auto bg-slate-700 flex items-center justify-center rounded-lg">
          <div className="text-xl font-mono text-gray-400">
            {qrData ? qrData.substring(0, 8) : "ERROR"}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {qrCodeUrl ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-3 rounded-lg shadow-lg"
          >
            <img
              src={qrCodeUrl || "/placeholder.svg"}
              alt="Ticket QR Code"
              className="w-40 h-40"
            />
          </motion.div>
          {error && (
            <motion.p
              className="mt-2 text-yellow-300 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Note: QR code contains truncated data
            </motion.p>
          )}
          <motion.p
            className="mt-4 text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Present this QR code at the event entrance
          </motion.p>
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-40 h-40 bg-slate-700 flex items-center justify-center rounded-lg">
            <div className="text-xl font-mono text-gray-400">
              {qrData ? qrData.substring(0, 8) : "TICKET"}
            </div>
          </div>
          <p className="mt-4 text-gray-400">QR Code for check-in</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TicketQRCode;
