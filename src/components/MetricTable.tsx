import { motion } from "motion/react";
import { ArrowUpRight, ArrowRight, ArrowDownLeft, TrendingUp, Sparkles } from "lucide-react";
import { MetricDetail } from "../types";

interface MetricTableProps {
  metrics: MetricDetail[];
  totalScore: number;
}

export default function MetricTable({ metrics, totalScore }: MetricTableProps) {
  
  // Render nice signal arrows based on metric signal string
  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case "UPUP":
        return (
          <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded" title="강한 상승 방향">
            <span>↑↑</span>
            <ArrowUpRight className="w-4 h-4 animate-bounce" />
          </div>
        );
      case "UP":
        return (
          <div className="flex items-center gap-1 text-teal-400 font-bold bg-teal-500/10 px-2 py-1 rounded" title="상승 유리">
            <span>↑</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        );
      case "NEUTRAL":
        return (
          <div className="flex items-center gap-1 text-slate-400 font-bold bg-slate-500/10 px-2 py-1 rounded" title="보합 또는 관망">
            <span>→</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        );
      case "DOWN":
        return (
          <div className="flex items-center gap-1 text-orange-400 font-bold bg-orange-500/10 px-2 py-1 rounded" title="하락 우위">
            <span>↓</span>
            <ArrowDownLeft className="w-3.5 h-3.5" />
          </div>
        );
      case "DOWNDOWN":
        return (
          <div className="flex items-center gap-1 text-rose-500 font-bold bg-rose-500/10 px-2 py-1 rounded" title="강한 하락 압력">
            <span>↓↓</span>
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        );
      default:
        return <span className="text-slate-400">-</span>;
    }
  };

  const getWeightStars = (weight: number) => {
    const w = Math.max(0, Math.min(5, typeof weight === "number" && !isNaN(weight) ? Math.round(weight) : 3));
    return "★".repeat(w) + "☆".repeat(5 - w);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6" id="metric-analysis-table">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 tracking-tight">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            실시간 핵심 지표 정밀 분석 리포트
          </h3>
          <p className="text-xs text-slate-400 mt-1">현물/선물 자금 흐름과 온체인, 기술적 모멘텀을 결합한 다차원 시장 정밀 검사표</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/50">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium text-slate-300">종합 기여 점수:</span>
          <span className="text-sm font-mono font-bold text-teal-300">{totalScore} / 100점</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-xs font-semibold text-slate-400 tracking-wider">
              <th className="py-3.5 px-4">지표 항목</th>
              <th className="py-3.5 px-4 hidden md:table-cell">가중치 (중요도)</th>
              <th className="py-3.5 px-4">최근 데이터 (실측)</th>
              <th className="py-3.5 px-3">해석 (상승 유리성 및 심리)</th>
              <th className="py-3.5 px-3 text-center">시각화</th>
              <th className="py-3.5 px-4 text-right">매수 점수</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {metrics.map((metric, idx) => (
              <motion.tr 
                key={metric.id}
                className="hover:bg-slate-800/30 transition-colors duration-150"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
              >
                {/* 지표명 */}
                <td className="py-4 px-4 font-semibold text-slate-200">
                  <div className="flex flex-col">
                    <span>{metric.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal md:hidden">
                      {getWeightStars(metric.weight)}
                    </span>
                  </div>
                </td>

                {/* 가중치 중요도 */}
                <td className="py-4 px-4 text-xs font-mono text-amber-400 hidden md:table-cell">
                  {getWeightStars(metric.weight)}
                </td>

                {/* 실측 데이터 */}
                <td className="py-4 px-4 font-mono text-xs text-slate-300">
                  <span className="bg-slate-850 px-2 py-1 rounded border border-slate-800/80">
                    {metric.value}
                  </span>
                </td>

                {/* 상승 유리성 해석 */}
                <td className="py-4 px-3 text-xs leading-relaxed text-slate-400 max-w-xs md:max-w-md">
                  {metric.interpretation}
                </td>

                {/* 기호 시각화 */}
                <td className="py-4 px-3 text-center">
                  <div className="flex justify-center">
                    {getSignalBadge(metric.signal)}
                  </div>
                </td>

                {/* 획득 점수 */}
                <td className="py-4 px-4 text-right font-mono font-semibold">
                  <div className="flex flex-col items-end">
                    <span className={metric.score >= metric.maxScore * 0.7 ? "text-emerald-400" : metric.score >= metric.maxScore * 0.4 ? "text-teal-400" : "text-rose-400"}>
                      {metric.score}점
                    </span>
                    {metric.maxScore > 0 && (
                      <span className="text-[9px] text-slate-500 font-normal">배점 {metric.maxScore}점</span>
                    )}
                    {metric.maxScore === 0 && (
                      <span className="text-[9px] text-slate-500 font-normal">보조 지표</span>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Guide Card inside table module */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-300">💡 11개 핵심 지표 총합산 방식</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Spot CVD(25점)와 Open Interest(20점), 청산맵과 온체인 고래 Netflow(각 15점), 거래량(10점) 등이 거대한 축을 기여도 85%로 이끌며, 나머지 FUTURES CVD(3점), Funding Rate/BTC Dominance(각 3점), RSI/MACD/스테이블 유입(각 2점) 등 11개 지표들을 조합하여 100점 만점으로 변환해 제공합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded text-slate-400">
            <span className="text-emerald-400 font-bold block">매집 지배형 (A/S급)</span>
            기관·현물 매집 위주
          </div>
          <div className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded text-slate-400">
            <span className="text-rose-400 font-bold block">상층 위험형 (C/D급)</span>
            롱 청산 집중 영역
          </div>
        </div>
      </div>
    </div>
  );
}
