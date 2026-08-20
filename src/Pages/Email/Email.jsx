import { useState } from "react";
import { BellRing, Camera, CheckCircle2, Image, Mail, MapPin, Send, Settings2 } from "lucide-react";

function Email() {
  const [recipient, setRecipient] = useState("info@gstsa1.org");
  const [includePhotos, setIncludePhotos] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const history = [
    { id: 1, title: "No Helmet Detected", location: "Production Area 1", time: "Today, 10:30 AM", status: "Delivered" },
    { id: 2, title: "Unauthorized Access", location: "Gate 2", time: "Today, 10:15 AM", status: "Delivered" },
    { id: 3, title: "Safety Violation", location: "Assembly Line A", time: "Today, 09:48 AM", status: "Delivered" }
  ];

  const saveNotificationSettings = () => {
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold text-blue-600">ALERT COMMUNICATIONS</p><h1 className="mt-1 text-3xl font-bold text-slate-800">Email Notifications</h1><p className="mt-2 text-slate-500">Automatically notify your safety team when an event is detected.</p></div>
        <button onClick={saveNotificationSettings} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"><Send className="h-4 w-4" /> Save Notifications</button>
      </div>

      {isSaved && <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"><CheckCircle2 className="h-5 w-5" /> Notification settings saved.</div>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-xl xl:col-span-2">
          <div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-3"><Mail className="h-6 w-6 text-blue-600" /></div><div><h2 className="font-bold text-slate-800">Notification Recipient</h2><p className="text-sm text-slate-500">Choose where safety alerts will be delivered.</p></div></div>
          <label className="block text-sm font-semibold text-slate-700">Email Address<input value={recipient} onChange={(event) => setRecipient(event.target.value)} type="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" /></label>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4"><input checked={includePhotos} onChange={(event) => setIncludePhotos(event.target.checked)} type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600" /><span><span className="flex items-center gap-2 font-semibold text-slate-800"><Image className="h-4 w-4 text-blue-600" /> Attach captured photos</span><span className="mt-1 block text-sm text-slate-500">Include detected camera frames with each alert email.</span></span></label>
          <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-700">Emails include</p><div className="mt-3 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-3"><span className="flex items-center gap-2"><BellRing className="h-4 w-4 text-blue-600" /> Event details</span><span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> Location & time</span><span className="flex items-center gap-2"><Camera className="h-4 w-4 text-blue-600" /> Camera capture</span></div></div>
        </section>

        <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl"><Settings2 className="h-9 w-9 text-blue-400" /><h2 className="mt-5 text-xl font-bold">Delivery Status</h2><p className="mt-2 text-sm text-slate-400">Safety-alert emails are active and will be sent when a new critical event is detected.</p><div className="mt-6 rounded-xl bg-slate-800 p-4"><p className="text-sm text-slate-400">Current recipient</p><p className="mt-1 break-all text-sm font-bold text-white">{recipient || "No recipient selected"}</p></div><p className="mt-5 flex items-center gap-2 text-sm font-semibold text-green-400"><CheckCircle2 className="h-4 w-4" /> Notifications enabled</p></section>

        <section className="rounded-2xl bg-white p-6 shadow-xl xl:col-span-3"><h2 className="text-xl font-bold text-slate-800">Recent Email Activity</h2><p className="mt-1 text-sm text-slate-500">The latest safety notifications prepared for delivery.</p><div className="mt-5 space-y-3">{history.map((item) => <article key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"><div className="rounded-xl bg-blue-100 p-3"><Mail className="h-5 w-5 text-blue-600" /></div><div className="flex-1"><p className="font-semibold text-slate-800">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.location} · {item.time}</p></div><span className="flex w-fit items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"><CheckCircle2 className="h-3.5 w-3.5" /> {item.status}</span></article>)}</div></section>
      </div>
    </div>
  );
}

export default Email;
