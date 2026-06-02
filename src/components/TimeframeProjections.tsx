import { motion } from "motion/react";
import { Clock, TrendingUp, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { MetricDetail } from "../types";

interface TimeframeProjectionsProps {
  metrics: MetricDetail[];
  symbol: string;
}

export default function TimeframeProjections({ metrics, symbol }: TimeframeProjectionsProps) {
  
  // Helper to map signal strings to values
  const getSignalValue = (signal: string): number => {
    switch (signal) {
      case "UPUP": return 2;
      case "UP": return 1;
      case "NEUTRAL": return 0;
      case "DOWN": return -1;
      case "DOWNDOWN": return -2;
      default: return 0;
    }
  };

  // Helper to map averaged signal value back to visual indicators
  const getSignalMeta = (avg: number) => {
    if (avg >= 1.2) {
      return {
        arrow: "↑↑",
        label: "강한 매수 우세",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      };
    } else if (avg >= 0.4) {
      return {
        arrow: "↑",
        label: "상승 유리",
        color: "text-teal-400 bg-teal-500/10 border-teal-500/30"
      };
    } else if (avg > -0.4 && avg < 0.4) {
      return {
        arrow: "→",
        label: "보합/관망세",
        color: "text-slate-400 bg-slate-500/10 border-slate-500/30"
      };
    } else if (avg <= -0.4 && avg > -1.2) {
      return {
        arrow: "↓",
        label: "단기 하락 우세",
        color: "text-orange-400 bg-orange-500/10 border-orange-500/30"
      };
    } else {
      return {
        arrow: "↓↓",
        label: "강한 하방 압력",
        color: "text-rose-500 bg-rose-500/10 border-rose-500/30"
      };
    }
  };

  // Categorize metrics and calculate
  // 1. Ultra Short-term (1~6 hours)
  const ultraShortIndicators = metrics.filter(m => 
    m.id === "spot-cvd" || 
    m.id === "futures-cvd" || 
    m.id === "oi" || 
    m.id === "liquidation" || 
    m.id === "funding"
  );
  const s1_scoreSum = ultraShortIndicators.reduce((acc, m) => acc + m.score, 0);
  const s1_maxSum = ultraShortIndicators.reduce((acc, m) => acc + m.maxScore, 0) || 60; // fallback to 60
  const s1_scoreScaled = Math.round((s1_scoreSum / s1_maxSum) * 100);
  const s1_avgSignal = ultraShortIndicators.length 
    ? ultraShortIndicators.reduce((acc, m) => acc + getSignalValue(m.signal), 0) / ultraShortIndicators.length 
    : 0;
  const s1_meta = getSignalMeta(s1_avgSignal);

  // 2. Short-term (6~24 hours)
  const shortIndicators = metrics.filter(m => 
    m.id === "rsi" || 
    m.id === "macd" || 
    m.id === "volume" ||
    m.id === "rsi-macd" // fallback safe
  );
  const s2_scoreSum = shortIndicators.reduce((acc, m) => acc + m.score, 0);
  const s2_maxSum = shortIndicators.reduce((acc, m) => acc + m.maxScore, 0) || 18;
  const s2_scoreScaled = Math.round((s2_scoreSum / s2_maxSum) * 100);
  const s2_avgSignal = shortIndicators.length 
    ? shortIndicators.reduce((acc, m) => acc + getSignalValue(m.signal), 0) / shortIndicators.length 
    : 0;
  const s2_meta = getSignalMeta(s2_avgSignal);

  // 3. Mid-term (1~7 days)
  const midIndicators = metrics.filter(m => 
    m.id === "onchain" || 
    m.id === "stable" || 
    m.id === "btcd"
  );
  const s3_scoreSum = midIndicators.reduce((acc, m) => acc + m.score, 0);
  const s3_maxSum = midIndicators.reduce((acc, m) => acc + m.maxScore, 0) || 22;
  const s3_scoreScaled = Math.round((s3_scoreSum / s3_maxSum) * 100);
  const s3_avgSignal = midIndicators.length 
    ? midIndicators.reduce((acc, m) => acc + getSignalValue(m.signal), 0) / midIndicators.length 
    : 0;
  const s3_meta = getSignalMeta(s3_avgSignal);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6" id="timeframe-projections-card">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-bold text-slate-100 text-base">예상 유효 시간대별 상승 전망</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">각 시간대의 가속도 점수 및 실시간 심리 벡터 융합 진단</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-teal-400 px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20">
          {symbol} Focus
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1: Ultra Short-term */}
        <motion.div 
          className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 p-5 rounded-2xl space-y-4 flex flex-col justify-between transition-all"
          whileHover={{ y: -3 }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs bg-indigo-500/10 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/20">초단기 전망</span>
              <span className="text-xs text-slate-500 font-mono">1 ~ 6시간 유효</span>
            </div>
            <h4 className="font-bold text-slate-300 text-sm">오더북 & 롱숏 레버리지</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">Spot/Futures CVD, OI, 청산 맵 및 펀딩피 기반 즉각성 자금 압력</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-bold text-slate-100">{s1_scoreScaled}</span>
                <span className="text-[10px] text-slate-500">점</span>
              </div>
              <div className={`text-md font-mono font-black px-2.5 py-0.5 rounded border ${s1_meta.color}`}>
                {s1_meta.arrow}
              </div>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden p-0.5 border border-slate-800">
              <motion.div 
                className={`h-full rounded-full ${s1_scoreScaled >= 70 ? 'bg-teal-400' : s1_scoreScaled >= 50 ? 'bg-indigo-400' : 'bg-rose-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${s1_scoreScaled}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>심리 상태: <strong className={s1_scoreScaled >= 70 ? "text-teal-400" : s1_scoreScaled >= 50 ? "text-indigo-300" : "text-rose-400"}>{s1_meta.label}</strong></span>
              <span>비중 60%</span>
            </div>
          </div>
        </motion.div>

        {/* Step 2: Short-term */}
        <motion.div 
          className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 p-5 rounded-2xl space-y-4 flex flex-col justify-between transition-all"
          whileHover={{ y: -3 }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs bg-teal-500/10 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/20">단기 전망</span>
              <span className="text-xs text-slate-500 font-mono">6 ~ 24시간 유효</span>
            </div>
            <h4 className="font-bold text-slate-300 text-sm">모멘텀 & 24H 볼륨</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">RSI, MACD 및 거래량 피드백의 연동 추세 강도 및 수평 저항 테스트</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-bold text-slate-100">{s2_scoreScaled}</span>
                <span className="text-[10px] text-slate-500">점</span>
              </div>
              <div className={`text-md font-mono font-black px-2.5 py-0.5 rounded border ${s2_meta.color}`}>
                {s2_meta.arrow}
              </div>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden p-0.5 border border-slate-800">
              <motion.div 
                className={`h-full rounded-full ${s2_scoreScaled >= 70 ? 'bg-teal-400' : s2_scoreScaled >= 50 ? 'bg-indigo-400' : 'bg-rose-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${s2_scoreScaled}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>심리 상태: <strong className={s2_scoreScaled >= 70 ? "text-teal-400" : s2_scoreScaled >= 50 ? "text-indigo-300" : "text-rose-400"}>{s2_meta.label}</strong></span>
              <span>비중 18%</span>
            </div>
          </div>
        </motion.div>

        {/* Step 3: Mid-term */}
        <motion.div 
          className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 p-5 rounded-2xl space-y-4 flex flex-col justify-between transition-all"
          whileHover={{ y: -3 }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs bg-cyan-500/10 text-cyan-350 font-bold px-2 py-0.5 rounded border border-cyan-500/20">중기 전망</span>
              <span className="text-xs text-slate-500 font-mono">1 ~ 7일 유효</span>
            </div>
            <h4 className="font-bold text-slate-300 text-sm">고래 유통 & 거시 도미넌스</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">Whale Netflow, 스테이블 공급 유입 및 BTC 점유비 분산 흐름</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-bold text-slate-100">{s3_scoreScaled}</span>
                <span className="text-[10px] text-slate-500">점</span>
              </div>
              <div className={`text-md font-mono font-black px-2.5 py-0.5 rounded border ${s3_meta.color}`}>
                {s3_meta.arrow}
              </div>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden p-0.5 border border-slate-800">
              <motion.div 
                className={`h-full rounded-full ${s3_scoreScaled >= 70 ? 'bg-teal-400' : s3_scoreScaled >= 50 ? 'bg-indigo-400' : 'bg-rose-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${s3_scoreScaled}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>심리 상태: <strong className={s3_scoreScaled >= 70 ? "text-teal-400" : s3_scoreScaled >= 50 ? "text-indigo-300" : "text-rose-400"}>{s3_meta.label}</strong></span>
              <span>비중 22%</span>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
