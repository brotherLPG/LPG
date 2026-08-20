import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera,
  AlertTriangle,
  ArrowLeft,
  Settings,
  Download,
  Share2,
  Maximize,
  Minimize,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import { baseUrl } from "../../utils/config";
import newRequest from "../../utils/userRequest";
import { useQuery } from "@tanstack/react-query";

function CameraDetail() {
  const { cameraId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCameraLive, setIsCameraLive] = React.useState(true);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Get ipAddress from navigation state
  const ipAddress = location.state?.ipAddress || "192.168.1.100";

  // Handler functions for control buttons
  const handleDownload = () => {
    const imgSrc = `${baseUrl}/live-detection-camera-${cameraId}`;
    const link = document.createElement("a");
    link.href = imgSrc;
    link.download = `camera-${cameraId}-snapshot.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Camera ${cameraId} - Live View`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Camera link copied to clipboard!");
    }
  };

  const handleSettings = () => {
    alert("Settings panel would open here");
  };

  const handleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Handle fullscreen change (ESC key press)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const getAlerts = async () => {
    const res = await newRequest.get("/detection-alerts");
    return res.data.data;
  };

  const {
    data: alerts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
  });

  const lastAlertId = useRef(null);

  useEffect(() => {
    if (!alerts.length) return;

    const latest = alerts[0];

    // First load
    if (lastAlertId.current === null) {
      lastAlertId.current = latest.id;
      return;
    }

    // New alert
    if (latest.id !== lastAlertId.current) {
      lastAlertId.current = latest.id;

      toast.error(
        <div>
          <div className="font-bold text-lg">🚨 {latest.event}</div>

          <div>📷 {latest.camera}</div>

          <div>📍 {latest.location}</div>

          <div>🎯 {latest.confidence}% Confidence</div>
        </div>,
        {
          toastId: latest.id,
        },
      );
    }
  }, [alerts]);

  const cameraName = `${location.state?.cameraName}`;

  const cameraAlertsresent = React.useMemo(() => {
    return alerts
      .filter((alert) => alert.camera === cameraName)
      .sort((a, b) => new Date(b.time) - new Date(a.time)); // newest first
  }, [alerts, cameraName]);

  // Mock camera data - in real app, this would come from an API
  const cameraData = {
    id: cameraId,
    name: `${location.state?.cameraName} `,
    location: `${location.state?.location} `,
    status: isCameraLive ? "online" : "offline",
    lastUpdate: "30 sec ago",
    alerts: cameraAlertsresent.length || "0",
    resolution: "1920x1080",
    fps: 30,
    uptime: "99.8%",
    ipAddress: ipAddress,
    macAddress: "00:1B:44:11:3A:B7",
    firmware: "v2.4.1",
    lastMaintenance: "2025-05-15",
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-slate-100 w-full">
      <div className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/live-view")}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Live View
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {cameraData.name}
              </h1>
              <p className="text-slate-500">{cameraData.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold ${
                  cameraData.status === "online"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {cameraData.status.toUpperCase()}
              </span>
              {/* {cameraData.alerts > 0 && ( */}
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {cameraData.alerts || "0"} Active Alerts
              </span>
              {/* )} */}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Camera Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Camera Feed */}
              <div
                ref={containerRef}
                className={`relative ${isFullscreen ? "h-screen w-screen" : "h-96"} bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden`}
                onWheel={handleWheel}
              >
                {!isCameraLive ? (
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Camera className="w-24 h-24 mb-4" />
                    <p className="text-xl font-medium">Camera Offline</p>
                    <p className="text-sm">
                      The camera is currently not running
                    </p>
                  </div>
                ) : (
                  <>
                    <div
                      className="relative cursor-grab active:cursor-grabbing"
                      style={{
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transition: isDragging
                          ? "none"
                          : "transform 0.1s ease-out",
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      <img
                        ref={imageRef}
                        src={`${baseUrl}/live-detection-camera-${cameraId}`}
                        alt="Live AI camera detection stream"
                        className={`${isFullscreen ? "max-h-screen" : "max-h-130"} w-full object-contain`}
                        style={{ maxHeight: isFullscreen ? "100vh" : "32rem" }}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setIsCameraLive(false)}
                        draggable={false}
                      />
                    </div>
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500"></div>
                      </div>
                    )}
                    {imageLoaded && (
                      <>
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          LIVE
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                          {cameraData.resolution} @ {cameraData.fps}fps
                        </div>
                        {/* Zoom Controls */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <button
                            onClick={handleFullscreen}
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                            title={
                              isFullscreen ? "Exit Fullscreen" : "Fullscreen"
                            }
                          >
                            {isFullscreen ? (
                              <Minimize className="w-5 h-5" />
                            ) : (
                              <Maximize className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={handleZoomIn}
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                            title="Zoom In"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleZoomOut}
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                            title="Zoom Out"
                            disabled={zoom <= 1}
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleResetZoom}
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                            title="Reset Zoom"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                        </div>
                        {/* Zoom Level Indicator */}
                        {zoom > 1 && (
                          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                            {Math.round(zoom * 100)}%
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  {/* <div className="flex gap-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Play
                    </button>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                  </div> */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSettings}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 bg-white rounded-2xl shadow-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Recent Alerts
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {cameraAlertsresent.length} alert
                    {cameraAlertsresent.length !== 1 && "s"} detected
                  </p>
                </div>

                <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Live
                </div>
              </div>

              {/* Scrollable List */}
              <div className="max-h-130 overflow-y-auto p-5 space-y-4">
                {cameraAlertsresent.length > 0 ? (
                  cameraAlertsresent.map((alert) => (
                    <div
                      key={alert.id}
                      className="group bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white hover:shadow-lg hover:border-red-200 transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        {/* Alert Image */}
                        <img
                          src={alert.image_url}
                          alt={alert.event}
                          className="w-28 h-24 rounded-xl object-cover border"
                        />

                        {/* Alert Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-slate-800 text-lg">
                                {alert.event}
                              </h3>

                              <p className="text-sm text-slate-500 mt-1">
                                📍 {alert.location}
                              </p>

                              <p className="text-sm text-slate-500">
                                📷 {alert.camera}
                              </p>
                            </div>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                alert.status === "New"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {alert.status}
                            </span>
                          </div>

                          {/* Bottom Row */}
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex gap-2">
                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                {alert.confidence}% Confidence
                              </span>

                              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                                Alert #{alert.id}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400">
                              {new Date(alert.time).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <AlertTriangle className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-lg font-semibold text-slate-500">
                      No Alerts Found
                    </p>
                    <p className="text-sm text-slate-400">
                      This camera has no recent safety violations.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Camera Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Camera Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Camera Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Status</span>
                  <span
                    className={`font-medium ${
                      cameraData.status === "online"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {cameraData.status}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium text-slate-800">
                    {cameraData.location}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Resolution</span>
                  <span className="font-medium text-slate-800">
                    {cameraData.resolution}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Frame Rate</span>
                  <span className="font-medium text-slate-800">
                    {cameraData.fps} fps
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Uptime</span>
                  <span className="font-medium text-slate-800">
                    {cameraData.uptime}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">IP Address</span>
                  <span className="font-medium text-slate-800">
                    {cameraData.ipAddress}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500">Last Maintenance</span>
                  <span className="font-medium text-slate-800">
                    {cameraData.lastMaintenance}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Today's Statistics</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Total Alerts</span>
                  <span className="text-2xl font-bold">
                    {cameraAlertsresent.length || "0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">High Priority</span>
                  <span className="text-2xl font-bold">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Resolved</span>
                  <span className="text-2xl font-bold">7</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CameraDetail;
