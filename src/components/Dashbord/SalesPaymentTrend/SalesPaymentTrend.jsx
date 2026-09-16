import { useState } from "react";
import { ArrowLeftRight, TrendingUp, Wallet } from "lucide-react";

const TREND_DATA = [
  { date: "Aug 24", sales: 160000, payment: 135000 },
  { date: "Aug 25", sales: 190000, payment: 165000 },
  { date: "Aug 26", sales: 155000, payment: 128000 },
  { date: "Aug 27", sales: 145000, payment: 120000 },
  { date: "Aug 28", sales: 180000, payment: 155000 },
  { date: "Aug 29", sales: 220000, payment: 195000 },
  { date: "Aug 30", sales: 180000, payment: 150000 },
];

const SALES_COLOR = "#2563EB";
const PAYMENT_COLOR = "#22C55E";
const CHART_WIDTH = 760;
const CHART_HEIGHT = 280;
const PLOT = { left: 78, top: 28, right: 148, bottom: 44 };

const formatRupees = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-US")}`;

const toPoints = (values, maxY) => {
  const plotWidth = CHART_WIDTH - PLOT.left - PLOT.right;
  const plotHeight = CHART_HEIGHT - PLOT.top - PLOT.bottom;

  return values.map((value, index) => ({
    x: PLOT.left + (index / Math.max(values.length - 1, 1)) * plotWidth,
    y: PLOT.top + plotHeight - (value / maxY) * plotHeight,
    value,
  }));
};

const toSmoothPath = (points) => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const controlX = (previous.x + current.x) / 2;
    path += ` C ${controlX} ${previous.y}, ${controlX} ${current.y}, ${current.x} ${current.y}`;
  }
  return path;
};

function SalesPaymentTrend() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const highestSales = TREND_DATA.reduce((best, item) =>
    item.sales > best.sales ? item : best
  );
  const highestPayment = TREND_DATA.reduce((best, item) =>
    item.payment > best.payment ? item : best
  );
  const averageDifference = 32000;

  const maxY = 250000;
  const yTicks = [250000, 200000, 150000, 100000, 50000, 0];
  const salesPoints = toPoints(
    TREND_DATA.map((item) => item.sales),
    maxY
  );
  const paymentPoints = toPoints(
    TREND_DATA.map((item) => item.payment),
    maxY
  );
  const lastSales = salesPoints[salesPoints.length - 1];
  const lastPayment = paymentPoints[paymentPoints.length - 1];
  const plotHeight = CHART_HEIGHT - PLOT.top - PLOT.bottom;
  const hoveredItem = hoveredIndex !== null ? TREND_DATA[hoveredIndex] : null;
  const tooltipLeft =
    hoveredIndex === null
      ? 0
      : Math.min(
          Math.max((salesPoints[hoveredIndex].x / CHART_WIDTH) * 100, 16),
          84
        );

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-[16px] font-bold text-BLUE-dark">
            Sales & Receiving Payment Trend
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
              Sales
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
              Received Payment
            </span>
          </div>
        </div>

        <div
          className="relative w-full overflow-x-auto"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-72 w-full min-w-150"
            role="img"
            aria-label="Sales and received payment trend for the last 7 days"
          >
            {yTicks.map((tick) => {
              const y =
                PLOT.top + plotHeight - (tick / maxY) * plotHeight;
              return (
                <g key={tick}>
                  <line
                    x1={PLOT.left}
                    y1={y}
                    x2={CHART_WIDTH - PLOT.right + 24}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                  <text
                    x={PLOT.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400"
                    fontSize="11"
                  >
                    {formatRupees(tick)}
                  </text>
                </g>
              );
            })}

            {TREND_DATA.map((item, index) => (
              <text
                key={item.date}
                x={salesPoints[index].x}
                y={CHART_HEIGHT - 12}
                textAnchor="middle"
                className="fill-slate-400"
                fontSize="11"
              >
                {item.date}
              </text>
            ))}

            <path
              d={toSmoothPath(salesPoints)}
              fill="none"
              stroke={SALES_COLOR}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d={toSmoothPath(paymentPoints)}
              fill="none"
              stroke={PAYMENT_COLOR}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {hoveredIndex !== null && (
              <line
                x1={salesPoints[hoveredIndex].x}
                y1={PLOT.top}
                x2={salesPoints[hoveredIndex].x}
                y2={PLOT.top + plotHeight}
                stroke="#94A3B8"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            )}

            {salesPoints.map((point, index) => (
              <circle
                key={`sales-${TREND_DATA[index].date}`}
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === index ? 6 : 4.5}
                fill={SALES_COLOR}
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
            {paymentPoints.map((point, index) => (
              <circle
                key={`payment-${TREND_DATA[index].date}`}
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === index ? 6 : 4.5}
                fill={PAYMENT_COLOR}
                stroke="#fff"
                strokeWidth="2"
              />
            ))}

            {hoveredIndex === null && (
              <>
                <rect
                  x={lastSales.x + 12}
                  y={lastSales.y - 14}
                  width="102"
                  height="26"
                  rx="8"
                  fill={SALES_COLOR}
                />
                <text
                  x={lastSales.x + 63}
                  y={lastSales.y + 3}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="11"
                  fontWeight="600"
                >
                  {formatRupees(lastSales.value)}
                </text>

                <rect
                  x={lastPayment.x + 12}
                  y={lastPayment.y - 14}
                  width="102"
                  height="26"
                  rx="8"
                  fill={PAYMENT_COLOR}
                />
                <text
                  x={lastPayment.x + 63}
                  y={lastPayment.y + 3}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="11"
                  fontWeight="600"
                >
                  {formatRupees(lastPayment.value)}
                </text>
              </>
            )}

            {TREND_DATA.map((item, index) => {
              const x = salesPoints[index].x;
              const prevX =
                index === 0
                  ? PLOT.left
                  : (salesPoints[index - 1].x + x) / 2;
              const nextX =
                index === TREND_DATA.length - 1
                  ? CHART_WIDTH - PLOT.right + 24
                  : (x + salesPoints[index + 1].x) / 2;

              return (
                <rect
                  key={`hit-${item.date}`}
                  x={prevX}
                  y={PLOT.top}
                  width={Math.max(nextX - prevX, 8)}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                />
              );
            })}
          </svg>

          {hoveredItem && (
            <div
              className="pointer-events-none absolute z-10 w-48 -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg"
              style={{
                left: `${tooltipLeft}%`,
                top: "12px",
              }}
            >
              <p className="mb-2 text-xs font-semibold text-BLUE-dark">
                {hoveredItem.date}
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                    Sales
                  </span>
                  <span className="font-semibold text-[#2563EB]">
                    {formatRupees(hoveredItem.sales)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                    Received Payment
                  </span>
                  <span className="font-semibold text-[#22C55E]">
                    {formatRupees(hoveredItem.payment)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2563EB]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Highest Sales</p>
              <p className="text-sm font-bold text-BLUE-dark">
                {formatRupees(highestSales.sales)}
              </p>
              <p className="text-xs text-slate-400">{highestSales.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#22C55E]">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Highest Received Payment</p>
              <p className="text-sm font-bold text-BLUE-dark">
                {formatRupees(highestPayment.payment)}
              </p>
              <p className="text-xs text-slate-400">{highestPayment.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F3FF] text-[#7C3AED]">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Average Difference</p>
              <p className="text-sm font-bold text-BLUE-dark">
                {formatRupees(averageDifference)}
              </p>
              <p className="text-xs text-slate-400">per day</p>
            </div>
          </div>
        </div>
    </div>
  );
}

export default SalesPaymentTrend;
