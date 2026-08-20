import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, MapPin, Clock, AlertTriangle, ShieldCheck, Play, Loader2 } from "lucide-react";
import { baseUrl } from "../../utils/config";
import newRequest from "../../utils/userRequest";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LiveView() {
  const navigate = useNavigate();
  const [streamUnavailable, setStreamUnavailable] = useState(false);
  const previousAlertCount = useRef(0);

  const getHealth = async () => {
  const res = await newRequest.get("/health");
  return res.data;
};

const {
  data: healthData,
  isLoading: healthLoading,
  isError: healthError,
} = useQuery({
  queryKey: ["health"],
  queryFn: getHealth,
});

  const cameras = healthData?.cameras
    ? Object.entries(healthData.cameras).map(([key, camera], index) => ({
        id: index + 1,
        key,
        name: camera.name,
        imagecamera: `${baseUrl}${camera.endpoint}`,
        location: camera.location,
        status:
          healthData.stream_running && camera.has_frame ? "online" : "offline",
        lastUpdate: "Live",
        ipaddress: healthData.nvr_ip,
        hasFrame: camera.has_frame,
      }))
    : [];

    const getAlerts = async () => {
      const res = await newRequest.get("/detection-alerts");
      return res.data.data;
    };
  
  const { data: RecentAlerts = [], isLoading, isError } = useQuery({
      queryKey: ['alerts'],
      queryFn: getAlerts
    });

    console.log(RecentAlerts, "RecentAlerts");
    
  
    const totalAlerts = RecentAlerts.length;

    useEffect(() => {
      if (previousAlertCount.current === 0) {
        previousAlertCount.current = totalAlerts;
        return;
      }

      if (totalAlerts > previousAlertCount.current) {
        const latestAlert = RecentAlerts[0];

        toast.error(
            `${latestAlert.event} detected\n${latestAlert.camera}\n${latestAlert.location}`,
            {
                toastId: latestAlert.id
            }
        );
      }

      previousAlertCount.current = totalAlerts;
    }, [RecentAlerts, totalAlerts]);

    // Count alerts per camera
    const getCameraAlerts = (cameraName) => {
      return RecentAlerts.filter(alert => alert.camera === cameraName).length;
    };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-slate-100 w-full">
      <div className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Live View</h1>
          <p className="text-slate-500">
            Real-time camera monitoring across all locations
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Cameras</p>
                <p className="text-2xl font-bold text-slate-800">
                  {cameras.length}
                </p>
              </div>
              <Camera className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Online</p>
                <p className="text-2xl font-bold text-green-600">
                  {cameras.filter((c) => c.status === "online").length}
                </p>
              </div>
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Offline</p>
                <p className="text-2xl font-bold text-red-600">
                  {cameras.filter((c) => c.status === "offline").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Active Alerts</p>
                {isLoading ? (
                  <div className="mt-2">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-orange-600">
                    {totalAlerts || "0"}
                  </p>
                )}
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </motion.div>

        {/* The backend returns an MJPEG stream, so it is rendered directly as an image. */}
        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8 overflow-hidden rounded-2xl bg-slate-950 shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-red-500">
                <span className="h-3 w-3 animate-ping rounded-full bg-red-400 opacity-75" />
              </span>
              <div>
                <h2 className="font-semibold text-white">Live Detection Feed</h2>
                <p className="text-sm text-slate-400">AI camera detections in real time</p>
              </div>
            </div>
            <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">LIVE</span>
          </div>
          <div className="flex min-h-64 items-center justify-center bg-black">
            {streamUnavailable ? (
              <p className="p-8 text-center text-sm text-slate-400">
                Unable to load the live stream. Confirm that the API is running on port 5051.
              </p>
            ) : (
              <img
                src={`${baseUrl}/live-detection`}
                alt="Live AI camera detection stream"
                className="max-h-[520px] w-full object-contain"
                onError={() => setStreamUnavailable(true)}
              />
            )}
          </div>
        </motion.section> */}

        {/* Camera Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {healthLoading ? (
            // Loading Skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="relative h-48 bg-slate-100 animate-pulse flex items-center justify-center">
                  <Spinner size="lg" color="default" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
                  <div className="h-10 bg-slate-100 rounded animate-pulse" />
                </div>
              </motion.div>
            ))
          ) : cameras.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20"
            >
              <Camera className="w-24 h-24 text-slate-300 mb-4" />
              <p className="text-xl font-semibold text-slate-600 mb-2">
                No cameras found
              </p>
              <p className="text-slate-500">
                Check your connection and try again
              </p>
            </motion.div>
          ) : (
            // Camera Cards
            cameras.map((camera, index) => (
              <motion.div
                key={camera.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Camera Feed Placeholder */}
                <div
                  className={`relative h-48 ${camera.status === "offline" ? "bg-slate-200" : "bg-linear-to-br from-slate-100 to-slate-200"} flex items-center justify-center`}
                >
                  {camera.status === "online" ? (
                    <>
                      <img
                        src={camera.imagecamera}
                        alt="Live AI camera detection stream"
                        className="max-h-130 w-full object-contain"
                      />
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="w-16 h-16 text-slate-300" />
                      <div className="absolute top-3 left-3 bg-slate-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        OFFLINE
                      </div>
                    </>
                  )}
                  {isLoading ? (
                    <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1 shadow">
                      <Spinner size="sm" color="warning" />
                    </div>
                  ) : (
                    getCameraAlerts(camera.name) > 0 && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {getCameraAlerts(camera.name)}
                      </div>
                    )
                  )}
                </div>

                {/* Camera Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800">{camera.name}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        camera.status === "online"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {camera.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {camera.location}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      Last update: {camera.lastUpdate}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/camera/${camera.id}`, {
                          state: {
                            ipAddress: camera.ipaddress,
                            cameraName: camera.name,
                            endpoint: camera.imagecamera,
                            location: camera.location,
                          },
                        })
                      }
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Play className="w-4 h-4" />
                      View
                    </button>
                    {/* {camera.status === 'online' && (
                      <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm">
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    )} */}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default LiveView;
