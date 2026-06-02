import { motion } from "motion/react";
import { Award, TrendingUp, ShieldAlert, BadgeCheck } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
  winRate: number;
  probability: number;
  symbol: string;
  name: string;
  change24h: number;
}

export default function ScoreGauge({
  score,
  winRate,
  probability,
  symbol,
  name,
  change24h
}: ScoreGaugeProps) {
  // Determine color and status badge based on totalScore
  let rating = "C";
  let ratingColor = "text-yellow-400";
  let ratingBg = "bg-yellow-500/10 border-yellow-500/30";
  let ratingText = "관망 필요 (위험 회피)";
  let statusIcon = <ShieldAlert className="w-5 h-5 text-yellow-400" />;

  if (score >= 85) {
    rating = "S";
    ratingColor = "text-emerald-400";
    ratingBg = "bg-emerald-500/10 border-emerald-500/30";
    ratingText = "초강력 진입 기회 (적극 매수)";
    statusIcon = <Award className="w-5 h-5 text-emerald-400" />;
  } else if (score >= 70) {
    rating = "A";
    ratingColor = "text-teal-400";
    ratingBg = "bg-teal-500/10 border-teal-500/30";
    ratingText = "진입 신호 감지 (분할 매수)";
    statusIcon = <BadgeCheck className="w-5 h-5 text-teal-400" />;
  } else if (score >= 50) {
    rating = "B";
    ratingColor = "text-sky-400";
    ratingBg = "bg-sky-500/10 border-sky-500/30";
    ratingText = "추세 탐색 국면 (보수적 진입)";
    statusIcon = <TrendingUp className="w-5 h-5 text-sky-400" />;
  } else if (score < 30) {
    rating = "D";
    ratingColor = "text-rose-400";
    ratingBg = "bg-rose-500/10 border-rose-500/30";
    ratingText = "진입 보류 (강한 하락 압력)";
    statusIcon = <ShieldAlert className="w-5 h-5 text-rose-400" />;
  }

  // Semi-circle dynamic dash offset calculation
  const strokeDashoffset = 282.7 - (282.7 * score) / 100;
  const winRateOffset = 219.9 - (219.9 * winRate) / 100;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-xl relative overflow-hidden" id="score-gauge-card">
      {/* Background glow effects */}
      <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-10 transition-all duration-700 ${score >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        
        {/* Left Side: Coin Metadata & Status */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-100 text-lg border border-slate-700 shadow-inner">
              {symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">{name}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60">{symbol}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-mono text-slate-300 font-medium">24H 변동:</span>
                <span className={`text-sm font-mono font-semibold ${change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {change24h >= 0 ? '+' : ''}{change24h}%
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 my-2"></div>

          {/* Core rating presentation */}
          <div className={`p-4 rounded-xl border ${ratingBg} flex items-start gap-3`}>
            <div className="mt-0.5">{statusIcon}</div>
            <div>
              <div className="text-xs text-slate-400 font-medium">최종 모멘텀 평가 등급</div>
              <div className={`text-base font-bold ${ratingColor} font-sans`}>
                {rating} Grade • {ratingText}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
              <span className="text-xs text-slate-400 block mb-0.5">상승 예측 승률</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-mono font-bold text-slate-200">{winRate}%</span>
                <span className="text-[10px] text-emerald-400 font-mono">Win Rate</span>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
              <span className="text-xs text-slate-400 block mb-0.5">상승 확률 신뢰도</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-mono font-bold text-slate-200">{probability}%</span>
                <span className="text-[10px] text-teal-400 font-mono">Prob.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: High impact premium semi-circular and circular layout gauges */}
        <div className="flex gap-8 items-center justify-center flex-wrap">
          {/* Gauge 1: Total Scoring (100) */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-slate-800 fill-none"
                  strokeWidth="8"
                />
                {/* Indicator Glow Progress */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="fill-none"
                  strokeWidth="8"
                  strokeDasharray="282.7"
                  initial={{ strokeDashoffset: 282.7 }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  stroke={score >= 70 ? "rgb(52, 211, 153)" : score >= 50 ? "rgb(45, 212, 191)" : "rgb(251, 113, 133)"}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-mono font-bold text-slate-100">{score}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">종합 투자 평점</span>
              </div>
            </div>
          </div>

          {/* Gauge 2: Win Rate % */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  className="stroke-slate-800 fill-none"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="35"
                  className="fill-none"
                  strokeWidth="6"
                  strokeDasharray="219.9"
                  initial={{ strokeDashoffset: 219.9 }}
                  animate={{ strokeDashoffset: winRateOffset }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                  stroke="rgb(45, 212, 191)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-mono font-bold text-teal-300">{winRate}%</span>
                <span className="text-[9px] text-slate-400 font-medium">예측 승률</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
