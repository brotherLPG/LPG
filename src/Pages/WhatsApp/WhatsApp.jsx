import { useState } from "react";
import { Camera, CheckCircle2, Image, MapPin, MessageCircle, Send, Settings2 } from "lucide-react";

function WhatsApp() {
  const [phoneNumber, setPhoneNumber] = useState("+92 300 1234567");
  const [includePhotos, setIncludePhotos] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const history = [
    { id: 1, title: "No Helmet Detected", location: "Production Area 1", time: "Today, 10:30 AM", status: "Delivered" },
    { id: 2, title: "Unauthorized Access", location: "Gate 2", time: "Today, 10:15 AM", status: "Delivered" },
    { id: 3, title: "Restricted Zone Entry", location: "Maintenance Bay", time: "Today, 09:30 AM", status: "Read" }
  ];

  const saveNotificationSettings = () => {
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold text-green-600">INSTANT ALERTS</p><h1 className="mt-1 text-3xl font-bold text-slate-800">WhatsApp Notifications</h1><p className="mt-2 text-slate-500">Send critical safety alerts directly to your WhatsApp number.</p></div>
        <button onClick={saveNotificationSettings} className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 hover:bg-green-700"><Send className="h-4 w-4" /> Save Notifications</button>
      </div>

      {isSaved && <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"><CheckCircle2 className="h-5 w-5" /> WhatsApp notification settings saved.</div>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-xl xl:col-span-2">
          <div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-green-100 p-3"><MessageCircle className="h-6 w-6 text-green-600" /></div><div><h2 className="font-bold text-slate-800">Notification Recipient</h2><p className="text-sm text-slate-500">Choose the WhatsApp number for critical safety messages.</p></div></div>
          <label className="block text-sm font-semibold text-slate-700">WhatsApp Number<input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} type="tel" placeholder="+92 300 1234567" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-green-500" /></label>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4"><input checked={includePhotos} onChange={(event) => setIncludePhotos(event.target.checked)} type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 accent-green-600" /><span><span className="flex items-center gap-2 font-semibold text-slate-800"><Image className="h-4 w-4 text-green-600" /> Include captured photos</span><span className="mt-1 block text-sm text-slate-500">Send the camera capture with each WhatsApp safety alert.</span></span></label>
          <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-700">Message includes</p><div className="mt-3 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-3"><span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-green-600" /> Event details</span><span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-green-600" /> Location & time</span><span className="flex items-center gap-2"><Camera className="h-4 w-4 text-green-600" /> Camera capture</span></div></div>
        </section>

        <section className="rounded-2xl bg-green-700 p-6 text-white shadow-xl"><Settings2 className="h-9 w-9 text-green-200" /><h2 className="mt-5 text-xl font-bold">Delivery Status</h2><p className="mt-2 text-sm text-green-100">Critical safety messages will be sent as soon as an alert is detected.</p><div className="mt-6 rounded-xl bg-green-800 p-4"><p className="text-sm text-green-200">Current recipient</p><p className="mt-1 break-all text-sm font-bold text-white">{phoneNumber || "No number selected"}</p></div><p className="mt-5 flex items-center gap-2 text-sm font-semibold text-green-100"><CheckCircle2 className="h-4 w-4" /> Notifications enabled</p></section>

        <section className="rounded-2xl bg-white p-6 shadow-xl xl:col-span-3"><h2 className="text-xl font-bold text-slate-800">Recent WhatsApp Activity</h2><p className="mt-1 text-sm text-slate-500">The latest safety notifications prepared for WhatsApp delivery.</p><div className="mt-5 space-y-3">{history.map((item) => <article key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"><div className="rounded-xl bg-green-100 p-3"><MessageCircle className="h-5 w-5 text-green-600" /></div><div className="flex-1"><p className="font-semibold text-slate-800">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.location} · {item.time}</p></div><span className="flex w-fit items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"><CheckCircle2 className="h-3.5 w-3.5" /> {item.status}</span></article>)}</div></section>
      </div>
    </div>
  );
}

export default WhatsApp;
