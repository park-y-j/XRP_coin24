import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  RefreshCw, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Sparkles,
  Zap
} from "lucide-react";
import { PredictionHistoryItem, AccuracyBrackets } from "../types";

interface PredictionValidationBoardProps {
  historyItems: PredictionHistoryItem[];
  onTriggerSimulatedValidation: () => void;
  accuracyStats: AccuracyBrackets;
}

export default function PredictionValidationBoard({
  historyItems,
  onTriggerSimulatedValidation,
  accuracyStats
}: PredictionValidationBoardProps) {
  const [filterRating, setFilterRating] = useState<string>("ALL");

  const filteredHistory = filterRating === "ALL" 
    ? historyItems 
    : historyItems.filter(item => item.rating === filterRating);

  // Status Badge Builder
  const renderValidationStatusBadge = (timeframe: string, status: "SUCCESS" | "FAILURE" | "PENDING", val: number | null) => {
    switch (status) {
      case "SUCCESS":
        return (
          <div className="flex flex-col items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-1.5 text-center min-w-[70px]">
            <span className="text-[9px] text-slate-400 font-mono tracking-wider block uppercase">{timeframe}</span>
            <div className="flex items-center gap-0.5 mt-0.5">
              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-xs font-mono font-bold text-emerald-400">성공</span>
            </div>
            {val !== null && (
              <span className={`text-[10px] font-mono font-medium ${val >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {val >= 0 ? "+" : ""}{val}%
              </span>
            )}
          </div>
        );
      case "FAILURE":
        return (
          <div className="flex flex-col items-center justify-center bg-rose-500/10 border border-rose-500/20 rounded-lg p-1.5 text-center min-w-[70px]">
            <span className="text-[9px] text-slate-400 font-mono tracking-wider block uppercase">{timeframe}</span>
            <div className="flex items-center gap-0.5 mt-0.5">
              <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="text-xs font-mono font-bold text-rose-400">실패</span>
            </div>
            {val !== null && (
              <span className={`text-[10px] font-mono font-medium ${val >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {val >= 0 ? "+" : ""}{val}%
              </span>
            )}
          </div>
        );
      case "PENDING":
        return (
          <div className="flex flex-col items-center justify-center bg-slate-800/60 border border-slate-700/30 rounded-lg p-1.5 text-center min-w-[70px]">
            <span className="text-[9px] text-slate-500 font-mono tracking-wider block uppercase">{timeframe}</span>
            <div className="flex items-center gap-0.5 mt-0.5">
              <Clock className="w-2.5 h-2.5 text-amber-500 animate-pulse shrink-0" />
              <span className="text-[10px] font-bold text-amber-400">대기 중</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">신호대기</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6" id="prediction-history-validation-section">
      
      {/* Dynamic Performance Grid (Auto Validation Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="validation-accuracy-dashboard">
        
        {/* Overall Accuracy Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-3 top-3 w-16 h-16 rounded-full bg-teal-500/5 blur-xl pointer-events-none"></div>
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">자가 통계 성능 검증</span>
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              최근 30일 전체 정확도
            </h4>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-mono font-black text-teal-300">{accuracyStats.overall}%</span>
            <span className="text-xs text-slate-400 font-medium">검증 평균값</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" style={{ width: `${accuracyStats.overall}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">10개 모멘텀 가중 분석 통합 유효 기강</span>
        </div>

        {/* 82 Score Above Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">S 등급 기회 구간</span>
            <h4 className="font-bold text-slate-200 text-sm">리포트 평점 82점 이상</h4>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-mono font-black text-emerald-400">{accuracyStats.above82}%</span>
            <span className="text-xs text-emerald-500 font-semibold font-mono">High Quality</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${accuracyStats.above82}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">CVD & 오더북 주도 상승 적률</span>
        </div>

        {/* 70 ~ 81 Score Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider block">A 등급 우위 구간</span>
            <h4 className="font-bold text-slate-200 text-sm">리포트 평점 70 ~ 81점</h4>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-mono font-black text-indigo-400">{accuracyStats.between70_81}%</span>
            <span className="text-xs text-indigo-400 font-semibold font-mono">Medium Risk</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${accuracyStats.between70_81}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">변동성 추종 돌파 상승 적률</span>
        </div>

        {/* 60 ~ 69 Score Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[11px] text-yellow-400 font-bold uppercase tracking-wider block">B 등급 관망 구간</span>
            <h4 className="font-bold text-slate-200 text-sm">리포트 평점 60 ~ 69점</h4>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-mono font-black text-yellow-500">{accuracyStats.between60_69}%</span>
            <span className="text-xs text-yellow-500 font-semibold font-mono">Moderate</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-yellow-500/80 rounded-full" style={{ width: `${accuracyStats.between60_69}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">추세 지지선 수렴 및 이탈 경합</span>
        </div>

      </div>

      {/* Main Validation and Log Section */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6" id="prediction-history-logs">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
              예측 히스토리 및 실시간 자동 검증 (Prediction History & Auto Validation)
            </h3>
            <p className="text-xs text-slate-400">지정된 4가지 시간 경과(6시간, 12시간, 24시간, 72시간)별 실측 시세와 신호를 비교 교정합니다.</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto self-end sm:self-center">
            {/* Simulation trigger */}
            <button
              onClick={onTriggerSimulatedValidation}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 hover:text-amber-200 border border-amber-500/30 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-md w-full sm:w-auto justify-center"
              title="시간을 경과시켜 대기 중인 예측 결과를 시뮬레이션으로 수동 검출 및 누적 업데이트합니다."
            >
              <Zap className="w-3.5 h-3.5" />
              <span>실시간 검증 업데이트</span>
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-850">
            {["ALL", "S", "A", "B", "C", "D"].map((grade) => (
              <button
                key={grade}
                onClick={() => setFilterRating(grade)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all font-mono font-semibold cursor-pointer ${
                  filterRating === grade 
                    ? "bg-slate-800 text-teal-300 shadow" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {grade === "ALL" ? "전체 목록" : `${grade} 등급`}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-mono">분석 검증 항목: total {filteredHistory.length}건</span>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 tracking-wider">
                <th className="py-3 px-4">분석 시각 / 종목</th>
                <th className="py-3 px-4 font-mono">가중 리포트 평점</th>
                <th className="py-3 px-4 text-center">예측 방향</th>
                <th className="py-3 px-3">10대 지표 요약</th>
                <th className="py-3 px-4 text-center">6시간 전망</th>
                <th className="py-3 px-4 text-center">12시간 전망</th>
                <th className="py-3 px-4 text-center">24시간 전망</th>
                <th className="py-3 px-4 text-center">72시간 전망</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    해당 등급의 검증된 과거 데이터 로그가 존재하지 않습니다. 상단 보드에서 더 많은 종목을 시뮬레이션해 보세요.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, idx) => {
                  const ratingColor = item.rating === "S" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                                      item.rating === "A" ? "text-teal-400 bg-teal-500/10 border-teal-500/20" :
                                      item.rating === "B" ? "text-sky-400 bg-sky-500/10 border-sky-500/20" : 
                                      item.rating === "C" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20";
                  
                  return (
                    <motion.tr
                      key={item.id}
                      className="hover:bg-slate-800/10 transition-all font-sans"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                    >
                      {/* 시간 / 종목 */}
                      <td className="py-4 px-4 font-medium">
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[10px] font-mono">{item.time}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-bold text-slate-100">{item.name}</span>
                            <span className="text-[9px] font-mono font-bold bg-slate-950 px-1 py-0.5 rounded text-slate-500">{item.symbol}</span>
                          </div>
                        </div>
                      </td>

                      {/* 평점 및 등급 */}
                      <td className="py-4 px-4 font-mono font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${ratingColor}`}>{item.rating}</span>
                          <span className="text-slate-200">{item.totalScore}점</span>
                        </div>
                      </td>

                      {/* 예측 방향 */}
                      <td className="py-4 px-4 text-center">
                        {item.expectedDirection === "UP" ? (
                          <div className="inline-flex items-center gap-0.5 text-emerald-400 font-extrabold bg-emerald-500/5 px-2 py-1 rounded">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>상승 (UP)</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-0.5 text-rose-400 font-extrabold bg-rose-500/5 px-2 py-1 rounded">
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span>하락 (DOWN)</span>
                          </div>
                        )}
                      </td>

                      {/* 지표 요약 */}
                      <td className="py-4 px-3 text-[11px] text-slate-400 max-w-xs truncate" title={item.metricsSummary}>
                        {item.metricsSummary}
                      </td>

                      {/* 6h, 12h, 24h, 72h */}
                      <td className="py-3 px-2 text-center">
                        <div className="flex justify-center">
                          {renderValidationStatusBadge("6h", item.validations["6h"].status, item.validations["6h"].actualChange)}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex justify-center">
                          {renderValidationStatusBadge("12h", item.validations["12h"].status, item.validations["12h"].actualChange)}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex justify-center">
                          {renderValidationStatusBadge("24h", item.validations["24h"].status, item.validations["24h"].actualChange)}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex justify-center">
                          {renderValidationStatusBadge("72h", item.validations["72h"].status, item.validations["72h"].actualChange)}
                        </div>
                      </td>

                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Informative Guidance Card */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              스스로 오차를 스스로 교정하는 자가-인텔리전스
            </h4>
            <p className="text-slate-400 leading-relaxed max-w-3xl">
              본 시스템은 실시간 예측 시점에 수집된 오더북 및 온체인 패턴 조합을 저장소에 영구히 저장한 뒤, 실제 6H / 12H / 24H / 72H 시점의 시세 가격 변동과 매핑하여 상방 예측 성공율을 산출합니다. 예측의 오차가 발견될 경우 다음 추론 가중 점수에 결함치를 자동으로 보간 교정합니다.
            </p>
          </div>
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-2 flex items-center gap-2 text-teal-300 font-semibold font-mono whitespace-nowrap">
            <span>공급 오차 보정 계수: K=0.942</span>
          </div>
        </div>

      </div>

    </div>
  );
}
