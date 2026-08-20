import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AlertTriangle, User, Clock, MapPin, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";

function AlertDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const alertData = location.state?.alertData;
  console.log(alertData); 

  if (!alertData) {
    return (
      <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-slate-100 w-full items-center justify-center">
        <p className="text-slate-600">No alert data found</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-slate-100 w-full">
      <div className="flex-1 p-8">
        <Button
          onClick={() => navigate("/Alert")}
          className="mb-6"
          variant="flat"
        >
          ← Back to Alerts
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-linear-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-2xl flex items-center shadow-lg">
            <div className="bg-white/20 p-2 rounded-lg mr-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg">CRITICAL SAFETY ALERT</span>
              <p className="text-red-100 text-sm">
                {alertData.event} - Immediate Action Required
              </p>
            </div>
          </div>

          <div className="bg-white rounded-b-2xl shadow-xl p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className=" gap-6">
                <div className="bg-slate-50 p-4 rounded-xl flex flex-row justify-between my-1">
                  <div className="flex items-center ">
                    <Camera className="w-5 h-5 text-slate-400 mr-2" />
                    <p className="text-slate-500 text-sm font-medium">Camera</p>
                  </div>
                  <p className="font-bold text-slate-800 text-lg">
                    {alertData.camera}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl  flex flex-row justify-between my-1">
                  <div className="flex items-center ">
                    <MapPin className="w-5 h-5 text-slate-400 mr-2" />
                    <p className="text-slate-500 text-sm font-medium">
                      Location
                    </p>
                  </div>
                  <p className="font-bold text-slate-800 text-lg">
                    {alertData.location || "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl my-1 flex flex-row justify-between ">
                  <div className="flex items-center ">
                    <Clock className="w-5 h-5 text-slate-400 mr-2" />
                    <p className="text-slate-500 text-sm font-medium">Time</p>
                  </div>
                  <p className="font-bold text-slate-800 text-lg">
                    {new Date(alertData.time).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl flex flex-row justify-between my-1">
                  <div className="flex items-center ">
                    <AlertTriangle className="w-5 h-5 text-slate-400 mr-2" />
                    <p className="text-slate-500 text-sm font-medium">Event</p>
                  </div>
                  <p className="font-bold text-slate-800 text-lg">
                    {alertData.event}
                  </p>
                </div>
              </div>
              <div className="bg-linear-to-r from-slate-50 to-slate-100 p-4 rounded-xl flex flex-row justify-between my-1">
                <p className="text-slate-500 text-sm font-medium ">
                  AI Confidence Score
                </p>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-2xl text-slate-800">
                    {alertData.confidence || "N/A"}%
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-[55%]"> {/* grid grid-cols-1 sm:grid-cols-3 gap-4  */}
              {/* {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full h-80 bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl border-4 border-red-400 flex items-center justify-center shadow-inner overflow-hidden"
                >
                  <div className="text-center">
                    <User className="w-20 h-20 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm font-medium">
                      Detection Frame
                    </p>
                  </div>
                </div>
              ))} */}
             
                <div
                  className="w-full bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl border-4 border-red-400 flex items-center justify-center shadow-inner overflow-hidden"
                >
                  <div className="text-center">
                    {/* <User className="w-20 h-20 text-slate-400 mx-auto mb-2" /> */}
                    <img
                      src={alertData.image_url}
                      alt="Live AI camera detection stream"
                      className="w-full h-full object-contain"
                    />
                    {/* <p className="text-slate-400 text-sm font-medium">
                      Detection Frame
                    </p> */}
                  </div>
                </div>

              
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AlertDetail;
